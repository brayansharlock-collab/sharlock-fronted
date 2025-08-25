import { Button, List, Typography } from "antd";
import { motion } from "framer-motion";

const { Text } = Typography;

export default function AddressStep() {
  const addresses = [
    "Calle 123 #45 - 67, Bogotá",
    "Carrera 10 #20 - 30, Medellín",
  ];

  return (
    <motion.div>
      <List
        header={<Text strong>Selecciona tu dirección de envío</Text>}
        bordered
        dataSource={addresses}
        renderItem={(item) => (
          <List.Item style={{ cursor: "pointer" }}>{item}</List.Item>
        )}
      />
      <Button type="link" style={{ marginTop: "1rem" }}>
        + Agregar nueva dirección
      </Button>
    </motion.div>
  );
}