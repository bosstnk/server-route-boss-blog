import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
    const token = req.headers.authorization;

    if(!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Token has invalid format"
        })
    }

    const tokenWithoutBearer  = token.split(" ")[1];

    jwt.verify(tokenWithoutBearer, process.env.SECRET_KEY,(err,payload) => {
        if (err) {
            return res.status(401).json({
                message: "Token is invalid"
            });
        }
        req.user = payload

        next();
    })
}

export const optionalProtect = (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return next(); // ไม่มี token ก็ผ่านได้
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded;
    } catch {
      // token invalid ก็ผ่านได้เหมือนกัน
    }
    next();
  };