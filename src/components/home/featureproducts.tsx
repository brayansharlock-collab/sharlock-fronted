"use client"

import type React from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

interface Product {
    id: number
    name: string
    category: string
    price: string
    image: string
}

const featuredProducts: Product[] = [
    {
        id: 1,
        name: "Gorra Retro",
        category: "Accesorios",
        price: "$45.000",
        image: "/elegant-white-baseball-cap-on-beige-background.jpg",
    },
    {
        id: 2,
        name: "Camisa Lino",
        category: "Camisas",
        price: "$89.000",
        image: "/elegant-beige-linen-shirt-on-neutral-background.jpg",
    },
    {
        id: 3,
        name: "Chaqueta Denim",
        category: "Chaquetas",
        price: "$125.000",
        image: "/premium-denim-jacket-on-beige-background.jpg",
    },
    {
        id: 4,
        name: "Pantalón Cargo",
        category: "Pantalones",
        price: "$78.000",
        image: "/beige-cargo-pants-on-neutral-background.jpg",
    },
    {
        id: 5,
        name: "Suéter Lana",
        category: "Suéteres",
        price: "$95.000",
        image: "/cream-wool-sweater-on-beige-background.jpg",
    },
    {
        id: 6,
        name: "Suéter Lana",
        category: "Suéteres",
        price: "$95.000",
        image: "/cream-wool-sweater-on-beige-background.jpg",
    },
]

export const FeaturedProducts: React.FC = () => {
    const navigate = useNavigate()

    const handleProductClick = (productId: number) => {
        navigate(`/product/${productId}`)
    }

    const gridStyles = [
        { gridColumn: "span 7" },
        { gridColumn: "span 5" },
        { gridColumn: "span 6" },
        { gridColumn: "span 6" },
    ]

    return (
        <section
            style={{
                padding: "10px 40px 70px 40px",
                position: "relative",
            }}
        >
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                style={{
                    maxWidth: "1400px",
                    margin: "0 auto 80px",
                    textAlign: "center",
                }}
            >
                <h2
                    style={{
                        fontFamily: "Lora, serif",
                        fontSize: "clamp(36px, 5vw, 64px)",
                        fontWeight: "400",
                        color: "#2a2a2a",
                        marginBottom: "20px",
                        lineHeight: "1.2",
                    }}
                >
                    Colección Destacada
                </h2>
                <p
                    style={{
                        fontSize: "clamp(16px, 2vw, 18px)",
                        color: "#6b6b6b",
                        maxWidth: "600px",
                        margin: "0 auto",
                        lineHeight: "1.6",
                        fontWeight: "300",
                    }}
                >
                    Descubre piezas únicas que definen tu estilo. Calidad y diseño en cada prenda.
                </p>
            </motion.div>

            {/* Mosaico dinámico */}
            <div
                style={{
                    maxWidth: "1400px",
                    margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: "repeat(12, 1fr)",
                    gap: "24px",
                }}
            >
                {featuredProducts.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        style={{
                            ...gridStyles[index % gridStyles.length],
                            position: "relative",
                            cursor: "pointer",
                            overflow: "hidden",
                            backgroundColor: "#fff",
                            borderRadius: "20px", // más redondeado
                            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        }}
                        onClick={() => handleProductClick(product.id)}
                    >
                        <div
                            style={{
                                position: "relative",
                                paddingBottom: "120%",
                                overflow: "hidden",
                            }}
                        >
                            <motion.img
                                src={product.image}
                                alt={product.name}
                                whileHover={{ scale: 1.06 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        </div>
                        <div
                            style={{
                                padding: "28px",
                                backgroundColor: "#fff",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: "11px",
                                    letterSpacing: "2px",
                                    textTransform: "uppercase",
                                    color: "#999",
                                    marginBottom: "8px",
                                    fontWeight: "500",
                                }}
                            >
                                {product.category}
                            </p>
                            <h3
                                style={{
                                    fontFamily: "Lora, serif",
                                    fontSize: "22px",
                                    fontWeight: "400",
                                    color: "#2a2a2a",
                                    marginBottom: "10px",
                                }}
                            >
                                {product.name}
                            </h3>
                            <p
                                style={{
                                    fontSize: "18px",
                                    color: "#2a2a2a",
                                    fontWeight: "500",
                                }}
                            >
                                {product.price}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* CTA */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                style={{
                    textAlign: "center",
                    marginTop: "80px",
                }}
            >
                <button
                    style={{
                        fontFamily: "inherit",
                        fontSize: "14px",
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        padding: "16px 48px",
                        backgroundColor: "#2a2a2a",
                        color: "#fff",
                        border: "none",
                        borderRadius: "30px",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        fontWeight: "500",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#1a1a1a"
                        e.currentTarget.style.transform = "translateY(-2px)"
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#2a2a2a"
                        e.currentTarget.style.transform = "translateY(0)"
                    }}
                    onClick={() => navigate("/products")}
                >
                    Ver Toda la Colección
                </button>
            </motion.div>
        </section>
    )
}
