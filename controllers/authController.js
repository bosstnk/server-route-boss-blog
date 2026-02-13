import authService from "../services/authService.js";

const authController = {
  register: async (req, res) => {
    try {
      const result = await authService.register(req.body);

      return res.status(201).json(result);
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },

  login: async (req, res) => {
    try {
      const result = await authService.login(req.body);
      return res.status(200).json(result);
    } catch (error) {

      if (error.statusCode) {
        return res.status(error.statusCode).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
};


export default authController;
