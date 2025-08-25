import { describeRoute } from "hono-openapi";

export const searchTagsScalar = describeRoute({
	description: "Search for tags (auto completion)",
	summary: "Returns tags that match the search query for auto completion",
	tags: ["Tag Search"],
	parameters: [
		{
			name: "q",
			in: "query",
			required: true,
			description: "The search query",
			schema: {
				type: "string",
				example: "java",
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
		{
			name: "limit",
			in: "query",
			required: false,
			description: "Maximum number of results to return",
			schema: {
				type: "string",
				example: "10",
			},
		},
	],
	responses: {
		200: {
			description: "Tags found successfully",
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
								example: ["javascript", "java", "javafx"],
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
