import commentService from "../services/commentService.js";

const commentController = {

  getComments: async (req, res) => {
    const { postId } = req.params;

    try {
      const comments = await commentService.getComments(postId);

      res.json(comments);
    } catch (error) {
      res.status(500).json({
        message: "Failed to get comments"
      });
    }
  },

  createComment: async (req, res) => {
    const { postId } = req.params;
    const { comment_text } = req.body;
    const userId = req.user.id;

    try {
      const comment = await commentService.createComment({
        postId,
        userId,
        comment_text
      });

      res.status(201).json(comment);
    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  },

  deleteComment: async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
      await commentService.deleteComment(id, userId);

      res.json({
        message: "Comment deleted"
      });
    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  }

};

export default commentController;