import { useEffect, useState, useMemo } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { productService } from "../../service/productService";
import { ProductCard } from "../ui/ProductCard";
import { isNewProduct } from "../../utils/dateUtils";
import { calculateDiscountPercent, getProductImages } from "../../utils/productUtils";

interface SimilarProductsCarouselProps {
    currentProduct: any;
}

export default function SimilarProductsCarousel({ currentProduct }: SimilarProductsCarouselProps) {
    const [products, setProducts] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // ✅ Define items por página según el tamaño real del viewport
    const itemsPerPage = useMemo(() => {
        if (windowWidth < 600) return 1;
        if (windowWidth < 900) return 2;
        if (windowWidth < 1200) return 3;
        if (windowWidth < 1500) return 4;
        return 5;
    }, [windowWidth]);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const buildBody = () => {
        const body: any = {};
        if (currentProduct?.subcategory?.category_detail?.id) {
            body.category_filter_id = currentProduct.subcategory.category_detail.id;
        }
        return body;
    };

    const fetchProducts = async () => {
        if (!currentProduct) return;
        try {
            setLoading(true);
            const body = buildBody();
            const res = await productService.list(body, page, itemsPerPage);
            setProducts(res.data);
            setHasMore(Array.isArray(res.data) ? res.data.length >= itemsPerPage : false);
        } catch (error) {
            console.error("Error al cargar productos similares:", error);
            setProducts([]);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
        setProducts([]);
        setHasMore(true);
    }, [currentProduct]);

    useEffect(() => {
        fetchProducts();
    }, [page, currentProduct, itemsPerPage]);

    const nextPage = () => {
        if (hasMore && !loading) setPage((prev) => prev + 1);
    };

    const prevPage = () => {
        if (page > 1 && !loading) setPage((prev) => prev - 1);
    };

    return (
        <section
            style={{
                width: "100%",
                margin: "0 auto",
                maxWidth: "1350px",
                padding: windowWidth < 768 ? "18px" : "28px",
                position: "relative",
                background: "linear-gradient(160deg, #ffffff, #e6e1d7)",
                border: "1px solid #e8e8e8",
                borderRadius: 18,
                boxSizing: "border-box",
            }}
        >
            <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    fontSize: windowWidth < 768 ? "20px" : "26px",
                    fontWeight: 800,
                    marginBottom: 24,
                    color: "#7a6449",
                    letterSpacing: "0.5px",
                }}
            >
                Productos similares
            </motion.h2>

            <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
                {/* Botón Izquierda */}
                <button
                    onClick={prevPage}
                    disabled={page === 1 || loading}
                    aria-label="Anterior"
                    style={{
                        border: "none",
                        background: "rgba(255,255,255,0.9)",
                        borderRadius: "50%",
                        width: 48,
                        height: 48,
                        boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
                        cursor: page === 1 ? "not-allowed" : "pointer",
                        position: "absolute",
                        left: -24,
                        zIndex: 10,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <LeftOutlined style={{ fontSize: 18, color: "#333" }} />
                </button>

                {/* Contenedor central */}
                <div
                    style={{
                        overflow: "hidden",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <motion.div
                        initial={false}
                        animate={{ opacity: loading ? 0.4 : 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            display: "grid",
                            gridTemplateColumns: `repeat(${itemsPerPage}, 1fr)`,
                            gap: windowWidth < 768 ? 16 : 24,
                            width: "100%",
                            alignItems: "stretch",
                            transition: "opacity 0.25s ease-in-out", // refuerzo visual
                        }}
                    >
                        {products.length > 0 ? (
                            products.map((product: any) => {
                                const discountPercent = calculateDiscountPercent(
                                    product.active_discount,
                                    product.final_price,
                                    product.final_price_discount
                                );
                                const images = getProductImages(product);
                                return (
                                    <motion.div
                                        key={product.id}
                                        style={{
                                            borderRadius: 16,
                                            overflow: "hidden",
                                            background: "#fff",
                                            boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                                            display: "flex",
                                            flexDirection: "column",
                                            width: "100%",
                                            boxSizing: "border-box",
                                            padding: 0,
                                        }}
                                    >
                                        <div style={{ width: "100%" }}>
                                            <ProductCard
                                                images={images}
                                                id={product.id}
                                                name={product.name}
                                                image={product.image_cover}
                                                price={product.final_price}
                                                originalPrice={
                                                    product.active_discount > 0
                                                        ? product.final_price_discount
                                                        : null
                                                }
                                                rating={product.average_rating}
                                                discountPercent={discountPercent}
                                                isNew={isNewProduct(product.created_at)}
                                                initialIsFavorite={product.is_favorite || false}
                                            />
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div
                                style={{
                                    gridColumn: "1 / -1",
                                    textAlign: "center",
                                    padding: 20,
                                    color: "#777",
                                }}
                            >
                                {loading
                                    ? "Cargando..."
                                    : "No hay más productos similares"}
                            </div>
                        )}
                    </motion.div>
                </div>

                <button
                    onClick={nextPage}
                    disabled={!hasMore || loading}
                    aria-label="Siguiente"
                    style={{
                        border: "none",
                        background: "rgba(255,255,255,0.9)",
                        borderRadius: "50%",
                        width: 48,
                        height: 48,
                        boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
                        cursor: hasMore ? "pointer" : "not-allowed",
                        position: "absolute",
                        right: -24,
                        zIndex: 10,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <RightOutlined style={{ fontSize: 18, color: "#333" }} />
                </button>
            </div>
        </section>
    );
}
