import type { Context } from "hono";
import { z } from "zod";
import { db } from "../kysely";

const userTagsQuerySchema = z.object({
	user_id: z.uuid(),
	organization_id: z.uuid(),
});

export const getUserTagsEndpoint = async (c: Context<{}, "/user-tags", {}>) => {
	try {
		const query = userTagsQuerySchema.parse(c.req.query());

		const tags = await db
			.selectFrom("tags")
			.innerJoin("content_tags", "content_tags.tag_id", "tags.id")
			.innerJoin("contents", "contents.id", "content_tags.content_id")
			.select("tags.name")
			.where("contents.user_id", "=", query.user_id)
			.where("contents.organization_id", "=", query.organization_id)
			.distinct()
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
