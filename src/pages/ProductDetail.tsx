"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Row, Col, Card, Button, Image, Tag, Carousel, Collapse } from "antd"
import { ShoppingCartOutlined, HeartOutlined } from "@ant-design/icons"
import { productService } from "../service/productService"
import { motion, AnimatePresence } from "framer-motion"
import type { Variants } from "framer-motion"
import Silk from "../components/animations/Silk"

const { Panel } = Collapse

interface Product {
  id: number
  name: string
  description: string
  image_cover: string
  media: { url: string }[]
  price: string
  discount: string
  active_discount: number
  stock: number
  is_favorite: boolean
  colors?: string[]
  sizes?: string[]
}

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [expanded, setExpanded] = useState(false) // Para controlar el Collapse

  useEffect(() => {
    if (id) {
      productService.getById(Number(id)).then((res: Product) => {
        setProduct(res)
        setSelectedImage(res.image_cover)
        if (res.colors?.length) setSelectedColor(res.colors[0])
      })
    }
  }, [id])

  if (!product) return <p>Cargando...</p>

  const discountPercent =
    product.active_discount && product.discount !== product.price
      ? Math.round(
          ((Number(product.discount) - Number(product.price)) / Number(product.discount)) * 100
        )
      : 0

  const allImages = [product.image_cover, ...product.media.map((m) => m.url)]

  // Animaciones
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  }

  const imageVariants: Variants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } },
  }

  return (
    <>
      {/* Fondo animado */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{
          position: "fixed",
          width: "100%",
          height: "100vh",
          zIndex: -1,
        }}
      >
        <Silk speed={10} scale={1} color="#e6e1d7" noiseIntensity={1.5} rotation={0} />
      </motion.div>

      {/* Contenedor principal con animación */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "95%",
          height: "95vh",
          padding: "32px",
          color: "black",
          backgroundColor: "#ffffff",
          borderRadius: 12,
          boxShadow: "0 4px 32px rgba(0,0,0,0.1)",
          overflowY: "auto",
          zIndex: 10,
        }}
      >
        <Row gutter={[32, 32]}>
          {/* Miniaturas (SM+) */}
          <Col xs={0} sm={3}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              {allImages.map((img, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Image
                    src={img}
                    alt={`Vista ${index}`}
                    preview={false}
                    onClick={() => setSelectedImage(img)}
                    style={{
                      border:
                        selectedImage === img ? "2px solid #111" : "1px solid #e5e7eb",
                      borderRadius: 8,
                      cursor: "pointer",
                      objectFit: "cover",
                      width: "100%",
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </Col>

          {/* Carrusel móvil (XS) */}
          <Col xs={24} sm={0}>
            <Carousel autoplay dots>
              {allImages.map((img, index) => (
                <motion.div
                  key={index}
                  variants={imageVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={() => setSelectedImage(img)}
                >
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Image
                      src={img}
                      alt={`Vista ${index}`}
                      preview={false}
                      style={{
                        borderRadius: 12,
                        maxHeight: 400,
                        objectFit: "contain",
                        margin: "0 auto",
                        width: "100%",
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </Carousel>
          </Col>

          {/* Imagen principal (SM+) */}
          <Col xs={0} sm={10}>
            <motion.div variants={imageVariants} initial="hidden" animate="visible">
              <Card style={{ textAlign: "center", position: "relative" }}>
                <Image
                  src={selectedImage}
                  alt={product.name}
                  style={{
                    borderRadius: 12,
                    maxHeight: "500px",
                    objectFit: "contain",
                    width: "100%",
                  }}
                  preview={false}
                />
                <Button
                  type="text"
                  shape="circle"
                  icon={<HeartOutlined />}
                  style={{ position: "absolute", top: 16, right: 16 }}
                />
              </Card>
            </motion.div>
          </Col>

          {/* Detalles */}
          <Col xs={24} sm={11}>
            <motion.div variants={itemVariants}>
              <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>
                {product.name}
              </h2>

              {/* Precio */}
              <motion.div variants={itemVariants} style={{ marginBottom: 16 }}>
                {discountPercent > 0 && (
                  <div style={{ marginBottom: 6 }}>
                    <span
                      style={{
                        textDecoration: "line-through",
                        color: "#9ca3af",
                        marginRight: 12,
                      }}
                    >
                      ${product.discount}
                    </span>
                    <Tag color="red">-{discountPercent}%</Tag>
                  </div>
                )}
                <div style={{ fontSize: 28, fontWeight: 700, color: "#111827" }}>
                  ${product.price}
                </div>
              </motion.div>

              {/* Medidas */}
              <motion.div variants={itemVariants} style={{ marginBottom: 16 }}>
                <p style={{ margin: 0, fontWeight: 500 }}>Medidas</p>
                <p style={{ margin: 0, color: "#4b5563" }}>
                  Alto 18cm · Ancho 21cm · Profundo 12cm
                </p>
              </motion.div>

              {/* Botón */}
              <motion.div variants={itemVariants} style={{ marginBottom: 20 }}>
                <Button
                  type="default"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  style={{
                    fontWeight: 600,
                    height: 48,
                  }}
                  block
                >
                  AGREGAR AL CARRITO
                </Button>
              </motion.div>
            </motion.div>
          </Col>

          {/* Descripción desplegable con animación */}
         {product.description && (
                <Collapse
                  bordered={false}
                  style={{ background: "#fff", borderRadius: 8 }}
                >
                  <Panel header="See more information" key="1">


                    <p style={{ margin: 0, lineHeight: 1.6, color: "#374151" }}>
                      {product.description}
                    </p>
                  </Panel>
                </Collapse>
              )}
        </Row>
      </motion.div>
    </>
  )
}

export default ProductDetail