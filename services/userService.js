import userRepository from "../repositories/userRepository.js";
import bcrypt from "bcrypt";
import { uploadProfileImage } from "../utils/uploadToSupabase.js";

const userService = {
    getUserById: async (id) => {
        return userRepository.getUserById(id);
    },

    updateProfile: async (userId, { name, username, file }) => {
        let profilePicUrl = null;

        if (file) {
            profilePicUrl = await uploadProfileImage(userId, file);
        }

        await userRepository.updateProfile(userId, {
            name,
            username,
            avatarUrl: profilePicUrl,
        });
    },
    resetPassword: async (userId, { currentPassword, newPassword }) => {
        const MIN_PASSWORD_LENGTH = 8;
        if (!currentPassword || !newPassword) {
            throw new Error("All fields are required");
        }

        if (newPassword.length < MIN_PASSWORD_LENGTH) {
            throw new Error("Password must be at least 8 characters");
        }

        // 🔍 ดึง user พร้อม password hash
        const user = await userRepository.getUserWithPassword(userId);

        if (!user) {
            throw new Error("User not found");
        }

        // 🔐 ตรวจรหัสเดิม
        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isMatch) {
            throw new Error("Current password is incorrect");
        }

        // 🔐 hash รหัสใหม่
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 💾 update password
        await userRepository.updatePassword(userId, hashedPassword);
    },

}
export default userService
