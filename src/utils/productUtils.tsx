/**
 * Calcula el porcentaje de descuento basado en el precio original y el precio con descuento.
 * @param activeDiscount Si el descuento está activo
 * @param finalPrice Precio actual (con descuento aplicado)
 * @param finalPriceDiscount Precio original (sin descuento)
 * @returns number - Porcentaje de descuento (ej. 20 significa 20%)
 */
export const calculateDiscountPercent = (
  activeDiscount: boolean,
  finalPrice: number,
  finalPriceDiscount: number
): number => {
  if (!activeDiscount || finalPriceDiscount === finalPrice) return 0

  const discount =
    ((Number(finalPriceDiscount) - Number(finalPrice)) / Number(finalPriceDiscount)) * 100

  return Math.round(discount)
}

/**
 * Obtiene las URLs de las imágenes del producto desde su stock_detail.
 * @param product Producto que contiene el arreglo stock_detail
 * @returns string[] - Lista de URLs de imágenes
 */
export const getProductImages = (product: any): string[] => {
  return (
    product?.stock_detail?.[0]?.media
      ?.filter((m: any) => m.is_image)
      ?.map((m: any) => m.file) || []
  )
}
