import { describeRoute } from "hono-openapi";

export const getContentTagsScalar = describeRoute({
	description: "Get all tags of a content",
	summary: "Returns all tags associated with a specific content",
	tags: ["Content Tags"],
	parameters: [
		{
			name: "content_id",
			in: "query",
			required: true,
			description: "The ID of the content",
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
			description: "Tags retrieved successfully",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							success: {
								type: "boolean",
								example: true,
							},
							data: {
								type: "array",
								items: {
									type: "string",
								},
								example: ["javascript", "react", "web"],
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
	},
});
