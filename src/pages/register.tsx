// pages/Register.tsx
import { Button, Card, Typography, Input, Alert, DatePicker, Select } from "antd";
import { useState } from "react";
import { Row, Col } from "antd";
import {
  LockOutlined,
  MailOutlined,
  UserOutlined,
  PhoneOutlined,
  IdcardOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import Silk from "../components/animations/Silk";
import { userService } from "../service/userService";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.42, 0, 0.58, 1] } },
};

export default function Register() {
  const passwordRegex =/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=(?:.*\d){3,})(?=.{8,})/;

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    document_type_id: 1,
    document: "",
    birth_date: "",
    gender_id: 1,
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (key: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!passwordRegex.test(form.password)) {
      setError("La contraseña no cumple con los requisitos de seguridad");
      setLoading(false);
      return;
    }

    if (form.password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      await userService.register(form);
      setSuccess("Usuario registrado con éxito");
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (value: string) => {
    setForm((prev) => ({ ...prev, password: value }));

    if (!passwordRegex.test(value)) {
      setPasswordError(
        "La contraseña debe tener al menos 8 caracteres, 1 mayúscula, 1 caracter especial y 3 números"
      );
    } else {
      setPasswordError("");
    }
  };


  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      {/* Fondo animado */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ width: "100%", height: "100%", zIndex: -1 }}
      >
        <Silk speed={10} scale={1} color="#e6e1d7" noiseIntensity={1.5} rotation={0} />
      </motion.div>

      <motion.div
        initial={{ width: 64, height: 500, borderRadius: "50%" }}
        animate={{ width: "100%", maxWidth: 500, height: "auto", borderRadius: "1rem" }}
        transition={{ type: "spring", stiffness: 120, damping: 15, duration: 0.8 }}
        style={{ position: "absolute" }}
      >
        <Card style={{ border: "none", borderRadius: "1rem", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
          <motion.div variants={itemVariants} initial="hidden" animate="show">
            <Title level={2} style={{ marginBottom: 4, textAlign: "center" }}>
              Crear Cuenta
            </Title>
            <Paragraph style={{ color: "#6b7280", fontSize: "0.95rem", textAlign: "center" }}>
              Completa los datos para registrarte
            </Paragraph>
          </motion.div>

          {error && <Alert type="error" message={error} showIcon style={{ marginBottom: "1rem" }} />}
          {success && <Alert type="success" message={success} showIcon style={{ marginBottom: "1rem" }} />}

          <form onSubmit={handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <motion.div variants={itemVariants} initial="hidden" animate="show" style={{ marginBottom: "1rem" }}>
                  <Text>Nombre</Text>
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Tu primer nombre"
                    value={form.first_name}
                    onChange={(e) => handleChange("first_name", e.target.value)}
                    required
                  />
                </motion.div>
              </Col>
              <Col span={12}>
                <motion.div variants={itemVariants} initial="hidden" animate="show" style={{ marginBottom: "1rem" }}>
                  <Text>Apellido</Text>
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Tu primer apellido"
                    value={form.last_name}
                    onChange={(e) => handleChange("last_name", e.target.value)}
                    required
                  />
                </motion.div>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <motion.div variants={itemVariants} initial="hidden" animate="show" style={{ marginBottom: "1rem" }}>
                  <Text>Email</Text>
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="tu@ejemplo.com"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                </motion.div>
              </Col>
              <Col span={12}>
                <motion.div variants={itemVariants} initial="hidden" animate="show" style={{ marginBottom: "1rem" }}>
                  <Text>Confirmar Email</Text>
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Usuario123"
                    value={form.username}
                    onChange={(e) => handleChange("username", e.target.value)}
                    required
                  />
                </motion.div>
              </Col>
            </Row>

            {/* Contraseña y Confirmar Contraseña */}
            <Row gutter={16}>
              <Col span={12}>
                <motion.div variants={itemVariants} initial="hidden" animate="show" style={{ marginBottom: "1rem" }}>
                  <Text>Contraseña</Text>
                  <Input
                    prefix={<LockOutlined />}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    suffix={
                      showPassword ? (
                        <EyeInvisibleOutlined onClick={() => setShowPassword(false)} style={{ cursor: "pointer" }} />
                      ) : (
                        <EyeOutlined onClick={() => setShowPassword(true)} style={{ cursor: "pointer" }} />
                      )
                    }
                    required
                  />
                  {passwordError && <Text type="danger" style={{ fontSize: "0.85rem" }}>{passwordError}</Text>}
                </motion.div>
              </Col>

              <Col span={12}>
                <motion.div variants={itemVariants} initial="hidden" animate="show" style={{ marginBottom: "1rem" }}>
                  <Text>Confirmar contraseña</Text>
                  <Input
                    prefix={<LockOutlined />}
                    type="password"
                    placeholder="Repite tu contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  {confirmPassword && confirmPassword !== form.password && (
                    <Text type="danger" style={{ fontSize: "0.85rem" }}>Las contraseñas no coinciden</Text>
                  )}
                </motion.div>
              </Col>
            </Row>

            {/* Teléfono y Documento */}
            <Row gutter={16}>
              <Col span={12}>
                <motion.div variants={itemVariants} initial="hidden" animate="show" style={{ marginBottom: "1rem" }}>
                  <Text>Teléfono</Text>
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder="300••••••"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    required
                  />
                </motion.div>
              </Col>
              <Col span={12}>
                <motion.div variants={itemVariants} initial="hidden" animate="show" style={{ marginBottom: "1rem" }}>
                  <Text>Documento</Text>
                  <Input
                    prefix={<IdcardOutlined />}
                    placeholder="•••••••••"
                    value={form.document}
                    onChange={(e) => handleChange("document", e.target.value)}
                    required
                  />
                </motion.div>
              </Col>
            </Row>

            {/* Fecha de nacimiento y Género */}
            <Row gutter={16}>
              <Col span={12}>
                <motion.div variants={itemVariants} initial="hidden" animate="show" style={{ marginBottom: "1rem" }}>
                  <Text>Fecha de nacimiento</Text>
                  <DatePicker
                    style={{ width: "100%" }}
                    value={form.birth_date ? dayjs(form.birth_date) : undefined}
                    onChange={(date) => handleChange("birth_date", date ? date.format("YYYY-MM-DD") : "")}
                    required
                  />
                </motion.div>
              </Col>
              <Col span={12}>
                <motion.div variants={itemVariants} initial="hidden" animate="show" style={{ marginBottom: "1rem" }}>
                  <Text>Género</Text>
                  <Select
                    style={{ width: "100%" }}
                    value={form.gender_id}
                    onChange={(val) => handleChange("gender_id", val)}
                  >
                    <Option value={1}>Masculino</Option>
                    <Option value={2}>Femenino</Option>
                    <Option value={3}>Otro</Option>
                  </Select>
                </motion.div>
              </Col>
            </Row>

            {/* Botón */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="show"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button type="primary" htmlType="submit" block loading={loading} style={{ border: "none", fontWeight: 500 }}>
                {loading ? "Registrando..." : "Registrarse"}
              </Button>
            </motion.div>
          </form>


          <motion.div variants={itemVariants} initial="hidden" animate="show">
            <Paragraph style={{ textAlign: "center", marginTop: "1.5rem", color: "#6b7280" }}>
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login" style={{ padding: 0 }}>
                Inicia sesion aquí
              </Link>
            </Paragraph>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}
