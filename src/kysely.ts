import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { Database } from "./db-schema";
import { envs } from "./env";
import { encodePostgresConnectionString } from "./utils/encodePostgresConnectionString";

const dialect = new PostgresDialect({
	pool: new Pool({
		connectionString: encodePostgresConnectionString(envs.DATABASE_URL),
	}),
});

export const db = new Kysely<Database>({
	dialect,
});
