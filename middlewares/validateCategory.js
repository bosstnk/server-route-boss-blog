export default function validateCategory(req, res, next) {
  const { name } = req.body;

  const errors = {};

  if (!name?.trim()) {
    errors.name = "Please enter a category name";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors,
    });
  }

  next();
}
