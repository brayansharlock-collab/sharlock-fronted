// src/service/billingService.ts
import axios from 'axios';
import { cartService } from './cartService';
import { getDecryptedCookie, removeCookie } from '../utils/encrypt';

const RECEIPT_API = 'http://localhost:8080/api/products/receipt/';

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
      const couponId = appliedCoupon?.id || null;

      const cartData = await cartService.getCart();
      let cartIds: number[] = [];

      const results = cartData?.results || cartData?.data || cartData || [];
      if (Array.isArray(results)) {
        cartIds = results
          .map((item: any) => (typeof item === 'object' ? item.id : item))
          .filter((id): id is number => typeof id === 'number');
      }

      if (cartIds.length === 0) {
        throw new Error('Carrito vacío o sin IDs válidos');
      }

      // 4. Construir payload
      const payload = {
        is_active: true,
        shopping_cart: cartIds,
        coupon: couponId,
        iva: 9,
        shipment_cost: 0,
        total:numericTotal,
      };

      // 5. Enviar a la API
      const response = await axios.post(RECEIPT_API, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      removeCookie('appliedCo');
      removeCookie('checkout_total');
      
      return response.data;
    } catch (error: any) {
      console.error('Error al crear recibo:', error);
      throw new Error(error.response?.data?.message || 'Error al procesar la factura');
    }
  },
};