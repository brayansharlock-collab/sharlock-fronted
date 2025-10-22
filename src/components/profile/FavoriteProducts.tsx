import { useEffect, useState, useRef, useCallback } from "react";
import { Row, Col, Spin, Empty, Typography } from "antd";
import { ProductCard } from "../ui/ProductCard";
import { productService } from "../../service/productService";
import { calculateDiscountPercent, getProductImages } from "../../utils/productUtils";
import { isNewProduct } from "../../utils/dateUtils";

const { Title } = Typography;

export default function FavoriteProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const nextPageRef = useRef(1);
  const loadingRef = useRef(false);

  // ❌ containerRef ya NO se usa para el scroll (el scroll es del viewport)
  // const containerRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const fetchFavorites = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    try {
      loadingRef.current = true;
      setLoading(true);

      const res = await productService.list({ favorite_product: true }, nextPageRef.current);
      const data = res.data || [];

      if (!Array.isArray(data) || data.length === 0) {
        setHasMore(false);
        return;
      }

      setProducts((prev) => {
        const unique = new Map([...prev, ...data].map((p) => [p.id, p]));
        return Array.from(unique.values());
      });

      nextPageRef.current += 1;
    } catch (err) {
      console.error("Error cargando favoritos", err);
      setHasMore(false);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [hasMore]);

  useEffect(() => {
    // Reiniciar al montar
    nextPageRef.current = 1;
    setProducts([]);
    setHasMore(true);
    fetchFavorites();
  }, [fetchFavorites]);

  useEffect(() => {
    if (!sentinelRef.current) return;

    // Limpiar observer anterior
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // ✅ Observar el viewport (root: null), no un contenedor interno
    const options: IntersectionObserverInit = {
      root: null, // 👈 Clave: observar la ventana completa
      rootMargin: "300px",
      threshold: 0.01,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !loadingRef.current && hasMore) {
          fetchFavorites();
        }
      });
    }, options);

    observerRef.current.observe(sentinelRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [fetchFavorites, hasMore]);

  if (!products.length && !loading) {
    return <Empty description="No tienes productos favoritos" style={{ marginTop: "2rem" }} />;
  }

  return (
    <>
      <Title level={3} style={{ marginBottom: "20px" }}>
        Tus productos favoritos
      </Title>

      {/* ❌ No necesitas containerRef aquí */}
      <div style={{ width: "100%" }}>
        <Row gutter={[16, 16]}>
          {products.map((p) => {
            const discountPercent = calculateDiscountPercent(
              p.active_discount,
              p.final_price,
              p.final_price_discount
            );
            const images = getProductImages(p);
            return (
              <Col key={p.id} xs={24} sm={12} md={8} lg={6}>
                <ProductCard
                  images={images}
                  id={p.id}
                  name={p.name}
                  image={p.image_cover}
                  price={p.final_price}
                  originalPrice={p.active_discount > 0 ? p.final_price_discount : null}
                  rating={p.average_rating}
                  discountPercent={discountPercent}
                  isNew={isNewProduct(p.created_at)}
                  initialIsFavorite={p.is_favorite || false}
                />
              </Col>
            );
          })}
        </Row>

        {/* Sentinel: trigger para cargar más */}
        <div ref={sentinelRef} style={{ height: "1px" }} />

        {loading && (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <Spin size="large" />
          </div>
        )}

        {!hasMore && products.length > 0 && (
          <div style={{ textAlign: "center", padding: "1rem", color: "#888" }}>
            No hay más productos favoritos
          </div>
        )}
      </div>
    </>
  );
}