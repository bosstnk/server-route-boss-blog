export const validateProfileUpdate = (req, res, next) => {
  const { name, username } = req.body;

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length === 0 || name.length > 100) {
      return res.status(400).json({
        message: "Name cannot be empty or exceed 100 characters",
      });
    }
  }

  if (username !== undefined) {
    if (
      typeof username !== "string" ||
      username.trim().length === 0 ||
      username.length > 50
    ) {
      return res.status(400).json({
        message: "Username cannot be empty or exceed 50 characters",
      });
    }
  }
  
  if (req.body.bio !== undefined) {
    if (
      typeof req.body.bio !== "string" ||
      req.body.bio.length > 120
    ) {
      return res.status(400).json({
        message: "Bio must be less than 120 characters",
      });
    }
  }

  next();
};

