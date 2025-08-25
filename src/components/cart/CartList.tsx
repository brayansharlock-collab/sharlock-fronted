"use client";

import { Button, Card, Divider, Empty, List, Popconfirm } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { AnimatePresence } from "framer-motion";

import { CartItemCard } from "./CartItemCard";
import type { CartItem } from "./types";

type Props = {
    items: CartItem[];
    updateQty: (id: number, qty: number | null) => void;
    removeItem: (id: number) => void;
    clearCart: () => void;
};

export function CartList({ items, updateQty, removeItem, clearCart }: Props) {
    return (
        <Card
            title={
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <ShoppingCartOutlined />
                    Tu carrito
                </span>
            }
            style={{ borderRadius: 12 }}
        >
            {items.length === 0 ? (
                <Empty
                    description="Tu carrito está vacío"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            ) : (
                <List
                    itemLayout="horizontal"
                    dataSource={items}
                    style={{
                        maxHeight: "50vh", // 50% de la altura de la pantalla
                        overflowY: "auto",
                    }}
                    renderItem={(item) => (
                        <AnimatePresence mode="popLayout">
                            <CartItemCard
                                key={item.id}
                                item={item}
                                updateQty={updateQty}
                                removeItem={removeItem}
                            />
                        </AnimatePresence>
                    )}
                />
            )}
            {items.length > 0 && (
                <>
                    <Divider />
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Popconfirm
                            title="¿Esta acción vaciará tu carrito?"
                            okText="Sí"
                            cancelText="No"
                            onConfirm={clearCart}
                        >
                            <Button danger>Vaciar carrito</Button>
                        </Popconfirm>
                    </div>
                </>
            )}
        </Card>
    );
}