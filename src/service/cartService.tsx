import api from "./api"
import { API_URL_ALL } from "./urls"

interface CartItem {
  is_active: boolean
  product_id: number
  amount: number
  variant_id: number
}

export const cartService = {
  addToCart: async (item: CartItem) => {
    const formData = new FormData()
    formData.append("is_active", String(item.is_active))
    formData.append("product_id", String(item.product_id))
    formData.append("amount", String(item.amount))
    formData.append("variant_id", String(item.variant_id))

    const { data } = await api.post(API_URL_ALL.CART, formData)
    return data
  },

  getCart: async () => {
    const { data } = await api.get(API_URL_ALL.CART)
    return data
  },

  updateCart: async (id: number, item: Partial<CartItem>) => {
    const formData = new FormData()
    Object.entries(item).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, String(value))
    })
    const { data } = await api.put(`${API_URL_ALL.CART}${id}/`, formData)
    return data
  },

  removeItem: async (id: number) => {
    const { data } = await api.delete(`${API_URL_ALL.CART}${id}/`)
    return data
  },

  clearCart: async () => {
    const { data } = await api.delete(API_URL_ALL.CART_CLEAR);
    return data;
  },

  applyCoupon: async (code: string) => {
    const formData = new FormData();
    formData.append("code", code);

    const { data } = await api.post(API_URL_ALL.COUPON, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data;
  },
}
