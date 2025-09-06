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

import errorGif from "../../assets/ilustrations/error.gif";


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
                <div style={{ textAlign: "center", padding: "48px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                    <Empty
                        imageStyle={{
                            height: 160,
                            marginBottom: 16,
                            opacity: 0.9,
                        }}
                        description={
                            <span style={{ fontSize: '16px', color: '#1f2937', fontWeight: 500 }}>
                                Tu carrito está vacío
                            </span>
                        }
                        image={errorGif}
                    />
                </div>
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