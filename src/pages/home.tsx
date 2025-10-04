import React, { useEffect, useState } from "react";
import { Carousel, Row, Col, Card } from "antd";
import AnimatedNav from "../components/ui/nav";
import { bannersService } from "../service/banners";
import { ProductCategoryShowcase } from "../components/home/ProductCategoryShowcase";
import { motion, AnimatePresence } from "framer-motion";
import { productService } from "../service/productService";

function chunkArray<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    is_active: boolean;
    img: string | null;
    sub_category: SubCategory[];
}

interface SubCategory {
    id: number;
    name: string;
    slug: string;
    category: number;
    is_active: boolean;
    sub_category: null;
    filter_name: number[];
}

const getResponsiveChunkSize = () => {
    if (window.innerWidth < 576) return 1;
    if (window.innerWidth < 992) return 2;
    return 4;
};

const Home: React.FC = () => {
    const [slides, setSlides] = useState<any[]>([]);
    const [categoriesAll, setCategoriesAll] = useState<any[]>([]);
    const [groupedCategories, setGroupedCategories] = useState<any[][]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const banners = await bannersService.list();
                setSlides(banners);

                setTimeout(() => setIsLoading(false), 2000);
            } catch (error) {
                console.error("Error cargando banners:", error);
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const updateChunks = () => {
            const chunkSize = getResponsiveChunkSize();
            setGroupedCategories(chunkArray(categoriesAll, chunkSize));
        };

        updateChunks();
        window.addEventListener("resize", updateChunks);

        return () => window.removeEventListener("resize", updateChunks);
    }, [categoriesAll]);

    useEffect(() => {
        (async () => {
            try {
                const cats = await productService.categories();
                setCategoriesAll(Array.isArray(cats) ? cats : []);
            } catch (err) {
                console.error("Error categorias:", err);
            }
        })();
    }, []);

    return (
        <>
            {/* 🔹 Pantalla de carga con animaciones */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100vh",
                            background: "#fff",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 9999,
                        }}
                    >
                        <motion.div
                            initial={{ y: 0 }}
                            animate={{
                                y: isLoading ? 0 : -300, // 👈 sube cuando termina
                            }}
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 20,
                            }}
                        >
                            {/* GIF candado */}
                            {/* <motion.img
          src={lock}
          alt="Candado animado"
          style={{ width: 120, height: 120 }}
          initial={{ opacity: 1 }}
          animate={{
            opacity: isLoading ? 1 : 0.9,
            scale: isLoading ? 1 : 0.95,
          }}
          transition={{ duration: 1 }}
        /> */}


                            {/* Texto SHARLOCK */}
                            <motion.h1
                                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                    color: isLoading ? "#000" : "#fff", // 👈 pasa de negro a blanco
                                }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                style={{
                                    letterSpacing: "4px",
                                    fontSize: "clamp(28px, 6vw, 60px)",
                                    fontWeight: "bold",
                                    textShadow: "0 2px 6px rgba(0, 0, 0, 0.4)",
                                    fontFamily: "Lora, serif",
                                }}
                            >
                                SHARLOCK
                            </motion.h1>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* 🔹 Contenido principal */}
            {!isLoading && (
                <div style={{ position: "relative" }}>
                    <AnimatedNav />

                    {/* Slider Principal */}
                    <Carousel dots={false} arrows autoplay>
                        {slides.map((slide, i) => (
                            <div key={i} style={{ position: "relative" }}>
                                <div
                                    style={{
                                        height: 730,
                                        backgroundImage: `url(${slide.img})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexDirection: "column",
                                        textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
                                        color: "white",
                                    }}
                                >
                                    {/* videos proocionales */}
                                    <div
                                        style={{
                                            position: "absolute",
                                            bottom: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "25%",
                                            background:
                                                "linear-gradient(to bottom, transparent, #e6e1d7)",
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </Carousel>

                    {/* Slider Categorías */}
                    <div
                        style={{
                            position: "absolute",
                            bottom: 80,
                            left: 0,
                            width: "100%",
                            zIndex: 10,
                            padding: "0 40px",
                            background: "transparent",
                        }}
                    >
                        <Carousel dots={false} slidesToShow={1} arrows autoplay>
                            {groupedCategories.map((group, index) => (
                                <div key={index}>
                                    <Row
                                        gutter={[16, 24]}
                                        justify="center"
                                        style={{ padding: "0 20px" }}
                                    >
                                        {group.map((cat: Category,) => (
                                            <Col style={{width: "200px", display: "flex", justifyContent: "center"}} key={cat.id}>
                                                <Card
                                                    hoverable
                                                    style={{
                                                        width: "100%",
                                                        maxWidth: 120,
                                                        height: 120,
                                                        borderRadius: "50%",
                                                        textAlign: "center",
                                                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                                        backgroundColor: "#fafafa",
                                                        cursor: "pointer",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Card.Meta
                                                        title={cat.name}
                                                        style={{
                                                            fontWeight: "bold",
                                                            fontSize: 16,
                                                            padding: "0 10px",
                                                        }}
                                                    />
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            ))}
                        </Carousel>
                    </div>
                </div>
            )}

            {/* Productos por categoría */}
            {!isLoading &&
                categoriesAll.map((cat, idx) => (
                    <ProductCategoryShowcase
                        key={idx}
                        categoryId={idx + 1}
                        categoryName={cat.name}
                    />
                ))}
        </>
    );
};

export default Home;
