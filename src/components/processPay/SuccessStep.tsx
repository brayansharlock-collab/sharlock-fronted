import { Result, Button } from "antd";
import { motion } from "framer-motion";
import successVideo from "../../assets/ilustrations/success.mp4";
import warningVideo from "../../assets/ilustrations/Warning_Status.gif";
import { Link, useLocation } from "react-router-dom";
import Silk from "../animations/Silk";
import SharlockLogo from "../ui/SharlockLogo";

export default function FinalStep() {

  const location = useLocation();
  const isFail = location.pathname === '/Checkout/failure';
  const isSuccess = location.pathname === '/Checkout/success';
  const isPending = location.pathname === '/Checkout/pending';

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
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", }}>
        <div style={{boxShadow: "0 4px 122px rgba(255, 255, 255, 1)", background: "#fff", width: "30%", borderRadius: 20, margin: "auto 20px", padding: "40px 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {isSuccess ? (
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
              subTitle="Gracias por tu compra. Te enviaremos un correo con el detalle."
              extra={[
                <Link to="/" style={{ textDecoration: 'none' }}>
                  <Button type="dashed" key="retry">
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
                <Link to="/checkout" style={{ textDecoration: 'none' }}>
                  <Button type="dashed" key="retry">
                    Volver a realizar el proceso de pago
                  </Button>
                </Link>
              ]}
            />
          ) : null}
          {isPending && (
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
          )}
        </div>
      </motion.div>
    </>
  );
}
