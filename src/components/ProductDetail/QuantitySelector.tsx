import { Button } from "antd"

interface QuantitySelectorProps {
  quantity: number
  variant: any | null
  onIncrease: () => void
  onDecrease: () => void
}

export const QuantitySelector = ({
  quantity,
  variant,
  onIncrease,
  onDecrease,
}: QuantitySelectorProps) => {
  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{ margin: 0, fontWeight: 500 }}>Cantidad</p>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <Button onClick={onDecrease} disabled={quantity <= 1}>
          -
        </Button>
        <span style={{ fontSize: 18, fontWeight: 600, alignSelf: "center" }}>
          {quantity}
        </span>
        <Button
          onClick={onIncrease}
          disabled={!!variant && quantity >= variant.quantity}
        >
          +
        </Button>
      </div>

      {variant && (
        <p style={{ margin: 0, color: "#888" }}>
          Stock disponible: {variant.quantity}
        </p>
      )}
    </div>
  )
}