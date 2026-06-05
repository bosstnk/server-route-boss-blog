export default function validateRegister(req, res, next) {
  const { name, username, email, password } = req.body;

  const errors = {};

  // Name
  if (!name?.trim()) {
    errors.name = "Please enter your full name";
  }

  // Username
  if (!username?.trim()) {
    errors.username = "Please enter a username";
  }

  // Password
  if (!password) {
    errors.password = "Please enter a password";
  } else if (password.length < 8) {
    errors.password =
      "Password must be at least 8 characters";
  }

  // Email
  if (!email?.trim()) {
    errors.email =
      "Please enter your email address";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email.toLowerCase()
    )
  ) {
    errors.email =
      "Please enter a valid email address";
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
