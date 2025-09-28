import React, { useEffect, useState } from "react";
import { Carousel, Row, Col, Card } from "antd";
import AnimatedNav from "../components/ui/nav";
import { bannersService } from "../service/banners";
import { ProductCategoryShowcase } from "../components/home/ProductCategoryShowcase";

const categories = ["Tecnología", "Moda", "Hogar", "Deportes", "Libros", "Juguetes", "Accesorios", "Deportes"];

function chunkArray<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}

function getResponsiveChunkSize(): number {
    const width = window.innerWidth;
    if (width < 768) return 2;
    if (width < 1024) return 3;
    return 4;
}

let groupedCategories = chunkArray(categories, getResponsiveChunkSize());
window.addEventListener('resize', () => { groupedCategories = chunkArray(categories, getResponsiveChunkSize()); });

const Home: React.FC = () => {
    const [slides, setSlides] = useState<any[]>([]);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const data = await bannersService.list();
                setSlides(data);
            } catch (error) {
                console.error("Error cargando banners:", error);
            }
        };
        fetchBanners();
    }, []);

    return (
        <>
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
                                    color: "white"
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
                                        background: "linear-gradient(to bottom, transparent, #e6e1d7)",
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </Carousel>

                {/* Slider Categorías - SUPERPUESTO */}
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
                                <Row gutter={[16, 24]} justify="center" style={{ padding: "0 20px" }}>
                                    {group.map((cat, i) => (
                                        <Col xs={12} sm={8} md={6} lg={4} xl={4} key={i}>
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
                                                    title={cat}
                                                    style={{ fontWeight: "bold", fontSize: 16, padding: "0 10px" }}
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
            {categories.map((cat, idx) => (
                <ProductCategoryShowcase
                    key={idx}
                    categoryId={idx + 1} // 👈 cambia según el id real que devuelva tu API
                    categoryName={cat}
                />
            ))}
        </>
    );
};

export default Home;
