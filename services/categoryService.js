import categoryRepository from "../repositories/categoryRepository.js";

const categoryService = {
  getCategories: async (keyword) => {
    return categoryRepository.getCategories(keyword);
  },

  getCategoryById: async (id) => {
    return categoryRepository.getCategoryById(id);
  },

  createCategory: async (name) => {
    if (!name || name.trim() === "") {
      throw new Error("Category name is required");
    }

    return categoryRepository.createCategory(name);
  },

  updateCategory: async (id, name) => {
    if (!name || name.trim() === "") {
      throw new Error("Category name is required");
    }

    return categoryRepository.updateCategory(id, name);
  },

  deleteCategory: async (id) => {
    return categoryRepository.deleteCategory(id);
  },
};

export default categoryService;