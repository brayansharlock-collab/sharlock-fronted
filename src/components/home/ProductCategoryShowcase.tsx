import React, { useEffect, useState, useRef } from "react";
import { Row, Col, Typography } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { productService } from "../../service/productService";

const { Title } = Typography;

interface ProductCategoryShowcaseProps {
    categoryId: number;
    categoryName: string;
}

export const ProductCategoryShowcase: React.FC<ProductCategoryShowcaseProps> = ({
    categoryId,
    categoryName,
}) => {
    const [products, setProducts] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const navigate = useNavigate();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Cargar productos por categoría
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productService.list({ category_filter_id: categoryId });
                setProducts(data);
            } catch (error) {
                console.error("Error cargando productos:", error);
            }
        };
        fetchProducts();
    }, [categoryId]);

    // Rotación automática cada 3s
    useEffect(() => {
        if (!products.length || paused) return;

        intervalRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % products.length);
        }, 3000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [products, paused]);

    const handleProductClick = (product: any) => {
        // guardar filtros en localStorage
        const payload = {
            categories: [categoryId],
            subcategories: [],
            search: "",
        };
        localStorage.setItem("productFilters", JSON.stringify(payload));

        navigate(`/producto/${product.slug}/${product.id}`);
    };

    if (!products.length) return null;

    const product = products[currentIndex];

    return (
        <motion.div
            style={{
                margin: "40px auto",
                width: "75%",
                height: 500,
                borderRadius: 16,
                overflow: "hidden",
                background: "#fff",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                cursor: "pointer",
            }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onClick={() => handleProductClick(product)}
        >
            <Row gutter={0}>
                <Col
                    xs={24}
                    md={14}
                    style={{
                        height: 500,
                        background: "#e6e1d7",
                        borderRadius: "16px 0 0 16px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <div style={{ padding: 54, height: "-webkit-fill-available" }}>
                        <Title
                            level={1}
                            style={{
                                margin: "0 0 12px 0",
                                fontWeight: 700,
                                color: "#111827",
                            }}
                        >
                            {categoryName}
                        </Title>

                        <AnimatePresence mode="wait">
                            <motion.p
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.6 }}
                                style={{
                                    margin: 0,
                                    lineHeight: 1.7,
                                    color: "#374151",
                                    fontSize: "20px",
                                    whiteSpace: "pre-line",
                                }}
                            >
                                {product.description || "Sin descripción"}
                            </motion.p>
                        </AnimatePresence>

                        {/* 👇 Atributos adicionales */}
                        <div style={{ marginTop: 16, color: "black"}}>
                            {/* Stock con tallas */}
                            <div style={{ marginTop: 12 }}>
                                <p style={{ fontWeight: 600, marginBottom: 6 }}>Disponibilidad:</p>
                                {product.stock_detail?.map((stock: any) => (
                                    <div key={stock.id} style={{ marginBottom: 4 }}>
                                        <span style={{ fontSize: 14 }}>
                                            Talla <b>{stock.size}</b> ({stock.color}) - {stock.quantity} en stock
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Col>

                <Col
                    xs={0}
                    md={10}
                    style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#fff",
                        borderRadius: "0 16px 16px 0",
                    }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.8 }}
                            style={{
                                position: "relative",
                                width: "100%",
                                height: "100%",
                                backgroundImage: `url(${product.image_cover})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center right",
                            }}
                        />
                    </AnimatePresence>
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: -100,
                            width: 200,
                            height: "100%",
                            background:
                                "linear-gradient(to right, #e6e1d7 50%, rgba(230,225,215,0) 100%)",
                            pointerEvents: "none",
                        }}
                    />
                </Col>
            </Row>
        </motion.div>
    );
};
