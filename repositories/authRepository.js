import connectionPool from "../utils/db.mjs";

const authRepository = {
  findUser: async (email) => {
    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await connectionPool.query(query, [email]);
    return result.rows[0];
  },

  findByUsername: async (username) => {
    const query = `SELECT * FROM users WHERE username = $1`;
    const result = await connectionPool.query(query, [username]);
    return result.rows[0];
  },

  createUser: async ({ name, username, email, password, role }) => {
    const query = `
      INSERT INTO users (name, username, email, password, role)
      VALUES ($1, $2, $3, $4, $5)
    `;

    const values = [name, username, email, password, role];

    await connectionPool.query(query, values);
  },
};

export default authRepository;
