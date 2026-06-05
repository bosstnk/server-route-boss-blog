import postRepository from "../repositories/postRepository.js";
import notificationService from "./notificationService.js";
import { createError } from "../utils/error.js";

const postService = {
  getPosts: async (queryParams) => {
    const category = queryParams.category || "";
    const keyword = queryParams.keyword || "";
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 6;

    console.log("📝 [POST][GET_ALL] Start", { category, keyword, page, limit });

    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, Math.min(100, limit));
    const offset = (safePage - 1) * safeLimit;

    const [postsResult, totalPosts] = await Promise.all([
      postRepository.getPosts({ category, keyword, limit: safeLimit, offset }),
      postRepository.countPosts({ category, keyword }),
    ]);

    const results = {
      totalPosts,
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

    console.log("✅ [POST][GET_ALL] Success", { totalPosts, currentPage: safePage });

    return results;
  },

  getAdminPosts: async (queryParams) => {
    const category = queryParams.category || "";
    const keyword = queryParams.keyword || "";
    const status = queryParams.status || "";
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 6;

    console.log("📝 [POST][ADMIN_GET_ALL] Start", { category, keyword, status, page, limit });

    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, Math.min(100, limit));
    const offset = (safePage - 1) * safeLimit;

    const [postsResult, totalPosts] = await Promise.all([
      postRepository.getAdminPosts({ category, keyword, status, limit: safeLimit, offset }),
      postRepository.countAdminPosts({ category, keyword, status }),
    ]);

    const results = {
      totalPosts,
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

    console.log("✅ [POST][ADMIN_GET_ALL] Success", { totalPosts, currentPage: safePage });

    return results;
  },

  createPost: async (postData) => {
    console.log("📝 [POST][CREATE] Start", { title: postData.title, user_id: postData.user_id });

    const newPost = await postRepository.createPost(postData);

    console.log("✅ [POST][CREATE] Success", { title: postData.title });

    if (Number(postData.status_id) === 2 && newPost?.id) {
      notificationService
        .notifyNewPost({ postId: newPost.id, actorId: postData.user_id })
        .catch((err) => console.error("💥 [NOTIFY][NEW_POST] Failed", err));
    }
  },

  getPostById: async (postId, userId) => {
    console.log("📝 [POST][GET_BY_ID] Start", { postId, userId });

    const post = await postRepository.getPostById(postId, userId);

    if (!post) {
      console.warn("⚠️ [POST][GET_BY_ID] Not found", { postId });
      return null;
    }

    console.log("✅ [POST][GET_BY_ID] Success", { postId });
    return post;
  },

  updatePostById: async (postId, postData, userId) => {
    console.log("📝 [POST][UPDATE_BY_ID] Start", { postId });

    const currentPost = await postRepository.getPostMeta(postId);

    if (!currentPost) {
      console.warn("⚠️ [POST][UPDATE_BY_ID] Not found", { postId });
      return null;
    }

    if (currentPost.user_id !== userId) {
      console.warn("⚠️ [POST][UPDATE_BY_ID] Forbidden", { postId, userId });
      throw createError({
        message: "You are not allowed to update this post",
        statusCode: 403,
      });
    }

    const isFirstPublish = currentPost.status_id !== 2 && Number(postData.status_id) === 2;

    const post = await postRepository.updatePostById(postId, postData);

    console.log("✅ [POST][UPDATE_BY_ID] Success", { postId });

    if (isFirstPublish) {
      notificationService
        .notifyNewPost({ postId, actorId: userId })
        .catch((err) => console.error("💥 [NOTIFY][NEW_POST] Failed", err));
    }

    return post;
  },

  deletePostById: async (postId, userId) => {
    console.log("📝 [POST][DELETE_BY_ID] Start", { postId });

    const currentPost = await postRepository.getPostMeta(postId);

    if (!currentPost) {
      console.warn("⚠️ [POST][DELETE_BY_ID] Not found", { postId });
      return null;
    }

    if (currentPost.user_id !== userId) {
      console.warn("⚠️ [POST][DELETE_BY_ID] Forbidden", { postId, userId });
      throw createError({
        message: "You are not allowed to delete this post",
        statusCode: 403,
      });
    }

    const post = await postRepository.deletePostById(postId);

    console.log("✅ [POST][DELETE_BY_ID] Success", { postId });
    return post;
  }

};

export default postService;
