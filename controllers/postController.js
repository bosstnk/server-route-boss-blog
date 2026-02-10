import postService from "../services/postService.js";

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
      try {
        await postService.createPost(req.body);
  
        return res.status(201).json({
          message: "Created post successfully",
        });
      } catch (error) {
        return res.status(500).json({
          message: "Server could not create post because database connection",
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

      if (Number.isNaN(postId)) {
        return res.status(400).json({
          message: "Invalid post id",
        });
      }
      

      try {
        const post = await postService.updatePostById(postId, req.body)

        if (!post) {
          return res.status(404).json({
            message: "Server could not find a requested post",
          });
        }

        return res.status(200).json({ 
          "message": "Updated post successfully" 
        })
      } catch (error) {
        return res.status(500).json({ 
          "message": "Server could not update post because database connection" 
        })
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