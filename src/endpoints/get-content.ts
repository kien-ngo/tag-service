import type { Context } from "hono";
import { z } from "zod";
import { db } from "../kysely";

const getContentQuerySchema = z.object({
	user_id: z.uuid(),
	organization_id: z.uuid(),
	page: z
		.string()
		.transform((val) => Number.parseInt(val, 10))
		.default(1),
	perPage: z
		.string()
		.transform((val) => Number.parseInt(val, 10))
		.default(50),
	withTags: z
		.string()
		.transform((val) => val === "true")
		.default("true"),
});

export const getContentEndpoint = async (
	c: Context<{}, "/get-content", {}>,
) => {
	try {
		const query = getContentQuerySchema.parse(c.req.query());

		const offset = (query.page - 1) * query.perPage;

		const contents = await db
			.selectFrom("contents")
			.select([
				"contents.id",
				"contents.content",
				"contents.user_id",
				"contents.organization_id",
			])
			.where("contents.user_id", "=", query.user_id)
			.where("contents.organization_id", "=", query.organization_id)
			.limit(query.perPage)
			.offset(offset)
			.execute();

		let contentsWithTags = contents;

		if (query.withTags) {
			const contentIds = contents.map((content) => content.id);

			if (contentIds.length > 0) {
				const contentTagsData = await db
					.selectFrom("content_tags")
					.innerJoin("tags", "content_tags.tag_id", "tags.id")
					.select([
						"content_tags.content_id",
						"tags.id as tag_id",
						"tags.name as tag_name",
					])
					.where("content_tags.content_id", "in", contentIds)
					.execute();

				contentsWithTags = contents.map((content) => ({
					...content,
					tags: contentTagsData
						.filter((ct) => ct.content_id === content.id)
						.map((ct) => ({
							id: ct.tag_id,
							name: ct.tag_name,
						})),
				}));
			} else {
				contentsWithTags = contents.map((content) => ({
					...content,
					tags: [],
				}));
			}
		}

		const totalCount = await db
			.selectFrom("contents")
			.select(db.fn.count("id").as("count"))
			.where("contents.user_id", "=", query.user_id)
			.where("contents.organization_id", "=", query.organization_id)
			.executeTakeFirst();

		const totalPages = Math.ceil(
			Number(totalCount?.count || 0) / query.perPage,
		);

		return c.json({
			success: true,
			data: {
				contents: contentsWithTags,
				pagination: {
					page: query.page,
					perPage: query.perPage,
					totalCount: Number(totalCount?.count || 0),
					totalPages,
				},
			},
		});
	} catch (error) {
		console.error(error);
		return c.json(
			{
				success: false,
				error: "Invalid request parameters",
				details: error instanceof Error ? error.message : String(error),
				stack: error instanceof Error ? error.stack : undefined,
			},
			400,
		);
	}
};
