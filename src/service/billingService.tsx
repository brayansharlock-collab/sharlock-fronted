// src/service/billingService.ts
import { cartService } from './cartService';
import { getDecryptedCookie, removeCookie, setEncryptedCookie } from '../utils/encrypt';
import { API_URL_ALL } from './urls';
import api from './api';

interface AppliedCoupon {
  id: number;
  percentage: number;
}

export const billingService = {
  createReceipt: async () => {
    try {
      const total = getDecryptedCookie('checkout_total');
      if (typeof total !== 'number' && typeof total !== 'string') {
        throw new Error('Total no encontrado o inválido en cookies');
      }

      const numericTotal = typeof total === 'string' ? parseFloat(total) : total;

      const appliedCoupon = getDecryptedCookie('appliedCo') as AppliedCoupon | null;
      const couponId = appliedCoupon?.id;

      const cartData = await cartService.getCart();
      let cartIds: number[] = [];

      const results = cartData?.data?.results || cartData?.data || cartData || [];
      if (Array.isArray(results)) {
        cartIds = results
          .map((item: any) => (typeof item === 'object' ? item.id : item))
          .filter((id): id is number => typeof id === 'number');
      }

      if (cartIds.length === 0) {
        throw new Error('Carrito vacío o sin IDs válidos');
      }

      const payload: Record<string, any> = {
        is_active: true,
        shopping_cart: cartIds,
        iva: 9,
        shipment_cost: 0,
        total: numericTotal,
      };

      if (couponId) {
        payload.coupon = couponId;
      }

      const response = await api.post(API_URL_ALL.RECIPIENT, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      const receiptId = response.data?.id;
      if (receiptId) {
        setEncryptedCookie('receipt_id', receiptId, 1);
      } else {
        console.warn('No se recibió ID de la factura');
      }

      return response.data;
    } catch (error: any) {
      console.error('Error al crear recibo:', error);
      throw new Error(error.response?.data?.message || 'Error al procesar la factura');
    }
  },

  updateReceiptStatus: async (statusData: any) => {
    const receiptId = getDecryptedCookie('receipt_id');

    if (!receiptId) {
      throw new Error('No se encontró el ID de la factura. La sesión puede haber expirado.');
    }

    const response = await api.put(`${API_URL_ALL.RECIPIENT}${receiptId}/`, statusData, {
      headers: { 'Content-Type': 'application/json' },
    });
    removeCookie('appliedCo');
    removeCookie('checkout_total');

    return response.data;
  },

  getReceiptId: (): number | null => {
    return getDecryptedCookie('receipt_id');
  },
};