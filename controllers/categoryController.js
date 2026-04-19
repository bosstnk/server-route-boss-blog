import categoryService from "../services/categoryService.js";

const categoryController = {
  getCategories: async (req, res) => {
    console.log("📝 [CATEGORY][GET][REQUEST]");

    try {
      const { keyword } = req.query;

      const categories = await categoryService.getCategories(keyword);

      console.log("✅ [CATEGORY][GET][RESPONSE]");

      return res.json(categories);
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("💥 [CATEGORY][GET][SYSTEM]", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  getCategoryById: async (req, res) => {
    const { id } = req.params;
    console.log("📝 [CATEGORY][GET_BY_ID][REQUEST]", { id });

    try {
      const category = await categoryService.getCategoryById(id);

      console.log("✅ [CATEGORY][GET_BY_ID][RESPONSE]", { id });

      return res.json(category);
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("💥 [CATEGORY][GET_BY_ID][SYSTEM]", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  createCategory: async (req, res) => {
    const { name } = req.body;
    console.log("📝 [CATEGORY][CREATE][REQUEST]", { name });

    try {
      const category = await categoryService.createCategory(name);

      console.log("✅ [CATEGORY][CREATE][RESPONSE]", { id: category.id });

      return res.status(201).json(category);
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("💥 [CATEGORY][CREATE][SYSTEM]", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  updateCategory: async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    console.log("📝 [CATEGORY][UPDATE][REQUEST]", { id, name });

    try {
      const category = await categoryService.updateCategory(id, name);

      console.log("✅ [CATEGORY][UPDATE][RESPONSE]", { id });

      return res.json(category);
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("💥 [CATEGORY][UPDATE][SYSTEM]", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  deleteCategory: async (req, res) => {
    const { id } = req.params;
    console.log("📝 [CATEGORY][DELETE][REQUEST]", { id });

    try {
      await categoryService.deleteCategory(id);

      console.log("✅ [CATEGORY][DELETE][RESPONSE]", { id });

      return res.json({ message: "Category deleted successfully" });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("💥 [CATEGORY][DELETE][SYSTEM]", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default categoryController;
