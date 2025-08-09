import React from "react";
import { AppButton } from "../ui/AppButton";
import { motion, AnimatePresence } from "framer-motion";
import { HeartOutlined, StarOutlined } from "@ant-design/icons";
import imgDefault from "../../assets/landscape-placeholder-svgrepo-com.svg";
import BadgeNuevo from "./Badge";

interface ProductCardProps {
  id: number;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  rating?: number;
  originalPrice?: number;
  isNew?: boolean;
  updateQuantity: (id: number, newQty: number) => void;
  removeItem: (id: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  image,
  price,
  rating = 0,
  originalPrice,
  isNew,
}) => {
  return (
    <div
      key={id}
      style={{
        transition: "box-shadow 0.2s ease",
        width: "15em",
        background: "white",
        borderRadius: "1rem"
      }}
      onMouseOver={(e) => (e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)")}
      onMouseOut={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      <div style={{ padding: 0 }}>
        <div style={{ position: "relative" }}>
          <img
            src={image || imgDefault}
            alt={name}
            style={{
              width: "100%",
              height: "16rem",
              objectFit: "cover",
              borderTopLeftRadius: "1rem",
              borderTopRightRadius: "1rem",
            }}
          />
          <AnimatePresence>
            <BadgeNuevo isNew={!isNew} />
          </AnimatePresence>

          <AppButton
            style={{
              position: "absolute",
              top: "0.5rem",
              right: "0.5rem",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: "0.5rem",
            }}
          >
            <HeartOutlined style={{ height: "1rem", width: "1rem" }} />
          </AppButton>
        </div>
        <div style={{ padding: "1rem" }}>
          <h4
            style={{
              fontWeight: 500,
              color: "#1f2937",
              marginBottom: "0.5rem",
            }}
          >
            {name}
          </h4>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
            {[...Array(5)].map((_, i) => (
              <StarOutlined
                key={i}
                style={{
                  height: "0.75rem",
                  width: "0.75rem",
                  color: i < Math.floor(rating) ? "#facc15" : "#d1d5db",
                  fill: i < Math.floor(rating) ? "#facc15" : "none",
                }}
              />
            ))}
            <span style={{ fontSize: "0.75rem", color: "#6b7280", marginLeft: "0.25rem" }}>
              ({rating})
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.75rem",
            }}
          >
            <div>
              <span style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#1f2937" }}>
                ${price}
              </span>
              {originalPrice && (
                <span
                  style={{
                    fontSize: "0.875rem",
                    color: "#6b7280",
                    textDecoration: "line-through",
                    marginLeft: "0.5rem",
                  }}
                >
                  ${originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Botón agregar al carrito */}
          <AppButton
            style={{
              width: "100%",
              color: "white",
              fontWeight: 500,
              backgroundColor: "#8b7355",
              borderRadius: "0.5rem"
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#7a6449")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#8b7355")}
          >
            Agregar al carrito
          </AppButton>
        </div>
      </div>
    </div>
  );
};
