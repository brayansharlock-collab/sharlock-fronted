import { motion } from "framer-motion";

export default function BadgeNuevo({ isNew }: { isNew: boolean }) {
  if (isNew) return null;

  return (
    <motion.div
      initial={{ scale: 1, opacity: 0.9 }}
      animate={{
        scale: [1, .9, 1],
        opacity: [0.9, 1, 0.9],
        boxShadow: [
          "0 0 0 0 rgba(239, 68, 68, 0.7)",
          "0 0 0 8px rgba(239, 68, 68, 0)",
          "0 0 0 0 rgba(239, 68, 68, 0)"
        ]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{
        position: "absolute",
        top: "0.5rem",
        left: "0.5rem",
        backgroundColor: "#ef4444",
        color: "white",
        padding: "0.25rem 0.5rem",
        borderRadius: "0.5rem",
        fontWeight: "bold"
      }}
    >
      Nuevo
    </motion.div>
  );
}
