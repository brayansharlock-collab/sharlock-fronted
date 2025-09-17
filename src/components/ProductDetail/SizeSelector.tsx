import { Button } from "antd"

interface SizeSelectorProps {
  sizes: string[]
  selectedSize: string
  onSelect: (size: string) => void
}

export const SizeSelector = ({ sizes, selectedSize, onSelect }: SizeSelectorProps) => {
  return (
    <div style={{ marginBottom: 16 }}>
      <p style={{ margin: 0, fontWeight: 500 }}>Talla</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {sizes.map((size, idx) => (
          <Button
            key={idx}
            onClick={() => onSelect(size)}
            style={{
              borderRadius: "9999px",
              padding: "4px 16px",
              fontWeight: 500,
              backgroundColor: selectedSize === size ? "#111" : "#f3f4f6",
              color: selectedSize === size ? "#fff" : "#111",
              border: "1px solid #e5e7eb",
              transition: "all 0.2s",
            }}
          >
            {size}
          </Button>
        ))}
      </div>
    </div>
  )
}