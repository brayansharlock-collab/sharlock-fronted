"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { Row, Col, Card, Image, message, Button, Tooltip } from "antd"
import { HeartFilled, HeartOutlined } from "@ant-design/icons"
import { motion } from "framer-motion"
import type { Variants } from "framer-motion"
import Silk from "../components/animations/Silk"
import { productService } from "../service/productService"
import { cartService } from "../service/cartService"

// Componentes importados
import { BackButton } from "../components/ProductDetail/BackButton"
import { ProductImageGallery } from "../components/ProductDetail/ProductImageGallery"
import { ProductInfo } from "../components/ProductDetail/ProductInfo"
import { ColorSelector } from "../components/ProductDetail/ColorSelector"
import { SizeSelector } from "../components/ProductDetail/SizeSelector"
import { QuantitySelector } from "../components/ProductDetail/QuantitySelector"
import { AddToCartButton } from "../components/ProductDetail/AddToCartButton"
import { ViewCartButton } from "../components/ProductDetail/ViewCartButton"
import { ProductDescriptionCard } from "../components/ProductDetail/ProductDescriptionCard"
import { ProductComments } from "../components/ProductDetail/ProductComments"
import SimilarProductsCarousel from "../components/ProductDetail/useSimilarProducts"
import { tokenStorage } from "../utils/token"

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
  final_price: string;
  final_price_discount: string;
  image_cover: string
  stock_detail: StockDetail[]
  price: string
  discount: string
  active_discount: number
  stock: number
  is_favorite: boolean
  average_rating: number;
  total_comments: number;
}

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage()
  const [quantity, setQuantity] = useState<number>(1)
  const [loading, setLoading] = useState(false);
  const [isLogged, setIsLogged] = useState(false)
  const token = tokenStorage.getAccessToken()

  useEffect(() => {
    setIsLogged(!!token)
  }, [])

  useEffect(() => {
    if (product) {
      setIsFavorite(product.is_favorite);
    }
  }, [product]);

  const variant = useMemo(() => {
    if (!product) return null
    return product.stock_detail.find(
      (s) => s.color === selectedColor && s.size === selectedSize
    ) || null
  }, [product, selectedColor, selectedSize])

  const toggleFavorite = async () => {
    if (loading) return;
    if (!product?.id) {
      console.warn("El producto no tiene id, no se puede eliminar de favoritos");
      return;
    }
    setLoading(true);

    try {
      if (isFavorite) {
        await productService.removeFromFavorites(product?.id);
        setIsFavorite(false);
      } else {
        await productService.addToFavorites(product?.id);
        setIsFavorite(true);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || "Error al actualizar favoritos");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product || !variant) {
      messageApi.open({
        type: "warning",
        content: "Debes seleccionar una talla y color disponibles",
      })
      return
    }

    if (quantity > variant.quantity) {
      messageApi.open({
        type: "error",
        content: "Stock insuficiente",
      })
      return
    }

    try {
      await cartService.addToCart({
        is_active: true,
        product_id: product.id,
        amount: quantity,
        variant_id: variant.id,
      })

      messageApi.open({
        type: "success",
        content: "Producto agregado al carrito",
      })
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content:
          error.response?.data?.error || "Error al agregar al carrito",
      })
    }
  }

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

  const filteredImages = product.stock_detail
    .filter(
      (s) =>
        (!selectedColor || s.color === selectedColor) &&
        (!selectedSize || s.size === selectedSize)
    )
    .flatMap((s) => s.media.map((m) => m.file))

  const allImages = filteredImages.length > 0 ? filteredImages : [product.image_cover]
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

  return (
    <>
      {contextHolder}

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
        <div style={{ textAlign: "right", marginBottom: "20px" }}>
          <BackButton />
        </div>

        <Row gutter={[32, 32]}>
          {/* Miniaturas (solo desktop) */}
          <Col xs={0} sm={3}>
            <ProductImageGallery
              images={allImages}
              selectedImage={selectedImage}
              onImageSelect={setSelectedImage}
              isMobile={false}
            />
          </Col>

          {/* Carrusel móvil */}
          <Col xs={24} sm={0}>
            <ProductImageGallery
              images={allImages}
              selectedImage={selectedImage}
              onImageSelect={setSelectedImage}
              isMobile={true}
            />
            <Tooltip title={!isLogged ? "Debes iniciar sesión para guardar favoritos" : isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}>
              <Button
                style={{
                  position: "absolute",
                  top: "0.5rem",
                  right: "0.5rem",
                  borderRadius: "0.8rem",
                  backdropFilter: "blur(10px)",
                  background: "rgba(255, 255, 255, 0.7)",
                  border: "1px solid rgba(255, 255, 255, 0.5)",
                  transition: "all 0.2s ease",
                  cursor: !isLogged ? "not-allowed" : "pointer",
                }}
                disabled={!isLogged}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavorite();
                }}
                icon={isFavorite ? <HeartFilled style={{ color: "#ff4d4f" }} /> : <HeartOutlined />}
                loading={loading}
                type={isFavorite ? "primary" : "default"}
              />
            </Tooltip>
          </Col>

          {/* Imagen principal */}
          <Col xs={0} sm={10}>
            <motion.div variants={itemVariants}>
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
                <Tooltip title={!isLogged ? "Debes iniciar sesión para guardar favoritos" : isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}>
                  <Button
                    style={{
                      position: "absolute",
                      top: "0.5rem",
                      right: "0.5rem",
                      borderRadius: "0.8rem",
                      backdropFilter: "blur(10px)",
                      background: "rgba(255, 255, 255, 0.7)",
                      border: "1px solid rgba(255, 255, 255, 0.5)",
                      cursor: !isLogged ? "not-allowed" : "pointer",
                      transition: "all 0.2s ease",
                    }}
                    disabled={!isLogged}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite();
                    }}
                    icon={isFavorite ? <HeartFilled style={{ color: "#ff4d4f" }} /> : <HeartOutlined />}
                    loading={loading}
                    type={isFavorite ? "primary" : "default"}
                  />
                </Tooltip>
              </Card>
            </motion.div>
          </Col>

          <Col xs={24} sm={11}>
            <motion.div variants={itemVariants}>
              <ProductInfo
                name={product.name}
                price={product.final_price}
                discount={product.final_price_discount}
                activeDiscount={product.active_discount}
              />

              <SizeSelector
                sizes={allSizes}
                selectedSize={selectedSize}
                onSelect={handleSelectSize}
              />
              
              <ColorSelector
                colors={allColors}
                selectedColor={selectedColor}
                onSelect={handleSelectColor}
              />

              <QuantitySelector
                quantity={quantity}
                variant={variant}
                onIncrease={() =>
                  setQuantity((prev) =>
                    variant ? Math.min(prev + 1, variant.quantity) : prev
                  )
                }
                onDecrease={() => setQuantity(Math.max(1, quantity - 1))}
              />

              <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
                <AddToCartButton onClick={handleAddToCart} quantity={variant?.quantity} disabled={variant?.quantity === 0 || !isLogged} />
                <ViewCartButton />
              </div>
            </motion.div>
          </Col>

          {product.description && (
            <ProductDescriptionCard
              description={product.description}
              imageCover={product.image_cover}
            />
          )}

          <SimilarProductsCarousel currentProduct={product} />

          <ProductComments productId={product.id} totalComent={product.total_comments} totalRating={product.average_rating} />
        </Row>
      </motion.div>
    </>
  )
}

export default ProductDetail