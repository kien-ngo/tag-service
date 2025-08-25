import type { Context } from "hono";
import { z } from "zod";
import { db } from "../kysely";

const createContentBodySchema = z.object({
	user_id: z.uuid(),
	organization_id: z.uuid(),
	content: z.string(),
	tags: z.array(z.string()).optional(),
});

export const createContentEndpoint = async (
	c: Context<{}, "/create-content", {}>,
) => {
	try {
		const body = createContentBodySchema.parse(await c.req.json());

		const newContent = await db
			.insertInto("contents")
			.values({
				user_id: body.user_id,
				organization_id: body.organization_id,
				content: body.content,
			})
			.returning(["id", "user_id", "organization_id", "content"])
			.executeTakeFirstOrThrow();

		// Handle tags if provided
		if (body.tags && body.tags.length > 0) {
			// Create tags that don't exist and get all tag IDs
			const tagIds: number[] = [];

			for (const tagName of body.tags) {
				// Try to find existing tag
				const existingTag = await db
					.selectFrom("tags")
					.select("id")
					.where("name", "=", tagName)
					.where("user_id", "=", body.user_id)
					.where("organization_id", "=", body.organization_id)
					.executeTakeFirst();

				if (existingTag) {
					tagIds.push(existingTag.id);
				} else {
					// Create new tag
					const newTag = await db
						.insertInto("tags")
						.values({
							name: tagName,
							user_id: body.user_id,
							organization_id: body.organization_id,
						})
						.returning("id")
						.executeTakeFirstOrThrow();
					tagIds.push(newTag.id);
				}
			}

			// Create content_tags relationships
			if (tagIds.length > 0) {
				await db
					.insertInto("content_tags")
					.values(
						tagIds.map((tag_id) => ({
							content_id: newContent.id,
							tag_id,
						})),
					)
					.execute();
			}
		}

		return c.json({
			success: true,
			data: newContent,
		});
	} catch (error) {
		return c.json(
			{
				success: false,
				error: "Failed to create content",
			},
			400,
		);
	}
};
