/**
 * Verifica si una fecha está dentro de los últimos X días (por defecto 7)
 * @param createdAt Fecha de creación (en formato ISO o Date)
 * @param days Número de días para considerar "nuevo" (por defecto 7)
 * @returns boolean
 */
export const isNewProduct = (createdAt: string | Date, days: number = 7): boolean => {
  if (!createdAt) return false

  const createdDate = new Date(createdAt)
  const now = new Date()

  const diffTime = now.getTime() - createdDate.getTime()
  const diffDays = diffTime / (1000 * 60 * 60 * 24)

  return diffDays <= days
}
