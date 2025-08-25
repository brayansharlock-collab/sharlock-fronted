import { List, Button, Popconfirm } from "antd";
import { useState } from "react";

export default function OrderHistory() {
  const [orders, setOrders] = useState([
    { id: 1, producto: "Zapatos Nike", fecha: "2025-01-10" },
    { id: 2, producto: "Camisa Adidas", fecha: "2025-01-20" },
  ]);

  const handleDelete = (id: number) => {
    setOrders(orders.filter((o) => o.id !== id));
  };

  return (
    <List
      dataSource={orders}
      renderItem={(item) => (
        <List.Item
          actions={[
            <Popconfirm
              title="¿Eliminar este pedido?"
              onConfirm={() => handleDelete(item.id)}
              okText="Sí"
              cancelText="No"
            >
              <Button danger>Eliminar</Button>
            </Popconfirm>,
          ]}
        >
          {item.producto} - {item.fecha}
        </List.Item>
      )}
    />
  );
}