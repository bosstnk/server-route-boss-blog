import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("🔐 [AUTH][PROTECT] Start");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.warn("⚠️ [AUTH][PROTECT] Missing or invalid token format");

    return res.status(401).json({
      message: "Token has invalid format",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.SECRET_KEY);

    console.log("✅ [AUTH][PROTECT] Success", {
      userId: payload.id,
      role: payload.role,
    });

    req.user = payload;
    next();

  } catch (error) {
    console.warn("⚠️ [AUTH][PROTECT] Invalid token", {
      message: error.message,
    });

    return res.status(401).json({
      message: "Token is invalid",
    });
  }
};

export const optionalProtect = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      console.log("ℹ️ [AUTH][OPTIONAL] No token");
      return next();
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    console.log("✅ [AUTH][OPTIONAL] User detected", {
      userId: decoded.id,
    });

    req.user = decoded;

  } catch (error) {
    console.warn("⚠️ [AUTH][OPTIONAL] Invalid token ignored", {
      message: error.message,
    });
  }

  next();
};