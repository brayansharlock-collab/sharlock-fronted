import { Button } from "antd"

interface ColorSelectorProps {
  colors: string[]
  selectedColor: string
  onSelect: (color: string) => void
}

export const ColorSelector = ({ colors, selectedColor, onSelect }: ColorSelectorProps) => {
  return (
    <div style={{ marginBottom: 16 }}>
      <p style={{ margin: 0, fontWeight: 500 }}>Color</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {colors.map((color, idx) => (
          <Button
            key={idx}
            onClick={() => onSelect(color)}
            style={{
              borderRadius: "9999px",
              padding: "4px 16px",
              fontWeight: 500,
              backgroundColor: selectedColor === color ? "#111" : "#f3f4f6",
              color: selectedColor === color ? "#fff" : "#111",
              border: "1px solid #e5e7eb",
              transition: "all 0.2s",
            }}
          >
            {color}
          </Button>
        ))}
      </div>
    </div>
  )
}