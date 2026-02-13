import connectionPool from "../utils/db.mjs";

const postRepository = {
  getPosts: async ({ category, keyword, limit, offset }) => {
    let query = `
      SELECT 
        posts.id, 
        posts.image, 
        categories.name AS category, 
        posts.title, 
        posts.description, 
        posts.date, 
        posts.content, 
        statuses.status, 
        posts.likes_count
      FROM posts
      INNER JOIN categories ON posts.category_id = categories.id
      INNER JOIN statuses ON posts.status_id = statuses.id
    `;

    let values = [];

    if (category && keyword) {
      query += `
        WHERE categories.name ILIKE $1
        AND (
          posts.title ILIKE $2
          OR posts.description ILIKE $2
          OR posts.content ILIKE $2
        )
      `;
      values.push(`%${category}%`, `%${keyword}%`);
    } else if (category) {
      query += ` WHERE categories.name ILIKE $1`;
      values.push(`%${category}%`);
    } else if (keyword) {
      query += `
        WHERE posts.title ILIKE $1
        OR posts.description ILIKE $1
        OR posts.content ILIKE $1
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
    `;

    let values = [];

    if (category && keyword) {
      query += `
        WHERE categories.name ILIKE $1
        AND (
          posts.title ILIKE $2
          OR posts.description ILIKE $2
          OR posts.content ILIKE $2
        )
      `;
      values.push(`%${category}%`, `%${keyword}%`);
    } else if (category) {
      query += ` WHERE categories.name ILIKE $1`;
      values.push(`%${category}%`);
    } else if (keyword) {
      query += `
        WHERE posts.title ILIKE $1
        OR posts.description ILIKE $1
        OR posts.content ILIKE $1
      `;
      values.push(`%${keyword}%`);
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
  }) => {
    const query = `
      INSERT INTO posts
      (title, image, category_id, description, content, status_id)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;

    const values = [
      title,
      image,
      category_id,
      description,
      content,
      status_id,
    ];

    await connectionPool.query(query, values);
  },

  getPostById: async (postId) => {
    let query = ` SELECT
      posts.id,
      posts.image,
      categories.name,
      posts.title,
      posts.description,
      posts.date,
      posts.content,
      statuses.status,
      posts.likes_count
    FROM posts
    INNER JOIN categories ON posts.category_id = categories.id
    INNER JOIN statuses ON posts.status_id = statuses.id
    WHERE posts.id = $1`

    let values = [postId]

    const result = await connectionPool.query(query, values)

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

  deletePostById: async(postId) => {
    let query = `
    DELETE FROM posts 
    WHERE id = $1
    RETURNING *;`

    let values = [postId]

    const result = await connectionPool.query(query, values);
    return result.rows[0];
  }
};

export default postRepository;
