import type { Context } from "hono";
import { z } from "zod";
import { db } from "../kysely";

const deleteContentParamsSchema = z.object({
	id: z.string().transform((val) => Number.parseInt(val, 10)),
});

const deleteContentQuerySchema = z.object({
	user_id: z.uuid(),
	organization_id: z.uuid(),
});

export const deleteContentEndpoint = async (
	c: Context<{}, "/delete-content/:id", {}>,
) => {
	try {
		const params = deleteContentParamsSchema.parse(c.req.param());
		const query = deleteContentQuerySchema.parse(c.req.query());

		const existingContent = await db
			.selectFrom("contents")
			.select(["id"])
			.where("id", "=", params.id)
			.where("user_id", "=", query.user_id)
			.where("organization_id", "=", query.organization_id)
			.executeTakeFirst();

		if (!existingContent) {
			return c.json(
				{
					success: false,
					error: "Content not found",
				},
				404,
			);
		}

		await db.transaction().execute(async (trx) => {
			await trx
				.deleteFrom("content_tags")
				.where("content_id", "=", params.id)
				.execute();

			await trx.deleteFrom("contents").where("id", "=", params.id).execute();
		});

		return c.json({
			success: true,
			message: "Content deleted successfully",
		});
	} catch (error) {
		console.error(error);
		return c.json(
			{
				success: false,
				error: "Invalid request parameters",
			},
			400,
		);
	}
};
