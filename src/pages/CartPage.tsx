import { useState } from "react";
import { Col, Row } from "antd";
import type { CartItem } from "../components/cart/types";
import { CartList } from "../components/cart/CartList";
import { CartSummary } from "../components/cart/CartSummary";
import { motion } from "framer-motion";
import Silk from "../components/animations/Silk";

export default function CartPage() {
    const [items, setItems] = useState<CartItem[]>([
        {
            id: 1,
            name: "Camiseta Oversize",
            price: 89990,
            image:
                "https://cuerosvelezco.vtexassets.com/arquivos/ids/295085/1039855-31-01-Camisa-de-cuero.jpg",
            quantity: 1,
        },
        {
            id: 2,
            name: "Top de cuero",
            price: 129990,
            image:
                "https://cuerosvelezco.vtexassets.com/arquivos/ids/293999/1039854-20-06-Top-de-cuero.jpg",
            quantity: 2,
        },
    ]);

    const [coupon, setCoupon] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

    const updateQty = (id: number, qty: number | null) => {
        if (!qty || qty < 1) return;
        setItems((prev) =>
            prev.map((it) => (it.id === id ? { ...it, quantity: qty } : it))
        );
    };

    const removeItem = (id: number) => {
        setItems((prev) => prev.filter((it) => it.id !== id));
    };

    const clearCart = () => {
        setItems([]);
        setAppliedCoupon(null);
        setCoupon("");
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
                <Silk speed={10} scale={1} color="#e6e1d7" noiseIntensity={1.5} rotation={0} />
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
