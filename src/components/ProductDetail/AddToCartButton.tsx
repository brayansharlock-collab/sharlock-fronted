import { Button } from "antd"
import { ShoppingCartOutlined } from "@ant-design/icons"

interface AddToCartButtonProps {
  onClick: () => void
  disabled?: boolean
}

export const AddToCartButton = ({ onClick, disabled }: AddToCartButtonProps) => {
  return (
    <Button
      type="default"
      size="large"
      icon={<ShoppingCartOutlined />}
      style={{ fontWeight: 600, height: 48 }}
      block
      onClick={onClick}
      disabled={disabled}
    >
      Agregar al carrito
    </Button>
  )
}