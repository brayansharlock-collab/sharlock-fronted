import { Result } from "antd";
import { motion } from "framer-motion";

export default function SuccessStep() {
  return (
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
      <Result
        status="success"
        title="Compra finalizada con éxito"
        subTitle="Gracias por tu compra. Te enviaremos un correo con el detalle."
      />
    </motion.div>
  );
}
