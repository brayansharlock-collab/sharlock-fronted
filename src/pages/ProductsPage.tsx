// src/pages/ProductsPage.tsx
import React, { useEffect, useState } from "react";
import { Layout, Slider, Button, Spin, Checkbox, Divider, Row, Col, Empty, Grid, Drawer, Badge, Avatar } from "antd";
import { SearchBarAntd } from "../components/ui/Search";
import { ProductCard } from "../components/ui/ProductCard";
import { productService } from "../service/productService";
import Silk from "../components/animations/Silk";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";

const { Sider, Content } = Layout;
const { useBreakpoint } = Grid;

export const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [subcategories, setSubcategories] = useState<any[]>([]);
    const [subcategoryFilters, setSubcategoryFilters] = useState<any[]>([]);

    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [selectedSubcategories, setSelectedSubcategories] = useState<number[]>([]);
    const [selectedFilters, setSelectedFilters] = useState<number[]>([]);

    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const [drawerVisible, setDrawerVisible] = useState(false);
    const screens = useBreakpoint();

    // Recuperar filtros guardados al montar
    useEffect(() => {
        const saved = localStorage.getItem("productFilters");
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed?.categories?.length) setSelectedCategory(parsed.categories[0]);
            if (parsed?.subcategories?.length) setSelectedSubcategories(parsed.subcategories);
            if (parsed?.search) setSearchTerm(parsed.search);
        }
    }, []);

    // Guardar filtros en localStorage
    useEffect(() => {
        const payload = {
            categories: selectedCategory ? [selectedCategory] : [],
            subcategories: selectedSubcategories,
            search: searchTerm || "",
        };
        localStorage.setItem("productFilters", JSON.stringify(payload));
    }, [selectedCategory, selectedSubcategories, searchTerm]);

    // cargar categorías
    useEffect(() => {
        (async () => {
            try {
                const cats = await productService.categories();
                setCategories(Array.isArray(cats) ? cats : []);
            } catch (err) {
                console.error("Error categorias:", err);
            }
        })();
    }, []);

    // cargar subcategorías cuando cambia la categoría
    useEffect(() => {
        (async () => {
            if (!selectedCategory) {
                setSubcategories([]);
                setSubcategoryFilters([]);
                return;
            }
            try {
                const selectedCat = categories.find((c) => c.id === selectedCategory);
                setSubcategories(selectedCat?.sub_category || []);
                setSubcategoryFilters([]);
            } catch (err) {
                console.error("Error subcategorias:", err);
                setSubcategories([]);
            }
        })();
    }, [selectedCategory, categories]);

    // handler seleccionar subcategoría
    const handleSelectSubcategory = async (subId: number) => {
        try {
            const data = await productService.subcategories(subId);
            setSubcategoryFilters(data.filter_name_detail || []);
            setSelectedSubcategories([subId]);
            setSelectedFilters([]);
        } catch (err) {
            console.error("Error cargando filtros de subcategoría:", err);
            setSubcategoryFilters([]);
        }
    };

    // Construye params para la API de productos
    const buildParams = () => {
        const params: any = {};
        if (selectedCategory !== null) params.category_filter_id = selectedCategory;
        if (selectedSubcategories.length > 0) {
            params.sub_category_filter_id =
                selectedSubcategories.length === 1
                    ? selectedSubcategories[0]
                    : selectedSubcategories.join(",");
        }
        if (selectedFilters.length > 0) {
            params.filters = selectedFilters.join(",");
        }
        if (searchTerm) params.search = searchTerm;
        if (priceRange?.[0] !== undefined) params.min_price = priceRange[0];
        if (priceRange?.[1] !== undefined) params.max_price = priceRange[1];
        return params;
    };

    // fetchProducts usando productService.list(params)
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = buildParams();
            const data = await productService.list(params);
            setProducts(Array.isArray(data) ? data : []);
            setFilteredProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error productos:", err);
            setProducts([]);
            setFilteredProducts([]);
        } finally {
            setLoading(false);
        }
    };

    // refrescar cuando cambian filtros o búsqueda
    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategory, selectedSubcategories, selectedFilters, priceRange, searchTerm]);

    // resetear filtros
    const resetFilters = () => {
        setSelectedCategory(null);
        setSelectedSubcategories([]);
        setSelectedFilters([]);
        setPriceRange([0, 1000000]);
        setSearchTerm("");
        setSubcategoryFilters([]);
        localStorage.removeItem("productFilters");
    };

    // handler del searchbar
    const handleSearch = (term: string) => {
        setSearchTerm(term || "");
        if (term && term.trim()) {
            setSelectedCategory(null);
            setSelectedSubcategories([]);
            setSelectedFilters([]);
            setSubcategoryFilters([]);
        }
    };

    // filtros (lo extraemos para usarlo en Sider y Drawer)
    const FiltersContent = (
        <div>
            <h3 style={{ marginBottom: 12 }}>Categorías</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {Array.isArray(categories) && categories.length > 0 ? (
                    categories.map((cat: any) => (
                        <Checkbox
                            key={cat.id}
                            checked={selectedCategory === cat.id}
                            onChange={() => {
                                setSelectedCategory(selectedCategory === cat.id ? null : cat.id);
                                setSelectedSubcategories([]);
                                setSelectedFilters([]);
                                setSubcategoryFilters([]);
                            }}
                        >
                            {cat.name}
                        </Checkbox>
                    ))
                ) : (
                    <Empty description="No hay categorías" />
                )}
            </div>

            <Divider />

            <h3 style={{ marginBottom: 12 }}>Subcategorías</h3>
            {selectedCategory ? (
                Array.isArray(subcategories) && subcategories.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {subcategories.map((sub: any) => (
                            <Checkbox
                                key={sub.id}
                                checked={selectedSubcategories.includes(sub.id)}
                                onChange={() => handleSelectSubcategory(sub.id)}
                            >
                                {sub.name}
                            </Checkbox>
                        ))}
                    </div>
                ) : (
                    <div style={{ color: "#888" }}>No se encontraron subcategorías</div>
                )
            ) : (
                <div style={{ color: "#888" }}>Selecciona una categoría</div>
            )}

            <Divider />

            <h3 style={{ marginBottom: 12 }}>Filtros</h3>
            {subcategoryFilters.length > 0 ? (
                subcategoryFilters.map((filter) => (
                    <div key={filter.id} style={{ marginBottom: 8 }}>
                        <strong>{filter.name}</strong>
                        <div style={{ display: "flex", flexDirection: "column", marginLeft: 10 }}>
                            {filter.filter_option_detail.map((opt: any) => (
                                <Checkbox
                                    key={opt.id}
                                    checked={selectedFilters.includes(opt.id)}
                                    onChange={() => {
                                        setSelectedFilters((prev) =>
                                            prev.includes(opt.id) ? prev.filter((id) => id !== opt.id) : [...prev, opt.id]
                                        );
                                    }}
                                >
                                    {opt.name} ({opt.products})
                                </Checkbox>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <div style={{ color: "#888" }}>Selecciona una subcategoría</div>
            )}

            <Divider />

            <h3 style={{ marginBottom: 12 }}>Precio</h3>
            <div style={{ padding: "0 8px" }}>
                <Slider
                    range
                    min={0}
                    max={5000000}
                    step={100}
                    value={priceRange}
                    onChange={(val) => {
                        if (Array.isArray(val)) setPriceRange([val[0], val[1]]);
                        else setPriceRange([val as number, priceRange[1]]);
                    }}
                    tipFormatter={(value) =>
                        (value || value === 0) ? Number(value).toLocaleString("es-CO", { minimumFractionDigits: 0 }) : ""
                    }
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#666" }}>
                    <span>{priceRange[0].toLocaleString("es-CO")}</span>
                    <span>{priceRange[1].toLocaleString("es-CO")}</span>
                </div>
            </div>

            <Divider />

            <Button block onClick={resetFilters} style={{ marginTop: 8 }}>
                Resetear filtros
            </Button>
        </div>
    );

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <div
                style={{
                    position: "fixed",
                    width: "100%",
                    height: "100vh",
                    zIndex: 0,
                }}
            >
                <Silk speed={10} scale={1} color="#e6e1d7" noiseIntensity={1.5} rotation={0} />
            </div>

            {/* top search */}
            <div style={{
                zIndex: 2,
                padding: 16,
                background: "linear-gradient(to bottom, #e8e2d9 50%, rgba(255,255,255,0) 100%)",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    {/* 🔹 Logo Sharlock */}
                    <div style={{
                        fontWeight: 700, fontSize: 20, color: "#000000ff",
                        whiteSpace: 'nowrap',
                        fontFamily: 'Lora, serif',
                    }}>SHARLOCK</div>

                    {/* 🔹 Buscador */}
                    <div style={{ flex: 1, margin: "0 206px" }}>
                        <SearchBarAntd onSearch={(t) => handleSearch(t)} products={products} />
                    </div>

                    {/* 🔹 Botones de acción */}
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        {/* Botón Filtros solo en móvil */}
                        {!screens.md && (
                            <Button type="primary" onClick={() => setDrawerVisible(true)}>
                                Filtros
                            </Button>
                        )}

                        {/* Carrito */}
                        <Badge count={2} size="small" offset={[-4, 4]}>
                            <ShoppingCartOutlined style={{ fontSize: 22, cursor: "pointer" }} />
                        </Badge>

                        {/* Perfil */}
                        <UserOutlined />
                    </div>
                </div>
            </div>

            <Layout>
                {/* left filters */}
                {screens.md ? (
                    <Sider
                        width={320}
                        style={{
                            margin: 30,
                            borderRadius: 16,
                            background: "#fff",
                            padding: 20,
                            color: "black",
                            boxShadow: "2px 0 8px rgba(0,0,0,0.04)",
                        }}
                    >
                        {FiltersContent}
                    </Sider>
                ) : (
                    <Drawer
                        title="Filtros"
                        placement="left"
                        onClose={() => setDrawerVisible(false)}
                        open={drawerVisible}
                        width={280}
                    >
                        {FiltersContent}
                    </Drawer>
                )}

                {/* right products */}
                <Content style={{ padding: 24 }}>
                    {loading ? (
                        <div style={{ textAlign: "center", paddingTop: 60 }}>
                            <Spin size="large" />
                        </div>
                    ) : (
                        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                            {filteredProducts.length === 0 ? (
                                <div style={{ textAlign: "center", paddingTop: 40 }}>
                                    <Empty description="No se encontraron productos" />
                                </div>
                            ) : (
                                <Row gutter={[20, 20]}>
                                    {filteredProducts.map((product: any) => {
                                        const cleanPrice = parseFloat(String(product.price).replace(/\./g, "")) || 0;
                                        const originalPrice =
                                            product.discount && product.active_discount ? cleanPrice + cleanPrice * 0.2 : undefined;
                                        return (
                                            <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                                                <ProductCard
                                                    id={product.id}
                                                    name={product.name}
                                                    image={product.image_cover}
                                                    price={cleanPrice}
                                                    originalPrice={originalPrice}
                                                    rating={product.rating || 4.5}
                                                    isNew={false}
                                                />
                                            </Col>
                                        );
                                    })}
                                </Row>
                            )}
                        </div>
                    )}
                </Content>
            </Layout>
        </Layout>
    );
};
