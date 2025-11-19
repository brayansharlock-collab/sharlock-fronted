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
      title={
        <div style={{
          fontSize: 20,
          fontWeight: 700,
          paddingBottom: 10,
          borderBottom: "1px solid #f0f0f0"
        }}>
          Nueva Dirección
        </div>
      }
      open={open}
      onCancel={onClose}
      centered
      width={720}
      style={{
        borderRadius: 12,
      }}
      bodyStyle={{
        padding: "24px 28px",
        background: "linear-gradient(to bottom right, #ffffff, #f8fafc)",
        borderRadius: 12,
      }}
      footer={
        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 12,
          padding: "16px 20px",
          borderTop: "1px solid #f0f0f0",
          background: "#fafafa",
          borderRadius: "0 0 12px 12px"
        }}>
          <Button onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="primary"
            loading={loading}
            onClick={handleSave}
            style={{ padding: "6px 18px" }}
          >
            Guardar
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        style={{
          marginTop: 6
        }}
      >
        <Row gutter={[18, 14]}>
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
                label={<span style={{ fontWeight: 600 }}>{f.label}</span>}
                rules={
                  f.required
                    ? [{ required: true, message: `Ingrese ${f.label.toLowerCase()}` }]
                    : []
                }
              >
                <Input
                  placeholder={`Escribe ${f.label.toLowerCase()}`}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 8
                  }}
                />
              </Form.Item>
            </Col>
          ))}

          {/* Departamento */}
          <Col span={12}>
            <Form.Item
              name="department"
              label={<span style={{ fontWeight: 600 }}>Departamento</span>}
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Seleccione un departamento"
                onChange={handleDepartmentChange}
                style={{ borderRadius: 8 }}
              >
                {departments.map((d) => (
                  <Option key={d.id} value={d.id}>
                    {d.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Ciudad */}
          <Col span={12}>
            <Form.Item
              name="city"
              label={<span style={{ fontWeight: 600 }}>Ciudad</span>}
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Seleccione una ciudad"
                style={{ borderRadius: 8 }}
              >
                {cities.map((c) => (
                  <Option key={c.id} value={c.id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Tipo de dirección */}
          <Col span={12}>
            <Form.Item
              name="type_of_address"
              label={<span style={{ fontWeight: 600 }}>Tipo de Dirección</span>}
              rules={[{ required: true }]}
            >
              <Select style={{ borderRadius: 8 }}>
                {addressTypes.map((t) => (
                  <Option key={t.id} value={t.id}>
                    {t.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Switch principal */}
          <Col span={12}>
            <Form.Item
              name="is_principal"
              label={<span style={{ fontWeight: 600 }}>¿Principal?</span>}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
