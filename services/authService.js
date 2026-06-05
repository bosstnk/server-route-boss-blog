import bcrypt from "bcrypt";
import authRepository from "../repositories/authRepository.js";
import jwt from "jsonwebtoken";
import { createError, DB_ERROR } from "../utils/error.js";

const authService = {
  register: async ({ name, username, email, password }) => {
    console.log("📝 [AUTH][REGISTER] Start", { email, username });

    name = name.trim();
    username = username.trim();
    email = email.trim().toLowerCase();

    const errors = {};

    // 🔍 check email
    const existingUser = await authRepository.findUser(email);
    if (existingUser) {
      console.warn("⚠️ [AUTH][REGISTER] Email already exists", { email });
      errors.email = "Email already exists";
    }
    // 🔍 check username
    const existingUsername = await authRepository.findByUsername(username);
    if (existingUsername) {
      console.warn("⚠️ [AUTH][REGISTER] Username already exists", { username });
      errors.username = "Username already exists";
    }

    if (Object.keys(errors).length > 0) {
      throw createError({
        message: "Validation failed",
        statusCode: 409,
        errors,
      });
    }

    console.log("🔐 [AUTH][REGISTER] Hashing password");

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const newUserId = await authRepository.createUser({
        name,
        username,
        email,
        password: hashedPassword,
        role: "user",
      });

      console.log("✅ [AUTH][REGISTER] Success", { email });

      const token = jwt.sign(
        { id: newUserId, role: "user" },
        process.env.SECRET_KEY,
        { expiresIn: "24h" }
      );

      return { token };

    } catch (error) {

      console.error("💥 [AUTH][REGISTER] DB Error", {
        message: error.message,
      });

      if (error.code === DB_ERROR.UNIQUE) {
        if (error.constraint === "users_username_key") {
          console.warn("⚠️ [AUTH][REGISTER] DB username duplicate");
          throw createError({
            message: "Username already exists",
            statusCode: 409,
            errors: {
              username: "Username already exists",
            },
          });
        }

        if (error.constraint === "users_email_key") {
          console.warn("⚠️ [AUTH][REGISTER] DB email duplicate");
          throw createError({
            message: "Email already exists",
            statusCode: 409,
            errors: {
              email: "Email already exists",
            },
          });
        }
      }

      throw error;
    }
  },

  login: async ({ email, password }) => {
    email = email.trim().toLowerCase();

    console.log("🔐 [AUTH][LOGIN] Start", { email });

    const user = await authRepository.findUser(email);

    if (!user) {
      console.warn("⚠️ [AUTH][LOGIN] User not found", { email });
      throw createError({
        message: "Invalid email or password",
        statusCode: 401,
      });
    }

    console.log("📦 [AUTH][LOGIN] User found", { userId: user.id });

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      console.warn("⚠️ [AUTH][LOGIN] Wrong password", { userId: user.id });
      throw createError({
        message: "Invalid email or password",
        statusCode: 401,
      });
    }

    console.log("✅ [AUTH][LOGIN] Success", { userId: user.id });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );

    return {
      message: "Login successfully",
      token,
    };
  }
};

export default authService;
