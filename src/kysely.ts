import { BunDialect } from "@ratiu5/kysely-bun-psql";
import { Kysely } from "kysely";
import type { Database } from "./db-schema";
import { envs } from "./env";

const dialect = new BunDialect({
	url: envs.DATABASE_URL,
});

export const db = new Kysely<Database>({
	dialect,
});
