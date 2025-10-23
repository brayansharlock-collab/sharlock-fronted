import  { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "../ui/ProductCard";

export const RecentProducts = () => {
  const [recentProducts, setRecentProducts] = useState<any[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentProducts") || "[]");
    setRecentProducts(stored);
  }, []);

  if (recentProducts.length === 0) return null;

  return (
    <section
      style={{
        width: "100%",
        margin: "40px auto",
        maxWidth: "1350px",
        padding: "28px",
        position: "relative",
        background: "linear-gradient(160deg, #ffffff, #e6e1d7)",
        border: "1px solid #e8e8e8",
        borderRadius: 18,
        boxSizing: "border-box",
      }}
    >
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          fontSize: "26px",
          fontWeight: 800,
          marginBottom: 24,
          color: "#7a6449",
          letterSpacing: "0.5px",
        }}
      >
        Productos que viste recientemente
      </motion.h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 24,
          alignItems: "stretch",
        }}
      >
        {recentProducts.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              borderRadius: 16,
              overflow: "hidden",
              background: "#fff",
              boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <ProductCard
              id={p.id}
              name={p.name}
              image={p.image}
              rating={p.average_rating}
              discountPercent={0}
              isNew={false}
              initialIsFavorite={false}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};
