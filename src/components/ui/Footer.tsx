import { Typography } from "antd";
import { motion } from "framer-motion";

const { Text } = Typography;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        position: "absolute",
        bottom: "1rem",
        right: "1.5rem",
        textAlign: "right",
        fontSize: "0.85rem",
        color: "#ffffffff",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        gap: "0.2rem",
        userSelect: "none",
         mixBlendMode: 'difference',
      }}
    >
      <Text>
        <a href="/terminos" style={{ color: "#ffffffff", borderRight: "1px solid #ccc", paddingRight: "0.5rem" }}>
          Términos y Condiciones
        </a>
      </Text>
      <br />
      <Text>© {year} SHARLOCK</Text>
    </motion.div>
  );
}
