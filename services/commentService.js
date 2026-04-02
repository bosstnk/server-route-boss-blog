import commentRepository from "../repositories/commentRepository.js";

const commentService = {

  getComments: async (postId) => {
    return commentRepository.getComments(postId);
  },

  createComment: async ({ postId, userId, comment_text }) => {

    if (!comment_text || comment_text.trim() === "") {
      throw new Error("Comment cannot be empty");
    }

    return commentRepository.createComment({
      postId,
      userId,
      comment_text
    });
  },

  deleteComment: async (commentId, userId) => {

    const comment = await commentRepository.getCommentById(commentId);

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.user_id !== userId) {
      throw new Error("Not allowed to delete this comment");
    }

    return commentRepository.deleteComment(commentId);
  }

};

export default commentService;