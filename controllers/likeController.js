import likeService from "../services/likeService.js";

const likeController = {

  toggleLike: async (req, res) => {

    const { postId } = req.params;
    const userId = req.user.id;

    try {

      const result = await likeService.toggleLike(postId, userId);

      res.json(result);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: "Failed to toggle like"
      });

    }

  }

};

export default likeController;