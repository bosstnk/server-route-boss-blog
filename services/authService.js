import bcrypt from "bcrypt";
import authRepository from "../repositories/authRepository.js";
import jwt from "jsonwebtoken";

const authService = {
  register: async ({ name, username, email, password }) => {
    name = name.trim();
    username = username.trim();
    email = email.trim().toLowerCase();

    const existingUser = await authRepository.findByEmail(email);

    if (existingUser) {
      const error = new Error("Email already exists");
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await authRepository.createUser({
      name,
      username,
      email,
      password: hashedPassword,
      role: "user",
    });

    return {
      message: "User has been created successfully",
    };
  },

  login: async ({ email, password }) => {
    email = email.trim().toLowerCase();

    // 1️⃣ หา user
    const user = await authRepository.findByEmail(email);

    if (!user) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    // 2️⃣ compare password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    // 3️⃣ generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.SECRET_KEY,
      { expiresIn: "30m" }
    );

    return {
      message: "Login successfully",
      token,
    };
  },
};

export default authService;
