import { List, Typography } from "antd";
import { motion } from "framer-motion";

const { Text } = Typography;

export default function SummaryStep() {
  const items = [
    { name: "Producto A", price: "$100.000" },
    { name: "Producto B", price: "$50.000" },
  ];

  return (
    <motion.div>
      <Text strong>Detalle de la compra</Text>
      <List
        dataSource={items}
        renderItem={(item) => (
          <List.Item>
            <Text>{item.name}</Text>
            <Text>{item.price}</Text>
          </List.Item>
        )}
      />
      <Text strong>Total: $150.000</Text>
    </motion.div>
  );
}