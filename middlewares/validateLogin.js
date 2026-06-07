export default function validateLogin(req, res, next) {
  const { email, password } = req.body;

  const errors = {};

  // Email
  if (!email?.trim()) {
    errors.email = "Please enter your email address";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email.toLowerCase()
    )
  ) {
    errors.email =
      "Please enter a valid email address";
  }

  // Password
  if (!password) {
    errors.password = "Please enter a password";
  }

  // Validation failed
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors,
    });
  }

  next();
}
