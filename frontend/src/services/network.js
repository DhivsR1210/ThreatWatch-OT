import api from "./api";

export const networkService = {
  async getTopology() {
    const response = await api.get("/network");
    return response.data.data;
  },
};
