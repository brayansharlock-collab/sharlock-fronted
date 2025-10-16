import { useEffect, useState } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { productService } from "../../service/productService";
import { ProductCard } from "../ui/ProductCard";

interface SimilarProductsCarouselProps {
    currentProduct: any;
}

export default function SimilarProductsCarousel({ currentProduct }: SimilarProductsCarouselProps) {
    const [products, setProducts] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const itemsPerPage = window.innerWidth < 768 ? 1 : 5;

    const buildBody = () => {
        const body: any = {};
        if (currentProduct?.subcategory) {
            // const subcategoryId = currentProduct.subcategory.id;
            const categoryId = currentProduct.subcategory.category_detail?.id;

            // if (subcategoryId) body.sub_category_filter_id = subcategoryId;
            if (categoryId) body.category_filter_id = categoryId;
        }
        body.page_size = itemsPerPage;
        body.page = page;

        return body;
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const body = buildBody();
            
            const res = await productService.list(body);

            const filtered = res.filter((p: any) => p.id !== currentProduct.id);

            setProducts(filtered);
            setHasMore(res.length === itemsPerPage);
            setLoading(false);
        } catch (error) {
            console.error("Error al cargar productos similares:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentProduct) {
            fetchProducts();
        }
    }, [currentProduct, page]);

    const nextPage = () => {
        if (hasMore) setPage((prev) => prev + 1);
    };

    const prevPage = () => {
        if (page > 1) setPage((prev) => prev - 1);
    };

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <section
            style={{
                width: "100%",
                margin: "0px auto",
                maxWidth: "1350px",
                height: "65vh",
                padding: isMobile ? "22px" : "24px",
                position: "relative",
                background: "linear-gradient(160deg, #ffffff, #e6e1d7)",
                border: "1px solid #e8e8e8",
                borderRadius:18,
            }}
        >
            {/* Título con efecto */}
            <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    fontSize: isMobile ? "20px" : "26px",
                    fontWeight: "800",
                    marginBottom: "32px",
                    WebkitBackgroundClip: "text",
                    color: "#7a6449",
                    letterSpacing: "0.5px",
                }}
            >
                Productos que tambien te podrían gustar
            </motion.h2>

            {/* Carrusel */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                }}
            >
                {/* Botón Izquierda */}
                {!isMobile && (
                    <button
                        onClick={prevPage}
                        disabled={page === 1}
                        style={{
                            border: "none",
                            background: "rgba(255,255,255,0.6)",
                            backdropFilter: "blur(8px)",
                            borderRadius: "50%",
                            width: 50,
                            height: 50,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                            cursor: page === 1 ? "not-allowed" : "pointer",
                            position: "absolute",
                            left: "-20px",
                            zIndex: 10,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            transition: "all 0.3s ease",
                        }}
                    >
                        <LeftOutlined style={{ fontSize: "18px", color: "#333" }} />
                    </button>
                )}

                {/* Contenedor de productos */}
                <div
                    style={{
                        overflow: "hidden",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <motion.div
                        key={page}
                        initial={{ opacity: 0, x: 80 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            display: "grid",
                            gridTemplateColumns: isMobile ? "repeat(1, 1fr)" : "repeat(5, 1fr)",
                            gap: isMobile ? "16px" : "24px",
                            width: "100%",
                        }}
                    >
                        {products.map((product: any) => {
                            const cleanPrice =
                                parseFloat(String(product.final_price).replace(/\./g, "")) || 0;
                            const originalPrice =
                                product.final_price_discount && product.active_discount
                                    ? cleanPrice + cleanPrice * 0.2
                                    : undefined;

                            const images =
                                product?.stock_detail?.[0]?.media
                                    ?.filter((m: any) => m.is_image)
                                    ?.map((m: any) => m.file) || [];

                            return (
                                <motion.div
                                    key={product.id}
                                    style={{
                                        borderRadius: "16px",
                                        overflow: "hidden",
                                        width: "250px",
                                        background: "#fff",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                        transition: "all 0.3s ease",
                                    }}
                                >
                                    <ProductCard
                                        id={product.id}
                                        images={images}
                                        name={product.name}
                                        image={product.image_cover}
                                        price={product.final_price_discount}
                                        originalPrice={originalPrice}
                                        // rating={product.rating || 4.5}
                                        isNew={false}
                                        initialIsFavorite={product.is_favorite || false}
                                    />
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>

                {/* Botón Derecha */}
                {!isMobile && (
                    <button
                        onClick={nextPage}
                        disabled={!hasMore}
                        style={{
                            border: "none",
                            background: "rgba(255,255,255,0.6)",
                            backdropFilter: "blur(8px)",
                            borderRadius: "50%",
                            width: 50,
                            height: 50,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                            cursor: hasMore ? "pointer" : "not-allowed",
                            position: "absolute",
                            right: "-20px",
                            zIndex: 10,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            transition: "all 0.3s ease",
                        }}
                    >
                        <RightOutlined style={{ fontSize: "18px", color: "#333" }} />
                    </button>
                )}
            </div>

            {/* Loading */}
            {loading && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                        textAlign: "center",
                        marginTop: "20px",
                        color: "#777",
                        fontSize: "15px",
                        fontWeight: 500,
                    }}
                >
                    Cargando productos...
                </motion.p>
            )}
        </section>
    );
}
