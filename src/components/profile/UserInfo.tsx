"use client";
import { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Col,
  Divider,
  Form,
  Input,
  message,
  Row,
  Typography,
  Select,
  DatePicker,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  LogoutOutlined,
  EditOutlined,
  SaveOutlined,
  IdcardOutlined,
  TeamOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { userService, type User } from "../../service/userService";
import dayjs from "dayjs";
import { authService } from "../../service/authService";

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
      });
    } catch {
      messageApi.error({ key, content: "Error al cargar tu datos" });
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

  const itemVariants:Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  return (
    <>
      {contextHolder}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{ padding: "24px" }}
      >
          <Row gutter={[24, 24]}>
            {/* Avatar y acciones */}
            <Col xs={24} md={6} style={{ textAlign: "center" }}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5,  stiffness: 300 }}
              >
                <Avatar
                  size={140}
                  src={user.avatar || undefined}
                  icon={<UserOutlined />}
                  style={{
                    border: "4px solid white",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  }}
                />
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>
                    {user.first_name} {user.last_name}
                  </Title>
                  <Text type="secondary">@{user.username}</Text>
                </motion.div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                custom={0}
                style={{ marginTop: 24 }}
              >
                <AnimatePresence mode="wait">
                  {!editing ? (
                    <motion.div
                      key="edit-mode"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        block
                        onClick={() => {
                          setEditing(true);
                        }}
                      >
                        Editar Perfil
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="save-mode"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      style={{ display: "flex", flexDirection: "column", gap: "8px" }}
                    >
                      <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        block
                        loading={loading}
                        onClick={handleSave}
                      >
                        Guardar Cambios
                      </Button>
                      <Button
                        icon={<CloseOutlined />}
                        block
                        onClick={handleCancel}
                      >
                        Cancelar
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  custom={1}
                  style={{ marginTop: 8 }}
                >
                  <Button
                    block
                    danger
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </Button>
                </motion.div>
              </motion.div>
            </Col>

            {/* Información del usuario */}
            <Col xs={24} md={18}>
              <Divider>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  style={{ display: "inline-block", fontSize: 18  }}
                >
                  Información de Contacto
                </motion.span>
              </Divider>

              <Form layout="vertical" form={form}>
                <Row gutter={16}>
                  {[
                    { label: "Usuario", name: "username", icon: <MailOutlined />, value: user.username? user.username : "No proporcionado" },
                    { label: "Correo", name: "email", icon: <MailOutlined />, value: user.email ? user.email : "No proporcionado" },
                    { label: "Teléfono", name: "phone", icon: <PhoneOutlined />, value: user.phone ? user.phone : "Numero no proporcionado" },
                    {
                      label: "Documento",
                      name: "document",
                      icon: <IdcardOutlined />,
                      value: `Documento:  ${user.document ? user.document : "No proporcionado"}`,
                    },
                    // {
                    //   label: "Género",
                    //   name: "gender",
                    //   icon: <TeamOutlined />,
                    //   value: `${user.age ? user.age : 0} años `,
                    // },
                    {
                      label: "Fecha de Nacimiento",
                      name: "birth_date",
                      icon: <CalendarOutlined />,
                      value: user.birth_date ? dayjs(user.birth_date).format("DD/MM/YYYY") : "No proporcionado",
                    },
                  ].map((field, index) => (
                    <Col xs={24} md={12} key={field.name}>
                      <motion.div
                        variants={itemVariants}
                        custom={index + 2}
                        initial="hidden"
                        animate="visible"
                        whileHover={editing ? "edit" : ""}
                      >
                        {editing ? (
                          field.name === "birth_date" ? (
                            <Form.Item name="birth_date" label="Fecha de Nacimiento">
                              <DatePicker
                                format="YYYY-MM-DD"
                                style={{ width: "100%" }}
                                suffixIcon={<CalendarOutlined />}
                              />
                            </Form.Item>
                          ) : field.name === "gender" ? (
                            <Form.Item name="gender" label="Género">
                              <Select
                                options={[
                                  { value: "Masculino", label: "Masculino" },
                                  { value: "Femenino", label: "Femenino" },
                                ]}
                                suffixIcon={<TeamOutlined />}
                              />
                            </Form.Item>
                          ) : (
                            <Form.Item
                              name={field.name}
                              label={field.label}
                              rules={[{ required: true }]}
                            >
                              <Input prefix={field.icon} />
                            </Form.Item>
                          )
                        ) : (
                          <Text>
                            {field.icon}
                            <span style={{ marginLeft: 8, fontSize: 18 }}>
                              {field.name === "birth_date"
                                ? `Fecha de nacimiento: ${field.value}`
                                : field.value}
                            </span>
                          </Text>
                        )}
                      </motion.div>
                    </Col>
                  ))}
                </Row>
              </Form>
            </Col>
          </Row>
      </motion.div>
    </>
  );
}