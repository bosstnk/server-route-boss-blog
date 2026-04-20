import userService from "../services/userService.js";

const userController = {
  getUserById: async (req, res) => {
    const userId = req.user.id;

    console.log("👤 [USER][GET PROFILE] Start", { userId });

    try {
      const user = await userService.getUserById(userId);

      if (!user) {
        console.warn("⚠️ [USER][GET PROFILE] User not found", { userId });

        return res.status(404).json({
          message: "User not found",
        });
      }

      console.log("✅ [USER][GET PROFILE] Success", { userId });

      return res.json(user);
    } catch (error) {
      console.error("💥 [USER][GET PROFILE] Error", {
        userId,
        message: error.message,
      });

      return res.status(500).json({
        message: "Failed to get user profile",
      });
    }
  },

  updateProfile: async (req, res) => {
    const userId = req.user.id;
    const { name, username, bio } = req.body;
    const file = req.files?.imageFile?.[0];

    console.log("📝 [USER][UPDATE PROFILE] Start", {
      userId,
      hasFile: !!file,
    });

    try {
      await userService.updateProfile(userId, {
        name,
        username,
        bio,
        file,
      });

      console.log("✅ [USER][UPDATE PROFILE] Success", { userId });

      return res.status(200).json({
        message: "Profile updated successfully",
      });
    } catch (error) {
      console.error("💥 [USER][UPDATE PROFILE] Error", {
        userId,
        message: error.message,
        hasFile: !!file,
      });

      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  resetPassword: async (req, res) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    console.log("🔐 [USER][RESET PASSWORD] Start", { userId });

    try {
      await userService.resetPassword(userId, {
        currentPassword,
        newPassword,
      });

      console.log("✅ [USER][RESET PASSWORD] Success", { userId });

      return res.status(200).json({
        message: "Password updated successfully",
      });

    } catch (error) {

      if (error.field) {
        console.warn("⚠️ [USER][RESET PASSWORD] Validation error", {
          userId,
          message: error.message,
        });

        return res.status(400).json({
          errors: {
            [error.field]: error.message,
          },
        });
      }

      console.error("💥 [USER][RESET PASSWORD] System error", {
        userId,
        message: error.message,
      });

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
};

export default userController;