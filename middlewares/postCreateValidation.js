const postCreateValidation = (req, res, next) => {
  const {
    title,
    category_id,
    description,
    content,
    status_id,
  } = req.body;

  const parsedCategoryId = Number(category_id);
  const parsedStatusId = Number(status_id);
  const file = req.files?.imageFile?.[0];

  const errors = {};

  if (!title?.trim()) {
    errors.title = "Please enter article title";
  }

  if (
    category_id === undefined ||
    category_id === null ||
    category_id === "" ||
    isNaN(parsedCategoryId)
  ) {
    errors.category_id = "Please select a category";
  }

  if (!description?.trim()) {
    errors.description = "Please enter article introduction";
  } else if (typeof description !== "string") {
    errors.description = "Description must be a string";
  } else if (description.length > 120) {
    errors.description = "Introduction must be less than 120 characters";
  }

  if (!content?.trim()) {
    errors.content = "Please enter article content";
  } else if (typeof content !== "string") {
    errors.content = "Content must be a string";
  }

  if (
    status_id === undefined ||
    status_id === null ||
    status_id === "" ||
    isNaN(parsedStatusId)
  ) {
    errors.status_id = "Status is required";
  }

  if (!file) {
    errors.image = "Please upload a thumbnail image";
  } else {
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

  req.body.category_id = parsedCategoryId;
  req.body.status_id = parsedStatusId;

  next();
};

export default postCreateValidation;
