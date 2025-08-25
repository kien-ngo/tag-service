import { db } from "../src/kysely";

async function bootstrap() {
	console.log("🚀 Starting database bootstrap...");

	try {
		// Create sample contents
		const contents = await db
			.insertInto("contents")
			.values([
				{
					user_id: "123e4567-e89b-12d3-a456-426614174000",
					organization_id: "987fcdeb-51a2-43d1-9f12-345678901234",
					content: "https://reactjs.org/docs/getting-started.html",
				},
				{
					user_id: "123e4567-e89b-12d3-a456-426614174000",
					organization_id: "987fcdeb-51a2-43d1-9f12-345678901234",
					content: "https://nodejs.org/en/docs/guides/",
				},
				{
					user_id: "456e7890-12f3-45g6-h789-012345678901",
					organization_id: "987fcdeb-51a2-43d1-9f12-345678901234",
					content: "https://javascript.info/",
				},
				{
					user_id: "456e7890-12f3-45g6-h789-012345678901",
					organization_id: "987fcdeb-51a2-43d1-9f12-345678901234",
					content: "/projects/my-app/README.md",
				},
				{
					user_id: "123e4567-e89b-12d3-a456-426614174000",
					organization_id: "987fcdeb-51a2-43d1-9f12-345678901234",
					content: "https://tailwindcss.com/docs",
				},
			])
			.returning(["id", "user_id", "organization_id", "content"])
			.execute();

		console.log("✅ Created sample contents:", contents);

		// Create sample tags
		const tags = await db
			.insertInto("tags")
			.values([
				{ user_id: "123e4567-e89b-12d3-a456-426614174000", organization_id: "987fcdeb-51a2-43d1-9f12-345678901234", name: "javascript" },
				{ user_id: "123e4567-e89b-12d3-a456-426614174000", organization_id: "987fcdeb-51a2-43d1-9f12-345678901234", name: "react" },
				{ user_id: "123e4567-e89b-12d3-a456-426614174000", organization_id: "987fcdeb-51a2-43d1-9f12-345678901234", name: "nodejs" },
				{ user_id: "123e4567-e89b-12d3-a456-426614174000", organization_id: "987fcdeb-51a2-43d1-9f12-345678901234", name: "documentation" },
				{ user_id: "456e7890-12f3-45g6-h789-012345678901", organization_id: "987fcdeb-51a2-43d1-9f12-345678901234", name: "tutorial" },
				{ user_id: "456e7890-12f3-45g6-h789-012345678901", organization_id: "987fcdeb-51a2-43d1-9f12-345678901234", name: "web" },
				{ user_id: "123e4567-e89b-12d3-a456-426614174000", organization_id: "987fcdeb-51a2-43d1-9f12-345678901234", name: "frontend" },
				{ user_id: "123e4567-e89b-12d3-a456-426614174000", organization_id: "987fcdeb-51a2-43d1-9f12-345678901234", name: "backend" },
				{ user_id: "456e7890-12f3-45g6-h789-012345678901", organization_id: "987fcdeb-51a2-43d1-9f12-345678901234", name: "css" },
				{ user_id: "123e4567-e89b-12d3-a456-426614174000", organization_id: "987fcdeb-51a2-43d1-9f12-345678901234", name: "tailwind" },
			])
			.returning(["id", "user_id", "organization_id", "name"])
			.execute();

		console.log("✅ Created sample tags:", tags);

		// Create sample content-tag associations
		const contentTagAssociations = [
			// React docs: javascript, react, documentation, web, frontend
			{ content_id: contents[0].id, tag_names: ["javascript", "react", "documentation", "web", "frontend"] },
			// Node.js docs: javascript, nodejs, documentation, backend
			{ content_id: contents[1].id, tag_names: ["javascript", "nodejs", "documentation", "backend"] },
			// JavaScript.info: javascript, tutorial, web
			{ content_id: contents[2].id, tag_names: ["javascript", "tutorial", "web"] },
			// README.md: documentation
			{ content_id: contents[3].id, tag_names: ["documentation"] },
			// Tailwind docs: css, tailwind, documentation, frontend, web
			{ content_id: contents[4].id, tag_names: ["css", "tailwind", "documentation", "frontend", "web"] },
		];

		for (const association of contentTagAssociations) {
			for (const tagName of association.tag_names) {
				const tag = tags.find((t) => t.name === tagName);
				if (tag) {
					await db
						.insertInto("content_tags")
						.values({
							content_id: association.content_id,
							tag_id: tag.id,
						})
						.execute();
				}
			}
		}

		console.log("✅ Created content-tag associations");

		// Verify the data
		const totalContents = await db
			.selectFrom("contents")
			.select(db.fn.count("id").as("count"))
			.executeTakeFirst();

		const totalTags = await db
			.selectFrom("tags")
			.select(db.fn.count("id").as("count"))
			.executeTakeFirst();

		const totalAssociations = await db
			.selectFrom("content_tags")
			.select(db.fn.count("content_id").as("count"))
			.executeTakeFirst();

		console.log("📊 Database summary:");
		console.log(`   Contents: ${totalContents?.count}`);
		console.log(`   Tags: ${totalTags?.count}`);
		console.log(`   Content-Tag associations: ${totalAssociations?.count}`);

		console.log("🎉 Bootstrap completed successfully!");
	} catch (error) {
		console.error("❌ Bootstrap failed:", error);
		process.exit(1);
	}
}

	bootstrap()
		.then(() => process.exit(0))
		.catch(() => process.exit(1));

export { bootstrap };