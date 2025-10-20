"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { productService } from "../../service/productService"

interface DiscountProduct {
    id: number;
    name: string;
    slug: string;
    image_cover: string;
    active_discount: number;
    final_price: string;
    final_price_discount: string;
    average_rating: number;
}

export const FeaturedProducts: React.FC = () => {
    const navigate = useNavigate()
    const [products, setProducts] = useState<DiscountProduct[]>([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false)
    const loadingRef = useRef(false)
    const itemsPerPage = 6

    const fetchDiscountedProducts = useCallback(async (append = false) => {
        if (loadingRef.current) return

        loadingRef.current = true
        setLoading(true)

        try {
            const res = await productService.getDiscountProducts(page, itemsPerPage)
            const results = Array.isArray(res?.data) ? res.data : []
            const total = res?.total ?? 0

            if (append) {
                setProducts(prev => [...prev, ...results])
            } else {
                setProducts(results)
            }

            const totalCargados = (append ? products.length : 0) + results.length
            setHasMore(totalCargados < total)

            if (totalCargados < total) {
                setPage(prev => prev + 1)
            }

        } catch (err) {
            console.error("Error al cargar productos:", err)
        } finally {
            loadingRef.current = false
            setLoading(false)
        }
    }, [page, products])

    useEffect(() => {
        fetchDiscountedProducts(false)
    }, [])

    const handleProductClick = (product: DiscountProduct) => {
        navigate(`/producto/${product.slug}/${product.id}`)
    }

    const handleSeeAll = async () => {
        if (hasMore) {
            await fetchDiscountedProducts(true)
        } else {
            navigate("/products")
        }
    }

    useEffect(() => {
        const handleScroll = () => {
            if (!hasMore || loadingRef.current) return
            const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 400
            if (bottom) fetchDiscountedProducts(true)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [hasMore, fetchDiscountedProducts])

    return (
        <section style={{ padding: "10px 0px 70px 0px", position: "relative" }}>
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
                    Descubre piezas únicas con descuentos especiales. Estilo y diseño a un
                    precio inigualable.
                </p>
            </motion.div>

            {/* Mosaico dinámico */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gridAutoRows: "auto",
                    width: "100%",
                    maxWidth: "1400px",
                    margin: "0 auto",
                    gap: "8px",
                }}
            >
                <style>
                    {`
                    @media (max-width: 768px) {
                      div[style*="gridTemplateColumns: repeat(2"] {
                        grid-template-columns: 1fr !important;
                      }
                    }
                  `}
                </style>

                {products.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        style={{
                            position: "relative",
                            cursor: "pointer",
                            overflow: "hidden",
                            backgroundColor: "#fff",
                            borderRadius: "0px",
                            gridColumn: index % 5 === 0 ? "span 2" : "span 1",
                        }}
                        onClick={() => handleProductClick(product)}
                    >
                        <div
                            style={{
                                position: "relative",
                                width: "100%",
                                height: "100%",
                                aspectRatio: index % 5 === 0 ? "16/7" : "1/1",
                            }}
                        >
                            <motion.img
                                src={product.image_cover}
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
                                    transition: "transform 0.4s ease",
                                }}
                            />

                            {product.active_discount > 0 && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "12px",
                                        right: "12px",
                                        backgroundColor: "#e63946",
                                        color: "#fff",
                                        fontSize: "14px",
                                        fontWeight: "600",
                                        padding: "6px 10px",
                                        borderRadius: "12px",
                                    }}
                                >
                                    -{product.active_discount}%
                                </div>
                            )}

                            <div
                                style={{
                                    position: "absolute",
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    padding: "20px",
                                    background:
                                        "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.65) 100%)",
                                    color: "#fff",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "flex-end",
                                    height: "100%",
                                }}
                            >
                                <h3
                                    style={{
                                        fontFamily: "Lora, serif",
                                        fontSize: "18px",
                                        fontWeight: "500",
                                        marginBottom: "6px",
                                    }}
                                >
                                    {product.name}
                                </h3>

                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <span style={{ fontSize: "16px", fontWeight: "600" }}>
                                        ${product.final_price}
                                    </span>
                                    {product.active_discount > 0 && (
                                        <span
                                            style={{
                                                fontSize: "14px",
                                                textDecoration: "line-through",
                                                opacity: 0.8,
                                            }}
                                        >
                                            ${product.final_price_discount}
                                        </span>
                                    )}
                                </div>

                                <div style={{ marginTop: "4px" }}>
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <span
                                            key={i}
                                            style={{
                                                color: i < product.average_rating ? "#FFD700" : "#aaa",
                                                fontSize: "16px",
                                            }}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>
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
                style={{ textAlign: "center", marginTop: "80px" }}
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
                    onClick={handleSeeAll}
                    disabled={loading}
                >
                    {loading
                        ? "Cargando..."
                        : hasMore
                            ? "Ver Más Productos"
                            : "Ver Página de Productos"}
                </button>
            </motion.div>
        </section>
    )
}
