import { describeRoute } from "hono-openapi";

export const deleteContentScalar = describeRoute({
	description:
		"Delete a content record by ID for a specific user and organization",
	summary: "Delete content by ID",
	tags: ["Content"],
	parameters: [
		{
			name: "id",
			in: "path",
			required: true,
			description: "The ID of the content to delete",
			schema: {
				type: "string",
				example: "1",
			},
		},
		{
			name: "user_id",
			in: "query",
			required: true,
			description: "The UUID of the user",
			schema: {
				type: "string",
				format: "uuid",
				example: "123e4567-e89b-12d3-a456-426614174000",
			},
		},
		{
			name: "organization_id",
			in: "query",
			required: true,
			description: "The UUID of the organization",
			schema: {
				type: "string",
				format: "uuid",
				example: "987fcdeb-51a2-43d1-9f12-345678901234",
			},
		},
	],
	responses: {
		200: {
			description: "Content deleted successfully",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							success: {
								type: "boolean",
								example: true,
							},
							message: {
								type: "string",
								example: "Content deleted successfully",
							},
						},
					},
				},
			},
		},
		400: {
			description: "Invalid request parameters",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							success: {
								type: "boolean",
								example: false,
							},
							error: {
								type: "string",
								example: "Invalid request parameters",
							},
						},
					},
				},
			},
		},
		404: {
			description: "Content not found",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							success: {
								type: "boolean",
								example: false,
							},
							error: {
								type: "string",
								example: "Content not found",
							},
						},
					},
				},
			},
		},
	},
});
