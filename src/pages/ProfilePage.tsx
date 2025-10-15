"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// icons
import {
  UserOutlined,
  HomeOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
  HeartOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import { Card, Button, Space, Grid, Tooltip } from "antd";
import { motion, AnimatePresence } from "framer-motion";

// Importar los componentes de cada sección
import Silk from "../components/animations/Silk";
import CardList from "../components/profile/CardList";
import UserInfo from "../components/profile/UserInfo";
import AddressList from "../components/profile/AddressList";
import OrderHistory from "../components/profile/OrderHistory";
import FavoriteProducts from "../components/profile/FavoriteProducts";
import OrderHistoryAdmin from "../components/profile/OrderHistoryAdmin";

const { useBreakpoint } = Grid;

const menuItems = [
  { key: "user", label: "Tus datos", icon: <UserOutlined /> },
  { key: "address", label: "Mis direcciones", icon: <HomeOutlined /> },
  { key: "favorites", label: "Favoritos", icon: <HeartOutlined /> },
  { key: "tracking", label: "Historial", icon: <SearchOutlined /> },
  { key: "guie", label: "Administrar pedidos", icon: <SnippetsOutlined /> },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState("user");
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const renderContent = () => {
    switch (selectedKey) {
      case "user":
        return <UserInfo />;
      case "address":
        return <AddressList />;
      case "cards":
        return <CardList />;
      case "favorites":
        return <FavoriteProducts />;
      case "tracking":
        return <OrderHistory />;
      case "guie":
        return <OrderHistoryAdmin />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {/* Fondo animado */}
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

      {/* Menú flotante centrado */}
      <motion.div
        layout
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: "white",
          borderRadius: "20px",
          padding: isMobile ? "0.5rem 1rem" : "1rem 2rem",
          margin: "1rem 2rem",
          boxShadow: "0 8px 54px rgba(226, 222, 199, 0.93)",
        }}
      >
        <Space
          size={isMobile ? "small" : "large"}
          wrap
          style={{ justifyContent: "center", width: "100%" }}
        >
          {menuItems.map((item) => (
            <Tooltip title={item.label}>
              <Button
                key={item.key}
                type={selectedKey === item.key ? "primary" : "default"}
                shape={isMobile ? "circle" : "round"}
                size={isMobile ? "large" : "large"}
                icon={item.icon}
                onClick={() => setSelectedKey(item.key)}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                {selectedKey === item.key ? !isMobile && item.label : null}
              </Button>
            </Tooltip>
          ))}
          <Button
            type="primary"
            shape={isMobile ? "circle" : "round"}
            size={isMobile ? "middle" : "large"}
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/")}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            {!isMobile && "Salir de perfil"}
          </Button>
        </Space>
      </motion.div>

      {/* Contenido dinámico animado */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedKey}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ duration: 0.35 }}
          style={{ width: "100%", maxWidth: 1200, padding: "1rem" }}
        >
          <Card
            style={{
              borderRadius: "1.25rem",
              boxShadow: "0 8px 24px rgba(226, 222, 199, 0.93)",
              height: "80vh",
              overflowY: "auto",
            }}
          >
            {renderContent()}
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
