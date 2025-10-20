// src/service/productService.ts
import api from "./api";
import { API_URL_ALL } from "./urls";

const normalizeResults = (resData: any) => {
  if (!resData) return [];

  // si trae shape { data: { results: [...] } }
  if (resData?.data?.results && Array.isArray(resData.data.results)) {
    return resData.data.results;
  }

  // si trae shape { results: [...] }
  if (resData?.results && Array.isArray(resData.results)) {
    return resData.results;
  }

  // si resData ya es un array
  if (Array.isArray(resData)) return resData;

  // si trae data como objeto con sub_category o results dentro
  if (resData?.data && typeof resData.data === "object") {
    if (Array.isArray(resData.data.sub_category)) return resData.data.sub_category;
    if (Array.isArray(resData.data.results)) return resData.data.results;
    // envolver objeto en array
    return [resData.data];
  }

  // si resData es objeto y tiene sub_category
  if (resData?.sub_category && Array.isArray(resData.sub_category)) return resData.sub_category;

  // si es un objeto único (detalle), envolver
  if (typeof resData === "object") return [resData];

  return [];
};

export const productService = {
  list: async (filters: any = {}, page: number = 1, pageSize: number = 1) => {
    if (filters.favorite_product !== undefined) {
      filters.favorite_product = String(filters.favorite_product);
    }

    const queryParams = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    }).toString();

    const res = await api.post(`${API_URL_ALL.PRODUCTS}?${queryParams}`, filters);
    return normalizeResults(res.data) || [];
  },

  getDiscountProducts: async (page: number = 1, pageSize: number = 6) => {
    try {
      const query = `?page=${page}&page_size=${pageSize}`;
      const res = await api.get(`${API_URL_ALL.PRODUCTS_DISCOUNT}${query}`);
      return { data: res.data?.data?.results || [], total: res.data?.data?.count }
    } catch (error) {
      console.error("Error al obtener productos con descuento:", error);
      return { results: [], next: null, count: 0 };
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

  // categorías: intenta devolver siempre un array
  categories: async () => {
    const res = await api.get(API_URL_ALL.CATEGORIES);
    return normalizeResults(res.data) || [];
  },

  // subcategories acepta optional categoryId
  subcategories: async (categoryId?: number) => {
    const url = categoryId ? `${API_URL_ALL.SUBCATEGORIES}${categoryId}/` : API_URL_ALL.SUBCATEGORIES;
    const res = await api.get(url);
    // puede venir como array o como objeto con sub_category etc.
    return normalizeResults(res.data) || [];
  },

  // filtros y favoritos (sin cambios funcionales)
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
