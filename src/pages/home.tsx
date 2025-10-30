import React, { useEffect, useState } from "react";
import { Carousel, Row, Col, Card } from "antd";
import AnimatedNav from "../components/ui/nav";
import { bannersService } from "../service/banners";
import { motion, AnimatePresence } from "framer-motion";
import { productService } from "../service/productService";
import FooterHome from "../components/ui/footerHome";
import { useNavigate } from "react-router-dom";
import { FeaturedProducts } from "../components/home/featureproducts";
import isotipo from "../assets/logos/isotipo.png";
import VideoBanner from "../components/home/VideoBanner";

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
    const navigate = useNavigate();
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

    const handleSelectCategory = (catName: number) => {
        const payload = {
            categories: [catName],
            subcategories: [],
            search: "",
        };

        localStorage.setItem("productFilters", JSON.stringify(payload));
        navigate("/products");
    };

    // useEffect(() => {
    //     const stored = JSON.parse(localStorage.getItem("recentProducts") || "[]");
    //         setRecentProducts(stored);
    // }, []);

    return (
        <>
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
                                y: isLoading ? 0 : -300,
                            }}
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 20,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    minHeight: "100vh",
                                    padding: "0 1rem",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "clamp(8px, 2vw, 16px)",
                                        fontFamily: "Lora, serif",
                                        fontWeight: "bold",
                                        letterSpacing: "4px",
                                        fontSize: "clamp(28px, 6vw, 60px)",
                                        textShadow: "0 2px 6px rgba(0, 0, 0, 0.4)",
                                    }}
                                >
                                    <motion.img
                                        src={isotipo}
                                        alt="isotipo"
                                        initial={{ opacity: 0, scale: 0.5, rotateZ: 0 }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1,
                                            rotateZ: [0, 180, 0],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            ease: [0.68, -0.55, 0.27, 1.55],
                                        }}
                                        style={{
                                            width: "clamp(40px, 20vw, 130px)",
                                            height: "auto",
                                            flexShrink: 0,
                                            transformOrigin: "center",
                                        }}
                                    />
                                </div>
                            </div>
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
                                            height: "20%",
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
                                            <Col style={{ width: "200px", display: "flex", justifyContent: "center" }} key={cat.id}>
                                                <Card
                                                    onClick={() => handleSelectCategory(cat.id)}
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
            {/* {!isLoading && <RecentProducts />} */}
            {!isLoading && <FeaturedProducts />}

            {/* {(!isLoading && recentProducts.length > 0) && 
            <div style={{marginBottom: 50}}>
                <SimilarProductsCarousel currentProduct={recentProducts} />
            </div>} */}

            <VideoBanner />

            <FooterHome />
        </>
    );
};

export default Home;
