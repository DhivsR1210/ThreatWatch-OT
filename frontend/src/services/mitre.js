import api from "./api";

export const mitreService = {
  async list(params = {}) {
    const response = await api.get("/mitre", { params });
    return response.data.data;
  },

  async get(techniqueId) {
    const response = await api.get(`/mitre/${techniqueId}`);
    return response.data.data.technique;
  },
};
