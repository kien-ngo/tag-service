I want the following functionalities: 
- get all tags of a content
- get all tags current user has 
- search for tags (auto completion) 
- search for contents by tags
- add more tags to a content 
- remove tags from a content.

I’d suggest three tables:

contents:
id        BIGSERIAL PRIMARY KEY
user_id   TEXT NOT NULL
content   TEXT NOT NULL


tags:
id    BIGSERIAL PRIMARY KEY
name  TEXT NOT NULL UNIQUE


content_tags
content_id BIGINT NOT NULL REFERENCES contents(id) ON DELETE CASCADE
tag_id     BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE
PRIMARY KEY (content_id, tag_id)

General queries:
- Get all tags of a content
```sql
SELECT t.name
FROM tags t
JOIN content_tags ct ON ct.tag_id = t.id
WHERE ct.content_id = $1;
```

Get all tags a user has
```sql
SELECT DISTINCT t.name
FROM tags t
JOIN content_tags ct ON ct.tag_id = t.id
JOIN contents c ON c.id = ct.content_id
WHERE c.user_id = $1;
```

Search tags:
```sql
SELECT name
FROM tags
WHERE name ILIKE $1 || '%'
ORDER BY name
LIMIT 10;
```

Add more tags to a content:
Insert tag if not exists.
Insert (content_id, tag_id) into content_tags.

Remove tags from a content:
```sql
DELETE FROM content_tags
WHERE content_id = $1 AND tag_id = $2;
```

Create the endpoints inside the ./src/endpoints folder. Make sure to add Scalar.
Write some sort of scripts or sql content to bootstrap the database with some records.