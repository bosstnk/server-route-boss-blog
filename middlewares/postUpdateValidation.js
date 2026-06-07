const postUpdateValidation = (req, res, next) => {
  const body = req.body;
  const file = req.files?.imageFile?.[0];

  // 1. ต้องมีอย่างน้อย 1 field (รวมไฟล์ด้วย)
  if ((!body || Object.keys(body).length === 0) && !file) {
    return res.status(400).json({
      message: "At least one field is required to update",
    });
  }

  // 2. whitelist fields
  const allowedFields = [
    "title",
    "image",
    "category_id",
    "description",
    "content",
    "status_id",
  ];

  const invalidFields = Object.keys(body).filter(
    (key) => !allowedFields.includes(key) && key !== "imageFile"
  );

  if (invalidFields.length > 0) {
    return res.status(400).json({
      message: `Invalid fields: ${invalidFields.join(", ")}`,
    });
  }

  const errors = {};

  // title
  if (body.title !== undefined) {
    if (typeof body.title !== "string") {
      errors.title = "Title must be a string";
    } else if (!body.title.trim()) {
      errors.title = "Please enter article title";
    }
  }

  // category_id
  if (body.category_id !== undefined) {
    const parsedCategoryId = Number(body.category_id);
    if (isNaN(parsedCategoryId)) {
      errors.category_id = "Please select a category";
    } else {
      body.category_id = parsedCategoryId;
    }
  }

  // description
  if (body.description !== undefined) {
    if (typeof body.description !== "string") {
      errors.description = "Description must be a string";
    } else if (!body.description.trim()) {
      errors.description = "Please enter article introduction";
    } else if (body.description.length > 120) {
      errors.description = "Introduction must be less than 120 characters";
    }
  }

  // content
  if (body.content !== undefined) {
    if (typeof body.content !== "string") {
      errors.content = "Content must be a string";
    } else if (!body.content.trim()) {
      errors.content = "Please enter article content";
    }
  }

  // status_id
  if (body.status_id !== undefined) {
    const parsedStatusId = Number(body.status_id);
    if (isNaN(parsedStatusId)) {
      errors.status_id = "Status is required";
    } else {
      body.status_id = parsedStatusId;
    }
  }

  // image (optional — เปลี่ยนรูปไม่บังคับ)
  if (file) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      errors.image = "Only JPG, PNG, WEBP are allowed";
    } else if (file.size > 2 * 1024 * 1024) {
      errors.image = "Image must be less than 2MB";
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors,
    });
  }

  next();
};

export default postUpdateValidation;
