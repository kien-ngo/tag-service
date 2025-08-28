import { Hono } from "hono";
import { logger } from "hono/logger";
import { addTagsEndpoint } from "./endpoints/add-tags";
import { addTagsScalar } from "./endpoints/add-tags.scalar";
import { getContentTagsEndpoint } from "./endpoints/content-tags";
import { getContentTagsScalar } from "./endpoints/content-tags.scalar";
import { createContentEndpoint } from "./endpoints/create-content";
import { createContentScalar } from "./endpoints/create-content.scalar";
import { deleteTagsEndpoint } from "./endpoints/delete-tags";
import { deleteTagsScalar } from "./endpoints/delete-tags.scalar";
import { docsEndpoint } from "./endpoints/docs";
import { getContentEndpoint } from "./endpoints/get-content";
import { getContentScalar } from "./endpoints/get-content.scalar";
import { healthEndpoint } from "./endpoints/health";
import { healthScalar } from "./endpoints/health.scalar";
import { openApiEndpoint } from "./endpoints/openapi";
import { searchContentsEndpoint } from "./endpoints/search-contents";
import { searchContentsScalar } from "./endpoints/search-contents.scalar";
import { searchTagsEndpoint } from "./endpoints/search-tags";
import { searchTagsScalar } from "./endpoints/search-tags.scalar";
import { getUserTagsEndpoint } from "./endpoints/user-tags";
import { getUserTagsScalar } from "./endpoints/user-tags.scalar";
import { envs } from "./env";
import { cors } from "hono/cors";
import { deleteContentScalar } from "./endpoints/delete-content.scalar";
import { deleteContentEndpoint } from "./endpoints/delete-content";

const app = new Hono();

app.use("*", cors({origin : "*"}))

app.use(logger());
/* ------------------------------------ ROUTES -------------------------------------*/
/**
 * The generated openapi.json which will be used by Scalar
 */
app.get("/openapi.json", openApiEndpoint(app));

/**
 * Reserve this path for the docs UI
 * using Scalar
 */
app.get("/docs", docsEndpoint);

app.get("/", (c) => {
	return c.text("Welcome to tag-service");
});

app.get("/health", healthScalar, (c) => healthEndpoint(c));

// Content management
app.post("/create-content", createContentScalar, (c) =>
	createContentEndpoint(c),
);

// Tag management
app.post("/add-tags", addTagsScalar, (c) => addTagsEndpoint(c));
app.post("/delete-tags", deleteTagsScalar, (c) => deleteTagsEndpoint(c));

// Tag queries
app.get("/content-tags", getContentTagsScalar, (c) =>
	getContentTagsEndpoint(c),
);
app.get("/user-tags", getUserTagsScalar, (c) => getUserTagsEndpoint(c));
app.get("/search-tags", searchTagsScalar, (c) => searchTagsEndpoint(c));

// Content search
app.get("/search-contents", searchContentsScalar, (c) =>
	searchContentsEndpoint(c),
);
// List contents of a userId (from on orgId)
app.get("/get-content", getContentScalar, (c) => getContentEndpoint(c));

// Delete content
app.get("/delete-content", deleteContentScalar, (c) => deleteContentEndpoint(c));
/* ------------------------------------ ROUTES -------------------------------------*/

export default {
	port: 6666,
	fetch: app.fetch,
	host: '0.0.0.0'
};
