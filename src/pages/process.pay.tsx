import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Steps, Button, Row, Col } from "antd";
import { motion, AnimatePresence } from "framer-motion";

import AddressStep from "../components/processPay/AddressStep";
import SummaryStep from "../components/processPay/SummaryStep";
import Silk from "../components/animations/Silk";
import { mercadoPagoService } from "../service/mercadoPagoService";
import { getDecryptedCookie } from "../utils/encrypt";
import SharlockLogo from "../components/ui/SharlockLogo";

const { Step } = Steps;

export default function ProcessPay() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);

  const [checkoutData, setCheckoutData] = useState({
    selectedAddress: null as string | null,
    paymentMethod: null as string | null,
    cardToken: null as string | null,
    paymentApproved: false,
  });

  useEffect(() => {
    localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
  }, [checkoutData]);

  useEffect(() => {
    const saved = localStorage.getItem("checkoutData");
    if (saved) {
      try {
        setCheckoutData(JSON.parse(saved));
      } catch (e) {
        console.warn("Error al cargar checkoutData de localStorage");
      }
    }
  }, []);

  const next = () => setCurrent((prev) => prev + 1);
  const prev = () => setCurrent((prev) => prev - 1);

  const pay = async () => {
    setLoading(true);
    const total = getDecryptedCookie("checkout_total");
    if (!total) {
      console.error("No se encontró el total en cookies");
      return;
    }
    let payload = {
      amount: total,
      title: "Compra en sharklock",
    };

    await mercadoPagoService.startPayMercadopago(payload);
    setLoading(false);
  };

  const steps = [
    {
      title: "Dirección",
      content: <AddressStep checkoutData={checkoutData} setCheckoutData={setCheckoutData} />,
    },
    {
      title: "Resumen",
      content: <SummaryStep checkoutData={checkoutData} />,
    },
  ];

  return (
    <div style={{ display: "flex", justifyContent: "center", height: "100vh", alignItems: "center" }}>
      <SharlockLogo />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ position: "fixed", width: "100%", height: "100vh", zIndex: -1 }}
      >
        <Silk speed={10} scale={1} color="#e6e1d7" noiseIntensity={1.5} rotation={0} />
      </motion.div>

      <Card style={{ boxShadow: "0 4px 122px rgba(255, 255, 255, 1)", maxWidth: 1000, width: "100%", padding: "1rem", borderRadius: "1rem", position: "absolute" }}>
        <Steps current={current} style={{ marginBottom: "2rem" }}>
          {steps.map((s, i) => (
            <Step key={i} title={s.title} />
          ))}
        </Steps>

        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              {steps[current].content}
            </motion.div>
          </AnimatePresence>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <Row gutter={[8, 8]} justify="end">
            {current > 0 && current !== 3 && (
              <Col>
                <Button block={window.innerWidth < 576} onClick={prev}>
                  Atrás
                </Button>
              </Col>
            )}

            {/* Mostrar "Siguiente" en pasos 0 y 1 */}
            {current < 1 && (
              <Col>
                <Button
                  type="primary"
                  block={window.innerWidth < 576}
                  onClick={next}
                  disabled={current === 0 && !checkoutData.selectedAddress}
                >
                  Siguiente
                </Button>
              </Col>
            )}

            {current === 1 && (
              <Col>
                <Button
                  type="primary"
                  block={window.innerWidth < 576}
                  onClick={pay}
                  disabled={loading}
                  loading={loading}
                >
                  Ir a pagar
                </Button>
              </Col>
            )}

            <Col>
              <Button block={window.innerWidth < 576} onClick={() => navigate("/")}>
                Cerrar y continuar comprando
              </Button>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
}