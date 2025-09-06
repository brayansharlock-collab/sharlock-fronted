import api from "./api";
import { API_URL_ALL } from "./urls";


export const productService = {
    // Productos
    list: async () => {
        const res = await api.get(`${API_URL_ALL.PRODUCTS}`);
        return res.data?.data?.results || [];
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

    // Obtener todas las categorías y subcategorías
    categories: async () => {
        const res = await api.get(API_URL_ALL.CATEGORIES);
        return res.data?.data?.results || [];
    },
    subcategories: async () => {
        const res = await api.get(API_URL_ALL.SUBCATEGORIES);
        return res.data?.data?.results || [];
    },

    // Filtros
    filterNames: async () => {
        const res = await api.get(API_URL_ALL.FILTER_NAMES);
        return res.data || [];
    },
    filterOptions: async () => {
        const res = await api.get(API_URL_ALL.FILTER_OPTIONS);
        return res.data || [];
    },

    // Favoritos
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