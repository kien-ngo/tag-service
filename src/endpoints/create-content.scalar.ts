import { describeRoute } from "hono-openapi";

export const createContentScalar = describeRoute({
	description: "Create new content",
	summary: "Creates a new content entry",
	tags: ["Content Management"],
	requestBody: {
		required: true,
		content: {
			"application/json": {
				schema: {
					type: "object",
					required: ["user_id", "organization_id", "content"],
					properties: {
						user_id: {
							type: "string",
							format: "uuid",
							description: "The UUID of the user creating the content",
							example: "123e4567-e89b-12d3-a456-426614174000",
						},
						organization_id: {
							type: "string",
							format: "uuid",
							description: "The UUID of the organization",
							example: "987fcdeb-51a2-43d1-9f12-345678901234",
						},
						content: {
							type: "string",
							description: "The content string (URL, file path, etc.)",
							example: "https://example.com/article",
						},
					},
				},
			},
		},
	},
	responses: {
		200: {
			description: "Content created successfully",
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
								type: "object",
								properties: {
									id: {
										type: "number",
										example: 1,
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
									content: {
										type: "string",
										example: "https://example.com/article",
									},
								},
							},
						},
					},
				},
			},
		},
		400: {
			description: "Failed to create content",
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
								example: "Failed to create content",
							},
						},
					},
				},
			},
		},
	},
});
