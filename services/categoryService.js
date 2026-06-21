import categoryRepository from "../repositories/categoryRepository.js";
import { createError } from "../utils/error.js";

const categoryService = {
  getCategories: async (keyword) => {
    console.log("📝 [CATEGORY][GET] Start", { keyword });

    keyword = keyword?.trim();

    const result = await categoryRepository.getCategories(keyword);

    console.log("✅ [CATEGORY][GET] Success", { count: result.length });

    return result;
  },

  getPopularCategories: async () => {
    console.log("📝 [CATEGORY][GET_POPULAR] Start");

    const result = await categoryRepository.getPopularCategories();

    console.log("✅ [CATEGORY][GET_POPULAR] Success", { count: result.length });

    return result;
  },

  getCategoryById: async (id) => {
    console.log("📝 [CATEGORY][GET_BY_ID] Start", { id });

    const category = await categoryRepository.getCategoryById(id);

    if (!category) {
      console.warn("⚠️ [CATEGORY][GET_BY_ID] Not found", { id });
      throw createError({ message: "Category not found", statusCode: 404 });
    }

    console.log("✅ [CATEGORY][GET_BY_ID] Success", { id });

    return category;
  },

  createCategory: async (name) => {
    console.log("📝 [CATEGORY][CREATE] Start", { name });

    name = name.trim();

    const existing = await categoryRepository.findByName(name);
    if (existing) {
      console.warn("⚠️ [CATEGORY][CREATE] Duplicate name", { name });
      throw createError({
        message: "Validation failed",
        statusCode: 409,
        errors: { name: "Category already exists" },
      });
    }

    const category = await categoryRepository.createCategory(name);

    console.log("✅ [CATEGORY][CREATE] Success", { id: category.id });

    return category;
  },

  updateCategory: async (id, name) => {
    console.log("📝 [CATEGORY][UPDATE] Start", { id });

    name = name.trim();

    const existing = await categoryRepository.findByName(name);
    if (existing && String(existing.id) !== String(id)) {
      console.warn("⚠️ [CATEGORY][UPDATE] Duplicate name", { name });
      throw createError({
        message: "Validation failed",
        statusCode: 409,
        errors: { name: "Category already exists" },
      });
    }

    const category = await categoryRepository.updateCategory(id, name);

    if (!category) {
      console.warn("⚠️ [CATEGORY][UPDATE] Not found", { id });
      throw createError({ message: "Category not found", statusCode: 404 });
    }

    console.log("✅ [CATEGORY][UPDATE] Success", { id });

    return category;
  },

  deleteCategory: async (id) => {
    console.log("📝 [CATEGORY][DELETE] Start", { id });

    const existing = await categoryRepository.getCategoryById(id);

    if (!existing) {
      console.warn("⚠️ [CATEGORY][DELETE] Not found", { id });
      throw createError({ message: "Category not found", statusCode: 404 });
    }

    await categoryRepository.deleteCategory(id);

    console.log("✅ [CATEGORY][DELETE] Success", { id });
  },
};

export default categoryService;
