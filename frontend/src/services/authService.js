import api from "./api";

const authService = {
  // POST /api/auth/register
  register: async (userData) => {
    const { data } = await api.post("/auth/register", userData);
    return data; // { token, user }
  },

  // POST /api/auth/login
  login: async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    return data; // { token, user }
  },

  // GET /api/auth/me  (protected)
  getMe: async () => {
    const { data } = await api.get("/auth/me");
    return data; // { user }
  },

  // PUT /api/auth/profile  (protected)
  updateProfile: async (profileData) => {
    const { data } = await api.put("/auth/profile", profileData);
    return data; // { user }
  },

  // GET /api/auth/users  (admin only)
  getAllUsers: async () => {
    const { data } = await api.get("/auth/users");
    return data; // { users[] }
  },
};

export default authService;