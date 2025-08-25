import { Timeline } from "antd";

export default function ProductTracking() {
  return (
    <Timeline>
      <Timeline.Item color="green">Pedido realizado</Timeline.Item>
      <Timeline.Item color="blue">En proceso</Timeline.Item>
      <Timeline.Item color="orange">En camino</Timeline.Item>
      <Timeline.Item color="gray">Entregado</Timeline.Item>
    </Timeline>
  );
}
