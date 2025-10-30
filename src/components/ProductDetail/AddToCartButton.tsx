import { Button, Tooltip } from "antd"
import { ShoppingCartOutlined } from "@ant-design/icons"

interface AddToCartButtonProps {
  onClick: () => void,
  disabled?: boolean,
  quantity?: number
}

export const AddToCartButton = ({ onClick, disabled, quantity }: AddToCartButtonProps) => {
  return (
    <Tooltip title={quantity === 0 ? "Producto agotado" : disabled ? "Debes iniciar sesión para agregar al carrito" : "Agregar al carrito"}>
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
    </Tooltip>

  )
}