import { Typography } from "antd"
const { Title } = Typography
import { Tag } from "antd"

interface ProductInfoProps {
  name: string
  price: string
  discount: string
  activeDiscount: number
}

export const ProductInfo = ({ name, price, discount, activeDiscount }: ProductInfoProps) => {
  const discountPercent =
    activeDiscount && discount !== price
      ? Math.round(((Number(discount) - Number(price)) / Number(discount)) * 100)
      : 0

  return (
    <>
      <Title
        level={2}
        style={{
          margin: "0 0 12px 0",
          fontWeight: 700,
          color: "#111827",
        }}
      >
        {name}
      </Title>

      {discountPercent > 0 && (
        <div style={{ marginBottom: 6 }}>
          <span
            style={{
              textDecoration: "line-through",
              color: "#9ca3af",
              marginRight: 12,
            }}
          >
            ${discount}
          </span>
          <Tag color="red">-{discountPercent}%</Tag>
        </div>
      )}
      <div style={{ fontSize: 28, fontWeight: 700, color: "#111827" }}>
        ${price}
      </div>
    </>
  )
}