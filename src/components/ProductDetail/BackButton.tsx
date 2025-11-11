import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import type { ButtonHTMLAttributes } from "react";

export const BackButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/products");
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        transition: "all 0.3s ease",
        outline: "none",
        cursor: "pointer",
        border: "none",
        background: "transparent",
        color: "#988c73ff",
        textDecoration: "none",
        ...props.style,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <ArrowLeftOutlined />
      Volver a Productos
    </button>
  );
};