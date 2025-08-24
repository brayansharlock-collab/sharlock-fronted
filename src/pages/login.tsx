import { Button, Card, Typography, Input } from "antd";
import { useState } from "react";
import {
  LockOutlined,
  MailOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  GoogleOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import Silk from "../components/animations/Silk";

const { Title, Paragraph, Text } = Typography;

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSwitchToForgot: () => void;
}

// Variantes para fade + slide de los elementos internos
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.42, 0, 0.58, 1] },
  },
};

export default function Login({ onSwitchToRegister, onSwitchToForgot }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
        style={{
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
      >
        <Silk speed={10} scale={1} color="#e6e1d7" noiseIntensity={1.5} rotation={0} />
      </motion.div>

      {/* Animación de expansión */}
      <motion.div
        initial={{ width: 64, height: 434, borderRadius: "50%" }}
        animate={{ width: "100%", maxWidth: 400, height: "auto", borderRadius: "1rem" }}
        transition={{ type: "spring", stiffness: 120, damping: 15, duration: 0.8 }}
        style={{ position: "absolute" }}
      >
        <Card
          style={{
            border: "none",
            borderRadius: "1rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 10, delay: 0.2 }}
            style={{
              width: 64,
              height: 64,
              margin: "0 auto 1rem",
              borderRadius: "50%",
              backgroundColor: "#f7f5f2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LockOutlined style={{ fontSize: 28, color: "#7a6449" }} />
          </motion.div>

          {/* Título */}
          <motion.div variants={itemVariants} initial="hidden" animate="show">
            <Title level={2} style={{ marginBottom: 4, textAlign: "center" }}>
              Iniciar Sesión
            </Title>
            <Paragraph style={{ color: "#6b7280", fontSize: "0.95rem", textAlign: "center" }}>
              Ingresa tus credenciales para acceder a tu cuenta
            </Paragraph>
          </motion.div>

          {/* Campo email */}
          <motion.div variants={itemVariants} initial="hidden" animate="show" style={{ marginBottom: "1rem" }}>
            <Text>Email</Text>
            <Input prefix={<MailOutlined />} type="email" placeholder="tu@ejemplo.com" style={{ marginTop: 4 }} />
          </motion.div>

          {/* Campo contraseña */}
          <motion.div variants={itemVariants} initial="hidden" animate="show" style={{ marginBottom: "1rem" }}>
            <Text>Contraseña</Text>
            <Input
              prefix={<LockOutlined />}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              suffix={
                showPassword ? (
                  <EyeInvisibleOutlined onClick={() => setShowPassword(false)} style={{ cursor: "pointer" }} />
                ) : (
                  <EyeOutlined onClick={() => setShowPassword(true)} style={{ cursor: "pointer" }} />
                )
              }
              style={{ marginTop: 4 }}
            />
          </motion.div>

          {/* Opciones */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="show"
            style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}
          >
            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Input type="checkbox" style={{ width: "2em" }} />
              <Text style={{ width: "10em" }}>Recordarme</Text>
            </label>
            <Button type="link" onClick={onSwitchToForgot} style={{ padding: 0 }}>
              ¿Olvidaste tu contraseña?
            </Button>
          </motion.div>

          {/* Botón principal */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="show"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button type="primary" block style={{ border: "none", fontWeight: 500 }}>
              Iniciar Sesión
            </Button>
          </motion.div>

          {/* Divider */}
          <motion.div variants={itemVariants} initial="hidden" animate="show">
            <Paragraph style={{ textAlign: "center", margin: "1rem 0", color: "#9ca3af" }}>
              O continúa con
            </Paragraph>
          </motion.div>

          {/* Botón Google */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="show"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button block icon={<GoogleOutlined />}>
              Google
            </Button>
          </motion.div>

          {/* Registro */}
          <motion.div variants={itemVariants} initial="hidden" animate="show">
            <Paragraph style={{ textAlign: "center", marginTop: "1.5rem", color: "#6b7280" }}>
              ¿No tienes una cuenta?{" "}
              <Button type="link" onClick={onSwitchToRegister} style={{ padding: 0 }}>
                Regístrate aquí
              </Button>
            </Paragraph>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}
