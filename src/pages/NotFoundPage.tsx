import React from "react";
import { Result, Button } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

import noFoundImage from "../assets/ilustrations/undraw_donut-love_5r3x.svg";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.42, 0, 0.58, 1] },
  },
};

const NotFoundPage: React.FC = () => {
  const containerStyle: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const cardStyle: React.CSSProperties = {
    background: "white",
    borderRadius: 16,
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
    padding: 32,
    maxWidth: 600,
    textAlign: "center",
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: 20,
    fontWeight: 500,
    color: "#555",
    marginTop: 8,
  };

  const textStyle = {
    fontSize: 14,
    color: "#888",
    marginTop: 12,
  };

  return (
    <div style={containerStyle}>
      <motion.div
        style={cardStyle}
        variants={itemVariants}
        initial="hidden"
        animate="show"
      >
        <Result
          icon={<img src={noFoundImage} alt="Not Found" style={{ width: 300, margin: "10px auto" }} />}
          title={<div style={subtitleStyle}>Página no encontrada</div>}
          subTitle={
            <motion.div
              style={textStyle}
              variants={itemVariants}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.1 }}
            >
              Parece que la dirección que buscas no existe o fue movida.
            </motion.div>
          }
          extra={
            <motion.div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
                marginTop: 20,
              }}
              variants={itemVariants}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.2 }}
            >
              <Button type="primary" icon={<HomeOutlined />} href="/">
                Ir al inicio
              </Button>
            </motion.div>
          }
        />
      </motion.div>
    </div>
  );
};

export default NotFoundPage;