import type { Generated, Insertable, Selectable, Updateable } from "kysely";

export interface Database {
	contents: ContentsTable;
	tags: TagsTable;
	content_tags: ContentTagsTable;
}

export interface ContentsTable {
	id: Generated<number>;
	user_id: string;
	organization_id: string;
	content: string;
}

export interface TagsTable {
	id: Generated<number>;
	user_id: string;
	organization_id: string;
	name: string;
}

export interface ContentTagsTable {
	content_id: number;
	tag_id: number;
}

export type Content = Selectable<ContentsTable>;
export type NewContent = Insertable<ContentsTable>;
export type ContentUpdate = Updateable<ContentsTable>;

export type Tag = Selectable<TagsTable>;
export type NewTag = Insertable<TagsTable>;
export type TagUpdate = Updateable<TagsTable>;

export type ContentTag = Selectable<ContentTagsTable>;
export type NewContentTag = Insertable<ContentTagsTable>;
export type ContentTagUpdate = Updateable<ContentTagsTable>;
