import type { Context } from "hono";
import { z } from "zod";
import { db } from "../kysely";

const searchTagsQuerySchema = z.object({
	q: z.string().min(1),
	user_id: z.uuid(),
	organization_id: z.uuid(),
	limit: z
		.string()
		.optional()
		.transform((val) => (val ? Number.parseInt(val, 10) : 10)),
});

export const searchTagsEndpoint = async (
	c: Context<{}, "/search-tags", {}>,
) => {
	try {
		const query = searchTagsQuerySchema.parse(c.req.query());

		const tags = await db
			.selectFrom("tags")
			.select("name")
			.where("name", "ilike", `${query.q}%`)
			.where("user_id", "=", query.user_id)
			.where("organization_id", "=", query.organization_id)
			.orderBy("name")
			.limit(query.limit)
			.execute();

		return c.json({
			success: true,
			data: tags.map((tag) => tag.name),
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
