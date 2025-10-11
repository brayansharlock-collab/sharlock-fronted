import { Typography } from "antd";
import { motion } from "framer-motion";

const { Text } = Typography;

export default function FooterHome() {
  const year = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        bottom: 0,
        left: 0,
        width: "100%",
        backgroundColor: "#0b0b0b",
        color: "#fff",
        borderTop: "1px solid #222",
        fontFamily: "'Cinzel', serif",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div
          style={{
            borderRight: "2px solid #000",
            paddingRight: "1.5rem",
            fontSize: "1.3rem",
            fontWeight: "600",
            letterSpacing: "1px",
            userSelect: "none",
          }}
        >
          SHARLOCK
        </div>

        <div
          style={{
            textAlign: "right",
            fontSize: "0.85rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "0.2rem",
            fontFamily: "sans-serif",
          }}
        >
          <Text style={{ color: "#ccc" }}>Soporte: soporte@sharlock.com</Text>
          <Text style={{ color: "#ccc" }}>Pereira, Colombia</Text>
          <a
            href="/terminos"
            style={{
              color: "#fff",
              textDecoration: "none",
              marginTop: "0.3rem",
            }}
          >
            Términos y Condiciones
          </a>
          <Text style={{ color: "#888", fontSize: "0.75rem" }}>
            © {year} SHARLOCK. Todos los derechos reservados.
          </Text>
        </div>
      </div>
    </motion.footer>
  );
}
