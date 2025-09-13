"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Row, Col, Card, Button, Image, Tag, Carousel, Typography } from "antd"
const { Title } = Typography
import { ShoppingCartOutlined, HeartOutlined } from "@ant-design/icons"
import { productService } from "../service/productService"
import { motion } from "framer-motion"
import type { Variants } from "framer-motion"
import Silk from "../components/animations/Silk"

interface StockDetail {
  id: number
  size: string
  color: string
  quantity: number
  media: { file: string }[]
}

interface Product {
  id: number
  name: string
  description: string
  image_cover: string
  stock_detail: StockDetail[]
  price: string
  discount: string
  active_discount: number
  stock: number
  is_favorite: boolean
}

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedSize, setSelectedSize] = useState<string>("")

  // Manejo de selección de color
  const handleSelectColor = (color: string) => {
    setSelectedColor(color)

    const validStock = product?.stock_detail.find(
      (s) => s.color === color && s.size === selectedSize
    )

    if (!validStock) {
      const firstValidSize = product?.stock_detail.find((s) => s.color === color)?.size
      if (firstValidSize) {
        setSelectedSize(firstValidSize)
      }
    }

    const stockWithImage = product?.stock_detail.find(
      (s) => s.color === color && s.size === (validStock ? selectedSize : product?.stock_detail.find((s) => s.color === color)?.size)
    )
    if (stockWithImage?.media?.length) {
      setSelectedImage(stockWithImage.media[0].file)
    }
  }

  // Manejo de selección de talla
  const handleSelectSize = (size: string) => {
    setSelectedSize(size)

    const validStock = product?.stock_detail.find(
      (s) => s.size === size && s.color === selectedColor
    )

    if (!validStock) {
      const firstValidColor = product?.stock_detail.find((s) => s.size === size)?.color
      if (firstValidColor) {
        setSelectedColor(firstValidColor)
      }
    }

    const stockWithImage = product?.stock_detail.find(
      (s) => s.size === size && s.color === (validStock ? selectedColor : product?.stock_detail.find((s) => s.size === size)?.color)
    )
    if (stockWithImage?.media?.length) {
      setSelectedImage(stockWithImage.media[0].file)
    }
  }

  useEffect(() => {
    if (id) {
      productService.getById(Number(id)).then((res: Product) => {
        setProduct(res)

        if (res.stock_detail.length > 0) {
          const firstStock = res.stock_detail[0]
          setSelectedImage(firstStock.media[0]?.file || res.image_cover)
          setSelectedColor(firstStock.color)
          setSelectedSize(firstStock.size)
        } else {
          setSelectedImage(res.image_cover)
        }
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

  const allImages = [
    ...new Set([
      // product.image_cover,
      ...product.stock_detail.flatMap((s) => s.media.map((m) => m.file)),
    ]),
  ]

  const allSizes = [...new Set(product.stock_detail.map((s) => s.size))]
  const allColors = [...new Set(product.stock_detail.map((s) => s.color))]

  // Animaciones
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
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

      {/* Contenedor principal */}
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
          {/* Miniaturas */}
          <Col xs={0} sm={3}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              {allImages.map((img, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Image
                    src={img}
                    alt={`Vista ${index}`}
                    preview={false}
                    onClick={() => setSelectedImage(img)}
                    style={{
                      border: selectedImage === img ? "2px solid #111" : "1px solid #e5e7eb",
                      borderRadius: 8,
                      cursor: "pointer",
                      objectFit: "cover",
                      width: "100%",
                      pointerEvents: "none",
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </Col>

          {/* Carrusel móvil */}
          <Col xs={24} sm={0}>
            <Carousel autoplay dots>
              {allImages.map((img, index) => (
                <motion.div key={index} variants={imageVariants} initial="hidden" animate="visible">
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
                        pointerEvents: "none",
                      }}
                      onClick={() => setSelectedImage(img)}
                    />
                  </div>
                </motion.div>
              ))}
            </Carousel>
          </Col>

          {/* Imagen principal */}
          <Col xs={0} sm={10}>
            <motion.div variants={imageVariants} initial="hidden" animate="visible">
              <Card style={{ textAlign: "center", position: "relative" }}>
                <Image
                  src={selectedImage}
                  alt={product.name}
                  style={{
                    borderRadius: 12,
                    height: "500px",
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
              <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>{product.name}</h2>

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

              {/* Colores */}
              <motion.div variants={itemVariants} style={{ marginBottom: 16 }}>
                <p style={{ margin: 0, fontWeight: 500 }}>Color</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {allColors.map((color, idx) => (
                    <Button
                      key={idx}
                      onClick={() => handleSelectColor(color)}
                      style={{
                        borderRadius: "9999px",
                        padding: "4px 16px",
                        fontWeight: 500,
                        backgroundColor: selectedColor === color ? "#111" : "#f3f4f6",
                        color: selectedColor === color ? "#fff" : "#111",
                        border: "1px solid #e5e7eb",
                        transition: "all 0.2s",
                      }}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </motion.div>

              {/* Tallas */}
              <motion.div variants={itemVariants} style={{ marginBottom: 16 }}>
                <p style={{ margin: 0, fontWeight: 500 }}>Talla</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {allSizes.map((size, idx) => (
                    <Button
                      key={idx}
                      onClick={() => handleSelectSize(size)}
                      style={{
                        borderRadius: "9999px",
                        padding: "4px 16px",
                        fontWeight: 500,
                        backgroundColor: selectedSize === size ? "#111" : "#f3f4f6",
                        color: selectedSize === size ? "#fff" : "#111",
                        border: "1px solid #e5e7eb",
                        transition: "all 0.2s",
                      }}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </motion.div>

              {/* Botón */}
              <motion.div variants={itemVariants} style={{ marginBottom: 20 }}>
                <Button
                  type="default"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  style={{ fontWeight: 600, height: 48 }}
                  block
                >
                  AGREGAR AL CARRITO
                </Button>
              </motion.div>
            </motion.div>
          </Col>

          {product.description && (
            <motion.div
              variants={itemVariants}
              style={{
                marginTop: 32,
                width: "100%",
                height: 500,
                borderRadius: 16,
                overflow: "hidden",
                background: "#fff",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <Row gutter={0}>
                {/* Información con scroll */}
                <Col
                  xs={24}
                  md={14}
                  style={{
                    height: 500,
                    background: "#e6e1d7",
                    borderRadius: "16px 0 0 16px",
                  }}
                >
                  <div
                    style={{
                      padding: "24px",
                      height: "320px",
                      overflowY: "auto",
                    }}
                  >
                    <Title
                      level={2}
                      style={{
                        margin: "0 0 12px 0",
                        fontWeight: 700,
                        color: "#111827",
                      }}
                    >
                      Detalles del producto
                    </Title>
                    <p
                      style={{
                        margin: 0,
                        lineHeight: 1.7,
                        color: "#374151",
                        fontSize: "15px",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {product.description}
                    </p>
                  </div>
                </Col>

                {/* Imagen reducida */}
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
                  {/* Imagen Cover con motion */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
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

                  {/* Overlay difuminado */}
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
          )}



        </Row>
      </motion.div>
    </>
  )
}

export default ProductDetail
