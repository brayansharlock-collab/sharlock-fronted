import { List, Button, Drawer } from "antd";
import { useState } from "react";
import AddressDrawer from "./AddressDrawer";

export default function AddressList() {
  const [addresses, setAddresses] = useState([
    { id: 1, direccion: "Calle 123 #45-67" },
    { id: 2, direccion: "Carrera 10 #20-30" },
  ]);
  const [open, setOpen] = useState(false);

  return (
    <>
      <List
        dataSource={addresses}
        renderItem={(item) => <List.Item>{item.direccion}</List.Item>}
      />
      <Button type="dashed" block onClick={() => setOpen(true)}>
        Agregar nueva dirección
      </Button>

      <Drawer
        title="Nueva Dirección"
        open={open}
        onClose={() => setOpen(false)}
        width={350}
      >
        <AddressDrawer />
      </Drawer>
    </>
  );
}