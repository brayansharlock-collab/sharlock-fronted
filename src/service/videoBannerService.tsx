import api from "./api";
import { API_URL_ALL } from "./urls";

export interface VideoBannerType {
  id: number;
  is_active: boolean;
  img_background: string;
  icono: string;
  video: string;
  url_redirect: string;
  description: string;
  order: number;
}

export const VideoBannerService = {
  getAll: async (): Promise<VideoBannerType[]> => {
    try {
      const response = await api.get<VideoBannerType[]>(API_URL_ALL.PUBLICY);
      return response.data;
    } catch (error) {
      console.error("Error fetching video banners:", error);
      return [];
    }
  },
};
