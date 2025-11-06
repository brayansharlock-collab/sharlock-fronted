"use client"

import { useState } from "react"
import { Card, Input, InputNumber, Upload } from "antd"
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons"
import { motion } from "framer-motion"

interface MediaItem {
  file: File
  is_image: boolean
  order: number
}

interface StockItem {
  size?: string
  color?: string
  quantity?: number
  media?: MediaItem[]
}

interface Props {
  index: number
  value: StockItem
  onChange: (val: StockItem) => void
  onDelete: (index: number) => void
}

const ProductStockForm = ({ index, value, onChange, onDelete }: Props) => {
  const [fileList, setFileList] = useState<any[]>([])

  const handleInputChange = (key: keyof StockItem, val: any) => {
    onChange({ ...value, [key]: val })
  }

  const handleMediaChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList)
    const media = newFileList.map(
      (file: any, i: number): MediaItem => ({
        file: file.originFileObj,
        is_image: true,
        order: i + 1,
      }),
    )
    handleInputChange("media", media)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        title={`Variante #${index + 1}`}
        style={{
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
          border: "1px solid #f0f0f0",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.12)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.06)"
        }}
        extra={
          <DeleteOutlined
            style={{ color: "#999", cursor: "pointer", fontSize: "16px" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#ff4d4f"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#999"
            }}
             onClick={() => onDelete(index)} 
          />
        }
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
          <Input
            placeholder="Talla (M, L, XL...)"
            value={value.size}
            onChange={(e) => handleInputChange("size", e.target.value)}
          />
          <Input
            placeholder="Color (Blanco, Negro...)"
            value={value.color}
            onChange={(e) => handleInputChange("color", e.target.value)}
          />
          <InputNumber
            placeholder="Cantidad"
            min={0}
            value={value.quantity}
            onChange={(val) => handleInputChange("quantity", val ?? 0)}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginTop: "16px" }}>
          <Upload listType="picture-card" fileList={fileList} beforeUpload={() => false} onChange={handleMediaChange}>
            {fileList.length >= 4 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Subir imagen</div>
              </div>
            )}
          </Upload>
        </div>
      </Card>
    </motion.div>
  )
}

export default ProductStockForm
