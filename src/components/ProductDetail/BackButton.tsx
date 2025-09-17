"use client"

import { Link } from "react-router-dom"
import { ArrowLeftOutlined } from "@ant-design/icons"

// interface BackButtonProps extends any:[]<HTMLButtonElement> {}

export const BackButton = ({ ...props }: any) => {
  return (
    <Link to="/products" style={{ textDecoration: 'none' }}>
      <button
        {...props}
        style={{
          display: "flex",
          gap: "8px",
          transition: "all 0.3s ease",
          outline: "none",
          cursor: "pointer",
          border: "none",
          background: "transparent",
          color: "#988c73ff",
          ...props.style,
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
      >
        <ArrowLeftOutlined />
        Volver a Productos
      </button>
    </Link>
  )
}