"use client";
import { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Col,
  Form,
  Input,
  message,
  Row,
  Typography,
  DatePicker,
  Card,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  CalendarOutlined,
  LogoutOutlined,
  EditOutlined,
  SaveOutlined,
  IdcardOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { userService, type User } from "../../service/userService";
import dayjs from "dayjs";
import { authService } from "../../service/authService";
import peopleImg from "../../assets/ilustrations/People.gif"

const { Title, Text } = Typography;

export default function UserInfo() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();

  const storedUser = localStorage.getItem("user");
  const currentUser: User | null = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (currentUser?.id) fetchUser(currentUser.id);
  }, []);

  const fetchUser = async (id: number) => {
    const key = "fetchUser";
    try {
      setLoading(true);
      const data = await userService.getUser(id);
      setUser(data);
      form.setFieldsValue({
        ...data,
        birth_date: data.birth_date ? dayjs(data.birth_date) : null,
        // Aseguramos que email y username estén sincronizados al cargar
        email: data.username || data.email,
      });
    } catch {
      messageApi.error({ key, content: "Error al cargar tus datos" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const key = "saveUser";
    try {
      const values = await form.validateFields();
      if (!user) return;
      const payload = {
        ...values,
        birth_date: values.birth_date?.format("YYYY-MM-DD") || null,
      };
      messageApi.open({ key, type: "loading", content: "Guardando cambios..." });
      const updated = await userService.updateUser(user.id, payload);
      setUser(updated);
      form.setFieldsValue({
        ...updated,
        birth_date: updated.birth_date ? dayjs(updated.birth_date) : null,
        email: updated.username || updated.email,
      });
      messageApi.success({
        key,
        content: "Perfil actualizado correctamente",
        duration: 1.5,
      });
      setEditing(false);
    } catch {
      messageApi.error({ key, content: "Error al actualizar el perfil" });
    }
  };

  const handleCancel = () => {
    if (user) {
      form.setFieldsValue({
        ...user,
        birth_date: user.birth_date ? dayjs(user.birth_date) : null,
        email: user.username || user.email,
      });
    }
    setEditing(false);
  };

  const handleLogout = () => {
    authService.logout();
    localStorage.removeItem("user");
    messageApi.success("Sesión cerrada");
    setTimeout(() => (window.location.href = "/login"), 800);
  };

  if (!user) return <Text>Cargando...</Text>;

  // Variants para animaciones
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <>
      {contextHolder}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header con avatar y acciones */}
        <Card
          style={{
            marginBottom: 24,
            borderRadius: 16,
            boxShadow: "none",
            background: "none",
          }}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <Row align="middle" gutter={16}>
                <Col>
                  <Avatar
                    size={80}
                    src={user.avatar || undefined}
                    icon={<UserOutlined />}
                  />
                </Col>
                <Col>
                  <Title level={4} style={{ margin: 0 }}>
                    {user.first_name} {user.last_name}
                  </Title>
                  <Text type="secondary">Perfil de usuario</Text>
                </Col>
              </Row>
            </Col>
            <Col>
              <Row gutter={8}>
                {!editing ? (
                  <Col>
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => setEditing(true)}
                    >
                      Editar
                    </Button>
                  </Col>
                ) : (
                  <>
                    <Col>
                      <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={handleSave}
                        loading={loading}
                      >
                        Guardar
                      </Button>
                    </Col>
                    <Col>
                      <Button icon={<CloseOutlined />} onClick={handleCancel}>
                        Cancelar
                      </Button>
                    </Col>
                  </>
                )}
                <Col>
                  <Button
                    danger
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>

        {/* Cuerpo con info y foto */}
        <Row gutter={[24, 24]}>
          {/* Información personal */}
          <Col xs={24} md={12}>
            <Card
              title="Información personal"
              style={{
                borderRadius: 16,
                boxShadow: "none",
                background: "none",
              }}
            >
              <Form
                layout="vertical"
                form={form}
                onValuesChange={(changedValues) => {
                  // Sincronizar email con username en tiempo real
                  if (changedValues.username !== undefined) {
                    form.setFieldsValue({ email: changedValues.username });
                  }
                }}
              >
                <Form.Item
                  label="Nombre de usuario"
                  name="username"
                  rules={[{ required: true, message: 'Por favor ingresa un nombre de usuario' }]}
                >
                  <Input prefix={<UserOutlined />} disabled={!editing} />
                </Form.Item>

                {/* Campo oculto: email se sincroniza con username */}
                <Form.Item name="email" noStyle>
                  <Input type="hidden" />
                </Form.Item>

                <Form.Item label="Teléfono" name="phone">
                  <Input prefix={<PhoneOutlined />} disabled={!editing} />
                </Form.Item>
                <Form.Item label="Documento" name="document">
                  <Input prefix={<IdcardOutlined />} disabled={!editing} />
                </Form.Item>
                <Form.Item label="Fecha de nacimiento" name="birth_date">
                  <DatePicker
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    suffixIcon={<CalendarOutlined />}
                    disabled={!editing}
                  />
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Imagen ilustrativa */}
          <Col xs={24} md={12}>
            <Card
              style={{
                border: "none",
                height: "100%",
                borderRadius: 16,
                boxShadow: "none",
                background: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={peopleImg}
                alt="Ilustración"
                style={{
                  width: "300px",
                  // maxWidth: "100%",
                  // maxHeight: 350,
                  borderRadius: 16,
                  objectFit: "cover",
                }}
              />
            </Card>
          </Col>
        </Row>
      </motion.div>
    </>
  );
}