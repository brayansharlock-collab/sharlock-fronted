import { Card } from "antd";
import { useState } from "react";
import { AppInput } from "../components/ui/AppInput";
import { AppButton } from "../components/ui/AppButton";
import { LockOutlined, MailOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

import { Title } from "../components/ui/Title"
import { Paragraph } from "../components/ui/Paragraph"
import { InfoText } from "../components/ui/InfoText"

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
        padding: "1rem",
        height: "100vh"
      }}
    >
      <Card style={{ width: "100%", maxWidth: 400, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              margin: "0 auto 1rem",
              borderRadius: "50%",
              backgroundColor: "#edeae4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LockOutlined style={{ fontSize: 28, color: "#555" }} />
          </div>
          <Title level={2} style={{ fontFamily: "Lora, serif", margin: 0 }}>
            Iniciar Sesión
          </Title>
          <Paragraph style={{ fontFamily: "Inter, Arial, sans-serif", color: "#666" }}>
            Ingresa tus credenciales para acceder a tu cuenta
          </Paragraph>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <InfoText style={{ fontFamily: "Nova Square sans-serif", fontWeight: 500 }}>Email</InfoText>
          <AppInput
            prefix={<MailOutlined />}
            type="email"
            placeholder="tu@ejemplo.com"
            style={{ marginTop: 4 }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <InfoText style={{ fontFamily: "Lora, serif", fontWeight: 500 }}>Contraseña</InfoText>
          <AppInput
            prefix={<LockOutlined />}
            type={showPassword ? "InfoText" : "password"}
            placeholder="••••••••"
            suffix={
              showPassword ? (
                <EyeInvisibleOutlined onClick={() => setShowPassword(false)} />
              ) : (
                <EyeOutlined onClick={() => setShowPassword(true)} />
              )
            }
            style={{ marginTop: 4 }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <AppInput type="checkbox" />
            <InfoText style={{ fontFamily: "Inter, Arial, sans-serif", fontSize: 14 }}>Recordarme</InfoText>
          </label>
          <AppButton type="link" style={{ fontFamily: "Inter, Arial, sans-serif", padding: 0 }} onClick={onSwitchToForgot}>
            ¿Olvidaste tu contraseña?
          </AppButton>
        </div>

        <AppButton
          type="primary"
          block
          style={{
            backgroundColor: "#8b7355",
            border: "none",
            fontFamily: "Lora, serif",
          }}
        //   onMouseOver={(e) => ((e.currentTarget as HTMLAppButtonElement).style.backgroundColor = "#7a6449")}
        //   onMouseOut={(e) => ((e.currentTarget as HTMLAppButtonElement).style.backgroundColor = "#8b7355")}
        >
          Iniciar Sesión
        </AppButton>

        <div style={{ textAlign: "center", margin: "1rem 0", color: "#888" }}>O continúa con</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          <AppButton block>Google</AppButton>
          <AppButton block>Twitter</AppButton>
        </div>

        <Paragraph style={{ textAlign: "center", marginTop: "1rem", fontFamily: "Inter, Arial, sans-serif" }}>
          ¿No tienes una cuenta?{" "}
          <AppButton type="link" onClick={onSwitchToRegister} style={{ fontFamily: "Lora, serif", padding: 0 }}>
            Regístrate aquí
          </AppButton>
        </Paragraph>
      </Card>
    </div>
  );
}
