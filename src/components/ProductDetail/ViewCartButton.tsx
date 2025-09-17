import { Button } from "antd"
import { Link } from "react-router-dom"

export const ViewCartButton = () => {
  return (
    <Link to="/CarPage" style={{ textDecoration: 'none' }}>
      <Button
        type="primary"
        size="large"
        style={{ fontWeight: 600, height: 48 }}
        block
      >
        Ver mi carrito
      </Button>
    </Link>
  )
}