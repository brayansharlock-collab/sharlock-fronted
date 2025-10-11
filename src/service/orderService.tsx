import api from "./api";
import { API_URL_ALL } from "./urls";

export const orderService = {
  getOrderHistory: async () => {
    try {
      const response = await api.get(API_URL_ALL.RECIPIENT);
      const { data } = response.data;

      if (!data?.results) return [];

      return data.results

    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
      return [];
    }
  },
};
