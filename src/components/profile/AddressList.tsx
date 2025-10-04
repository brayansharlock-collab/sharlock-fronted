"use client";
import { useEffect, useState } from "react";
import {
  Card, Button, Row, Col, message, Modal, Form, Input, Select, Space, Tag, Typography, Popconfirm, Switch,
} from "antd";
import {
  DeleteOutlined, EditOutlined, HomeOutlined, PlusOutlined, StarFilled, StarOutlined,
} from "@ant-design/icons";
import { addressService, type Address, type AddressType, type Department } from "../../service/addressService";
import errorGif from "../../assets/ilustrations/error.gif";

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

      <div style={{ maxHeight: "65vh", overflowY: "auto" }}>
        {contextHolder}

        <Row gutter={[0, 16]}>
          {addresses.length > 0 ? (
            addresses.map((addr) => (
              <Col xs={24} key={addr.id}>
                <Card
                  extra={
                    <Space>
                      <Button icon={<EditOutlined />} onClick={() => openModal(addr)} />
                      <Popconfirm
                        title="Eliminar dirección"
                        onConfirm={() => handleDelete(addr)}
                        okButtonProps={{ danger: true }}
                      >
                        <Button danger icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </Space>
                  }
                >
                  <div style={{ display: "flex" }}>
                    <div style={{ width: 48, height: 48, borderRadius: 24, background: "#eef7f0", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                      <HomeOutlined style={{ color: "#2c8f6b", fontSize: 18 }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <Space>
                        <Tag color="#2f8f5a">
                          <StarFilled style={{ color: "#fff", marginRight: 6 }} />
                          {addr.type_of_address?.name ?? "Casa"}
                        </Tag>
                        {addr.is_principal && <Tag color="green">Principal</Tag>}
                      </Space>
                      <div style={{ marginTop: 12 }}>
                        <Text strong>{addr.address}</Text>
                        <div>
                          <Text type="secondary">
                            {addr.city?.name}, {addr.department?.name} {addr.postal_code ? `· ${addr.postal_code}` : ""}
                          </Text>
                        </div>
                        <Text>{addr.telephone_number}</Text>
                        {!addr.is_principal && (
                          <Button type="link" onClick={() => handleSetPrincipal(addr)}>
                            <StarOutlined /> Hacer principal
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))
          ) : (
            <Col xs={24}>
              <div style={{ textAlign: "center", padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                <img src={errorGif} alt="error" />
                <Title level={5}>No tienes direcciones registradas</Title>
                <Text type="secondary">Añade una dirección para recibir tus pedidos.</Text>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
                  Agregar primera dirección
                </Button>
              </div>
            </Col>
          )}
        </Row>

        <Modal
          title={editing ? "Editar Dirección" : "Nueva Dirección"}
          open={open}
          onCancel={() => setOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setOpen(false)}>Cancelar</Button>,
            <Button key="save" type="primary" onClick={handleSave}>Guardar</Button>,
          ]}
        >
          <Form form={form} layout="vertical">
            <Row gutter={12}>
              {[
                { name: "address", label: "Dirección", required: true },
                { name: "telephone_number", label: "Teléfono" },
                { name: "barrio", label: "Barrio" },
                { name: "apartment", label: "Apartamento (opcional)" },
                { name: "indications", label: "Indicaciones" },
                { name: "postal_code", label: "Código Postal" },
              ].map((f) => (
                <Col span={12} key={f.name}>
                  <Form.Item name={f.name} label={f.label} rules={f.required ? [{ required: true }] : []}>
                    <Input />
                  </Form.Item>
                </Col>
              ))}

              <Col span={12}>
                <Form.Item name="department" label="Departamento" rules={[{ required: true }]}>
                  <Select placeholder="Seleccione un departamento" onChange={handleDepartmentChange}>
                    {departments.map((d) => (
                      <Option key={d.id} value={d.id}>{d.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="city" label="Ciudad" rules={[{ required: true }]}>
                  <Select placeholder="Seleccione una ciudad">
                    {cities.map((c) => (
                      <Option key={c.id} value={c.id}>{c.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="type_of_address" label="Tipo de Dirección" rules={[{ required: true }]}>
                  <Select>
                    {addressTypes.map((t) => (
                      <Option key={t.id} value={t.id}>{t.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="is_principal" label="Quieres que sea principal?" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
      {addresses.length > 0 ? (
        <div style={{ textAlign: "left", width: "100%", marginTop: 16, }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal()}
          >
            Agregar otra dirección
          </Button>
        </div>
      ) : null}
    </>

  );
}
