import React, { useEffect, useState } from "react";
import { Button, message, Tooltip } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { HeartFilled, HeartOutlined, StarOutlined } from "@ant-design/icons";
import BadgeNuevo from "./Badge";
import { productService } from "../../service/productService";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id: number;
  name: string;
  image?: string;
  images?: string[];
  price: number;
  quantity?: number; // Opcional
  rating?: number;
  originalPrice?: number;
  isNew?: boolean;
  initialIsFavorite?: boolean;
  updateQuantity?: (id: number, newQty: number) => void;
  removeItem?: (id: number) => void;
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
  initialIsFavorite = false,
}) => {
  const [hover, setHover] = useState(false);
  const allImages = [image, ...images].filter(Boolean) as string[];
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const checkFavorite = async () => {
  //     try {
  //       const favorite = await productService.isFavorite(id);
  //       setIsFavorite(favorite);
  //     } catch (error) {
  //       console.error("Error checking favorite status:", error);
  //     }
  //   };
  //   checkFavorite();
  // }, [id]);

  const toggleFavorite = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (isFavorite) {
        await productService.removeFromFavorites(id);
        setIsFavorite(false);
        message.success("Eliminado de favoritos");
      } else {
        await productService.addToFavorites(id);
        setIsFavorite(true);
        message.success("Agregado a favoritos");
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || "Error al actualizar favoritos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link
      to={`/producto/${name}/${id}`}
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
    >
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
              <div style={{ position: "relative", overflow: "hidden", height: "20rem" }}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={hover ? allImages[1] : allImages[0]} // cambia key para animar entre imágenes
                    src={hover ? allImages[1] : allImages[0]}
                    alt={name}
                    loading="lazy"
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{
                      width: "100%",
                      height: "20rem",
                      objectFit: "cover",
                      borderTopLeftRadius: "1.2rem",
                      borderTopRightRadius: "1.2rem",
                      cursor: "pointer",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  />
                </AnimatePresence>
              </div>
            ) : (
              <motion.img
                src={allImages[0] || "../../assets/landscape-placeholder-svgrepo-com.svg"}
                alt={name}
                loading="lazy"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
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
                  background: "rgba(255, 255, 255, 0.7)",
                  border: "1px solid rgba(255, 255, 255, 0.5)",
                  transition: "all 0.2s ease",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavorite();
                }}
                icon={isFavorite ? <HeartFilled style={{ color: "#ff4d4f" }} /> : <HeartOutlined />}
                loading={loading}
                type={isFavorite ? "primary" : "default"}
              />
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
    </Link>
  );
};
