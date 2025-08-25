import { List, Button, Drawer, Tag } from "antd";
import { useState } from "react";
import CardDrawer from "./CardDrawer";

export default function CardList() {
  const [cards] = useState([
    { id: 1, numero: "**** **** **** 1234", predeterminada: true },
    { id: 2, numero: "**** **** **** 5678", predeterminada: false },
  ]);
  const [open, setOpen] = useState(false);

  return (
    <>
      <List
        dataSource={cards}
        renderItem={(item) => (
          <List.Item>
            {item.numero} {item.predeterminada && <Tag color="green">Default</Tag>}
          </List.Item>
        )}
      />
      <Button type="dashed" block onClick={() => setOpen(true)}>
        Agregar nueva tarjeta
      </Button>

      <Drawer
        title="Nueva Tarjeta"
        open={open}
        onClose={() => setOpen(false)}
        width={350}
      >
        <CardDrawer />
      </Drawer>
    </>
  );
}