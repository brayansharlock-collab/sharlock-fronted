import { useEffect, useState } from "react";
import { List, Tag, Card, Collapse, Typography, Button, message } from "antd";
import { mercadoPagoService } from "../../service/mercadoPagoService";
import { orderService } from "../../service/orderService";
import { setEncryptedCookie } from "../../utils/encrypt";

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
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState<number | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const results = await orderService.getOrderHistory();
        setOrders(results);
      } catch (error) {
        console.error("Error al cargar pedidos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);
  const getStatusColor = (fix_id: number) => {
    switch (fix_id) {
      case 1:
        return { color: "blue", text: "En proceso" };
      case 2:
        return { color: "green", text: "Pedido completado" };
      case 3:
        return { color: "orange", text: "Pendiente en procesar pago" };
      case 4:
        return { color: "red", text: "Fallido" };
      case 5:
        return { color: "cyan", text: "En envío" };
      default:
        return { color: "default", text: "Desconocido" };
    }
  };

  const handleProcessPayment = async (order: Order) => {
    try {
      const receiptId = order.id;
      if (receiptId) {
        setEncryptedCookie('receipt_id', receiptId, 1);
      }
      setProcessingPayment(receiptId);

      const currentPath = window.location.pathname + window.location.search;
      localStorage.setItem("lastVisitedPath", currentPath);

      const payload = {
        amount: order.total,
        title: "Compra en Sharlock",
      };

      await mercadoPagoService.startPayMercadopago(payload);
    } catch (err: any) {
      console.error("Error al procesar pago:", err);
      message.error("Error al iniciar el pago, inténtalo nuevamente.");
    } finally {
      setProcessingPayment(null);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={3} style={{ marginBottom: "20px" }}>
        Historial de Pedidos
      </Title>

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
                  <h3 style={{ marginBottom: 8 }}>
                    Pedido #{order.id}{" "}
                    <Tag color={status.color}>{status.text}</Tag>
                  </h3>

                  <Collapse
                    ghost
                    style={{ marginTop: 8, background: "#dbd5cb62" }}
                    expandIconPosition="end"
                  >
                    <Panel header="Ver productos" key="1">
                      {order.shopping_cart_detail?.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
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
                          <div>
                            <div style={{ fontWeight: 500 }}>
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

                  <p style={{ marginTop: 10, fontWeight: 500 }}>
                    Total: ${order.total.toLocaleString("es-CO")}
                  </p>

                  {order.coupon_detail && (
                    <p style={{ fontSize: 13, color: "#888" }}>
                      Cupón aplicado:{" "}
                      <strong>{order.coupon_detail.name}</strong> (
                      {order.coupon_detail.percentage}%)
                    </p>
                  )}

                  {(order.fix_id === 1 || order.fix_id === 4) && (
                    <Button
                      type="primary"
                      style={{
                        marginTop: 10,
                      }}
                      loading={processingPayment === order.id}
                      onClick={() => handleProcessPayment(order)}
                    >
                      {order.fix_id === 4
                        ? "Reintentar pago"
                        : "Procesar pago"}
                    </Button>
                  )}
                </div>
              </List.Item>
            </Card>
          );
        }}
      />
    </div>
  );
}
