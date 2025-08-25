import { describeRoute } from "hono-openapi";

export const searchContentsScalar = describeRoute({
	description: "Search for contents by tags",
	summary: "Returns contents that are associated with the specified tags",
	tags: ["Content Search"],
	parameters: [
		{
			name: "tags",
			in: "query",
			required: true,
			description: "Comma-separated list of tag names",
			schema: {
				type: "string",
				example: "javascript,react",
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
			description: "Contents found successfully",
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
									type: "object",
									properties: {
										id: {
											type: "number",
											example: 1,
										},
										content: {
											type: "string",
											example: "https://example.com/article",
										},
										user_id: {
											type: "string",
											format: "uuid",
											example: "123e4567-e89b-12d3-a456-426614174000",
										},
										organization_id: {
											type: "string",
											format: "uuid",
											example: "987fcdeb-51a2-43d1-9f12-345678901234",
										},
									},
								},
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
