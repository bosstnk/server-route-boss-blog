import connectionPool from "../utils/db.mjs";

const categoryRepository = {

  getCategories: async (keyword) => {

    let query = `
      SELECT id, name
      FROM categories
    `;

    const values = [];

    if (keyword) {
      query += ` WHERE name ILIKE $1`;
      values.push(`%${keyword}%`);
    }

    query += ` ORDER BY id`;

    const result = await connectionPool.query(query, values);

    return result.rows;
  },

  getPopularCategories: async () => {

    const query = `
      SELECT c.id, c.name,
             COUNT(p.id) FILTER (WHERE st.status = 'Published')::int AS post_count
      FROM categories c
      LEFT JOIN posts p     ON p.category_id = c.id
      LEFT JOIN statuses st ON st.id = p.status_id
      GROUP BY c.id, c.name
      ORDER BY post_count DESC, c.id
    `;

    const result = await connectionPool.query(query);

    return result.rows;
  },

  getCategoryById: async (id) => {

    const query = `
      SELECT id, name
      FROM categories
      WHERE id = $1
    `;

    const result = await connectionPool.query(query, [id]);

    return result.rows[0];
  },

  findByName: async (name) => {
    const query = `
      SELECT id, name
      FROM categories
      WHERE LOWER(name) = LOWER($1)
    `;

    const result = await connectionPool.query(query, [name]);

    return result.rows[0];
  },

  createCategory: async (name) => {
    const query = `
      INSERT INTO categories (name)
      VALUES ($1)
      RETURNING *
    `;

    const result = await connectionPool.query(query, [name]);

    return result.rows[0];
  },

  updateCategory: async (id, name) => {
    const query = `
      UPDATE categories
      SET name = $1
      WHERE id = $2
      RETURNING *
    `;

    const result = await connectionPool.query(query, [name, id]);

    return result.rows[0];
  },

  deleteCategory: async (id) => {
    const query = `
      DELETE FROM categories
      WHERE id = $1
    `;

    await connectionPool.query(query, [id]);
  },
};

export default categoryRepository;