import connectionPool from "../utils/db.mjs";

const commentRepository = {

  getComments: async (postId) => {

    const query = `
      SELECT
        comments.id,
        comments.comment_text,
        comments.created_at,
        users.name,
        users.profile_pic
      FROM comments
      JOIN users
      ON users.id = comments.user_id
      WHERE post_id = $1
      ORDER BY created_at DESC
    `;

    const result = await connectionPool.query(query, [postId]);

    return result.rows;
  },

  createComment: async ({ postId, userId, comment_text }) => {

    const query = `
      INSERT INTO comments
      (post_id, user_id, comment_text)
      VALUES ($1,$2,$3)
      RETURNING *
    `;

    const result = await connectionPool.query(query, [
      postId,
      userId,
      comment_text
    ]);

    return result.rows[0];
  },

  getCommentById: async (id) => {

    const query = `
      SELECT *
      FROM comments
      WHERE id = $1
    `;

    const result = await connectionPool.query(query, [id]);

    return result.rows[0];
  },

  deleteComment: async (id) => {

    const query = `
      DELETE FROM comments
      WHERE id = $1
    `;

    await connectionPool.query(query, [id]);
  }

};

export default commentRepository;