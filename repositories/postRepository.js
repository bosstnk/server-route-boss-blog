import connectionPool from "../utils/db.mjs";

const postRepository = {
  getPosts: async ({ category, keyword, limit, offset }) => {
    let query = `
      SELECT
        posts.id,
        users.name AS author,
        users.profile_pic AS author_pic,
        posts.image,
        categories.name AS category,
        posts.title,
        posts.description,
        posts.date,
        posts.content,
        statuses.status,
        posts.likes_count
      FROM posts
      INNER JOIN users on posts.user_id = users.id
      INNER JOIN categories ON posts.category_id = categories.id
      INNER JOIN statuses ON posts.status_id = statuses.id
      WHERE statuses.status = 'Published'
    `;

    let values = [];

    if (category && keyword) {
      query += `
        AND categories.name ILIKE $1
        AND (
          posts.title ILIKE $2
          OR posts.description ILIKE $2
          OR posts.content ILIKE $2
        )
      `;
      values.push(`%${category}%`, `%${keyword}%`);
    } else if (category) {
      query += ` AND categories.name ILIKE $1`;
      values.push(`%${category}%`);
    } else if (keyword) {
      query += `
        AND (
          posts.title ILIKE $1
          OR posts.description ILIKE $1
          OR posts.content ILIKE $1
        )
      `;
      values.push(`%${keyword}%`);
    }

    query += `
      ORDER BY posts.date DESC
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
    `;

    values.push(limit, offset);

    const result = await connectionPool.query(query, values);
    return result.rows;
  },

  countPosts: async ({ category, keyword }) => {
    let query = `
      SELECT COUNT(*)
      FROM posts
      INNER JOIN categories ON posts.category_id = categories.id
      INNER JOIN statuses ON posts.status_id = statuses.id
      WHERE statuses.status = 'Published'
    `;

    let values = [];

    if (category && keyword) {
      query += `
        AND categories.name ILIKE $1
        AND (
          posts.title ILIKE $2
          OR posts.description ILIKE $2
          OR posts.content ILIKE $2
        )
      `;
      values.push(`%${category}%`, `%${keyword}%`);
    } else if (category) {
      query += ` AND categories.name ILIKE $1`;
      values.push(`%${category}%`);
    } else if (keyword) {
      query += `
        AND (
          posts.title ILIKE $1
          OR posts.description ILIKE $1
          OR posts.content ILIKE $1
        )
      `;
      values.push(`%${keyword}%`);
    }

    const result = await connectionPool.query(query, values);
    return parseInt(result.rows[0].count, 10);
  },

  getAdminPosts: async ({ category, keyword, status, limit, offset }) => {
    let query = `
      SELECT
        posts.id,
        users.name AS author,
        posts.image,
        categories.name AS category,
        posts.title,
        posts.description,
        posts.date,
        posts.content,
        statuses.status,
        posts.likes_count
      FROM posts
      INNER JOIN users on posts.user_id = users.id
      INNER JOIN categories ON posts.category_id = categories.id
      INNER JOIN statuses ON posts.status_id = statuses.id
    `;

    const conditions = [];
    const values = [];

    if (category) {
      values.push(`%${category}%`);
      conditions.push(`categories.name ILIKE $${values.length}`);
    }

    if (keyword) {
      values.push(`%${keyword}%`);
      const idx = values.length;
      conditions.push(
        `(posts.title ILIKE $${idx} OR posts.description ILIKE $${idx} OR posts.content ILIKE $${idx})`
      );
    }

    if (status) {
      values.push(status);
      conditions.push(`statuses.status = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += `
      ORDER BY posts.date DESC
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
    `;

    values.push(limit, offset);

    const result = await connectionPool.query(query, values);
    return result.rows;
  },

  countAdminPosts: async ({ category, keyword, status }) => {
    let query = `
      SELECT COUNT(*)
      FROM posts
      INNER JOIN categories ON posts.category_id = categories.id
      INNER JOIN statuses ON posts.status_id = statuses.id
    `;

    const conditions = [];
    const values = [];

    if (category) {
      values.push(`%${category}%`);
      conditions.push(`categories.name ILIKE $${values.length}`);
    }

    if (keyword) {
      values.push(`%${keyword}%`);
      const idx = values.length;
      conditions.push(
        `(posts.title ILIKE $${idx} OR posts.description ILIKE $${idx} OR posts.content ILIKE $${idx})`
      );
    }

    if (status) {
      values.push(status);
      conditions.push(`statuses.status = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    const result = await connectionPool.query(query, values);
    return parseInt(result.rows[0].count, 10);
  },

  createPost: async ({
    title,
    image,
    category_id,
    description,
    content,
    status_id,
    user_id
  }) => {

    const query = `
      INSERT INTO posts
      (title, image, category_id, description, content, status_id, user_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING id
    `;

    const values = [
      title,
      image,
      category_id,
      description,
      content,
      status_id,
      user_id
    ];

    const result = await connectionPool.query(query, values);
    return result.rows[0];

  },

  getPostMeta: async (postId) => {
    const result = await connectionPool.query(
      `SELECT user_id, status_id FROM posts WHERE id = $1`,
      [postId]
    );
    return result.rows[0] ?? null;
  },

  getPostById: async (postId, userId) => {
    const query = `
      SELECT
        posts.id,
        users.name AS author,
        users.profile_pic AS author_pic,
        users.bio AS author_bio,
        posts.image,
        posts.category_id,
        categories.name AS category,
        posts.title,
        posts.description,
        posts.date,
        posts.content,
        statuses.status,
        posts.likes_count,
        CASE WHEN likes.id IS NOT NULL THEN true ELSE false END AS liked
      FROM posts
      INNER JOIN users ON posts.user_id = users.id
      INNER JOIN categories ON posts.category_id = categories.id
      INNER JOIN statuses ON posts.status_id = statuses.id
      LEFT JOIN likes ON likes.post_id = posts.id AND likes.user_id = $2
      WHERE posts.id = $1
    `
    const result = await connectionPool.query(query, [postId, userId || null])
    return result.rows[0];
  },

  updatePostById: async (postId, postData) => {
    const fields = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(postData)) {
      fields.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }

    if (fields.length === 0) {
      return null;
    }

    values.push(postId);

    const query = `
      UPDATE posts
      SET ${fields.join(", ")}
      WHERE id = $${index}
      RETURNING *;
    `;

    const result = await connectionPool.query(query, values);
    return result.rows[0];
  },

  deletePostById: async (postId) => {
    const client = await connectionPool.connect();

    try {
      await client.query("BEGIN");

      // ลบ dependencies ทั้งหมดก่อน (กัน FK violation)
      await client.query("DELETE FROM notifications WHERE post_id = $1", [postId]);
      await client.query("DELETE FROM likes WHERE post_id = $1", [postId]);
      await client.query("DELETE FROM comments WHERE post_id = $1", [postId]);

      const result = await client.query(
        "DELETE FROM posts WHERE id = $1 RETURNING *",
        [postId]
      );

      await client.query("COMMIT");
      return result.rows[0];

    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },

};

export default postRepository;
