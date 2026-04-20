import likeRepository from "../repositories/likeRepository.js";
import notificationService from "./notificationService.js";

const likeService = {

  toggleLike: async (postId, userId) => {

    const existing = await likeRepository.findLike(postId, userId);

    if (existing) {

      await likeRepository.deleteLike(postId, userId);

      await likeRepository.decreasePostLike(postId);

    } else {

      await likeRepository.createLike(postId, userId);
      await likeRepository.increasePostLike(postId);

      notificationService
        .notifyLike({ postId, actorId: userId })
        .catch((err) => console.error("💥 [NOTIFY][LIKE] Failed", err));

    }

    const likesCount = await likeRepository.getPostLikes(postId);

    return {
      likes_count: likesCount,
      liked: !existing 
    };

  }

};

export default likeService;