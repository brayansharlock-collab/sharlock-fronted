import { useEffect, useState } from "react";
import {
  List,
  Tag,
  Card,
  Collapse,
  Typography,
  Button,
  message,
  Tabs,
  Modal,
  Form,
  Input,
  type TabsProps,
  Tooltip,
} from "antd";
import { orderService } from "../../service/orderService";
import { billingService } from "../../service/billingService";
import { getDecryptedCookie, setEncryptedCookie } from "../../utils/encrypt";
import { CopyOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Panel } = Collapse;

interface Variant {
  id: number;
  size: string;
  color: string;
  media: { file: string }[];
}

interface Product {
  id: number;
  name: string;
  image_cover: string;
}

interface CartDetail {
  id: number;
  amount: number;
  variant: Variant;
  product: Product;
}

interface CouponDetail {
  name: string;
  percentage: number;
}

interface Order {
  id: number;
  fix_id: number;
  total: number;
  shopping_cart_detail: CartDetail[];
  coupon_detail?: CouponDetail;
  Guide_detail: any[];
}

interface Distributor {
  id: number;
  name: string;
  url_distributor: string;
  icono_distributor: string;
}

export default function OrderHistoryAdmin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeKey, setActiveKey] = useState("2");
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [selectedDistributor, setSelectedDistributor] = useState<number | null>(null);
  const [form] = Form.useForm();

  const user = getDecryptedCookie("data");

  const loadOrders = async (fix_id_filter?: string) => {
    setLoading(true);
    try {
      const results = await orderService.getOrderHistory(
        fix_id_filter ? { fix_id_filter } : undefined
      );
      setOrders(results);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(activeKey);
  }, [activeKey]);

  const getStatusColor = (fix_id_filter: number) => {
    switch (fix_id_filter) {
      case 1:
        return { color: "blue", text: "En proceso" };
      case 2:
        return { color: "green", text: "Aprobado" };
      case 3:
        return { color: "orange", text: "Pendiente" };
      case 4:
        return { color: "red", text: "Fallido" };
      case 5:
        return { color: "cyan", text: "Enviado" };
      default:
        return { color: "default", text: "Desconocido" };
    }
  };

  const openGuideModal = async (order: Order) => {
    setSelectedOrder(order);
    form.resetFields();
    setOpenModal(true);

    try {
      const data = await orderService.getDistributor();
      setDistributors(data);
    } catch (error) {
      console.error("Error al obtener transportadoras:", error);
    }
  };

  const handleCreateGuide = async (values: any) => {
    if (!selectedOrder) return;

    try {
      setLoading(true);
      setEncryptedCookie("receipt_id", selectedOrder.id, 1);

      const payload = {
        fix_id: 5,
        distributor_id: selectedDistributor,
        number_guide: values.tracking_number,
      };

      await billingService.updateReceiptStatus(payload);
      message.success("Guía creada correctamente ✅");

      setOpenModal(false);
      setSelectedOrder(null);
      loadOrders(activeKey);
    } catch (error: any) {
      console.error("Error al crear guía:", error);
      message.error("No se pudo generar la guía. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const items: TabsProps["items"] = [
    { key: "2", label: "Aprobado" },
    { key: "5", label: "Enviado" },
    { key: "3", label: "Pendiente" },
    { key: "4", label: "Fallidos" },
    { key: "1", label: "En proceso" },
  ];

  const onChange = (key: string) => {
    setActiveKey(key);
  };

  return (
    <div >
      <Title level={3} style={{ marginBottom: "20px" }}>
        Historial de Pedidos
      </Title>

      <Tabs defaultActiveKey={activeKey} items={items} onChange={onChange} />

      <List
        loading={loading}
        dataSource={orders}
        renderItem={(order) => {
          const status = getStatusColor(order.fix_id);
          return (
            <Card
              key={order.id}
              style={{
                marginBottom: 16,
                borderRadius: 12,
                backgroundColor: "#fff",
              }}
            >
              <List.Item>
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: 8, fontSize: 16, wordWrap: "break-word" }}>
                    Pedido #{order.id}{" "}
                    <Tag color={status.color}>{status.text}</Tag>
                  </h3>

                  <Collapse
                    ghost
                    style={{ marginTop: 8, background: "#dbd5cb62",  border: "1px solid #ab9a78ff", }}
                    expandIconPosition="end"
                  >
                    <Panel header="Ver productos" key="1">
                      {order.shopping_cart_detail?.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                            marginBottom: 8,
                            gap: 10,
                          }}
                        >
                          <img
                            src={
                              item.variant.media?.[0]?.file ||
                              item.product.image_cover
                            }
                            alt={item.product.name}
                            style={{
                              width: 60,
                              height: 60,
                              borderRadius: 8,
                              objectFit: "cover",
                            }}
                          />
                          <div style={{ flex: 1, minWidth: 200 }}>
                            <div style={{ fontWeight: 500, fontSize: 14 }}>
                              {item.product.name}
                            </div>
                            <div style={{ fontSize: 13, color: "#666" }}>
                              Talla: {item.variant.size} | Color:{" "}
                              {item.variant.color} | Cantidad: {item.amount}
                            </div>
                          </div>
                        </div>
                      ))}
                    </Panel>
                  </Collapse>

                  <p style={{ marginTop: 10, fontWeight: 500, fontSize: 15 }}>
                    Total: ${order.total.toLocaleString("es-CO")}
                  </p>

                  {order.coupon_detail && (
                    <p style={{ fontSize: 13, color: "#888" }}>
                      Cupón aplicado:{" "}
                      <strong>{order.coupon_detail.name}</strong> (
                      {order.coupon_detail.percentage}%)
                    </p>
                  )}

                  {(order.fix_id === 2 && user.role === "gia") && (
                    <Button
                      type="dashed"
                      style={{
                        marginTop: 10,
                        width: "100%",
                        maxWidth: 250,
                      }}
                      onClick={() => openGuideModal(order)}
                    >
                      Generar guía de pedido
                    </Button>
                  )}

                  {order.fix_id === 5 && order.Guide_detail?.length > 0 && (
                    <div
                      style={{
                        marginTop: 14,
                        padding: 12,
                        background: "#f1efeb",
                        border: "1px solid #ab9a78ff",
                        borderRadius: 8,
                      }}
                    >
                      <h4 style={{ marginBottom: 8, fontSize: 15 }}>📦 Detalle de guía</h4>

                      {order.Guide_detail.map((g: any) => (
                        <div
                          key={g.id}
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 8,
                            marginBottom: 8,
                            padding: "10px 12px",
                            background: "#fff",
                            borderRadius: 6,
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              flexWrap: "wrap",
                              gap: 10,
                              flex: 1,
                              minWidth: 230,
                            }}
                          >
                            <img
                              src={g.distributor.icono_distributor}
                              alt={g.distributor.name}
                              style={{
                                width: 60,
                                height: 30,
                                objectFit: "contain",
                              }}
                            />
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  flexWrap: "wrap",
                                  gap: 6,
                                }}
                              >
                                <span style={{ fontSize: 13, color: "#666" }}>
                                  N° de guía: <strong>{g.number_guide}</strong>
                                </span>
                                <Tooltip title="Copiar N° de guía">
                                  <Button
                                    size="small"
                                    type="link"
                                    onClick={() => {
                                      navigator.clipboard.writeText(g.number_guide);
                                      message.success("Número de guía copiado ✅");
                                    }}
                                    style={{
                                      padding: 0,
                                      height: "auto",
                                      color: "#7a6449",
                                    }}
                                  >
                                    <CopyOutlined />
                                  </Button>
                                </Tooltip>
                              </div>
                            </div>
                          </div>

                          <Button
                            type="link"
                            href={g.distributor.url_distributor}
                            target="_blank"
                            style={{
                              color: "#7a6449",
                              fontSize: 13,
                              fontWeight: 500,
                              padding: 0,
                            }}
                          >
                            Ver pedido →
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </List.Item>
            </Card>
          );
        }}
      />

      <Modal
        title="Generar guía de pedido"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
      >
        <p style={{ marginBottom: 16, color: "#444", fontSize: 14, lineHeight: 1.5 }}>
          <strong>Para realizar este formulario es muy sencillo:</strong> debes seleccionar primero la distribuidora y realizar todo el proceso que conlleva para poder hacerle el seguimiento.
          Cuando termines, agrega el número de guía de esa distribuidora y eso sería todo.
          Finalmente, dale a <strong>"Generar guía"</strong> y automáticamente cambiará a la pestaña de <strong>enviados</strong>.
        </p>

        <Form form={form} layout="vertical" onFinish={handleCreateGuide}>

          <Form.Item label="Transportadoras disponibles: ">
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {distributors.map((d) => {
                let pressTimer: NodeJS.Timeout;

                const handleMouseDown = () => {
                  pressTimer = setTimeout(() => {
                    form.setFieldValue("carrier", d.name);
                    form.setFieldValue("distributor_id", d.id);
                    setSelectedDistributor(d.id);
                    message.success(`Distribuidora "${d.name}" seleccionada`);
                  }, 600);
                };

                const handleMouseUp = () => {
                  clearTimeout(pressTimer);
                };

                const handleClick = () => {
                  window.open(d.url_distributor, "_blank");
                };

                const isSelected = selectedDistributor === d.id;

                return (
                  <Tooltip title="Preciona fuerte para seleccionar">
                    <Button
                      key={d.id}
                      type="default"
                      onClick={handleClick}
                      onMouseDown={handleMouseDown}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={() => clearTimeout(pressTimer)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        width: 130,
                        height: 110,
                        borderRadius: 16,
                        padding: 12,
                        boxShadow: isSelected
                          ? "0 0 12px rgba(24,144,255,0.8)" // 💙 resalta seleccionado
                          : "0 2px 6px rgba(0,0,0,0.15)",
                        border: isSelected ? "2px solid #1890ff" : "1px solid #d9d9d9",
                        transition: "all 0.3s ease",
                        backgroundColor: isSelected ? "#e6f7ff" : "#fff",
                      }}
                    >
                      <img
                        src={d.icono_distributor}
                        alt={d.name}
                        style={{
                          width: 155,
                          objectFit: "contain",
                          marginBottom: 6,
                        }}
                      />
                    </Button>
                  </Tooltip>
                );
              })}
            </div>
          </Form.Item>
          <Form.Item
            name="tracking_number"
            label="Número de guía"
            rules={[{ required: true, message: "Por favor ingresa el número de guía" }]}
          >
            <Input placeholder="Ejemplo: 12345ABC" />
          </Form.Item>

          <div style={{ textAlign: "right" }}>
            <Button onClick={() => setOpenModal(false)} style={{ marginRight: 8 }}>
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Guardar guía
            </Button>
          </div>
        </Form>
      </Modal>

    </div>
  );
}
