import postRepository from "../repositories/postRepository.js";

const postService = {
  getPosts: async (queryParams) => {
    const category = queryParams.category || "";
    const keyword = queryParams.keyword || "";
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 6;

    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, Math.min(100, limit));
    const offset = (safePage - 1) * safeLimit;

    // ดึง posts
    const postsResult = await postRepository.getPosts({
      category,
      keyword,
      limit: safeLimit,
      offset,
    });

    // นับจำนวนทั้งหมด
    const totalPosts = await postRepository.countPosts({
      category,
      keyword,
    });

    const results = {
      totalPosts: totalPosts,
      totalPages: Math.ceil(totalPosts / safeLimit),
      currentPage: safePage,
      limit: safeLimit,
      posts: postsResult,
    };

    if (offset + safeLimit < totalPosts) {
      results.nextPage = safePage + 1;
    }

    if (offset > 0) {
      results.previousPage = safePage - 1;
    }

    return results;
  },

  createPost: async (postData) => {
    return postRepository.createPost(postData);
  },

  getPostById: async (postId) => {
    const post = await postRepository.getPostById(postId)

    if (!post) {
      return null
    }

    return post
  },

  updatePostById: async (postId, postData) => {
    const post = await postRepository.updatePostById(postId, postData)

    if (!post) {
      return null
    }

    return post
  },

  deletePostById: async (postId) => {
    const post = await postRepository.deletePostById(postId)

    if (!post) {
      return null
    }

    return post
  }

};

export default postService;
