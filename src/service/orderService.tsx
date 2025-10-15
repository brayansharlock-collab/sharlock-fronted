import api from "./api";
import { API_URL_ALL } from "./urls";

export const orderService = {
  getOrderHistory: async (params?: Record<string, any>) => {
    try {
      const response = await api.get(API_URL_ALL.RECIPIENT, { params });
      const { data } = response.data;

      if (!data?.results) return [];
      return data.results;
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
      return [];
    }
  },

   getDistributor: async () => {
    try {
      const response = await api.get(API_URL_ALL.GUIE);
      return response.data;
    } catch (error) {
      console.error("Error al obtener las transportadoras:", error);
      return [];
    }
  },
};