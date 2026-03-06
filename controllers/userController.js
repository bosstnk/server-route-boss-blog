import userService from "../services/userService.js";


const userController = {
  getUserById: async (req, res) => {
    try {
      const userId = req.user.id;

      const user = await userService.getUserById(userId);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Failed to get user profile",
      });
    }
  },
  updateProfile: async (req, res) => {
    const userId = req.user.id;
    const { name, username } = req.body;
    const file = req.files?.imageFile?.[0];

    try {
      await userService.updateProfile(userId, {
        name,
        username,
        file,
      });

      return res.status(200).json({
        message: "Profile updated successfully",
      });
    } catch (error) {
      // ⭐ สำคัญมาก
      console.error("UPDATE PROFILE ERROR:", error);

      return res.status(500).json({
        message: "Failed to update profile",
        error: error.message, // ⭐ ส่ง message กลับมาด้วย
      });
    }
  },
  resetPassword: async (req, res) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    try {
      await userService.resetPassword(userId, {
        currentPassword,
        newPassword,
      });

      return res.status(200).json({
        message: "Password updated successfully",
      });
    } catch (error) {
      console.error("RESET PASSWORD ERROR:", error);

      return res.status(400).json({
        message: error.message,
      });
    }
  },
};

export default userController
