export const processPayService = {
  getAddresses: async () => {
    return ["Calle 123 #45 - 67, Bogotá", "Carrera 10 #20 - 30, Medellín"];
  },
  addAddress: async (address: string) => {
    return { success: true, address };
  },
  processPayment: async (method: string, data: any) => {
    return { success: true, transactionId: "TX123456789" };
  },
  getSummary: async () => {
    return [
      { name: "Producto A", price: "$100.000" },
      { name: "Producto B", price: "$50.000" },
    ];
  },
};