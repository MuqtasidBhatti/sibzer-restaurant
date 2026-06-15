import api from "./api";

const orderService = {
  // User
  placeOrder: async (orderData) => {
    const { data } = await api.post("/orders", orderData);
    return data;
  },

  getMyOrders: async () => {
    const { data } = await api.get("/orders/my");
    return data;
  },

  getOrderById: async (id) => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },

  // Admin aliases (used by ManageOrders.jsx)
  adminGetAll: async (params = {}) => {
    const { data } = await api.get("/orders", { params });
    return data;
  },

  updateStatus: async (id, status) => {
    const { data } = await api.patch(`/orders/${id}/status`, { status });
    return data;
  },

  // Original names (kept for any other usage)
  getAllOrders: async (params = {}) => {
    const { data } = await api.get("/orders", { params });
    return data;
  },

  updateOrderStatus: async (id, status) => {
    const { data } = await api.patch(`/orders/${id}/status`, { status });
    return data;
  },
};

export default orderService;