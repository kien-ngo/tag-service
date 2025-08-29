import type { Context } from "hono";
import { z } from "zod";
import { db } from "../kysely";

const searchContentsQuerySchema = z.object({
	tags: z.string().transform((val) => val.split(",")),
	user_id: z.uuid(),
	organization_id: z.uuid(),
	withTags: z
		.string()
		.transform((val) => val === "true")
		.default("true"),
});

export const searchContentsEndpoint = async (
	c: Context<{}, "/search-contents", {}>,
) => {
	try {
		const query = searchContentsQuerySchema.parse(c.req.query());

		const contents = await db
			.selectFrom("contents")
			.innerJoin("content_tags", "content_tags.content_id", "contents.id")
			.innerJoin("tags", "tags.id", "content_tags.tag_id")
			.select([
				"contents.id",
				"contents.content",
				"contents.user_id",
				"contents.organization_id",
			])
			.where("tags.name", "in", query.tags)
			.where("contents.user_id", "=", query.user_id)
			.where("contents.organization_id", "=", query.organization_id)
			.groupBy([
				"contents.id",
				"contents.content",
				"contents.user_id",
				"contents.organization_id",
			])
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

		return c.json({
			success: true,
			data: contentsWithTags,
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
