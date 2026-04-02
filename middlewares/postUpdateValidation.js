const postUpdateValidation = (req, res, next) => {
  const body = req.body;

  // 1. ต้องมีอย่างน้อย 1 field
  if (!body || Object.keys(body).length === 0) {
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

  // ===============================
  // 3. TYPE + PARSE
  // ===============================

  // title
  if (body.title !== undefined && typeof body.title !== "string") {
    return res.status(400).json({ message: "Title must be a string" });
  }

  // image (optional)
  if (body.image !== undefined && typeof body.image !== "string") {
    return res.status(400).json({ message: "Image must be a string" });
  }

  // category_id
  if (body.category_id !== undefined) {
    const parsedCategoryId = Number(body.category_id);

    if (isNaN(parsedCategoryId)) {
      return res.status(400).json({
        message: "Category id must be a number",
      });
    }

    body.category_id = parsedCategoryId; // 👈 overwrite
  }

  // description
  if (
    body.description !== undefined &&
    typeof body.description !== "string"
  ) {
    return res.status(400).json({
      message: "Description must be a string",
    });
  }

  // content
  if (body.content !== undefined && typeof body.content !== "string") {
    return res.status(400).json({
      message: "Content must be a string",
    });
  }

  // status_id
  if (body.status_id !== undefined) {
    const parsedStatusId = Number(body.status_id);

    if (isNaN(parsedStatusId)) {
      return res.status(400).json({
        message: "Status id must be a number",
      });
    }

    body.status_id = parsedStatusId; // 👈 overwrite
  }

  next();
};

export default postUpdateValidation;