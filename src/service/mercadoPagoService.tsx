declare global {
  interface Window {
    MercadoPago: any;
  }
}

import { loadMercadoPago } from "@mercadopago/sdk-js";

let mp: any = null;

export const mercadoPagoService = {
  init: async () => {
    if (!mp) {
      await loadMercadoPago();
      mp = new window.MercadoPago(
        "TEST-3106c665-e231-48aa-a7c9-4c252344d140", // tu PUBLIC_KEY
        { locale: "es-CO" }
      );
    }
    return mp;
  },

  createCardToken: async (data: {
    cardholderName: string;
    identificationType: string;
    identificationNumber: string;
  }) => {
    if (!mp) await mercadoPagoService.init();
    return await mp.fields.createCardToken(data);
  },

  getIdentificationTypes: async () => {
    if (!mp) await mercadoPagoService.init();
    return await mp.getIdentificationTypes();
  },

  processPayment: async (payload: any) => {
    const res = await fetch("http://localhost:8000/api/process_card_payment/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  },

  startPSE: async () => {
    const res = await fetch("http://localhost:8000/api/create_preference/", {
      method: "POST",
    });
    const { id } = await res.json();
    window.location.href = `https://sandbox.mercadopago.com.co/checkout/v1/redirect?pref_id=${id}`;
  },
};
