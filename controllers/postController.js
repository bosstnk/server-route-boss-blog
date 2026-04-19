import postService from "../services/postService.js";
import { uploadImage } from "../utils/uploadToSupabase.js";

const postController = {
  getPosts: async (req, res) => {
    try {
      const result = await postService.getPosts(req.query);

      console.log("✅ [POST][GET_ALL][RESPONSE]");

      return res.status(200).json(result);
    } catch (error) {

      if (error.statusCode) {
        console.warn("⚠️ [POST][GET_ALL][BUSINESS]", {
          message: error.message,
        });

        return res.status(error.statusCode).json({
          message: error.message,
        });
      }

      console.error("💥 [POST][GET_ALL][SYSTEM]", {
        message: error.message,
      });

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },

  getAdminPosts: async (req, res) => {
    try {
      const result = await postService.getAdminPosts(req.query);

      console.log("✅ [POST][ADMIN_GET_ALL][RESPONSE]");

      return res.status(200).json(result);
    } catch (error) {

      if (error.statusCode) {
        console.warn("⚠️ [POST][ADMIN_GET_ALL][BUSINESS]", {
          message: error.message,
        });

        return res.status(error.statusCode).json({
          message: error.message,
        });
      }

      console.error("💥 [POST][ADMIN_GET_ALL][SYSTEM]", {
        message: error.message,
      });

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },

  createPost: async (req, res) => {
    try {
      const { title, category_id, description, content, status_id } = req.body;
      const user_id = req.user.id;

      let image = null;
      if (req.files?.imageFile?.[0]) {
        image = await uploadImage("posts", user_id, req.files.imageFile[0]);
      }

      await postService.createPost({
        title,
        image,
        category_id,
        description,
        content,
        status_id,
        user_id,
      });

      console.log("✅ [POST][CREATE][RESPONSE]");

      return res.status(201).json({
        message: "Created post successfully",
      });

    } catch (error) {

      if (error.statusCode) {
        console.warn("⚠️ [POST][CREATE][BUSINESS]", { message: error.message });
        return res.status(error.statusCode).json({ message: error.message });
      }

      console.error("💥 [POST][CREATE][SYSTEM]", { message: error.message });
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  getPostById: async (req, res) => {
    const postId = Number(req.params.postId);
    const userId = req.user?.id || null;

    if (Number.isNaN(postId)) {
      console.warn("⚠️ [POST][GET_BY_ID][BUSINESS]", { message: "Invalid post id" });
      return res.status(400).json({ message: "Invalid post id" });
    }

    try {
      const post = await postService.getPostById(postId, userId);

      if (!post) {
        console.warn("⚠️ [POST][GET_BY_ID][BUSINESS]", { message: "Post not found", postId });
        return res.status(404).json({ message: "Server could not find a requested post" });
      }

      console.log("✅ [POST][GET_BY_ID][RESPONSE]");
      return res.status(200).json(post);
    } catch (error) {

      if (error.statusCode) {
        console.warn("⚠️ [POST][GET_BY_ID][BUSINESS]", { message: error.message });
        return res.status(error.statusCode).json({ message: error.message });
      }

      console.error("💥 [POST][GET_BY_ID][SYSTEM]", { message: error.message });
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  updatePostById: async (req, res) => {
    const postId = Number(req.params.postId);

    if (Number.isNaN(postId)) {
      console.warn("⚠️ [POST][UPDATE_BY_ID][BUSINESS]", { message: "Invalid post id" });
      return res.status(400).json({ message: "Invalid post id" });
    }

    try {
      const user_id = req.user.id;

      let updateData = { ...req.body };
      if (req.files?.imageFile?.[0]) {
        updateData.image = await uploadImage("posts", user_id, req.files.imageFile[0]);
      }

      const post = await postService.updatePostById(postId, updateData, user_id);

      if (!post) {
        console.warn("⚠️ [POST][UPDATE_BY_ID][BUSINESS]", { message: "Post not found", postId });
        return res.status(404).json({ message: "Server could not find a requested post" });
      }

      console.log("✅ [POST][UPDATE_BY_ID][RESPONSE]");
      return res.status(200).json({ message: "Updated post successfully" });

    } catch (error) {

      if (error.statusCode) {
        console.warn("⚠️ [POST][UPDATE_BY_ID][BUSINESS]", { message: error.message });
        return res.status(error.statusCode).json({ message: error.message });
      }

      console.error("💥 [POST][UPDATE_BY_ID][SYSTEM]", { message: error.message });
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  deletePostById: async (req, res) => {
    const postId = Number(req.params.postId);

    if (Number.isNaN(postId)) {
      console.warn("⚠️ [POST][DELETE_BY_ID][BUSINESS]", { message: "Invalid post id" });
      return res.status(400).json({ message: "Invalid post id" });
    }

    try {
      const user_id = req.user.id;
      const post = await postService.deletePostById(postId, user_id);

      if (!post) {
        console.warn("⚠️ [POST][DELETE_BY_ID][BUSINESS]", { message: "Post not found", postId });
        return res.status(404).json({ message: "Server could not find a requested post" });
      }

      console.log("✅ [POST][DELETE_BY_ID][RESPONSE]");
      return res.status(200).json({ message: "Deleted post successfully" });

    } catch (error) {

      if (error.statusCode) {
        console.warn("⚠️ [POST][DELETE_BY_ID][BUSINESS]", { message: error.message });
        return res.status(error.statusCode).json({ message: error.message });
      }

      console.error("💥 [POST][DELETE_BY_ID][SYSTEM]", { message: error.message });
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};

export default postController;