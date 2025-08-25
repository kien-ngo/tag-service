import { describeRoute } from "hono-openapi";

export const deleteTagsScalar = describeRoute({
	description: "Remove tags from a content",
	summary: "Removes specified tags from a specific content",
	tags: ["Content Management"],
	requestBody: {
		required: true,
		content: {
			"application/json": {
				schema: {
					type: "object",
					required: ["user_id", "organization_id", "content_id", "tags"],
					properties: {
						user_id: {
							type: "string",
							format: "uuid",
							description: "The UUID of the user",
							example: "123e4567-e89b-12d3-a456-426614174000",
						},
						organization_id: {
							type: "string",
							format: "uuid",
							description: "The UUID of the organization",
							example: "987fcdeb-51a2-43d1-9f12-345678901234",
						},
						content_id: {
							type: "number",
							description: "The ID of the content",
							example: 1,
						},
						tags: {
							type: "array",
							items: {
								type: "string",
							},
							description: "Array of tag names to remove",
							example: ["javascript", "tutorial"],
						},
					},
				},
			},
		},
	},
	responses: {
		200: {
			description: "Tags removed successfully",
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
								example: "Tags removed successfully",
							},
						},
					},
				},
			},
		},
		400: {
			description: "Failed to remove tags",
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
								example: "Failed to remove tags",
							},
						},
					},
				},
			},
		},
	},
});
