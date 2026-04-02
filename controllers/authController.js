import authService from "../services/authService.js";

const authController = {
  register: async (req, res) => {
    try {
      const result = await authService.register(req.body);

      console.log("✅ [AUTH][REGISTER][RESPONSE]");

      return res.status(201).json(result);

    } catch (error) {

      if (error.statusCode) {
        console.warn("⚠️ [AUTH][REGISTER][BUSINESS]", {
          message: error.message,
        });

        return res.status(error.statusCode).json({
          message: error.message,
        });
      }

      console.error("💥 [AUTH][REGISTER][SYSTEM]", {
        message: error.message,
      });

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },


  login: async (req, res) => {
    try {
      const result = await authService.login(req.body);

      console.log("✅ [AUTH][LOGIN][RESPONSE]");

      return res.status(200).json(result);

    } catch (error) {

      if (error.statusCode) {
        console.warn("⚠️ [AUTH][LOGIN][BUSINESS]", error.message);

        return res.status(error.statusCode).json({
          message: error.message,
        });
      }

      console.error("💥 [AUTH][LOGIN][SYSTEM]", error.message);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
};


export default authController;
