import likeService from "../services/likeService.js";

const likeController = {

  toggleLike: async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;
    console.log("📝 [LIKE][TOGGLE][REQUEST]", { postId, userId });

    try {
      const result = await likeService.toggleLike(postId, userId);

      console.log("✅ [LIKE][TOGGLE][RESPONSE]", { liked: result.liked });

      return res.json(result);
    } catch (error) {
      if (error.statusCode) {
        console.warn("⚠️ [LIKE][TOGGLE][BUSINESS]", {
          message: error.message,
          errors: error.errors,
        });
        const body = { message: error.message };
        if (error.errors) body.errors = error.errors;
        return res.status(error.statusCode).json(body);
      }
      console.error("💥 [LIKE][TOGGLE][SYSTEM]", { message: error.message });
      return res.status(500).json({ message: "Internal server error" });
    }
  },

};

export default likeController;
