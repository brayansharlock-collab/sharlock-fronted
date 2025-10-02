import api from "./api";

export const mercadoPagoService = {
  startPayMercadopago: async (payload: any) => {
    const { data } = await api.post("api/accounts/mercado_pago/", payload);
    if (data.init_point) {
      window.location.href = data.init_point;  // Producción
    } else if (data.sandbox_init_point) {
      window.location.href = data.sandbox_init_point; // Sandbox
    } else {
      alert("Error creando preferencia de pago");
    }
  },
};