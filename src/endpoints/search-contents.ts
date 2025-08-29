import type { Context } from "hono";
import { z } from "zod";
import { db } from "../kysely";

const searchContentsQuerySchema = z.object({
	tags: z.string().transform((val) => val.split(",")),
	user_id: z.uuid(),
	organization_id: z.uuid(),
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

		return c.json({
			success: true,
			data: contents,
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
