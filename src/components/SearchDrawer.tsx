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
            {/* Ícono de búsqueda */}
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
                    body: { padding: 0, backgroundColor: "#ff", display: "flex", flexDirection: "column" },
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

                <div
                    style={{
                        // width: "100%",
                        position: "absolute",
                        top: "20%",
                        left: "20%",
                        transform: "translate(20% 20%)"
                    }}
                >
                    <img
                        src="src/assets/ilustrations/search.svg"
                        alt="search"
                        style={{
                            width: "80%",
                            maxWidth: "400px",
                            height: "auto",
                        }}
                    />
                </div>
            </Drawer>
        </>
    );
};