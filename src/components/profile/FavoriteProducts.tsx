import { useEffect, useState } from "react";
import { Row, Col, Spin, Empty } from "antd";
import { ProductCard } from "../ui/ProductCard";
import { productService } from "../../service/productService";

export default function FavoriteProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await productService.list({ favorite_product: true });
        setProducts(res);
      } catch (err) {
        console.error("Error cargando favoritos", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!products.length) {
    return <Empty description="No tienes productos favoritos" style={{ marginTop: "2rem" }} />;
  }

  return (
    <Row gutter={[16, 16]}>
      {products.map((p) => (
        <Col key={p.id} xs={24} sm={12} md={8} lg={6}>
          <ProductCard
            id={p.id}
            name={p.name}
            image={p.image_cover}
            images={p.images}
            price={p.price}
            rating={p.rating}
            originalPrice={p.originalPrice}
            isNew={p.isNew}
            initialIsFavorite={true}
          />
        </Col>
      ))}
    </Row>
  );
}
