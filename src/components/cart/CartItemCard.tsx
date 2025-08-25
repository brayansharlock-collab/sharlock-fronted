import { Button, InputNumber, List, Popconfirm, Tag, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

import { COP } from "../common/Currency";
import type { CartItem } from "./types";

const { Text } = Typography;

const qtyVariants = {
  tap: { scale: 0.96 },
  hover: { scale: 1.02 },
};

type Props = {
  item: CartItem;
  updateQty: (id: number, qty: number | null) => void;
  removeItem: (id: number) => void;
};

export function CartItemCard({ item, updateQty, removeItem }: Props) {
  return (
    <motion.div
      key={item.id}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      style={{
        borderBottom: "1px solid #f0f0f0",
        padding: "16px 0",
      }}
    >
      <List.Item
        style={{
          flexDirection: "column", // stack en mobile
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        {/* Imagen + datos */}
        <div style={{ display: "flex", gap: 12, width: "100%" }}>
          <motion.img
            layoutId={`img-${item.id}`}
            src={item.image}
            alt={item.name}
            style={{
              width: 80,
              height: 80,
              objectFit: "cover",
              borderRadius: 8,
              flexShrink: 0,
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
          />

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                alignItems: "center",
              }}
            >
              <Text strong>{item.name}</Text>
              <Tag color="blue">Unitario: {COP.format(item.price)}</Tag>
            </div>
            <Text type="secondary">
              Total item:{" "}
              <strong>{COP.format(item.price * item.quantity)}</strong>
            </Text>
          </div>
        </div>

        {/* Acciones (debajo en mobile, a la derecha en desktop) */}
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Text type="secondary">Cant.</Text>
            <motion.div whileTap="tap" whileHover="hover" variants={qtyVariants}>
              <InputNumber
                min={1}
                value={item.quantity}
                onChange={(v) => updateQty(item.id, v)}
                style={{ width: 90 }}
              />
            </motion.div>
          </div>

          <Popconfirm
            title="¿Eliminar este producto del carrito?"
            okText="Sí"
            cancelText="No"
            onConfirm={() => removeItem(item.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      </List.Item>
    </motion.div>
  );
}
