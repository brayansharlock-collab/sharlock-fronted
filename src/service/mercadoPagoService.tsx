declare global {
  interface Window {
    MercadoPago: any;
  }
}

import { loadMercadoPago } from "@mercadopago/sdk-js";

const MP_PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY;
const MP_API_URL = import.meta.env.VITE_MP_API_URL;

let mp: any = null;

export const mercadoPagoService = {
  init: async () => {
    if (!mp) {
      await loadMercadoPago();
      mp = new window.MercadoPago(MP_PUBLIC_KEY, { locale: "es-CO" });
    }
    return mp;
  },

  createCardToken: async (data: {
    cardNumber: string;
    cardholderName: string;
    cardExpirationMonth: string;
    cardExpirationYear: string;
    securityCode: string;
    identificationType: string;
    identificationNumber: string;
  }) => {
    const payload = {
      card_number: data.cardNumber,
      expiration_month: Number(data.cardExpirationMonth),
      expiration_year: Number(data.cardExpirationYear),
      security_code: data.securityCode,
      cardholder: {
        name: data.cardholderName,
        identification: {
          type: data.identificationType,
          number: data.identificationNumber,
        },
      },
    };

    const res = await fetch(
      `${MP_API_URL}?public_key=${MP_PUBLIC_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Error al crear token");
    }

    const json = await res.json();
    console.log("RESPUESTA:", json);
    return json;
  },

  getIdentificationTypes: async () => {
    if (!mp) await mercadoPagoService.init();
    return await mp.getIdentificationTypes();
  },

  processPayment: async (payload: any) => {
    const res = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/api/process_card_payment/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  },

  startPSE: async () => {
    const res = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/api/create_preference/`, {
      method: "POST",
    });
    const { id } = await res.json();
    window.location.href = `https://sandbox.mercadopago.com.co/checkout/v1/redirect?pref_id=${id}`;
  },
};