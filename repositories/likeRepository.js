import connectionPool from "../utils/db.mjs";

const likeRepository = {

  findLike: async (postId, userId) => {

    const result = await connectionPool.query(
      `SELECT id
       FROM likes
       WHERE post_id=$1 AND user_id=$2`,
      [postId, userId]
    );

    return result.rows[0];

  },

  createLike: async (postId, userId) => {

    await connectionPool.query(
      `INSERT INTO likes(post_id,user_id)
       VALUES($1,$2)`,
      [postId, userId]
    );

  },

  deleteLike: async (postId, userId) => {

    await connectionPool.query(
      `DELETE FROM likes
       WHERE post_id=$1 AND user_id=$2`,
      [postId, userId]
    );

  },

  increasePostLike: async (postId) => {

    await connectionPool.query(
      `UPDATE posts
       SET likes_count = likes_count + 1
       WHERE id=$1`,
      [postId]
    );

  },

  decreasePostLike: async (postId) => {

    await connectionPool.query(
      `UPDATE posts
       SET likes_count = GREATEST(likes_count - 1,0)
       WHERE id=$1`,
      [postId]
    );

  },

  getPostLikes: async (postId) => {

    const result = await connectionPool.query(
      `SELECT likes_count
       FROM posts
       WHERE id=$1`,
      [postId]
    );

    return result.rows[0].likes_count;

  }

};

export default likeRepository;