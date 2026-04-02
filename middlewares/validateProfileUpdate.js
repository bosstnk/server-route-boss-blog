export const validateProfileUpdate = (req, res, next) => {
  let { name, username, bio } = req.body;

  // 🔥 normalize
  if (typeof name === "string") {
    name = name.trim();
    req.body.name = name;
  }

  if (typeof username === "string") {
    username = username.trim();
    req.body.username = username;
  }

  if (typeof bio === "string") {
    bio = bio.trim();
    req.body.bio = bio;
  }

  const errors = {};

  // ✅ validate
  if (name !== undefined) {
    if (name.length === 0 || name.length > 100) {
      errors.name = "Name must be between 1-100 characters";
    }
  }

  if (username !== undefined) {
    if (username.length === 0 || username.length > 50) {
      errors.username = "Username must be between 1-50 characters";
    }
  }

  if (bio !== undefined) {
    if (bio.length > 120) {
      errors.bio = "Bio must be less than 120 characters";
    }
  }

  // ❌ มี error → return ทีเดียว
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};