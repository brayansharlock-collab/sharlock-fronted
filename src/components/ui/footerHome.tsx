import { Typography } from "antd";
import { motion } from "framer-motion";
import {
  MailOutlined,
  EnvironmentOutlined,
  InstagramOutlined,
  FacebookOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

export default function FooterHome() {
  const year = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        width: "100%",
        backgroundColor: "#0b0b0b",
        color: "#fff",
        fontFamily: "'Cinzel', serif",
        zIndex: 50,
        paddingTop: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          padding: "2rem 3rem",
          flexWrap: "wrap",
          gap: "2rem",
          borderBottom: "1px solid #222",
        }}
      >
        {/* Logo y descripción */}
        <div style={{ maxWidth: "340px" }}>
          <Title level={2} style={{ marginBottom: "1rem", fontWeight: 600, letterSpacing: "1px", color: "white" }}>
            SHARLOCK
          </Title>
          <Text style={{ color: "#ccc", fontSize: "0.95rem", lineHeight: "1.6" }}>
            Estilo y calidad en cada prenda. Descubre la moda que te define.
          </Text>
        </div>

        {/* Contacto */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <h4 style={{ marginBottom: "0.5rem", letterSpacing: "1px" }}>CONTACTO</h4>
          <Text style={{ color: "#ccc", display: "flex", alignItems: "center", gap: 8 }}>
            <MailOutlined />
            support@sharlockstore.com
          </Text>
          <Text style={{ color: "#ccc", display: "flex", alignItems: "center", gap: 8 }}>
            <EnvironmentOutlined />
            Pereira, Colombia
          </Text>
        </div>
      </div>

      {/* Derechos / Links / Redes */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 3rem",
          flexWrap: "wrap",
          gap: "1rem",
          fontFamily: "sans-serif",
        }}
      >
        <Text style={{ color: "#888", fontSize: "0.85rem" }}>
          © {year} SHARLOCK. Todos los derechos reservados.
        </Text>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            fontSize: "0.85rem",
          }}
        >
          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
            <a
              href="/terminos"
              style={{ color: "#fff", textDecoration: "none", fontSize: "0.9rem" }}
            >
              Términos y Condiciones
            </a>
            <span style={{ color: "#555" }}>|</span>
            <a
              href="/privacidad"
              style={{ color: "#fff", textDecoration: "none", fontSize: "0.9rem" }}
            >
              Política de Privacidad
            </a>
          </div>

          {/* Redes sociales */}
          <div style={{ display: "flex", gap: 10, marginLeft: 8 }}>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 34,
                height: 34,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "#0b0b0b",
                textDecoration: "none",
                color: "#fff",
              }}
            >
              <InstagramOutlined />
            </a>

            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 34,
                height: 34,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "#0b0b0b",
                textDecoration: "none",
                color: "#fff",
              }}
            >
              <FacebookOutlined />
            </a>
          </div>
        </div>
      </div>

      {/* Responsivo */}
      <style>
        {`
          @media (max-width: 768px) {
            footer {
              text-align: center !important;
            }
            footer > div {
              flex-direction: column !important;
              align-items: center !important;
            }
            footer > div > div  {
              flex-direction: column !important;
              align-items: center !important;
            }
            h2 {
              text-align: center;
            }
            /* separar el bloque de links/redes cuando se apilan */
            footer div[style*="justify-content: space-between"][style*="padding: 1rem 3rem"] {
              gap: 0.8rem;
            }
          }
        `}
      </style>
    </motion.footer>
  );
}
