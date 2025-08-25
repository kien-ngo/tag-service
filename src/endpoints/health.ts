import type { Context } from "hono";

export const healthEndpoint = (c: Context<{}, "/health", {}>) => {
	return c.json({
		status: "ok",
		timestamp: new Date().toISOString(),
	});
};
