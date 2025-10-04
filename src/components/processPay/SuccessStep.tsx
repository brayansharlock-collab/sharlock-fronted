// src/pages/FinalStep.tsx
import { Result, Button, message } from "antd";
import { motion } from "framer-motion";
import successVideo from "../../assets/ilustrations/success.mp4";
import warningVideo from "../../assets/ilustrations/Warning_Status.gif";
import { Link, useLocation } from "react-router-dom";
import Silk from "../animations/Silk";
import SharlockLogo from "../ui/SharlockLogo";
import { useEffect, useState } from "react";
import { billingService } from "../../service/billingService";

export default function FinalStep() {
  const location = useLocation();
  const isFail = location.pathname === '/Checkout/failure';
  const isSuccess = location.pathname === '/Checkout/success';
  const isPending = location.pathname === '/Checkout/pending';

  const [loading, setLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null); // null = cargando, true/false = resultado

  useEffect(() => {
    if (isSuccess) {
      const referrer = document.referrer;
      const isFromMercadoPago = referrer.includes('mercadopago.com');

      if (!isFromMercadoPago) {
        console.warn('Acceso no autorizado: no viene de Mercado Pago');
        setIsAuthorized(false);
        message.error('Acceso no permitido');
        return;
      }

      setIsAuthorized(true);

      // Procesar facturación
      const processBilling = async () => {
        setLoading(true);
        try {
          await billingService.createReceipt();
          console.log('Factura generada con éxito');
        } catch (err: any) {
          console.error('Error en facturación:', err);
          message.error(err.message || 'Error al generar la factura');
        } finally {
          setLoading(false);
        }
      };

      processBilling();
    }
  }, [isSuccess]);

  if (isSuccess && isAuthorized === false) {
    return (
      <>
        <SharlockLogo />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ position: "fixed", width: "100%", height: "100vh", zIndex: -1 }}
        >
          <Silk speed={10} scale={1} color="#e6e1d7" noiseIntensity={1.5} rotation={0} />
        </motion.div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh"
          }}
        >
          <div
            style={{
              boxShadow: "0 4px 122px rgba(255, 255, 255, 1)",
              background: "#fff",
              width: "30%",
              minWidth: "300px",
              borderRadius: 20,
              margin: "auto 20px",
              padding: "40px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Result
              status="error"
              title="Acceso no autorizado"
              subTitle="Estás intentando acceder a esta página de forma indebida. Esta acción ha sido registrada."
              extra={[
                <Link to="/" key="home">
                  <Button type="dashed">
                    Volver al inicio
                  </Button>
                </Link>
              ]}
            />
          </div>
        </motion.div>
      </>
    );
  }

  return (
    <>
      <SharlockLogo />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ position: "fixed", width: "100%", height: "100vh", zIndex: -1 }}
      >
        <Silk speed={10} scale={1} color="#e6e1d7" noiseIntensity={1.5} rotation={0} />
      </motion.div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh"
        }}
      >
        <div
          style={{
            boxShadow: "0 4px 122px rgba(255, 255, 255, 1)",
            background: "#fff",
            width: "30%",
            minWidth: "300px",
            borderRadius: 20,
            margin: "auto 20px",
            padding: "40px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {isSuccess && isAuthorized === true ? (
            <Result
              icon={
                <video
                  src={successVideo}
                  autoPlay
                  loop={false}
                  muted
                  playsInline
                  style={{
                    margin: "0 auto",
                    width: "120px",
                    borderRadius: "12px",
                  }}
                />
              }
              title="Compra finalizada con éxito"
              subTitle={loading
                ? "Generando factura..."
                : "Gracias por tu compra. Te enviaremos un correo con el detalle."
              }
              extra={[
                <Link to="/" style={{ textDecoration: 'none' }} key="home">
                  <Button type="dashed" disabled={loading}>
                    Volver al inicio
                  </Button>
                </Link>
              ]}
            />
          ) : isFail ? (
            <Result
              status="error"
              title="Pago rechazado"
              subTitle="Tu pago no pudo ser procesado. Por favor revisa los datos e intenta nuevamente."
              extra={[
                <Link to="/checkout" style={{ textDecoration: 'none' }} key="retry">
                  <Button type="dashed">
                    Volver a realizar el proceso de pago
                  </Button>
                </Link>
              ]}
            />
          ) : isPending ? (
            <Result
              icon={
                <img
                  src={warningVideo}
                  style={{
                    margin: "0 auto",
                    width: "120px",
                    borderRadius: "12px",
                  }}
                />
              }
              title="Pago pendiente"
              subTitle="Tu pago está siendo procesado. Te notificaremos cuando se haya completado."
            />
          ) : null}
        </div>
      </motion.div>
    </>
  );
}