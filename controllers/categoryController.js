import categoryService from "../services/categoryService.js";

const categoryController = {
  getCategories: async (req, res) => {
    try {
      const { keyword } = req.query;

      const categories = await categoryService.getCategories(keyword);

      return res.json(categories);
    } catch (error) {
      return res.status(500).json({
        message: "Failed to get categories",
      });
    }
  },

  getCategoryById: async (req, res) => {
    try {

      const { id } = req.params;

      const category = await categoryService.getCategoryById(id);

      if (!category) {
        return res.status(404).json({
          message: "Category not found"
        });
      }

      res.json(category);

    } catch (error) {

      res.status(500).json({
        message: "Failed to fetch category"
      });

    }
  },

  createCategory: async (req, res) => {
    const { name } = req.body;

    try {
      const category = await categoryService.createCategory(name);

      return res.status(201).json(category);
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  updateCategory: async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
      const category = await categoryService.updateCategory(id, name);

      return res.json(category);
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  deleteCategory: async (req, res) => {
    const { id } = req.params;

    try {
      await categoryService.deleteCategory(id);

      return res.json({
        message: "Category deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to delete category",
      });
    }
  },
};

export default categoryController;