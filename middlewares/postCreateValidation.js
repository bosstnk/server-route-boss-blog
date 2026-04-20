const postCreateValidation = (req, res, next) => {
  const {
    title,
    category_id,
    description,
    content,
    status_id,
  } = req.body;

  // ===============================
  // CONVERT TYPE
  // ===============================
  const parsedCategoryId = Number(category_id);
  const parsedStatusId = Number(status_id);

  // ===============================
  // REQUIRED CHECK
  // ===============================
  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  if (category_id === undefined || category_id === null || category_id === "") {
    return res.status(400).json({ message: "Category id is required" });
  }

  if (!description) {
    return res.status(400).json({ message: "Description is required" });
  }

  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }

  if (status_id === undefined || status_id === null || status_id === "") {
    return res.status(400).json({ message: "Status id is required" });
  }

  if (!req.files?.imageFile?.[0]) {
    return res.status(400).json({ message: "Image is required" });
  }

  // ===============================
  // TYPE CHECK
  // ===============================
  if (isNaN(parsedCategoryId)) {
    return res.status(400).json({ message: "Category id must be a number" });
  }

  if (isNaN(parsedStatusId)) {
    return res.status(400).json({ message: "Status id must be a number" });
  }

  if (typeof description !== "string") {
    return res.status(400).json({ message: "Description must be a string" });
  }

  if (typeof content !== "string") {
    return res.status(400).json({ message: "Content must be a string" });
  }

  // ===============================
  // OPTIONAL: overwrite body ให้เป็น number จริง
  // ===============================
  req.body.category_id = parsedCategoryId;
  req.body.status_id = parsedStatusId;

  next();
};

export default postCreateValidation;