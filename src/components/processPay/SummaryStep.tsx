// SummaryStep.tsx
import { useEffect, useState } from "react";
import { Typography, List, Card, message } from "antd";
import { cartService } from "../../service/cartService";

const { Title, Text } = Typography;

export default function SummaryStep({ checkoutData }: any) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  useEffect(() => {
    // 🔹 Leer cupón desde localStorage
    const storedCoupon = localStorage.getItem("appliedCoupon");
    if (storedCoupon) {
      try {
        setAppliedCoupon(JSON.parse(storedCoupon));
      } catch (err) {
        console.error("Error al parsear el cupón:", err);
      }
    }

    const fetchCart = async () => {
      try {
        const response = await cartService.getCart();
        const cartData = response?.data?.results || response?.data || response || [];

        const mapped = cartData.map((item: any) => {
          const rawPrice = item.product?.price?.toString() || "0";
          const cleanPrice =
            parseFloat(rawPrice.replace(/\./g, "").replace(/,/g, "")) || 0;

          return {
            id: item.id,
            name: item.product?.name || "Producto sin nombre",
            price: cleanPrice,
            image:
              item.variant?.media?.[0]?.file ||
              item.product?.image_cover ||
              "",
            quantity: item.amount || 1,
            variantName:
              [item.variant?.size, item.variant?.color]
                .filter(Boolean)
                .join(" ") || "Sin variante",
            stock: item.variant?.quantity || 0,
          };
        });

        setItems(mapped);
      } catch (err) {
        console.error("Error al cargar el carrito:", err);
        message.error("No se pudo cargar el resumen de tu compra");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Subtotal
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Descuento desde localStorage
  const discount =
    appliedCoupon?.percentage && total > 0
      ? (total * appliedCoupon.percentage) / 100
      : 0;

  const finalTotal = Math.max(total - discount, 0);

  return (
    <div>
      <Title level={4}>Resumen de tu compra</Title>

      {/* Dirección */}
      <Card size="small" style={{ marginBottom: "1rem" }}>
        <Text strong>Dirección de envío:</Text>
        <br />
        {checkoutData.selectedAddress ? (
          <>
            {checkoutData.selectedAddress.address},{" "}
            {checkoutData.selectedAddress.city?.name}
            {checkoutData.selectedAddress.department?.name &&
              `, ${checkoutData.selectedAddress.department.name}`}
          </>
        ) : (
          <Text type="danger">No seleccionada</Text>
        )}
      </Card>

      {/* Productos */}
      <Card size="small" style={{ marginBottom: "1rem", height: 300, overflowY: "auto" }}>
        <List
          loading={loading}
          dataSource={items}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.name}
                description={
                  <>
                    {item.variantName && (
                      <div>
                        <small>{item.variantName}</small>
                      </div>
                    )}
                    <div>Cantidad: {item.quantity}</div>
                  </>
                }
              />
              <div style={{ textAlign: "right" }}>
                ${item.price.toLocaleString("es-CO")} × {item.quantity} ={" "}
                {(item.price * item.quantity).toLocaleString("es-CO")}
              </div>
            </List.Item>
          )}
        />
      </Card>

      {/* Totales */}
      <Card style={{ marginTop: "1rem" }}>
        <div>
          <Text strong>Subtotal: </Text> ${total.toLocaleString("es-CO")}
        </div>
        {appliedCoupon && (
          <div>
            <Text type="success">
              Cupón aplicado ({appliedCoupon.percentage}%): -$
              {discount.toLocaleString("es-CO")}
            </Text>
          </div>
        )}
        <div>
          <Text strong>Total a pagar: </Text> $
          {finalTotal.toLocaleString("es-CO")}
        </div>
      </Card>
    </div>
  );
}
