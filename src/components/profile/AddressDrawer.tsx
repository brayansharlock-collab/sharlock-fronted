import { Form, Input, Button } from "antd";

export default function AddressDrawer() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Nueva dirección:", values);
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item name="direccion" label="Dirección" rules={[{ required: true }]}>
        <Input placeholder="Ingrese la dirección" />
      </Form.Item>
      <Button type="primary" htmlType="submit" block>
        Guardar
      </Button>
    </Form>
  );
}