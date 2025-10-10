// components/processPay/AddressFormModal.tsx
import { Modal, Form, Input, Select, Row, Col, Switch, Button, message } from "antd";
import { useState, useEffect } from "react";
import { addressService } from "../../service/addressService";

const { Option } = Select;

interface City {
  id: number;
  name: string;
}

interface Department {
  id: number;
  name: string;
  city: City[];
}

interface AddressType {
  id: number;
  name: string;
}

interface AddressFormModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function AddressFormModal({ open, onClose, onSaved }: AddressFormModalProps) {
  const [form] = Form.useForm();

  // ✅ Tipos explícitos
  const [departments, setDepartments] = useState<Department[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [addressTypes, setAddressTypes] = useState<AddressType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      loadOptions();
    }
  }, [open]);

  const loadOptions = async () => {
    try {
      const [deps, types] = await Promise.all([
        addressService.getDepartments(),
        addressService.getAddressTypes(),
      ]);

      setDepartments(deps as Department[]);
      setAddressTypes(types as AddressType[]);
    } catch (err) {
      message.error("Error al cargar opciones");
    }
  };

  const handleDepartmentChange = (depId: number) => {
    const dep = departments.find((d) => d.id === depId);
    setCities(dep?.city || []);
    form.setFieldsValue({ city: undefined });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await addressService.create(values); // o update si es edición
      message.success("Dirección guardada");
      onSaved();
      form.resetFields();
    } catch (err) {
      message.error("Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Nueva Dirección"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancelar
        </Button>,
        <Button key="save" type="primary" loading={loading} onClick={handleSave}>
          Guardar
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Row gutter={12}>
          {[
            { name: "address", label: "Dirección", required: true },
            { name: "telephone_number", label: "Teléfono" },
            { name: "barrio", label: "Barrio" },
            { name: "apartment", label: "Apartamento (opcional)" },
            { name: "indications", label: "Indicaciones" },
            { name: "postal_code", label: "Código Postal" },
          ].map((f) => (
            <Col span={12} key={f.name}>
              <Form.Item
                name={f.name}
                label={f.label}
                rules={f.required ? [{ required: true, message: `Ingrese ${f.label.toLowerCase()}` }] : []}
              >
                <Input />
              </Form.Item>
            </Col>
          ))}

          <Col span={12}>
            <Form.Item name="department" label="Departamento" rules={[{ required: true }]}>
              <Select placeholder="Seleccione" onChange={handleDepartmentChange}>
                {departments.map((d) => (
                  <Option key={d.id} value={d.id}>
                    {d.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="city" label="Ciudad" rules={[{ required: true }]}>
              <Select placeholder="Seleccione">
                {cities.map((c) => (
                  <Option key={c.id} value={c.id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="type_of_address" label="Tipo de Dirección" rules={[{ required: true }]}>
              <Select>
                {addressTypes.map((t) => (
                  <Option key={t.id} value={t.id}>
                    {t.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="is_principal" label="¿Principal?" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
