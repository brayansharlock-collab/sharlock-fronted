"use client"

import { Layout, Button, Menu, theme, Tooltip } from "antd"
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    FileAddOutlined,
    AppstoreOutlined,
    UserOutlined,
    ArrowLeftOutlined,
} from "@ant-design/icons"
import { useState } from "react"
import { motion } from "framer-motion"
import ProductForm from "./ProductForm"
import OrderHistoryAdmin from "../../components/profile/OrderHistoryAdmin"
import { Link } from "react-router-dom"

// import constructionImg from "../../assets/ilustrations/undraw_construction-workers_z99i.svg"

const { Sider, Content, Header } = Layout

export default function ProductsPage() {
    const [collapsed, setCollapsed] = useState(false)
    const [activeMenu, setActiveMenu] = useState("create")
    const {
        token: { colorBgContainer, colorPrimary },
    } = theme.useToken()

    return (
        <Layout
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%)",
            }}
        >
            {/* SIDEBAR */}
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                width={260}
                style={{
                    background: "#ffffff",
                    transition: "all 0.3s ease",
                }}
            >
                <div
                    style={{
                        padding: "24px 0",
                        textAlign: "center",
                    }}
                >
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            color: "black",
                            fontSize: collapsed ? "24px" : "22px",
                            fontWeight: "700",
                            letterSpacing: "0.5px",
                            margin: 0,
                        }}
                    >
                        {collapsed ? "🛍️" : "Administración"}
                    </motion.h1>
                </div>

                {/* MENU */}
                <Menu
                    mode="inline"
                    selectedKeys={[activeMenu]}
                    onClick={(e) => setActiveMenu(e.key)}
                    style={{
                        border: "none",
                        background: "transparent",
                        padding: "16px 0",
                    }}
                    items={[
                        {
                            key: "create",
                            label: <span style={{ fontWeight: 500, fontSize: "15px" }}>Crear Producto</span>,
                            icon: <FileAddOutlined style={{ fontSize: "18px", color: colorPrimary }} />,
                        },
                        {
                            key: "Facturación",
                            label: <span style={{ fontWeight: 500, fontSize: "15px" }}>Facturación</span>,
                            icon: <AppstoreOutlined style={{ fontSize: "18px", color: colorPrimary }} />,
                        },
                        // {
                        //     key: "settings",
                        //     label: <span style={{ fontWeight: 500, fontSize: "15px" }}>Configuración</span>,
                        //     icon: <SettingOutlined style={{ fontSize: "18px", color: colorPrimary }} />,
                        // },
                    ]}
                />
            </Sider>

            {/* MAIN CONTENT */}
            <Layout>
                <Header
                    style={{
                        background: colorBgContainer,
                        display: "flex",
                        alignItems: "center",
                        padding: "0 24px",
                        height: "64px",
                    }}
                >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: "18px",
                            color: colorPrimary,
                            marginRight: "16px",
                        }}
                    />
                    <motion.h2
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            margin: 0,
                            fontSize: "20px",
                            fontWeight: 700,
                            color: "#1a1a1a",
                            display: "flex", justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                        }}
                    >
                        {activeMenu === "create" && "Crear Nuevo Producto"}
                        {activeMenu === "Facturación" && "Historial de Pedidos"}
                        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                            <Link to="/" >
                            <button
                                style={{
                                    display: "flex",
                                    gap: "8px",
                                    transition: "all 0.3s ease",
                                    outline: "none",
                                    cursor: "pointer",
                                    border: "none",
                                    fontSize: "16px",
                                    background: "transparent",
                                    color: "#988c73ff",
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                            >
                                <ArrowLeftOutlined />
                                Volver a home
                            </button>
                            </Link>
                            <Tooltip title="Tu perfil">
                                <Link to="/Profile">
                                    <UserOutlined
                                        style={{
                                            fontSize: '22px',
                                            color: '#000',
                                            cursor: 'pointer',
                                        }}
                                    />
                                </Link>
                            </Tooltip>
                        </div>

                    </motion.h2>
                </Header>

                <Content
                    style={{
                        overflow: "auto",
                        background: "white",
                        padding: "24px",
                        display: "flex",
                        width: "100%",
                        alignItems: "flex-start",
                        minHeight: "calc(100vh - 64px)",
                    }}
                >
                    <motion.div
                        key={activeMenu}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        style={{
                            width: "100%",
                            background: "#ffffff",
                            borderRadius: "20px",
                            boxShadow: "0 10px 30px #7a644927",
                            padding: "40px 48px",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                top: "-35%",
                                right: "-8%",
                                width: "320px",
                                height: "320px",
                                background: "radial-gradient(circle, rgba(118, 75, 162, 0.08) 0%, transparent 70%)",
                                borderRadius: "50%",
                                pointerEvents: "none",
                            }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                bottom: "-25%",
                                left: "-12%",
                                width: "300px",
                                height: "300px",
                                background: "radial-gradient(circle, rgba(102, 126, 234, 0.06) 0%, transparent 70%)",
                                borderRadius: "50%",
                                pointerEvents: "none",
                            }}
                        />

                        <div style={{ position: "relative", zIndex: 2 }}>
                            {activeMenu === "create" && <ProductForm />}
                            {activeMenu === "Facturación" && <OrderHistoryAdmin />}
                            {/*
                            {activeMenu === "settings" && (
                                <div style={{ textAlign: "center", padding: "60px 20px", justifyContent: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <img src={constructionImg} alt="construction" style={{ width: "50%" }} />
                                    <h3 style={{ fontSize: "18px", color: "#666" }}>Sección de Configuración en desarrollo...</h3>
                                </div>
                            )} */}
                        </div>
                    </motion.div>
                </Content>
            </Layout>
        </Layout>
    )
}
