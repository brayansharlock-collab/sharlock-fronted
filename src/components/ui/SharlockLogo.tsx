import { Typography } from "antd";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const { Text } = Typography;

export default function SharlockLogo() {
  return (
    <>
      <motion.div
        className="sharlock-logo"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          position: "absolute",
          top: "1rem",
          left: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          mixBlendMode: "difference",
          cursor: "default",
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
          }}
        >
          <Text
            style={{
              fontSize: "1.5rem",
              mixBlendMode: "difference",
              fontWeight: 600,
              color: "#ffffffff",
            }}
          >
            SHARLOCK
          </Text>
        </Link>
      </motion.div>

      {/* 🔹 Estilos responsive */}
      <style>
        {`
          @media (max-width: 600px) {
            .sharlock-logo {
              justify-content: center !important;
              width: 100% !important;
              left: 0rem !important ;
              top: .2rem !important ;
            }

            .sharlock-logo span {
            }
          }
        `}
      </style>
    </>
  );
}
