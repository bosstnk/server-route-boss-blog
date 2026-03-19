import postService from "../services/postService.js";
import { uploadPostImage } from "../utils/uploadPostImage.js";

const postController = {
  getPosts: async (req, res) => {
    try {
      const result = await postService.getPosts(req.query);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        message: "Server could not read post because database connection",
      });
    }
  },

  createPost: async (req, res) => {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);
    try {
      const {
        title,
        category_id,
        description,
        content,
        status_id,
      } = req.body;

      const user_id = req.user.id;

      let image = null;

      if (req.files?.imageFile?.[0]) {
        image = await uploadPostImage(user_id, req.files.imageFile[0]);
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

      return res.status(201).json({
        message: "Created post successfully",
      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        message: "Server could not create post",
      });

    }
  },

  getPostById: async (req, res) => {
    const postId = Number(req.params.postId);

    if (Number.isNaN(postId)) {
      return res.status(400).json({
        message: "Invalid post id",
      });
    }

    try {
      const post = await postService.getPostById(postId);

      if (!post) {
        return res.status(404).json({
          message: "Server could not find a requested post",
        });
      }

      return res.status(200).json(post);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Server could not read post because database connection",
      });
    }
  },

  updatePostById: async (req, res) => {
    const postId = Number(req.params.postId);
    console.log("FILES:", req.files);
    if (Number.isNaN(postId)) {
      return res.status(400).json({
        message: "Invalid post id",
      });
    }

    const user_id = req.user.id;
    try {

      let updateData = { ...req.body };
      if (req.files?.imageFile?.[0]) {
        const image = await uploadPostImage(
          user_id,
          req.files.imageFile[0]
        );

        updateData.image = image; // 👈 ใส่ลงไปใน data
      }

      const post = await postService.updatePostById(
        postId,
        updateData
      );

      if (!post) {
        return res.status(404).json({
          message: "Server could not find a requested post",
        });
      }

      return res.status(200).json({
        "message": "Updated post successfully"
      })
    } catch (error) {
      console.error("UPDATE ERROR:", error); // 👈 สำคัญมาก

      return res.status(500).json({
        message: error.message, // 👈 ส่ง error จริงออกมา
      });
    }
  },

  deletePostById: async (req, res) => {
    const postId = Number(req.params.postId);

    if (Number.isNaN(postId)) {
      return res.status(400).json({
        message: "Invalid post id",
      });
    }

    try {
      const post = await postService.deletePostById(postId)

      if (!post) {
        return res.status(404).json({
          message: "Server could not find a requested post",
        });
      }

      return res.status(200).json({
        "message": "Deleted post successfully"
      })
    } catch (error) {
      return res.status(500).json({
        "message": "Server could not delete post because database connection"
      })
    }
  }
};

export default postController;