import api from "./api";

export const vulnerabilityService = {
  async list(params = {}) {
    const response = await api.get("/vulnerabilities", { params });
    return response.data.data;
  },

  async get(id) {
    const response = await api.get(`/vulnerabilities/${id}`);
    return response.data.data;
  },
};
