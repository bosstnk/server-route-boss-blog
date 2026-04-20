import userRepository from "../repositories/userRepository.js";
import bcrypt from "bcrypt";
import { uploadImage } from "../utils/uploadToSupabase.js";

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
            if (file) {
                console.log("📤 [USER][SERVICE][UPLOAD IMAGE] Validating...");

                // 🎯 1. validate mime type
                const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

                if (!allowedTypes.includes(file.mimetype)) {
                    console.warn("⚠️ [USER][SERVICE][UPLOAD IMAGE] Invalid file type", {
                        type: file.mimetype,
                    });
                    throw new Error("Only JPG, PNG, WEBP are allowed");
                }

                // 🎯 2. validate size (2MB)
                const MAX_SIZE = 2 * 1024 * 1024;

                if (file.size > MAX_SIZE) {
                    console.warn("⚠️ [USER][SERVICE][UPLOAD IMAGE] File too large", {
                        size: file.size,
                    });
                    throw new Error("File size must be less than 2MB");
                }

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
                throw new Error("User not found");
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password);

            if (!isMatch) {
                const error = new Error("Current password is incorrect");
                error.field = "currentPassword"; // ⭐ KEY สำคัญ
                error.statusCode = 400;
                throw error;
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