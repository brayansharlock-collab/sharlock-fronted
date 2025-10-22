import api from "./api";
import { API_URL_ALL } from "./urls";

const normalizeResults = (resData: any) => {
  if (!resData) return [];

  if (resData?.data?.results && Array.isArray(resData.data.results)) {
    return resData.data.results;
  }

  if (resData?.results && Array.isArray(resData.results)) {
    return resData.results;
  }

  if (Array.isArray(resData)) return resData;

  if (resData?.data && typeof resData.data === "object") {
    if (Array.isArray(resData.data.sub_category)) return resData.data.sub_category;
    if (Array.isArray(resData.data.results)) return resData.data.results;
    return [resData.data];
  }

  if (resData?.sub_category && Array.isArray(resData.sub_category)) return resData.sub_category;

  if (typeof resData === "object") return [resData];

  return [];
};

export const productService = {
  list: async (filters: any = {}, page: number = 1, pageSize?: number) => {
    if (filters.favorite_product !== undefined) {
      filters.favorite_product = String(filters.favorite_product);
    }

    try {
      const body = {
        ...filters,
        page,
      };

      const queryParams = pageSize ? `?page_size=${pageSize}` : "";
      const res = await api.post(`${API_URL_ALL.PRODUCTS}${queryParams}?page_size=${5}`, body);

      const data = res.data?.data?.results || [];
      const total = res.data?.data?.count || 0;

      return { data, total };
    } catch (error) {
      console.error("Error al listar productos:", error);
      return { data: [], total: 0 };
    }
  },

  getDiscountProducts: async (page: number = 1, pageSize: number = 6) => {
    try {

      const query = `?page=${page}&page_size=${pageSize}`;
      const res = await api.get(`${API_URL_ALL.PRODUCTS}${query}`);
      return { data: res.data?.data?.results || [], total: res.data?.data?.count }
    } catch (error) {
      console.error("Error al obtener productos con descuento:", error);
      return { data: [], total: 0 };
    }
  },

  getById: async (id: number) => {
    const res = await api.get(`${API_URL_ALL.PRODUCTS}${id}/`);
    return res.data;
  },

  create: async (payload: any) => {
    const res = await api.post(API_URL_ALL.PRODUCTS, payload);
    return res.data;
  },

  update: async (id: number, payload: any) => {
    const res = await api.put(`${API_URL_ALL.PRODUCTS}${id}/`, payload);
    return res.data;
  },

  remove: async (id: number) => {
    const res = await api.delete(`${API_URL_ALL.PRODUCTS}${id}/`);
    return res.data;
  },

  categories: async () => {
    const res = await api.get(API_URL_ALL.CATEGORIES);
    return normalizeResults(res.data) || [];
  },

  subcategories: async (categoryId?: number) => {
    const url = categoryId ? `${API_URL_ALL.SUBCATEGORIES}${categoryId}/` : API_URL_ALL.SUBCATEGORIES;
    const res = await api.get(url);
    return res.data || [];
  },

  filterNames: async () => {
    const res = await api.get(API_URL_ALL.FILTER_NAMES);
    return res.data || [];
  },
  filterOptions: async () => {
    const res = await api.get(API_URL_ALL.FILTER_OPTIONS);
    return res.data || [];
  },
  addToFavorites: async (productId: number) => {
    const res = await api.post(`${API_URL_ALL.FAVORITES}${productId}/`);
    return res.data;
  },
  removeFromFavorites: async (productId: number) => {
    const res = await api.delete(`${API_URL_ALL.FAVORITES}${productId}/`);
    return res.data;
  },
  isFavorite: async (productId: number): Promise<boolean> => {
    try {
      const res = await api.get(`${API_URL_ALL.FAVORITES}${productId}/`);
      return res.data?.is_favorite ?? false;
    } catch (error) {
      console.error(`Error checking favorite status for product ${productId}:`, error);
      return false;
    }
  },
};
