"use client";

import { useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Button,
  Select,
} from "antd";
import { motion, AnimatePresence } from "framer-motion";

// icons 
import {
  CreditCardOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { FaCcVisa, FaCcMastercard, FaCcAmex } from "react-icons/fa";

const { Title, Text } = Typography;
const { Option } = Select;

export default function PaymentMethods() {
  const [method, setMethod] = useState<string | null>(null);
  const [cardType, setCardType] = useState<"visa" | "master" | "amex" | null>(
    null
  );

  const paymentOptions = [
    {
      id: "pse",
      title: "PSE",
      subtitle: "Pagos Seguros en Línea",
      icon: <BankOutlined style={{ fontSize: 36, color: "#7a6449" }} />,
      description: "Paga directamente desde tu banco",
    },
    {
      id: "credit",
      title: "Tarjeta de Crédito o Debito",
      subtitle: "Visa, Mastercard, American Express",
      icon: <CreditCardOutlined style={{ fontSize: 36, color: "#7a6449" }} />,
      description: "Pago seguro con tu tarjeta",
    },
  ];

  const formatExpiry = (value: string) => {
    if (!value) return "";
    // Elimina todo lo que no sea número
    value = value.replace(/\D/g, "");
    // Inserta "/" después de los primeros 2 dígitos
    if (value.length > 2) {
      return value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    return value;
  };

  const detectCardType = (value: string) => {
    const cleanValue = value.replace(/\s/g, "");
    if (/^4\d{15}$/.test(cleanValue)) return "visa";
    if (
      /^(5[1-5]\d{14}|2(2[2-9]\d{12}|[3-6]\d{13}|7([01]\d{12}|20\d{12})))$/.test(
        cleanValue
      )
    )
      return "master";
    if (/^3[47]\d{13}$/.test(cleanValue)) return "amex";

    return null;
  };

  const validateCardNumber = (_: any, value: string) => {
    if (!value) return Promise.reject("Ingresa el número de tarjeta");
    const cleanValue = value.replace(/\s/g, "");
    if (/^4\d{15}$/.test(cleanValue)) return Promise.resolve();
    if (
      /^(5[1-5]\d{14}|2(2[2-9]\d{12}|[3-6]\d{13}|7([01]\d{12}|20\d{12})))$/.test(
        cleanValue
      )
    )
      return Promise.resolve();
    if (/^3[47]\d{13}$/.test(cleanValue)) return Promise.resolve();
    return Promise.reject("Número de tarjeta inválido");
  };

  const validateCVV = (_: any, value: string) => {
    if (!value) return Promise.reject("Ingresa el CVV");
    if (!/^\d{3,4}$/.test(value)) return Promise.reject("El CVV debe ser numérico (3 o 4 dígitos)");
    return Promise.resolve();
  };

  return (
    <div style={{ margin: "0 auto", }}>
      {/* Header */}
      {!method && (
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Title level={2}>Métodos de Pago</Title>
          <Text type="secondary">Selecciona tu método de pago preferido</Text>
        </div>
      )}

      {/* Contenido con transición suave */}
      <AnimatePresence mode="wait">
        {!method ? (
          <motion.div
            key="options"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <Row gutter={16}>
              {paymentOptions.map((option) => (
                <Col xs={24} md={8} key={option.id}>
                  <Card
                    hoverable
                    onClick={() => setMethod(option.id)}
                    style={{
                      textAlign: "center",
                      border: "1px solid #f0f0f0",
                      borderRadius: 12,
                      transition: "0.3s",
                    }}
                  >
                    <div style={{ marginBottom: "1rem" }}>
                      {option.icon}
                    </div>
                    <Title level={4}>{option.title}</Title>
                    <Text strong>{option.subtitle}</Text>
                    <p style={{ color: "gray" }}>{option.description}</p>
                  </Card>
                </Col>
              ))}
            </Row>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            style={{ marginTop: "2rem" }}
          >
            <Card style={{ borderRadius: 12 }}>
              <Button
                type="link"
                onClick={() => setMethod(null)}
                style={{ marginBottom: "1rem" }}
              >
                ← Volver a métodos de pago
              </Button>

              {method === "pse" && (
                <>
                  <Title level={4}>Pagar con PSE</Title>
                  <Form layout="vertical">
                    <Form.Item
                      label="Banco"
                      name="bank"
                      rules={[{ required: true, message: "Selecciona tu banco" }]}
                    >
                      <Select placeholder="Selecciona tu banco">
                        <Option value="bancolombia">Bancolombia</Option>
                        <Option value="davivienda">Davivienda</Option>
                        <Option value="bbva">BBVA</Option>
                        <Option value="bogota">Banco de Bogotá</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="Número de documento"
                      name="doc"
                      rules={[{ required: true, message: "Ingresa tu documento" }]}
                    >
                      <Input placeholder="Cédula/NIT" />
                    </Form.Item>
                    <Button type="primary" block size="large">
                      Continuar con PSE
                    </Button>
                  </Form>
                </>
              )}

              {method === "credit" && (
                <>
                  <Title level={4}>Pagar con Tarjeta de Crédito</Title>
                  <Form layout="vertical">
                    <Form.Item
                      label="Número de tarjeta"
                      name="card"
                      rules={[{ validator: validateCardNumber }]}
                    >
                      <Input
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        suffix={
                          cardType === "visa" ? (
                            <FaCcVisa size={24} color="#1a1f71" />
                          ) : cardType === "master" ? (
                            <FaCcMastercard size={24} color="#eb001b" />
                          ) : cardType === "amex" ? (
                            <FaCcAmex size={24} color="#2e77bb" />
                          ) : (
                            <CreditCardOutlined />
                          )
                        }
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "");
                          value = value.replace(/(.{4})/g, "$1 ").trim();
                          e.target.value = value;

                          setCardType(detectCardType(value));
                        }}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Nombre en la tarjeta"
                      name="name"
                      rules={[{ required: true, message: "Ingresa el nombre" }]}
                    >
                      <Input placeholder="Como aparece en la tarjeta" />
                    </Form.Item>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Fecha de expiración"
                          name="expiry"
                          rules={[
                            { required: true, message: "Ingresa la fecha (MM/AA)" },
                            {
                              validator: (_, value) => {
                                if (!value) return Promise.resolve();
                                const [month, year] = value.split("/");
                                if (!month || !year) {
                                  return Promise.reject("Formato inválido");
                                }
                                const m = parseInt(month, 10);
                                if (isNaN(m) || m < 1 || m > 12) {
                                  return Promise.reject("Mes inválido");
                                }
                                return Promise.resolve();
                              },
                            },
                          ]}
                          getValueFromEvent={(e) => formatExpiry(e.target.value)}
                        >
                          <Input placeholder="MM/AA" maxLength={5} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="CVV"
                          name="cvv"
                          rules={[{ validator: validateCVV }]}
                        >
                          <Input.Password placeholder="123" maxLength={4} />
                        </Form.Item>
                      </Col>
                    </Row>
                 
                  </Form>
                </>
              )}

            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer seguridad */}
      <div
        style={{
          marginTop: "2rem",
          textAlign: "center",
          color: "gray",
          fontSize: "0.9rem",
        }}
      >
        <SafetyCertificateOutlined style={{ marginRight: 8 }} />
        Transacciones 100% seguras y encriptadas
      </div>
    </div>
  );
}
