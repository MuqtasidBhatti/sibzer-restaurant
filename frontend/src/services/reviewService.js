import api from "./api";

// NOTE: No review UI is being built in the frontend.
// This file is kept in case reviews are added later.
// The backend routes exist and work — just wire up UI when needed.

const reviewService = {
  // GET /api/reviews  — public (only approved reviews)
  getApprovedReviews: async () => {
    const { data } = await api.get("/reviews");
    return data; // { reviews[] }
  },

  // POST /api/reviews  — protected
  // body: { rating, comment }
  submitReview: async (reviewData) => {
    const { data } = await api.post("/reviews", reviewData);
    return data; // { review }
  },

  // PATCH /api/reviews/:id/approve  — admin only
  approveReview: async (id) => {
    const { data } = await api.patch(`/reviews/${id}/approve`);
    return data; // { review }
  },

  // DELETE /api/reviews/:id  — admin only
  deleteReview: async (id) => {
    const { data } = await api.delete(`/reviews/${id}`);
    return data; // { message }
  },
};

export default reviewService;