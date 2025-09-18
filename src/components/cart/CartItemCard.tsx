import { Button, InputNumber, Popconfirm, Row, Col, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import type { CartItem } from "./types";
import { COP } from "../common/Currency";

const { Text } = Typography;

type Props = {
  item: CartItem;
  updateQty: (id: number, qty: number | null) => void;
  removeItem: (id: number) => void;
};

export function CartItemCard({ item, updateQty, removeItem }: Props) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      }}
    >
      <Row justify="space-between" align="middle" gutter={16}>
        <Col flex="auto">
          <Text strong>{item.name}</Text>
          <Text strong>{item.image_cover}</Text>
          
          <div style={{ fontSize: 12, color: "#6b7280" }}>
            {item.variantName} • Stock: {item.stock}
          </div>
          <Text>{COP.format(item.price)}</Text>
        </Col>

        <Col>
          <InputNumber
            min={1}
            max={item.stock}
            value={item.quantity}
            onChange={(val) => updateQty(item.id, val)}
            style={{ width: 80, marginRight: 8 }}
          />
          <Popconfirm
            title="¿Eliminar este producto del carrito?"
            okText="Sí"
            cancelText="No"
            onConfirm={() => removeItem(item.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Col>
      </Row>
    </motion.div>
  );
}
