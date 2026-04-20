export default function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email?.trim() || !password) {
    return res.status(400).json({
      message: "Missing email or password",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format",
    });
  }
  next();
}
