import api from "./api";

const menuService = {
  // GET /api/menu  — public, supports query params
  // params: { category, search, dietaryTags, sort, featured }
  getAllItems: async (params = {}) => {
    const { data } = await api.get("/menu", { params });
    return data; // { menuItems[] }
  },

  // GET /api/menu/:id  — public
  getItemById: async (id) => {
    const { data } = await api.get(`/menu/${id}`);
    return data; // { menuItem }
  },

  // GET /api/menu/admin/all  — admin only (includes unavailable items)
  getAllItemsAdmin: async () => {
    const { data } = await api.get("/menu/admin/all");
    return data; // { menuItems[] }
  },

  // POST /api/menu  — admin only
  createItem: async (itemData) => {
    const { data } = await api.post("/menu", itemData);
    return data; // { menuItem }
  },

  // PUT /api/menu/:id  — admin only
  updateItem: async (id, itemData) => {
    const { data } = await api.put(`/menu/${id}`, itemData);
    return data; // { menuItem }
  },

  // DELETE /api/menu/:id  — admin only
  deleteItem: async (id) => {
    const { data } = await api.delete(`/menu/${id}`);
    return data; // { message }
  },

  // PATCH /api/menu/:id/toggle  — admin only (toggles isAvailable)
  toggleAvailability: async (id) => {
    const { data } = await api.patch(`/menu/${id}/toggle`);
    return data; // { menuItem }
  },

  // GET /api/categories  — public
  getCategories: async () => {
    const { data } = await api.get("/categories");
    return data; // { categories[] }
  },

  // POST /api/categories  — admin only
  createCategory: async (categoryData) => {
    const { data } = await api.post("/categories", categoryData);
    return data; // { category }
  },

  // PUT /api/categories/:id  — admin only
  updateCategory: async (id, categoryData) => {
    const { data } = await api.put(`/categories/${id}`, categoryData);
    return data; // { category }
  },

  // DELETE /api/categories/:id  — admin only
  deleteCategory: async (id) => {
    const { data } = await api.delete(`/categories/${id}`);
    return data; // { message }
  },
};

export default menuService;