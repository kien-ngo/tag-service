import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const envs = createEnv({
	server: {
		DATABASE_URL: z.url(),
		SERVER_PORT: z.string().optional(),
		HOST: z.url(),
	},

	/**
	 * What object holds the environment variables at runtime. This is usually
	 * `process.env` or `import.meta.env` for Vite.
	 */
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
