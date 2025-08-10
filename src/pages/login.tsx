import { Button, Card, Typography, Input } from "antd";
import { useState } from "react";
import {
  LockOutlined,
  MailOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  GoogleOutlined
} from "@ant-design/icons";


const { Title, Paragraph, Text } = Typography;

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSwitchToForgot: () => void;
}

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
      <Card
        style={{
          width: "100%",
          maxWidth: 400,
          border: "none",
          borderRadius: "1rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        {/* Encabezado */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div
            style={{
              width: 64,
              height: 64,
              margin: "0 auto 1rem",
              borderRadius: "50%",
              backgroundColor: "#f7f5f2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <LockOutlined style={{ fontSize: 28, color: "#7a6449"}} />
          </div>
          <Title level={2} style={{ marginBottom: 4 }}>
            Iniciar Sesión
          </Title>
          <Paragraph style={{ color: "#6b7280", fontSize: "0.95rem" }}>
            Ingresa tus credenciales para acceder a tu cuenta
          </Paragraph>
        </div>

        {/* Campo email */}
        <div style={{ marginBottom: "1rem" }}>
          <Text>Email</Text>
          <Input
            prefix={<MailOutlined />}
            type="email"
            placeholder="tu@ejemplo.com"
            style={{ marginTop: 4 }}
          />
        </div>

        {/* Campo contraseña */}
        <div style={{ marginBottom: "1rem" }}>
          <Text>Contraseña</Text>
          <Input
            prefix={<LockOutlined />}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            suffix={
              showPassword ? (
                <EyeInvisibleOutlined
                  onClick={() => setShowPassword(false)}
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <EyeOutlined
                  onClick={() => setShowPassword(true)}
                  style={{ cursor: "pointer" }}
                />
              )
            }
            style={{ marginTop: 4 }}
          />
        </div>

        {/* Opciones */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Input type="checkbox" style={{ width: "2em"}} />
            <Text style={{ width: "10em"}}>Recordarme</Text>
          </label>
          <Button type="link" onClick={onSwitchToForgot} style={{ padding: 0 }}>
            ¿Olvidaste tu contraseña?
          </Button>
        </div>

        {/* Botón principal */}
        <Button
          type="primary"
          block
          style={{
            border: "none",
            fontWeight: 500
          }}
        >
          Iniciar Sesión
        </Button>

        {/* Divider */}
        <Paragraph style={{ textAlign: "center", margin: "1rem 0", color: "#9ca3af" }}>
          O continúa con
        </Paragraph>

        {/* Botones sociales */}
        <div style={{  gap: "0.75rem" }}>
          <Button block icon={<GoogleOutlined />}>Google</Button>
        </div>

        {/* Registro */}
        <Paragraph style={{ textAlign: "center", marginTop: "1.5rem", color: "#6b7280" }}>
          ¿No tienes una cuenta?{" "}
          <Button type="link" onClick={onSwitchToRegister} style={{ padding: 0 }}>
            Regístrate aquí
          </Button>
        </Paragraph>
      </Card>
    </div>
  );
}
