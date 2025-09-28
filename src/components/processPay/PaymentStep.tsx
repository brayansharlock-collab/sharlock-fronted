"use client";

import { useState, useEffect } from "react";
import { Button, Card, Row, Col, Typography, Form, Input, Select, message } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCardOutlined, BankOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { FaCcVisa, FaCcMastercard, FaCcAmex } from "react-icons/fa";
import { mercadoPagoService } from "../../service/mercadoPagoService";

const { Title, Text } = Typography;
const { Option } = Select;

export default function PaymentStep({ setCheckoutData, onNext }: any) {
  const [method, setMethod] = useState<string | null>(null);
  const [cardType, setCardType] = useState<"visa" | "master" | "amex" | null>(null);
  const [idTypes, setIdTypes] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (method === "credit") {
      (async () => {
        try {
          await mercadoPagoService.init();
          const docs = await mercadoPagoService.getIdentificationTypes();
          setIdTypes(docs);
        } catch (err) {
          message.error("Error al cargar tipos de documento");
        }
      })();
    }
  }, [method]);

  const handleConfirmPayment = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      let paymentResult = null;

      if (method === "pse") {
        paymentResult = { status: "approved" };
      } else if (method === "credit") {
        const token = await mercadoPagoService.createCardToken({
          cardholderName: values.name,
          identificationType: values.idType,
          identificationNumber: values.idNumber,
        });

        paymentResult = await mercadoPagoService.processPayment({
          token: token.id,
          transactionAmount: 10000,
          installments: 1,
          paymentMethodId: cardType || "visa",
          payer: {
            email: values.email,
            identification: {
              type: values.idType,
              number: values.idNumber,
            },
          },
        });
      }

      if (paymentResult?.status === "approved") {
        message.success("✅ Pago aprobado");
        setCheckoutData((prev: any) => ({
          ...prev,
          paymentMethod: method,
          cardType,
          paymentApproved: true,
          paymentResult,
        }));
        onNext();
      } else {
        message.error("❌ Pago rechazado");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("❌ Error al procesar el pago");
    } finally {
      setLoading(false);
    }
  };

  const detectCardType = (value: string) => {
    const cleanValue = value.replace(/\s/g, "");
    if (/^4\d{15}$/.test(cleanValue)) return "visa";
    if (/^(5[1-5]|2[2-7])\d{14}$/.test(cleanValue)) return "master";
    if (/^3[47]\d{13}$/.test(cleanValue)) return "amex";
    return null;
  };

  const formatExpiry = (value: string) => {
    if (!value) return "";
    value = value.replace(/\D/g, "");
    if (value.length > 2) {
      return value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    return value;
  };

  return (
    <div style={{ margin: "0 auto" }}>
      {!method && (
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Title level={2}>Métodos de Pago</Title>
          <Text type="secondary">Selecciona tu método de pago preferido</Text>
        </div>
      )}

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
              <Col xs={24} md={8}>
                <Card hoverable onClick={() => setMethod("pse")}>
                  <BankOutlined style={{ fontSize: 36, color: "#7a6449" }} />
                  <Title level={4}>PSE</Title>
                  <Text>Pagos Seguros en Línea</Text>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card hoverable onClick={() => setMethod("credit")}>
                  <CreditCardOutlined style={{ fontSize: 36, color: "#7a6449" }} />
                  <Title level={4}>Tarjeta</Title>
                  <Text>Visa, Master, Amex</Text>
                </Card>
              </Col>
            </Row>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            style={{ marginTop: "2rem" }}
          >
            <Card>
              <Button type="link" onClick={() => setMethod(null)}>
                ← Volver
              </Button>

              {method === "credit" && (
                <>
                  <Title level={4}>Pagar con Tarjeta</Title>
                  <Form layout="vertical" form={form}>
                    <Form.Item label="Número de tarjeta" name="card" rules={[{ required: true }]}>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        suffix={
                          cardType === "visa" ? <FaCcVisa size={24} color="#1a1f71" />
                          : cardType === "master" ? <FaCcMastercard size={24} color="#eb001b" />
                          : cardType === "amex" ? <FaCcAmex size={24} color="#2e77bb" />
                          : <CreditCardOutlined />
                        }
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "");
                          value = value.replace(/(.{4})/g, "$1 ").trim();
                          e.target.value = value;
                          setCardType(detectCardType(value));
                        }}
                      />
                    </Form.Item>

                    <Form.Item label="Nombre en la tarjeta" name="name" rules={[{ required: true }]}>
                      <Input placeholder="Como aparece en la tarjeta" />
                    </Form.Item>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="Expiración" name="expiry" rules={[{ required: true }]} getValueFromEvent={(e) => formatExpiry(e.target.value)}>
                          <Input placeholder="MM/AA" maxLength={5} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="CVV" name="cvv" rules={[{ required: true }]}>
                          <Input.Password placeholder="123" maxLength={4} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item label="Tipo de documento" name="idType" rules={[{ required: true }]}>
                          <Select placeholder="Selecciona">
                            {idTypes.map((t) => (
                              <Option key={t.id} value={t.id}>{t.name}</Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="Número de documento" name="idNumber" rules={[{ required: true }]}>
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="Correo" name="email" rules={[{ required: true, type: "email" }]}>
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Button type="primary" block onClick={handleConfirmPayment} loading={loading}>
                      Confirmar Pago
                    </Button>
                  </Form>
                </>
              )}

              {method === "pse" && (
                <div style={{ textAlign: "center", padding: "1rem" }}>
                  <Text>Seleccionaste PSE.</Text>
                  <Button type="primary" style={{ marginTop: "1rem" }} onClick={handleConfirmPayment}>
                    Confirmar Pago con PSE
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ marginTop: "2rem", textAlign: "center", color: "gray" }}>
        <SafetyCertificateOutlined /> Transacciones 100% seguras
      </div>
    </div>
  );
}