import type { Hono } from "hono";
import type { BlankEnv, BlankSchema } from "hono/types";
import { openAPISpecs } from "hono-openapi";
import { envs } from "../env";

export const openApiEndpoint = (app: Hono<BlankEnv, BlankSchema, "/">) =>
	openAPISpecs(app, {
		documentation: {
			info: {
				title: "Tag-things Documentation",
				version: "1.0.0",
				description: "API server for tag-things",
				// contact: {
				//   name: "API Support",
				//   email: "support@example.com",
				// },
				// license: {
				//   name: "MIT",
				//   url: "https://opensource.org/licenses/MIT",
				// },
			},
			servers: [
				{
					url: `${envs.HOST}${envs.SERVER_PORT ? `:${envs.SERVER_PORT}` : ''}`,
					description: "Tag staging server",
				},
			],
			tags: [
				{ name: "Basic", description: "Basic endpoints" },
				{ name: "System", description: "System monitoring endpoints" },
			],
			components: {
				securitySchemes: {
					bearerAuth: {
						type: "http",
						scheme: "bearer",
						bearerFormat: "JWT",
					},
				},
			},
		},
	});
