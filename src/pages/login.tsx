import { Button, Card, Typography, Input, Alert } from "antd";
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

import { useNavigate } from "react-router-dom";
import { authService } from "../service/authService";

const { Title, Paragraph, Text } = Typography;

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSwitchToForgot: () => void;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.42, 0, 0.58, 1] },
  },
};

export default function Login({ onSwitchToRegister, onSwitchToForgot }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await authService.login(email, password);

      localStorage.setItem("user", JSON.stringify(user));
      navigate("/", { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || "Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      {/* Fondo animado */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ width: "100%", height: "100%", zIndex: -1 }}
      >
        <Silk speed={10} scale={1} color="#e6e1d7" noiseIntensity={1.5} rotation={0} />
      </motion.div>

      {/* Formulario */}
      <motion.div
        initial={{ width: 64, height: 434, borderRadius: "50%" }}
        animate={{ width: "100%", maxWidth: 400, height: "auto", borderRadius: "1rem" }}
        transition={{ type: "spring", stiffness: 120, damping: 15, duration: 0.8 }}
        style={{ position: "absolute" }}
      >
        <Card style={{ border: "none", borderRadius: "1rem", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
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

          <motion.div variants={itemVariants} initial="hidden" animate="show">
            <Title level={2} style={{ marginBottom: 4, textAlign: "center" }}>
              Iniciar Sesión
            </Title>
            <Paragraph style={{ color: "#6b7280", fontSize: "0.95rem", textAlign: "center" }}>
              Ingresa tus credenciales para acceder a tu cuenta
            </Paragraph>
          </motion.div>

          {/* Mostrar error si hay */}
          {error && (
            <motion.div variants={itemVariants} initial="hidden" animate="show">
              <Alert type="error" message={error} showIcon style={{ marginBottom: "1rem" }} />
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <motion.div variants={itemVariants} initial="hidden" animate="show" style={{ marginBottom: "1rem" }}>
              <Text>Email</Text>
              <Input
                prefix={<MailOutlined />}
                // type="email"
                placeholder="tu@ejemplo.com"
                style={{ marginTop: 4 }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </motion.div>

            {/* Contraseña */}
            <motion.div variants={itemVariants} initial="hidden" animate="show" style={{ marginBottom: "1rem" }}>
              <Text>Contraseña</Text>
              <Input
                prefix={<LockOutlined />}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                style={{ marginTop: 4 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                suffix={
                  showPassword ? (
                    <EyeInvisibleOutlined onClick={() => setShowPassword(false)} style={{ cursor: "pointer" }} />
                  ) : (
                    <EyeOutlined onClick={() => setShowPassword(true)} style={{ cursor: "pointer" }} />
                  )
                }
                required
              />
            </motion.div>

            {/* Recordarme y recuperar */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="show"
              style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}
            >
              <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input type="checkbox" style={{ width: "2em" }} />
                <Text style={{ width: "10em" }}>Recordarme</Text>
              </label>
              <Button type="link" onClick={onSwitchToForgot} style={{ padding: 0 }}>
                ¿Olvidaste tu contraseña?
              </Button>
            </motion.div>

            {/* Botón */}
            <motion.div variants={itemVariants} initial="hidden" animate="show" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                style={{ border: "none", fontWeight: 500 }}
              >
                {loading ? "Iniciando..." : "Iniciar Sesión"}
              </Button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div variants={itemVariants} initial="hidden" animate="show">
            <Paragraph style={{ textAlign: "center", margin: "1rem 0", color: "#9ca3af" }}>
              O continúa con
            </Paragraph>
          </motion.div>

          {/* Google */}
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