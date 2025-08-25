import type { Context } from "hono";
import { z } from "zod";
import { db } from "../kysely";

const addTagsBodySchema = z.object({
	user_id: z.uuid(),
	organization_id: z.uuid(),
	content_id: z.number(),
	tags: z.array(z.string()),
});

export const addTagsEndpoint = async (c: Context<{}, "/add-tags", {}>) => {
	try {
		const body = addTagsBodySchema.parse(await c.req.json());

		await db.transaction().execute(async (trx) => {
			for (const tagName of body.tags) {
				let tag = await trx
					.selectFrom("tags")
					.select("id")
					.where("name", "=", tagName)
					.executeTakeFirst();

				if (!tag) {
					tag = await trx
						.insertInto("tags")
						.values({
							name: tagName,
							user_id: body.user_id,
							organization_id: body.organization_id,
						})
						.returning("id")
						.executeTakeFirstOrThrow();
				}

				await trx
					.insertInto("content_tags")
					.values({
						content_id: body.content_id,
						tag_id: tag.id,
					})
					.onConflict((oc) => oc.doNothing())
					.execute();
			}
		});

		return c.json({
			success: true,
			message: "Tags added successfully",
		});
	} catch (error) {
		console.error(error)
		return c.json(
			{
				success: false,
				error: "Failed to add tags",
			},
			400,
		);
	}
};
