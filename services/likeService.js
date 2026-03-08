import likeRepository from "../repositories/likeRepository.js";

const likeService = {

  toggleLike: async (postId, userId) => {

    const existing = await likeRepository.findLike(postId, userId);

    if (existing) {

      await likeRepository.deleteLike(postId, userId);

      await likeRepository.decreasePostLike(postId);

    } else {

      await likeRepository.createLike(postId, userId);

      await likeRepository.increasePostLike(postId);

    }

    const likesCount = await likeRepository.getPostLikes(postId);

    return {
      likes_count: likesCount
    };

  }

};

export default likeService;