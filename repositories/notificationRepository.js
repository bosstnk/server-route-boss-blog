import connectionPool from "../utils/db.mjs";

const notificationRepository = {

  getNotificationsByUserId: async (userId) => {
    const query = `
      SELECT
        n.id, n.type, n.is_read, n.created_at,
        n.post_id, p.title AS post_title,
        n.comment_id, c.comment_text,
        actor.id AS actor_id, actor.name AS actor_name, actor.profile_pic AS actor_pic
      FROM notifications n
      JOIN users actor ON actor.id = n.actor_id
      JOIN posts p ON p.id = n.post_id
      LEFT JOIN comments c ON c.id = n.comment_id
      WHERE n.user_id = $1
      ORDER BY n.created_at DESC
      LIMIT 50
    `;
    const result = await connectionPool.query(query, [userId]);
    return result.rows.map((n) => ({
      id: n.id,
      type: n.type,
      is_read: n.is_read,
      created_at: n.created_at,
      post_id: n.post_id,
      post_title: n.post_title,
      comment_id: n.comment_id,
      comment_text: n.comment_text,
      actor: {
        id: n.actor_id,
        name: n.actor_name,
        profile_pic: n.actor_pic,
      },
    }));
  },

  createNotification: async ({ userId, actorId, type, postId, commentId = null }) => {
    await connectionPool.query(
      `INSERT INTO notifications (user_id, actor_id, type, post_id, comment_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, actorId, type, postId, commentId]
    );
  },

  createBulkNotifications: async (rows) => {
    if (!rows.length) return;

    const placeholders = rows
      .map((_, i) => {
        const b = i * 4;
        return `($${b + 1}, $${b + 2}, $${b + 3}, $${b + 4})`;
      })
      .join(", ");

    const values = rows.flatMap((r) => [r.userId, r.actorId, r.type, r.postId]);

    await connectionPool.query(
      `INSERT INTO notifications (user_id, actor_id, type, post_id) VALUES ${placeholders}`,
      values
    );
  },

  getPostOwnerId: async (postId) => {
    const result = await connectionPool.query(
      `SELECT user_id FROM posts WHERE id = $1`,
      [postId]
    );
    return result.rows[0]?.user_id ?? null;
  },

  getPreviousCommentersOnPost: async (postId, excludeUserId) => {
    const result = await connectionPool.query(
      `SELECT DISTINCT user_id FROM comments WHERE post_id = $1 AND user_id != $2`,
      [postId, excludeUserId]
    );
    return result.rows.map((r) => r.user_id);
  },

  getAllUserIds: async (excludeUserId) => {
    const result = await connectionPool.query(
      `SELECT id FROM users WHERE id != $1`,
      [excludeUserId]
    );
    return result.rows.map((r) => r.id);
  },

  checkNewPostNotified: async (postId) => {
    const result = await connectionPool.query(
      `SELECT 1 FROM notifications WHERE type = 'new_post' AND post_id = $1 LIMIT 1`,
      [postId]
    );
    return result.rows.length > 0;
  },
};

export default notificationRepository;
