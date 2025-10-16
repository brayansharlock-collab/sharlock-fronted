import { Row, Col, Typography } from "antd"
import { motion } from "framer-motion"

const { Title } = Typography

interface ProductDescriptionCardProps {
  description: string
  imageCover: string
}

export const ProductDescriptionCard = ({ description, imageCover }: ProductDescriptionCardProps) => {
  return (
    <motion.div
      style={{
        // marginTop: 32,
        margin: "40px auto",
        width: "95%",
        height: 500,
        borderRadius: 16,
        overflow: "hidden",
        background: "#fff",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      <Row gutter={0}>
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
              {description}
            </p>
          </div>
        </Col>

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              backgroundImage: `url(${imageCover})`,
              backgroundSize: "cover",
              backgroundPosition: "center right",
            }}
          />
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
  )
}