const postUpdateValidation = (req, res, next) => {
    const body = req.body;
  
    // 1. ต้องส่งมาอย่างน้อย 1 field
    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({
        message: "At least one field is required to update",
      });
    }
  
    // 2. ไม่ให้ field แปลก
    const allowedFields = [
      "title",
      "image",
      "category_id",
      "description",
      "content",
      "status_id",
    ];
  
    const invalidFields = Object.keys(body).filter(
      (key) => !allowedFields.includes(key)
    );
  
    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: `Invalid fields: ${invalidFields.join(", ")}`,
      });
    }
  
    // 3. type validation (เช็คเฉพาะที่ส่งมา)
    if (body.title !== undefined && typeof body.title !== "string") {
      return res.status(400).json({ message: "Title must be a string" });
    }
  
    if (body.image !== undefined && typeof body.image !== "string") {
      return res.status(400).json({ message: "Image must be a string" });
    }
  
    if (
      body.category_id !== undefined &&
      typeof body.category_id !== "number"
    ) {
      return res
        .status(400)
        .json({ message: "Category id must be a number" });
    }
  
    if (
      body.description !== undefined &&
      typeof body.description !== "string"
    ) {
      return res
        .status(400)
        .json({ message: "Description must be a string" });
    }
  
    if (body.content !== undefined && typeof body.content !== "string") {
      return res
        .status(400)
        .json({ message: "Content must be a string" });
    }
  
    if (
      body.status_id !== undefined &&
      typeof body.status_id !== "number"
    ) {
      return res
        .status(400)
        .json({ message: "Status id must be a number" });
    }
  
    next();
  };
  
  export default postUpdateValidation;
  