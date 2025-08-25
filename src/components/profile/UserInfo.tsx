import { Descriptions, Button } from "antd";
import { useState } from "react";

export default function UserInfo() {
  const [user] = useState({
    nombre: "Juan Pérez",
    email: "juan@example.com",
    telefono: "3001234567",
  });

  return (
    <>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Nombre">{user.nombre}</Descriptions.Item>
        <Descriptions.Item label="Correo">{user.email}</Descriptions.Item>
        <Descriptions.Item label="Teléfono">{user.telefono}</Descriptions.Item>
      </Descriptions>
      <Button style={{ marginTop: "1rem" }} type="primary" block>
        Editar datos
      </Button>
    </>
  );
}