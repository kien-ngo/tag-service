-- Create the contents table
CREATE TABLE IF NOT EXISTS contents (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    organization_id TEXT NOT NULL,
    content TEXT NOT NULL
);

-- Create the tags table
CREATE TABLE IF NOT EXISTS tags (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    organization_id TEXT NOT NULL,
    name TEXT NOT NULL,
    UNIQUE(user_id, organization_id, name)
);

-- Create the content_tags junction table
CREATE TABLE IF NOT EXISTS content_tags (
    content_id BIGINT NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (content_id, tag_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_contents_user_id ON contents(user_id);
CREATE INDEX IF NOT EXISTS idx_contents_organization_id ON contents(organization_id);
CREATE INDEX IF NOT EXISTS idx_contents_user_org ON contents(user_id, organization_id);
CREATE INDEX IF NOT EXISTS idx_tags_user_id ON tags(user_id);
CREATE INDEX IF NOT EXISTS idx_tags_organization_id ON tags(organization_id);
CREATE INDEX IF NOT EXISTS idx_tags_user_org ON tags(user_id, organization_id);
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
CREATE INDEX IF NOT EXISTS idx_content_tags_content_id ON content_tags(content_id);
CREATE INDEX IF NOT EXISTS idx_content_tags_tag_id ON content_tags(tag_id);