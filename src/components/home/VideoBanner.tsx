"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { VideoBannerService, type VideoBannerType } from "../../service/videoBannerService"

export default function VideoBanner() {
    const [banners, setBanners] = useState<VideoBannerType[]>([])
    const [current, setCurrent] = useState<number>(0)
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
        const fetchBanners = async () => {
            const data = await VideoBannerService.getAll()
            setBanners(data.filter((b) => b.is_active))
        }
        fetchBanners()
    }, [])

    useEffect(() => {
        if (banners.length > 1) {
            const interval = setInterval(() => {
                setCurrent((prev) => (prev + 1) % banners.length)
            }, 8000)
            return () => clearInterval(interval)
        }
    }, [banners])

    if (!banners.length) return null

    const currentBanner = banners[current]

    return (
        <>
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
                    Inspírate con nuestros videos de estilo y moda
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
                    Descubre el arte detrás de cada prenda: colores, texturas y tendencias que
                    definen nuestra marca. Conéctate en redes y vive la experiencia visual de la moda.
                </p>

            </motion.div>
            <div
                style={{
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "95%",
                    maxWidth: "1400px",
                    height: "600px",
                    margin: "60px auto",
                    overflow: "hidden",
                    borderRadius: "32px",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        inset: "-20px",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
                        filter: "blur(40px)",
                        opacity: 0.4,
                        animation: "pulse 4s ease-in-out infinite",
                    }}
                />

                <img
                    src={currentBanner.img_background || "/placeholder.svg"}
                    alt="background"
                    style={{
                        position: "absolute",
                        inset: "0",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: "blur(3px) brightness(0.7)",
                        transform: isHovered ? "scale(1.05)" : "scale(1)",
                        transition: "transform 0.6s ease-out",
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        inset: "0",
                        background: "linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(88,28,135,0.4) 50%, rgba(0,0,0,0.7) 100%)",
                        mixBlendMode: "multiply",
                    }}
                />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentBanner.id}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        onHoverStart={() => setIsHovered(true)}
                        onHoverEnd={() => setIsHovered(false)}
                        style={{
                            position: "relative",
                            display: "flex",
                            flexDirection: window.innerWidth < 768 ? "column" : "row",
                            width: "92%",
                            height: "500px",
                            background: "rgba(255, 255, 255, 0.08)",
                            backdropFilter: "blur(20px) saturate(180%)",
                            borderRadius: "28px",
                            overflow: "hidden",
                            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
                            border: "1px solid rgba(255, 255, 255, 0.18)",
                        }}
                    >
                        <motion.div
                            style={{
                                flex: 1,
                                position: "relative",
                                overflow: "hidden",
                            }}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.4 }}
                        >
                            <video
                                src={currentBanner.video}
                                autoPlay
                                muted
                                loop
                                playsInline
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />

                            <div
                                style={{
                                    position: "absolute",
                                    inset: "0",
                                    background: "linear-gradient(to right, rgba(0,0,0,0.3) 0%, transparent 100%)",
                                    pointerEvents: "none",
                                }}
                            />
                        </motion.div>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "flex-start",
                                gap: "24px",
                                padding: "48px 40px",
                                width: window.innerWidth < 768 ? "100%" : "45%",
                                background: "linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(236, 72, 153, 0.1) 100%)",
                                position: "relative",
                            }}
                        >
                            <div
                                style={{
                                    position: "absolute",
                                    top: "-50px",
                                    right: "-50px",
                                    width: "200px",
                                    height: "200px",
                                    background: "radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)",
                                    borderRadius: "50%",
                                    filter: "blur(40px)",
                                    pointerEvents: "none",
                                }}
                            />

                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                                style={{
                                    position: "relative",
                                }}
                            >
                                <div
                                    style={{
                                        position: "absolute",
                                        inset: "-8px",
                                        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                                        borderRadius: "50%",
                                        filter: "blur(12px)",
                                        opacity: 0.6,
                                    }}
                                />
                                <img
                                    src={currentBanner.icono || "/placeholder.svg"}
                                    alt="icon"
                                    style={{
                                        position: "relative",
                                        width: "80px",
                                        height: "80px",
                                        borderRadius: "50%",
                                        border: "3px solid rgba(255,255,255,0.9)",
                                        objectFit: "cover",
                                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                                    }}
                                />
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                style={{
                                    fontSize: "clamp(28px, 4vw, 4px)",
                                    fontWeight: 700,
                                    margin: 0,
                                    color: "#ffffff",
                                    lineHeight: "1.2",
                                    textShadow: "0 4px 20px rgba(0, 0, 0, 0.5), 0 0 40px rgba(236, 72, 153, 0.3)",
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                {currentBanner.description}
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                style={{
                                    fontSize: "16px",
                                    color: "rgba(255, 255, 255, 0.8)",
                                    margin: 0,
                                    fontWeight: 400,
                                    letterSpacing: "0.02em",
                                }}
                            >
                                Descubre contenido exclusivo
                            </motion.p>

                            <motion.a
                                href={currentBanner.url_redirect}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    marginTop: "8px",
                                    padding: "16px 36px",
                                    background: "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)",
                                    color: "#1a1a1a",
                                    fontWeight: 600,
                                    fontSize: "16px",
                                    borderRadius: "50px",
                                    textDecoration: "none",
                                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
                                    transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                                    position: "relative",
                                    overflow: "hidden",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                                onMouseEnter={(e) => {
                                    const target = e.currentTarget as HTMLAnchorElement
                                    target.style.background = "linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)"
                                    target.style.boxShadow = "0 12px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2) inset"
                                }}
                                onMouseLeave={(e) => {
                                    const target = e.currentTarget as HTMLAnchorElement
                                    target.style.background = "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)"
                                    target.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1) inset"
                                }}
                            >
                                Ver más
                                <span style={{ fontSize: "18px" }}>→</span>
                            </motion.a>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Indicadores de navegación */}
                {banners.length > 1 && (
                    <div
                        style={{
                            position: "absolute",
                            bottom: "24px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            display: "flex",
                            gap: "12px",
                            zIndex: 10,
                        }}
                    >
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrent(index)}
                                style={{
                                    width: current === index ? "40px" : "12px",
                                    height: "12px",
                                    borderRadius: "6px",
                                    border: "none",
                                    background:
                                        current === index
                                            ? "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.8) 100%)"
                                            : "rgba(255, 255, 255, 0.4)",
                                    cursor: "pointer",
                                    transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                                    boxShadow: current === index ? "0 4px 12px rgba(255, 255, 255, 0.4)" : "none",
                                }}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}

                <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
      `}</style>
            </div>
        </>

    )
}
