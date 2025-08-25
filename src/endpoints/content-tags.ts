import type { Context } from "hono";
import { z } from "zod";
import { db } from "../kysely";

const contentTagsQuerySchema = z.object({
	content_id: z.string().transform((val) => Number.parseInt(val, 10)),
	user_id: z.uuid(),
	organization_id: z.uuid(),
});

export const getContentTagsEndpoint = async (
	c: Context<{}, "/content-tags", {}>,
) => {
	try {
		const query = contentTagsQuerySchema.parse(c.req.query());

		const tags = await db
			.selectFrom("tags")
			.innerJoin("content_tags", "content_tags.tag_id", "tags.id")
			.innerJoin("contents", "contents.id", "content_tags.content_id")
			.select("tags.name")
			.where("content_tags.content_id", "=", query.content_id)
			.where("contents.user_id", "=", query.user_id)
			.where("contents.organization_id", "=", query.organization_id)
			.execute();

		return c.json({
			success: true,
			data: tags.map((tag) => tag.name),
		});
	} catch (error) {
		console.error(error)
		return c.json(
			{
				success: false,
				error: "Invalid request parameters",
			},
			400,
		);
	}
};
