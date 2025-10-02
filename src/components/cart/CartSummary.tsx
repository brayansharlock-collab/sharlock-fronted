import { useMemo } from "react";
import {
  Button,
  Card,
  Divider,
  Input,
  message,
  Row,
  Tag,
  Typography,
} from "antd";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { COP } from "../common/Currency";
import type { CartItem } from "./types";
import { cartService } from "../../service/cartService";
import { removeCookie, setEncryptedCookie } from "../../utils/encrypt";

const { Title, Text } = Typography;

type Props = {
  items: CartItem[];
  coupon: string;
  setCoupon: (c: string) => void;
  appliedCoupon: {
    id: number;
    percentage: number;
  } | null;
  setAppliedCoupon: (c: { id: number; percentage: number } | null) => void;
};

export function CartSummary({
  items,
  coupon,
  setCoupon,
  appliedCoupon,
  setAppliedCoupon,
}: Props) {
  const navigate = useNavigate();

  const { subtotal, discount, iva, total } = useMemo(() => {
    const st = items.reduce((acc, it) => acc + it.price * it.quantity, 0);
    let disc = 0;

    if (appliedCoupon) {
      disc = (st * appliedCoupon.percentage) / 100;
    }

    const taxable = Math.max(st - disc, 0);
    const iva19 = taxable * 0.19;
    const tot = taxable + iva19;

    return { subtotal: st, discount: disc, iva: iva19, total: tot };
  }, [items, appliedCoupon]);

  const handleApplyCoupon = async () => {
    const code = coupon.trim();
    if (!code) return;

    try {
      const res = await cartService.applyCoupon(code);

      const couponData = {
        id: res.coupon_id,
        percentage: res.percentage,
        code,
      };

      setAppliedCoupon(couponData);
      setEncryptedCookie("appliedCo", couponData, 7);
    } catch (err: any) {
      setAppliedCoupon(null);
      removeCookie("appliedCo");
      message.error(err.response?.data?.error || "Cupón inválido");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCoupon("");
    removeCookie("appliedCo");
  };

  return (
    <Card
      variant="outlined"
      style={{ borderRadius: 12, position: "sticky", top: 24 }}
      title="Resumen"
    >
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <Input
          placeholder="Código de cupón"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          disabled={!!appliedCoupon}
        />
        {appliedCoupon ? (
          <Button onClick={removeCoupon}>Quitar</Button>
        ) : (
          <Button type="primary" onClick={handleApplyCoupon}>
            Aplicar
          </Button>
        )}
      </div>

      {appliedCoupon && (
        <Tag color="green" style={{ marginBottom: 12 }}>
          Cupón aplicado: {appliedCoupon.percentage.toFixed(2)}% OFF
        </Tag>
      )}

      <motion.div layout>
        <Row justify="space-between">
          <Text>Subtotal</Text>
          <Text strong>{COP.format(subtotal)}</Text>
        </Row>
        <Row justify="space-between" style={{ marginTop: 6 }}>
          <Text>Descuento</Text>
          <Text type={discount > 0 ? "success" : "secondary"}>
            - {COP.format(discount)}
          </Text>
        </Row>
        <Row justify="space-between" style={{ marginTop: 6 }}>
          <Text>IVA (19%)</Text>
          <Text>{COP.format(iva)}</Text>
        </Row>

        <Divider style={{ margin: "12px 0" }} />
        <Row justify="space-between">
          <Title level={4}>Total</Title>
          <Title level={4} style={{ margin: 0 }}>{COP.format(total)}</Title>
        </Row>
      </motion.div>

      <Divider />
      <Button
        type="primary"
        block
        size="large"
        disabled={items.length === 0}
        onClick={() => navigate("/Checkout")}
      >
        Ir a pagar
      </Button>
      <Button block style={{ marginTop: 8 }} onClick={() => navigate("/")}>
        Seguir comprando
      </Button>
    </Card>
  );
}
