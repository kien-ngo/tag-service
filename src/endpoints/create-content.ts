import type { Context } from "hono";
import { z } from "zod";
import { db } from "../kysely";

const createContentBodySchema = z.object({
	user_id: z.uuid(),
	organization_id: z.uuid(),
	content: z.string(),
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
