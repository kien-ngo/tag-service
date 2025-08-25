import type { Context } from "hono";
import { z } from "zod";
import { db } from "../kysely";

const deleteTagsBodySchema = z.object({
	user_id: z.uuid(),
	organization_id: z.uuid(),
	content_id: z.number(),
	tags: z.array(z.string()),
});

export const deleteTagsEndpoint = async (
	c: Context<{}, "/delete-tags", {}>,
) => {
	try {
		const body = deleteTagsBodySchema.parse(await c.req.json());

		await db.transaction().execute(async (trx) => {
			for (const tagName of body.tags) {
				const tag = await trx
					.selectFrom("tags")
					.select("id")
					.where("name", "=", tagName)
					.where("user_id", "=", body.user_id)
					.where("organization_id", "=", body.organization_id)
					.executeTakeFirst();

				if (tag) {
					await trx
						.deleteFrom("content_tags")
						.where("content_id", "=", body.content_id)
						.where("tag_id", "=", tag.id)
						.execute();
				}
			}
		});

		return c.json({
			success: true,
			message: "Tags removed successfully",
		});
	} catch (error) {
		console.error(error)
		return c.json(
			{
				success: false,
				error: "Failed to remove tags",
			},
			400,
		);
	}
};
