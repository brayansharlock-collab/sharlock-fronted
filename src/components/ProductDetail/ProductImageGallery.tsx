"use client"

import { Image, Carousel } from "antd"
import { motion } from "framer-motion"
import type { Variants } from "framer-motion"

interface ProductImageGalleryProps {
  images: string[]
  selectedImage: string
  onImageSelect: (img: string) => void
  isMobile: boolean
}

const imageVariants: Variants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } },
}

export const ProductImageGallery = ({
  images,
  selectedImage,
  onImageSelect,
  isMobile,
}: ProductImageGalleryProps) => {
  if (isMobile) {
    return (
      <Carousel autoplay dots>
        {images.map((img, index) => (
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
                onClick={() => onImageSelect(img)}
              />
            </div>
          </motion.div>
        ))}
      </Carousel>
    )
  }

  return (
    <motion.div
      style={{ display: "flex", flexDirection: "column", gap: 12 }}
    >
      {images.map((img, index) => (
        <motion.div key={index}>
          <Image
            src={img}
            alt={`Vista ${index}`}
            preview={false}
            onClick={() => onImageSelect(img)}
            style={{
              border: selectedImage === img ? "2px solid #111" : "1px solid #e5e7eb",
              borderRadius: 8,
              cursor: "pointer",
              objectFit: "cover",
              width: "84%",
              pointerEvents: "none",
            }}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}