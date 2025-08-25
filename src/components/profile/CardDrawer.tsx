import { Form, Input, Button, Checkbox } from "antd";

export default function CardDrawer() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Nueva tarjeta:", values);
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item name="numero" label="Número de tarjeta" rules={[{ required: true }]}>
        <Input placeholder="**** **** **** ****" maxLength={16} />
      </Form.Item>
      <Form.Item name="fecha" label="Fecha de expiración" rules={[{ required: true }]}>
        <Input placeholder="MM/AA" />
      </Form.Item>
      <Form.Item name="cvv" label="CVV" rules={[{ required: true }]}>
        <Input.Password placeholder="***" maxLength={4} />
      </Form.Item>
      <Form.Item name="predeterminada" valuePropName="checked">
        <Checkbox>Definir como predeterminada</Checkbox>
      </Form.Item>
      <Button type="primary" htmlType="submit" block>
        Guardar
      </Button>
    </Form>
  );
}