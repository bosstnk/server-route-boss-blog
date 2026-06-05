import commentRepository from "../repositories/commentRepository.js";
import notificationService from "./notificationService.js";
import { createError } from "../utils/error.js";

const commentService = {

  getComments: async (postId) => {
    return commentRepository.getComments(postId);
  },

  createComment: async ({ postId, userId, comment_text }) => {

    if (!comment_text || comment_text.trim() === "") {
      throw createError({ message: "Comment cannot be empty", statusCode: 422 });
    }

    const newComment = await commentRepository.createComment({
      postId,
      userId,
      comment_text,
    });

    notificationService
      .notifyComment({ postId, actorId: userId, commentId: newComment.id })
      .catch((err) => console.error("💥 [NOTIFY][COMMENT] Failed", err));

    return newComment;
  },

  deleteComment: async (commentId, userId) => {

    const comment = await commentRepository.getCommentById(commentId);

    if (!comment) {
      throw createError({ message: "Comment not found", statusCode: 404 });
    }

    if (comment.user_id !== userId) {
      throw createError({ message: "Not allowed to delete this comment", statusCode: 403 });
    }

    return commentRepository.deleteComment(commentId);
  }

};

export default commentService;