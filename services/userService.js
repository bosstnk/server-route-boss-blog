import userRepository from "../repositories/userRepository.js";
import bcrypt from "bcrypt";
import { uploadImage } from "../utils/uploadToSupabase.js";
import { createError } from "../utils/error.js";

const userService = {
    getUserById: async (id) => {
        console.log("👤 [USER][SERVICE][GET] Start", { userId: id });

        try {
            const user = await userRepository.getUserById(id);

            if (!user) {
                console.warn("⚠️ [USER][SERVICE][GET] User not found", { userId: id });
                return null;
            }

            console.log("✅ [USER][SERVICE][GET] Success", { userId: id });

            return user;
        } catch (error) {
            console.error("💥 [USER][SERVICE][GET] Error", {
                userId: id,
                message: error.message,
            });
            throw error;
        }
    },

    updateProfile: async (userId, { name, username, bio, file }) => {
        console.log("📝 [USER][SERVICE][UPDATE PROFILE] Start", {
            userId,
            hasFile: !!file,
        });

        let profilePicUrl = null;

        try {
            // 🔍 check duplicate username (ยกเว้นตัวเอง)
            if (username) {
                const existing = await userRepository.findByUsername(username);

                if (existing && String(existing.id) !== String(userId)) {
                    console.warn("⚠️ [USER][SERVICE][UPDATE PROFILE] Duplicate username", {
                        username,
                    });
                    throw createError({
                        message: "Validation failed",
                        statusCode: 409,
                        errors: { username: "Username already exists" },
                    });
                }
            }

            if (file) {
                console.log("📤 [USER][SERVICE][UPLOAD IMAGE] Uploading...");

                profilePicUrl = await uploadImage("profiles", userId, file);

                console.log("✅ [USER][SERVICE][UPLOAD IMAGE] Success");
            }

            await userRepository.updateProfile(userId, {
                name,
                username,
                bio,
                avatarUrl: profilePicUrl,
            });

            console.log("✅ [USER][SERVICE][UPDATE PROFILE] Success", { userId });

        } catch (error) {
            console.error("💥 [USER][SERVICE][UPDATE PROFILE] Error", {
                userId,
                message: error.message,
            });
            throw error;
        }
    },

    resetPassword: async (userId, { currentPassword, newPassword }) => {
        console.log("🔐 [USER][SERVICE][RESET PASSWORD] Start", { userId });

        try {
            const user = await userRepository.getUserWithPassword(userId);

            if (!user) {
                throw createError({ message: "User not found", statusCode: 404 });
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password);

            if (!isMatch) {
                throw createError({
                    message: "Validation failed",
                    statusCode: 400,
                    errors: { currentPassword: "Current password is incorrect" },
                });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await userRepository.updatePassword(userId, hashedPassword);

            console.log("✅ [USER][SERVICE][RESET PASSWORD] Success");

        } catch (error) {
            console.error("💥 [USER][SERVICE][RESET PASSWORD]", {
                userId,
                message: error.message,
            });
            throw error;
        }
    },
};

export default userService;