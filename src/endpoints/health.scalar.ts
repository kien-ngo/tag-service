import { describeRoute } from "hono-openapi";

export const healthScalar = describeRoute({
	description: "Health check endpoint",
	summary: "Returns the current status of the API",
	tags: ["System"],
	responses: {
		200: {
			description: "System is healthy",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							status: {
								type: "string",
								example: "ok",
							},
							timestamp: {
								type: "string",
								format: "date-time",
								example: "2023-01-01T00:00:00.000Z",
							},
						},
					},
				},
			},
		},
	},
});
