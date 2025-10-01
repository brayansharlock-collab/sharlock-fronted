import { Result, Button } from "antd";
import { motion } from "framer-motion";
import successVideo from "../../assets/ilustrations/success.mp4";

export default function FinalStep({
  checkoutData,
  onRetry,
}: {
  checkoutData: any;
  onRetry: () => void;
}) {
  return (
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
      {checkoutData.paymentApproved ? (
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
        />
      ) : (
        <Result
          status="error"
          title="Pago rechazado"
          subTitle="Tu pago no pudo ser procesado. Por favor revisa los datos e intenta nuevamente."
          extra={[
            <Button type="dashed" key="retry" onClick={onRetry}>
              Volver al pago
            </Button>,
          ]}
        />
      )}
    </motion.div>
  );
}
