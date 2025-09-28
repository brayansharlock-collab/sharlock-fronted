import api from "./api";
import { API_URL_ALL } from "./urls";

export const bannersService = {
  list: async () => {
    const res = await api.get(API_URL_ALL.BANNER);
    return res.data.filter((b: any) => b.is_active && b.img);
  },
};
