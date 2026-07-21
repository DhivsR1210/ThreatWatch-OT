import api from "./api";

export const alertService = {
  async list(params = {}) {
    const response = await api.get("/alerts", { params });
    return response.data.data;
  },

  async get(id) {
    const response = await api.get(`/alerts/${id}`);
    return response.data.data.alert;
  },

  async create(payload) {
    const response = await api.post("/alerts", payload);
    return response.data.data.alert;
  },

  async update(id, payload) {
    const response = await api.put(`/alerts/${id}`, payload);
    return response.data.data.alert;
  },

  async remove(id) {
    await api.delete(`/alerts/${id}`);
  },
};
