import api from "./api";

export const assetService = {
  async list(params = {}) {
    const response = await api.get("/assets", { params });
    return response.data.data;
  },

  async create(payload) {
    const response = await api.post("/assets", payload);
    return response.data.data.asset;
  },

  async update(assetId, payload) {
    const response = await api.put(`/assets/${assetId}`, payload);
    return response.data.data.asset;
  },

  async remove(assetId) {
    await api.delete(`/assets/${assetId}`);
  },
};
