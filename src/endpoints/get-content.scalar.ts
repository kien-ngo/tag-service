import { describeRoute } from "hono-openapi";

export const getContentScalar = describeRoute({
	description:
		"Get all contents owned by a user within an organization with pagination",
	summary: "Returns paginated contents for a specific user and organization",
	tags: ["Content"],
	parameters: [
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
			name: "page",
			in: "query",
			required: false,
			description: "Page number (default: 1)",
			schema: {
				type: "string",
				example: "1",
			},
		},
		{
			name: "perPage",
			in: "query",
			required: false,
			description: "Number of items per page (default: 10)",
			schema: {
				type: "string",
				example: "10",
			},
		},
	],
	responses: {
		200: {
			description: "Contents retrieved successfully",
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
									contents: {
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
									pagination: {
										type: "object",
										properties: {
											page: {
												type: "number",
												example: 1,
											},
											perPage: {
												type: "number",
												example: 10,
											},
											totalCount: {
												type: "number",
												example: 25,
											},
											totalPages: {
												type: "number",
												example: 3,
											},
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
