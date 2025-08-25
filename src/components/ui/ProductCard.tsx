import React from "react";
import { Button, Tooltip } from "antd";
import { AnimatePresence } from "framer-motion";
import { HeartOutlined, ShoppingCartOutlined, StarOutlined } from "@ant-design/icons";
// import imgDefault from "../assets/landscape-placeholder-svgrepo-com.svg";
import imgDefault from "../../assets/download.jpeg";
import BadgeNuevo from "./Badge";

interface ProductCardProps {
  id: number;
  name: string;
  image?: string;
  images?: string[];
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
  images = [],
  price,
  rating = 0,
  originalPrice,
  isNew,
}) => {
  const [hover, setHover] = React.useState(false);
  const allImages = [image, ...images].filter(Boolean) as string[];

  return (
    <div
      key={id}
      style={{
        transition: "box-shadow 0.2s ease",
        width: "15em",
        borderRadius: "1.2rem",
        backgroundColor: "white",
        cursor: "pointer",
      }}
    >
      <div style={{ padding: 0 }}>
        <div
          style={{ position: "relative" }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {allImages.length > 1 ? (
            <div style={{ position: "relative", overflow: "hidden" }}>
              <img
                src={hover ? allImages[1] : allImages[0]}
                alt={name}
                style={{
                  width: "100%",
                  height: "20rem",
                  objectFit: "cover",
                  borderTopLeftRadius: "1.2rem",
                  borderTopRightRadius: "1.2rem",
                  cursor: "pointer",
                  transition: "transform 0.3s ease, opacity 0.3s ease",
                  opacity: hover ? 0.85 : 1,
                }}
              />
            </div>
          ) : (
            <img
              src={allImages[0] || imgDefault}
              alt={name}
              style={{
                width: "100%",
                height: "20rem",
                objectFit: "cover",
                borderTopLeftRadius: "1.2rem",
                borderTopRightRadius: "1.2rem",
                cursor: "pointer",
              }}
            />
          )}

          <AnimatePresence>
            <BadgeNuevo isNew={!isNew} />
          </AnimatePresence>

          <Tooltip title="Agregar a favoritos">
            <Button
              style={{
                position: "absolute",
                top: "0.5rem",
                right: "0.5rem",
                borderRadius: "0.8rem",
                backdropFilter: "blur(10px)",
                background: "transparent",
                border: "none"
              }}
            >
              <HeartOutlined style={{ height: "1rem", width: "1rem", }} />
            </Button>
          </Tooltip>


          <div style={{ position: "absolute", background: "linear-gradient(to bottom, transparent, white)", height: "80px", width: "100%", bottom: 0 }} />
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
                  color: i < Math.floor(rating) ? "#facc15" : "#727272ff",
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


        </div>
      </div>
    </div>
  );
};
