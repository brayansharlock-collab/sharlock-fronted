import api from "./api";
import { API_URL_ALL } from "./urls";

const baseUrl = API_URL_ALL.COMMENTS;

export const commentService = {
    getByProduct: async (productId: number) => {
        const response = await api.get(`${baseUrl}?product=${productId}`);
        return response.data;
    },

    create: async (data: { product: number; comment: string; comment_parent?: number; rating: number, }) => {
        const response = await api.post(baseUrl, data);
        return response.data;
    },

    update: async (id: number, data: { comment: string }) => {
        const response = await api.put(`${baseUrl}${id}/`, data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete(`${baseUrl}${id}/`);
        return response.data;
    },
};
