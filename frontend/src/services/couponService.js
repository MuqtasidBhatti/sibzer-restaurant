import api from "./api";

const couponService = {
  // Public
  validateCoupon: async (code, orderAmount) => {
    const { data } = await api.post("/coupons/validate", { code, orderAmount });
    return data;
  },

  // Admin aliases (used by ManageCoupons.jsx)
  adminGetAll: async () => {
    const { data } = await api.get("/coupons");
    return data;
  },

  create: async (couponData) => {
    const { data } = await api.post("/coupons", couponData);
    return data;
  },

  remove: async (id) => {
    const { data } = await api.delete(`/coupons/${id}`);
    return data;
  },

  // Original names (kept for any other usage)
  getAllCoupons: async () => {
    const { data } = await api.get("/coupons");
    return data;
  },

  createCoupon: async (couponData) => {
    const { data } = await api.post("/coupons", couponData);
    return data;
  },

  deleteCoupon: async (id) => {
    const { data } = await api.delete(`/coupons/${id}`);
    return data;
  },
};

export default couponService;