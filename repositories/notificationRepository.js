import connectionPool from "../utils/db.mjs";

const notificationRepository = {

    getNotifications: async () => {

        const result = await connectionPool.query(`
      
      SELECT
  c.id,
  'comment' AS type,
  c.comment_text AS content,
  c.created_at,
  p.id AS post_id,
  p.title AS article,
  u.name,
  u.profile_pic AS avatar
FROM comments c
JOIN users u ON c.user_id = u.id
JOIN posts p ON c.post_id = p.id

UNION ALL

SELECT
  l.id,
  'like' AS type,
  NULL AS content,
  l.liked_at AS created_at,
  p.id AS post_id,
  p.title AS article,
  u.name,
  u.profile_pic AS avatar
FROM likes l
JOIN users u ON l.user_id = u.id
JOIN posts p ON l.post_id = p.id

      ORDER BY created_at DESC

      LIMIT 50

    `);

        return result.rows.map((n) => ({
            id: n.id,
            type: n.type,
            content: n.content,
            article: n.article,
            post_id: n.post_id,
            time: n.created_at,
            user: {
                name: n.name,
                avatar: n.avatar
            }
        }));

    }

};

export default notificationRepository;