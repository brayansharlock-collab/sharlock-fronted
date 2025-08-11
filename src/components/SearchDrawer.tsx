// src/components/SearchDrawer.tsx
import React, { useState } from "react";
import { Drawer } from "antd";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { SearchBarAntd } from "./Search";

interface SearchDrawerProps {
    products: any[];
    isScrolled: Boolean
    onSearch: (term: string, results: any[]) => void;
}

export const SearchDrawer: React.FC<SearchDrawerProps> = ({
    onSearch,
    products,
    isScrolled,
}) => {
    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    return (
        <>
            {/* Ícono de búsqueda animado */}
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                onClick={showDrawer}
                style={{ display: "flex", alignItems: "center" }}
            >
                <SearchOutlined
                    style={{
                        fontSize: "18px",
                        color: isScrolled ? "#000" : "#fff",
                        cursor: "pointer",
                    }}
                />
            </motion.div>

            {/* Drawer */}
            <Drawer
                title={
                    <div style={{ fontWeight: 500, fontSize: "16px", color: "#1f1f1f" }}>
                        Buscar productos
                    </div>
                }
                placement="top"
                height="100vh"
                open={open}
                onClose={onClose}
                closeIcon={
                    <CloseOutlined style={{ color: "#1f1f1f", fontSize: "16px" }} />
                }
                styles={{
                    body: { padding: 0, backgroundColor: "#ff" },
                    header: { borderBottom: "1px solid #e6e1d7", padding: "16px 24px" },
                }}
                maskClosable
            >
                {/* Barra de búsqueda dentro del Drawer */}
                <div style={{ padding: "24px", backgroundColor: "#fff" }}>
                    <SearchBarAntd
                        products={products}
                        onSearch={(term, results) => {
                            onSearch(term, results);
                            onClose();
                        }}
                        className="w-full"
                    />
                </div>

                {/* Espacio para mostrar resultados (opcional) */}
                <div
                    style={{
                        padding: "24px",
                        color: "#666",
                        fontSize: "14px",
                        textAlign: "center",
                        margin: "40px auto",
                        width: "100%",
                    }}
                >
                    <img
                        src="src/assets/ilustrations/search.svg"
                        alt="search"
                        style={{
                            width: "50%",
                            maxWidth: "300px",
                            height: "auto",
                        }}
                    />
                    <p style={{ marginTop: "16px" }}>
                        Empieza a escribir para buscar productos
                    </p>
                </div>
            </Drawer>
        </>
    );
};