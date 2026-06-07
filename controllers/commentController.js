import commentService from "../services/commentService.js";

const commentController = {

  getComments: async (req, res) => {
    const { postId } = req.params;
    console.log("📝 [COMMENT][GET][REQUEST]", { postId });

    try {
      const comments = await commentService.getComments(postId);

      console.log("✅ [COMMENT][GET][RESPONSE]", { count: comments.length });

      return res.json(comments);
    } catch (error) {
      if (error.statusCode) {
        console.warn("⚠️ [COMMENT][GET][BUSINESS]", {
          message: error.message,
          errors: error.errors,
        });
        const body = { message: error.message };
        if (error.errors) body.errors = error.errors;
        return res.status(error.statusCode).json(body);
      }
      console.error("💥 [COMMENT][GET][SYSTEM]", { message: error.message });
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  createComment: async (req, res) => {
    const { postId } = req.params;
    const { comment_text } = req.body;
    const userId = req.user.id;
    console.log("📝 [COMMENT][CREATE][REQUEST]", { postId, userId });

    try {
      const comment = await commentService.createComment({
        postId,
        userId,
        comment_text,
      });

      console.log("✅ [COMMENT][CREATE][RESPONSE]", { id: comment.id });

      return res.status(201).json(comment);
    } catch (error) {
      if (error.statusCode) {
        console.warn("⚠️ [COMMENT][CREATE][BUSINESS]", {
          message: error.message,
          errors: error.errors,
        });
        const body = { message: error.message };
        if (error.errors) body.errors = error.errors;
        return res.status(error.statusCode).json(body);
      }
      console.error("💥 [COMMENT][CREATE][SYSTEM]", { message: error.message });
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  deleteComment: async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    console.log("📝 [COMMENT][DELETE][REQUEST]", { id, userId });

    try {
      await commentService.deleteComment(id, userId);

      console.log("✅ [COMMENT][DELETE][RESPONSE]", { id });

      return res.json({ message: "Comment deleted" });
    } catch (error) {
      if (error.statusCode) {
        console.warn("⚠️ [COMMENT][DELETE][BUSINESS]", {
          message: error.message,
          errors: error.errors,
        });
        const body = { message: error.message };
        if (error.errors) body.errors = error.errors;
        return res.status(error.statusCode).json(body);
      }
      console.error("💥 [COMMENT][DELETE][SYSTEM]", { message: error.message });
      return res.status(500).json({ message: "Internal server error" });
    }
  },

};

export default commentController;
