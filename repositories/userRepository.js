import connectionPool from "../utils/db.mjs";

const userRepository = {
  getUserById: async (id) => {
    const query = `
    SELECT 
      name,
      username,
      email,
      profile_pic AS image
    FROM users
    WHERE id = $1
  `;
    const result = await connectionPool.query(query, [id]);
    return result.rows[0];
  },

  updateProfile: async (userId, { name, username, avatarUrl }) => {
    const fields = [];
    const values = [];
    let index = 1;

    if (name) {
      fields.push(`name = $${index++}`);
      values.push(name);
    }

    if (username) {
      fields.push(`username = $${index++}`);
      values.push(username);
    }

    if (avatarUrl) {
      fields.push(`profile_pic = $${index++}`);
      values.push(avatarUrl);
    }

    values.push(userId);

    const query = `
      UPDATE users
      SET ${fields.join(", ")}
      WHERE id = $${index}
    `;

    await connectionPool.query(query, values);
  },
  
  getUserWithPassword: async (id) => {
    const query = `
      SELECT id, password
      FROM users
      WHERE id = $1
    `;

    const result = await connectionPool.query(query, [id]);
    return result.rows[0];
  },

  updatePassword: async (id, hashedPassword) => {
    const query = `
      UPDATE users
      SET password = $1
      WHERE id = $2
    `;

    await connectionPool.query(query, [hashedPassword, id]);
  },
};

export default userRepository;