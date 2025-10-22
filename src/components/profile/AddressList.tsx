"use client";

import { useEffect, useState } from "react";
import {
  Card, Button, Row, Col, message, Modal, Form, Input, Select, Space, Tag, Typography, Popconfirm, Switch, Empty
} from "antd";
import {
  DeleteOutlined, EditOutlined, HomeOutlined, PlusOutlined, StarFilled, StarOutlined
} from "@ant-design/icons";
import { motion } from "framer-motion";
import {
  addressService, type Address, type AddressType, type Department
} from "../../service/addressService";
import boo from "../../assets/ilustrations/error.gif";

const { Option } = Select;
const { Text, Title } = Typography;

export default function AddressList() {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editing, setEditing] = useState<Address | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [cities, setCities] = useState<Department["city"]>([]);
  const [addressTypes, setAddressTypes] = useState<AddressType[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchAddresses();
    (async () => {
      setDepartments(await addressService.getDepartments());
      setAddressTypes(await addressService.getAddressTypes());
    })();
  }, []);

  const fetchAddresses = async () => {
    try {
      setAddresses(await addressService.getAll());
    } catch {
      messageApi.error("Error al cargar las direcciones");
    }
  };

  const handleDepartmentChange = (depId: number) => {
    const dep = departments.find((d) => d.id === depId);
    setCities(dep?.city || []);
    form.setFieldsValue({ city: undefined });
  };

  const handleDelete = async (addr: Address) => {
    try {
      await addressService.delete(addr.id);
      setAddresses((prev) => prev.filter((a) => a.id !== addr.id));
      messageApi.success("Eliminada con éxito");
    } catch {
      messageApi.error("No pudimos eliminarla");
    }
  };

  const handleSetPrincipal = async (addr: Address) => {
    try {
      await addressService.update(addr.id, { is_principal: true });
      messageApi.success("Dirección marcada como principal");
      fetchAddresses();
    } catch {
      messageApi.error("Error al marcar como principal");
    }
  };

  const openModal = (addr?: Address) => {
    setEditing(addr || null);
    setOpen(true);
    addr
      ? form.setFieldsValue({
        ...addr,
        department: addr.department?.id,
        city: addr.city?.id,
        type_of_address: addr.type_of_address?.id,
      })
      : form.resetFields();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = { ...values };

      messageApi.open({ type: "loading", content: "Guardando...", key: "save" });
      if (editing) {
        await addressService.update(editing.id, payload);
      } else {
        await addressService.create(payload);
      }
      messageApi.success({ content: "Dirección guardada", key: "save" });
      setOpen(false);
      fetchAddresses();
    } catch {
      messageApi.error({ content: "Error al guardar", key: "save" });
    }
  };

  return (
    <>
      {contextHolder}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>Mis direcciones</Title>
        {addresses.length > 0 ? (
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
            Agregar dirección
          </Button>
        ) : null}
      </div>

      {addresses.length > 0 ? (
        <Row gutter={[16, 16]}>
          {addresses.map((addr) => (
            <Col xs={24} sm={12} lg={8} key={addr.id}>
              <motion.div whileHover={{ scale: 1.02 }}>
                <Card
                  style={{
                    borderRadius: 16,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                  }}
                  actions={[
                    <EditOutlined key="edit" onClick={() => openModal(addr)} />,
                    <Popconfirm
                      title="¿Eliminar esta dirección?"
                      onConfirm={() => handleDelete(addr)}
                      okButtonProps={{ danger: true }}
                    >
                      <DeleteOutlined key="delete" />
                    </Popconfirm>,
                  ]}
                >
                  <Space align="start">
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #ffffffff, #d4cabeff, #7a6449)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: 22,
                      }}
                    >
                      <HomeOutlined />
                    </div>

                    <div style={{ flex: 1 }}>
                      <Space wrap>
                        <Tag color="#7a644983">
                          <StarFilled style={{ marginRight: 6 }} />
                          {addr.type_of_address?.name ?? "Casa"}
                        </Tag>
                        {addr.is_principal && <Tag color="green">Principal</Tag>}
                      </Space>

                      <div style={{ marginTop: 8 }}>
                        <Text strong>{addr.address}</Text>
                        <div>
                          <Text type="secondary">
                            {addr.city?.name}, {addr.department?.name}
                            {addr.postal_code && ` · ${addr.postal_code}`}
                          </Text>
                        </div>
                        <Text>{addr.telephone_number}</Text>
                        {!addr.is_principal && (
                          <Button
                            style={{ border: "#7a6449", boxShadow: "none" }}
                            size="small"
                            onClick={() => handleSetPrincipal(addr)}
                            icon={<StarOutlined />}
                          >
                            Hacer principal
                          </Button>
                        )}
                      </div>
                    </div>
                  </Space>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty
          image={<img src={boo} alt="empty" style={{ height: 160, margin: "0 auto" }} />}
          style={{ padding: "48px 24px", textAlign: "center" }}
          description={
            <>
              <Title level={5} style={{ marginTop: 30 }}>Mmm... no veo nada por acá ¿quieres agregar una dirección?</Title>
              <Text type="secondary">Agrega una dirección para recibir tus pedidos.</Text>
            </>
          }
        >
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
            Agregar primera dirección
          </Button>
        </Empty>

      )}

      <Modal
        title={editing ? "Editar Dirección" : "Nueva Dirección"}
        open={open}
        onCancel={() => setOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setOpen(false)}>
            Cancelar
          </Button>,
          <Button key="save" type="primary" onClick={handleSave}>
            Guardar
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Row gutter={12}>
            {/* Campos de texto básicos */}
            {[
              { name: "address", label: "Dirección", required: true },
              { name: "telephone_number", label: "Teléfono" },
              { name: "barrio", label: "Barrio" },
              { name: "apartment", label: "Apartamento (opcional)" },
              { name: "indications", label: "Indicaciones" },
              { name: "postal_code", label: "Código Postal" },
            ].map((f) => (
              <Col span={12} key={f.name}>
                <Form.Item
                  name={f.name}
                  label={f.label}
                  rules={f.required ? [{ required: true, message: `Ingrese ${f.label}` }] : []}
                >
                  <Input />
                </Form.Item>
              </Col>
            ))}

            {/* Departamento */}
            <Col span={12}>
              <Form.Item
                name="department"
                label="Departamento"
                rules={[{ required: true, message: "Seleccione un departamento" }]}
              >
                <Select
                  placeholder="Seleccione un departamento"
                  onChange={handleDepartmentChange}
                >
                  {departments.map((d) => (
                    <Option key={d.id} value={d.id}>
                      {d.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Ciudad */}
            <Col span={12}>
              <Form.Item
                name="city"
                label="Ciudad"
                rules={[{ required: true, message: "Seleccione una ciudad" }]}
              >
                <Select placeholder="Seleccione una ciudad">
                  {cities.map((c) => (
                    <Option key={c.id} value={c.id}>
                      {c.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Tipo de dirección */}
            <Col span={12}>
              <Form.Item
                name="type_of_address"
                label="Tipo de Dirección"
                rules={[{ required: true, message: "Seleccione el tipo de dirección" }]}
              >
                <Select placeholder="Seleccione un tipo">
                  {addressTypes.map((t) => (
                    <Option key={t.id} value={t.id}>
                      {t.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Dirección principal */}
            <Col span={12}>
              <Form.Item
                name="is_principal"
                label="¿Quieres que sea principal?"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

    </>
  );
}
