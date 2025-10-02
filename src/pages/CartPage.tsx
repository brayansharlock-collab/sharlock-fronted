// pages/CartPage.tsx
import { useEffect, useState } from "react";
import { Col, Row, message } from "antd";
import type { CartItem } from "../components/cart/types";
import { CartList } from "../components/cart/CartList";
import { CartSummary } from "../components/cart/CartSummary";
import { motion } from "framer-motion";
import Silk from "../components/animations/Silk";
import { cartService } from "../service/cartService";
import { getDecryptedCookie, removeCookie } from "../utils/encrypt";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    id: number;
    percentage: number;
  } | null>(null);

  const fetchCart = async () => {
    try {
      const data = await cartService.getCart();
      const mapped: CartItem[] = data?.data?.results.map((r: any) => ({
        id: r.id,
        name: r.product.name,
        price: parseFloat(r.product.price.replace(/\./g, "")),
        image: r.variant?.media?.[0]?.file || r.product.image_cover,
        quantity: r.amount,
        variantName: `${r.variant?.size || ""} ${r.variant?.color || ""}`,
        stock: r.variant?.quantity || 0,
        product_id: r.product.id,
        variant_id: r.variant?.id || 0,
      }));

      setItems(mapped);

      if (mapped.length <= 0) {
        removeCookie("appliedCo");
        setAppliedCoupon(null);
        setCoupon("");
      } else {
        const storedCoupon = getDecryptedCookie("appliedCo");
        if (storedCoupon) {
          setAppliedCoupon(storedCoupon);
          setCoupon(storedCoupon.code || "");
        }
      }
    } catch (err) {
      message.error("Error al cargar el carrito");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQty = async (id: number, qty: number | null) => {
    if (!qty || qty < 1) return;

    const item = items.find((it) => it.id === id);
    if (!item) return;

    try {
      await cartService.updateCart(id, {
        amount: qty,
        product_id: item.product_id,
        variant_id: item.variant_id,
        is_active: true,
      });

      await fetchCart();
      message.success("Cantidad actualizada");
    } catch {
      message.error("No se pudo actualizar la cantidad");
    }
  };

  const removeItem = async (id: number) => {
    try {
      await cartService.removeItem(id);
      setItems((prev) => prev.filter((it) => it.id !== id));
      message.success("Producto eliminado");
    } catch {
      message.error("No se pudo eliminar el producto");
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setItems([]);
      setAppliedCoupon(null);
      setCoupon("");
      removeCookie("appliedCo");
      message.success("Carrito vacío");
    } catch {
      message.error("No se pudo vaciar el carrito");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
        style={{
          position: "fixed",
          width: "100%",
          height: "100vh",
          zIndex: -1,
        }}
      >
        <Silk
          speed={10}
          scale={1}
          color="#e6e1d7"
          noiseIntensity={1.5}
          rotation={0}
        />
      </motion.div>

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "24px",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} md={14} lg={16}>
            <CartList
              items={items}
              updateQty={updateQty}
              removeItem={removeItem}
              clearCart={clearCart}
            />
          </Col>

          <Col xs={24} md={10} lg={8}>
            <CartSummary
              items={items}
              coupon={coupon}
              setCoupon={setCoupon}
              appliedCoupon={appliedCoupon}
              setAppliedCoupon={setAppliedCoupon}
            />
          </Col>
        </Row>
      </div>
    </>
  );
}
