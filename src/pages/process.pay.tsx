import { useState } from "react";
import { Card, Steps, Button, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Importar los componentes de cada paso
import AddressStep from "../components/processPay/AddressStep";
import PaymentStep from "../components/processPay/PaymentStep";
import SummaryStep from "../components/processPay/SummaryStep";
import SuccessStep from "../components/processPay/SuccessStep";
import Silk from "../components/animations/Silk";


const { Step } = Steps;

export default function ProcessPay() {
    const navigate = useNavigate();
    const [current, setCurrent] = useState(0);

    const steps = [
        { title: "Dirección", content: <AddressStep /> },
        { title: "Pago", content: <PaymentStep /> },
        { title: "Resumen", content: <SummaryStep /> },
        { title: "Finalizado", content: <SuccessStep /> },
    ];

    const next = () => setCurrent((prev) => prev + 1);
    const prev = () => setCurrent((prev) => prev - 1);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                height: "100vh",
                alignItems: "center",
            }}
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                    duration: 0.8,
                    ease: "easeOut",
                }}
                style={{
                    position: "fixed",
                    width: "100%",
                    height: "100vh",
                    zIndex: -1,
                }}
            >
                <Silk speed={10} scale={1} color="#e6e1d7" noiseIntensity={1.5} rotation={0} />
            </motion.div>

            <Card style={{ boxShadow: "0 4px 122px rgba(230, 227, 212, 1)", maxWidth: 1000, width: "100%", padding: "1rem", borderRadius: "1rem", position: "absolute" }}>
                {/* Steps Header */}
                <Steps current={current} style={{ marginBottom: "2rem" }}>
                    {steps.map((s, i) => (
                        <Step key={i} title={s.title} />
                    ))}
                </Steps>

                {/* Animated Step Content */}
                <div >
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
                        {current > 0 && (
                            <Col>
                                <Button
                                    block={window.innerWidth < 576}
                                    onClick={prev}
                                >
                                    Atrás
                                </Button>
                            </Col>
                        )}

                        {current < steps.length - 1 && (
                            <Col>
                                <Button
                                    type="primary"
                                    block={window.innerWidth < 576}
                                    onClick={next}
                                >
                                    Siguiente
                                </Button>
                            </Col>
                        )}

                        <Col>
                            <Button
                                block={window.innerWidth < 576}
                                onClick={() => navigate("/")}
                            >
                                Cerrar y continuar comprando
                            </Button>
                        </Col>
                    </Row>
                </div>

            </Card>
        </div>
    );
}
