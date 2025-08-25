import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { Database } from "./db-schema";
import { envs } from "./env";

const dialect = new PostgresDialect({
	pool: new Pool({
		connectionString: envs.DATABASE_URL,
	}),
});

export const db = new Kysely<Database>({
	dialect,
});
