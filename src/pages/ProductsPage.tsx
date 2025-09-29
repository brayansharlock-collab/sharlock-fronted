// src/pages/ProductsPage.tsx
import React, { useEffect, useRef, useState } from "react";
import { Layout, Slider, Button, Spin, Checkbox, Divider, Row, Col, Empty, Grid, Drawer, Badge } from "antd";
import { SearchBarAntd } from "../components/ui/Search";
import { ProductCard } from "../components/ui/ProductCard";
import { productService } from "../service/productService";
import { CloseOutlined, SearchOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cartService } from "../service/cartService";
// import searchAnimation from "../../src/assets/ilustrations/search.gif";

const { Sider, Content } = Layout;
const { useBreakpoint } = Grid;

export const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [subcategories, setSubcategories] = useState<any[]>([]);
    const [subcategoryFilters, setSubcategoryFilters] = useState<any[]>([]);
    const [showSearch, setShowSearch] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [selectedSubcategories, setSelectedSubcategories] = useState<number[]>([]);
    const [selectedFilters, setSelectedFilters] = useState<number[]>([]);

    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [restored, setRestored] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [cartCount, setCartCount] = useState(2);
    const screens = useBreakpoint();
    const lastFetchId = useRef(0);

    const [userChangedFilters, setUserChangedFilters] = useState(false);

    const [derivedCategory, setDerivedCategory] = useState<number | null>(null);

    const displayedCategory = searchTerm ? (userChangedFilters ? selectedCategory : derivedCategory) : selectedCategory;

    // Recuperar filtros guardados al montar
    useEffect(() => {
        if (restored) return;

        const saved = localStorage.getItem("productFilters");
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed?.categories?.length) setSelectedCategory(parsed.categories[0]);
            if (parsed?.subcategories?.length) setSelectedSubcategories(parsed.subcategories);
            if (parsed?.search) setSearchTerm(parsed.search);
        }

        setRestored(true);
    }, [restored]);

    useEffect(() => {
        const fetchCartCount = async () => {
            try {
                const data = await cartService.getCart();
                // 👇 El count viene directo de la API
                setCartCount(data?.data?.count || 0);
            } catch (err) {
                console.error("Error al obtener el carrito", err);
                setCartCount(0);
            }
        };

        fetchCartCount();
    }, []);

    // guardar filtros solo después de haber restaurado
    useEffect(() => {
        if (!restored) return;

        const payload = {
            categories: selectedCategory ? [selectedCategory] : [],
            subcategories: selectedSubcategories,
            search: searchTerm || "",
        };
        localStorage.setItem("productFilters", JSON.stringify(payload));
    }, [selectedCategory, selectedSubcategories, searchTerm, restored]);

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

            setUserChangedFilters(true);
        } catch (err) {
            console.error("Error cargando filtros de subcategoría:", err);
            setSubcategoryFilters([]);
        }
    };


    // Construye params para la API de productos
    const buildParams = () => {
        const body: any = {};
        if (searchTerm) {
            body.search = searchTerm;
        } else {
            if (selectedCategory !== null) body.category_filter_id = selectedCategory;
            if (selectedSubcategories.length > 0) {
                body.sub_category_filter_id =
                    selectedSubcategories.length === 1
                        ? selectedSubcategories[0]
                        : selectedSubcategories.join(",");
            }
            if (selectedFilters.length > 0) {
                body.filters = selectedFilters.join(",");
            }
        }
        if (priceRange?.[0] !== undefined) body.min_price = priceRange[0];
        if (priceRange?.[1] !== undefined) body.max_price = priceRange[1];
        return body;
    };

    // fetchProducts usando productService.list(params)
    const fetchProducts = async () => {
        const fetchId = ++lastFetchId.current;
        try {
            setLoading(true);
            const body = buildParams();
            const data = await productService.list(body);

            if (fetchId !== lastFetchId.current) return;

            const results = Array.isArray(data) ? data : [];
            setProducts(results);
            setFilteredProducts(results);

            if (searchTerm && results.length > 0) {
                const uniqueCategoryIds = Array.from(
                    new Set(results.map((p: any) => p.subcategory?.category_detail?.id).filter(Boolean))
                );

                const uniqueSubcatObjs = results
                    .map((p: any) => p.subcategory)
                    .filter(Boolean)
                    .reduce((acc: any[], cur: any) => {
                        if (!acc.some((s) => s.id === cur.id)) acc.push(cur);
                        return acc;
                    }, []);

                setDerivedCategory(uniqueCategoryIds.length === 1 ? uniqueCategoryIds[0] : null);

                if (uniqueCategoryIds.length === 1) {
                    const foundCat = categories.find((c) => c.id === uniqueCategoryIds[0]);
                    if (foundCat) {
                        setSubcategories(foundCat.sub_category || []);
                    } else {
                        setSubcategories(uniqueSubcatObjs);
                    }
                } else {
                    setSubcategories(uniqueSubcatObjs);
                }
            } else {
                setDerivedCategory(null);
                if (!selectedCategory) setSubcategories([]);
            }
        } catch (err) {
            if (fetchId !== lastFetchId.current) return;
            console.error("Error productos:", err);
            setProducts([]);
            setFilteredProducts([]);
        } finally {
            if (fetchId === lastFetchId.current) setLoading(false);
        }
    };

    useEffect(() => {
        if (!restored) return;
        fetchProducts();
    }, [selectedCategory, selectedSubcategories, selectedFilters, priceRange, searchTerm]);

    // resetear filtros
    const resetFilters = () => {
        setSelectedCategory(null);
        setSelectedSubcategories([]);
        setSelectedFilters([]);
        setPriceRange([0, 1000000]);
        setSearchTerm("");
        setSubcategoryFilters([]);
        setUserChangedFilters(false);
        localStorage.removeItem("productFilters");
    };

    // handler del searchbar
    const handleSearch = (value: string) => {
        const trimmed = value?.trim() ?? "";
        setSearchTerm(value);

        if (trimmed === "") {
            setDerivedCategory(null);
            setSelectedCategory(null);
            setSelectedSubcategories([]);
            setSelectedFilters([]);
            setSubcategoryFilters([]);
        } else {
            setUserChangedFilters(false);
            setDerivedCategory(null);
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
                            checked={displayedCategory === cat.id}
                            onChange={() => {
                                const newCat = selectedCategory === cat.id ? null : cat.id;
                                setSelectedCategory(newCat);
                                setSelectedSubcategories([]);
                                setSelectedFilters([]);
                                setSubcategoryFilters([]);

                                setUserChangedFilters(true);
                                setDerivedCategory(null);
                                setSearchTerm("");
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
            {displayedCategory ? (
                Array.isArray(subcategories) && subcategories.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {subcategories.map((sub: any) => (
                            <Checkbox
                                key={sub.id}
                                checked={selectedSubcategories.includes(sub.id)}
                                onChange={() => {
                                    handleSelectSubcategory(sub.id);

                                    // si venías de búsqueda, haz transición al modo manual
                                    if (searchTerm) {
                                        setSearchTerm("");
                                        setDerivedCategory(null);
                                    }

                                    setUserChangedFilters(true);
                                }}
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
            {/* <div
                style={{
                    position: "fixed",
                    width: "100%",
                    height: "100vh",
                    zIndex: 0,
                }}
            >
                <Silk speed={10} scale={1} color="#e6e1d7" noiseIntensity={1.5} rotation={0} />
            </div> */}

            <div
                style={{
                    zIndex: 2,
                    padding: 16,
                    background: "white",
                    position: "relative",
                    backgroundColor: "#ffffffdd",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Link to="/" style={{ textDecoration: "none" }}>
                        <div
                            style={{
                                fontWeight: 700,
                                fontSize: 20,
                                marginLeft: 30,
                                color: "#000000ff",
                                whiteSpace: "nowrap",
                                fontFamily: "Lora, serif",
                            }}
                        >
                            SHARLOCK
                        </div>
                    </Link>

                    {screens.md && (
                        <div
                            style={{
                                flex: 1,
                                margin: "0 20px",
                                maxWidth: "600px",
                            }}
                        >
                            <SearchBarAntd
                                onSearch={(t) => handleSearch(t)}
                                products={products}
                            />
                        </div>
                    )}

                    <div style={{ display: "flex", alignItems: "center", gap: 16, color: "black" }}>
                        {!screens.lg && (
                            <Button type="dashed" onClick={() => setDrawerVisible(true)}>
                                Filtros
                            </Button>
                        )}
                        {!screens.md && (
                            <SearchOutlined
                                style={{ fontSize: 22, cursor: "pointer" }}
                                onClick={() => setShowSearch(true)}
                            />
                        )}

                        <Link to="/profile" style={{ textDecoration: "none" }}>
                            <UserOutlined style={{ color: "black", fontSize: 22, cursor: "pointer" }} />
                        </Link>
                        <Link to="/CarPage" style={{ textDecoration: "none" }}>
                            <Badge count={cartCount} size="small" offset={[-4, 4]}>
                                <ShoppingCartOutlined style={{ fontSize: 22, cursor: "pointer" }} />
                            </Badge>
                        </Link>
                    </div>
                </div>

                <AnimatePresence>
                    {!screens.md && showSearch && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            style={{
                                position: "absolute",
                                top: "100%", // justo debajo del nav
                                left: 0,
                                right: 0,
                                background: "white",
                                padding: "12px 16px",
                                zIndex: 99,
                                color: "black",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <SearchBarAntd
                                    onSearch={(t) => {
                                        handleSearch(t);
                                        setShowSearch(false);
                                    }}
                                    products={products}
                                />
                                <CloseOutlined
                                    style={{ fontSize: 20, cursor: "pointer" }}
                                    onClick={() => setShowSearch(false)}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Layout>
                {screens.lg ? (
                    <Sider
                        width={250}
                        style={{
                            background: "#fff",
                            padding: 20,
                            color: "black",
                        }}
                    >
                        {FiltersContent}
                    </Sider>
                ) : (
                    <Drawer
                        title="Filtros"
                        placement="left"
                        onClose={() => setDrawerVisible(false)}
                        style={{ background: '#e5e1d7' }}
                        open={drawerVisible}
                        width={280}
                    >
                        {FiltersContent}
                    </Drawer>
                )}

                {/* right products */}
                <Content style={{ padding: 24, background: '#e5e1d7' }}>
                    {loading ? (
                        <div style={{ textAlign: "center", paddingTop: 60 }}>
                            <Spin size="large" />
                        </div>
                    ) : (
                        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                            {filteredProducts.length === 0 ? (
                                <div style={{ textAlign: "center", paddingTop: 40 }}>
                                    <Empty
                                        description="No se encontraron productos"
                                    // image={
                                    //     <img
                                    //         src={searchAnimation}
                                    //         alt="Sin resultados"
                                    //          style={{ width: "20%", height: 150,  maxWidth: 320, opacity: 0.95 }} 
                                    //     />
                                    // }
                                    />
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
                                                    initialIsFavorite={product.is_favorite || false}
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