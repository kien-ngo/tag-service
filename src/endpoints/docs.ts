import { Scalar } from "@scalar/hono-api-reference";

export const docsEndpoint = Scalar({
	// Change the theme here to your linking
	theme: "purple",
	url: "/openapi.json",
});
