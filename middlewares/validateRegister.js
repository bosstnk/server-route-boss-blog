export default function validateRegister(req, res, next) {
    const { name, username, email, password } = req.body;
  
    if (!name?.trim() || !username?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ 
        message: "Missing required fields" 
      });
    }
  
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
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
  