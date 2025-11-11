// src/pages/ProductsPage.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Layout, Slider, Button, Spin, Checkbox, Divider, Row, Col, Empty, Grid, Drawer, Badge } from "antd";
import { SearchBarAntd } from "../components/ui/Search";
import { ProductCard } from "../components/ui/ProductCard";
import { productService } from "../service/productService";
import { CloseOutlined, SearchOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cartService } from "../service/cartService";
import { isNewProduct } from "../utils/dateUtils";
import { calculateDiscountPercent, getProductImages } from "../utils/productUtils";
import FooterHome from "../components/ui/footerHome";
import { useDebouncedCallback } from "use-debounce";

const { Sider, Content } = Layout;
const { useBreakpoint } = Grid;

export const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [subcategories, setSubcategories] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [selectedFilters, setSelectedFilters] = useState<number[]>([]);
    const [subcategoryFilters, setSubcategoryFilters] = useState<any[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
    const [selectedSubcategories, setSelectedSubcategories] = useState<number[]>([]);

    const loadingRef = useRef(false);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [restored, setRestored] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [userChangedFilters, setUserChangedFilters] = useState(false);

    const [derivedSubcategory, setDerivedSubcategory] = useState<number | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [derivedCategory, setDerivedCategory] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [cartCount, setCartCount] = useState(2);
    const screens = useBreakpoint();

    const pageRef = useRef(1);
    const lastFetchId = useRef(0);

    const displayedCategory = searchTerm ? (userChangedFilters ? selectedCategory : derivedCategory) : selectedCategory;
    const displayedSubcategory = searchTerm ? (userChangedFilters ? selectedSubcategories[0] : derivedSubcategory) : selectedSubcategories[0];


    const debouncedSetPrice = useDebouncedCallback((val: [number, number]) => {
        setPriceRange(val);
    }, 400);

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
                const data = await cartService.getCountCar();
                setCartCount(data?.data || 0);
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
            setSelectedSubcategories([]);
        }
    };

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
                body.filters = selectedFilters;
            }
        }
        if (priceRange?.[0] !== undefined) body.min_price = priceRange[0];
        if (priceRange?.[1] !== undefined) body.max_price = priceRange[1];
        return body;
    };

    const productsRef = useRef<any[]>([]);
    useEffect(() => {
        productsRef.current = products;
    }, [products]);

    const fetchProducts = useCallback(async (append = false) => {
        if (loadingRef.current) return;
        loadingRef.current = true;

        const currentFetchId = ++lastFetchId.current;
        const currentPage = append ? pageRef.current : 1;

        try {
            const body = buildParams();
            const res = await productService.list(body, pageRef.current);


            if (currentFetchId !== lastFetchId.current) return;

            const results = Array.isArray(res.data) ? res.data : [];
            const total = res.total || 0;

            setProducts(prev => {
                const newProducts = append ? [...prev, ...results] : results;

                const uniqueProducts = newProducts.filter(
                    (p, i, self) => i === self.findIndex(x => x.id === p.id)
                );

                setFilteredProducts(uniqueProducts);

                setHasMore(uniqueProducts.length < total);

                if (append && results.length > 0) {
                    pageRef.current = currentPage + 1;
                } else {
                    pageRef.current = 2;
                }

                return uniqueProducts;
            });

            if (searchTerm && results.length > 0) {
                const uniqueCategoryIds = Array.from(
                    new Set(results.map((p: any) => p.subcategory?.category_detail?.id).filter(Boolean))
                );

                const uniqueSubCategoryIds = Array.from(
                    new Set(results.map((p: any) => p.subcategory?.id).filter(Boolean))
                );

                const uniqueSubcatObjs = results
                    .map((p: any) => p.subcategory)
                    .filter(Boolean)
                    .reduce((acc: any[], cur: any) => {
                        if (!acc.some((s) => s.id === cur.id)) acc.push(cur);
                        return acc;
                    }, []);

                const derivedCat = uniqueCategoryIds.length === 1 ? uniqueCategoryIds[0] : null;
                const derivedSubcatId = uniqueSubcatObjs.length === 1 ? uniqueSubCategoryIds[0] : null;

                setDerivedCategory(derivedCat);
                setDerivedSubcategory(derivedSubcatId);

                if (derivedCat) {
                    const foundCat = categories.find((c) => c.id === derivedCat);
                    if (foundCat) {
                        setSubcategories(foundCat.sub_category || []);
                    } else {
                        setSubcategories(uniqueSubcatObjs);
                    }
                } else {
                    setSubcategories(uniqueSubcatObjs);
                }

                // --- 🚀 Si solo hay una subcategoría y no hubo cambios manuales ---
                if (derivedCat && derivedSubcatId && !userChangedFilters) {
                    setSelectedCategory(derivedCat);
                    setSelectedSubcategories([derivedSubcatId]);

                    // Espera un ciclo de renderizado antes de ejecutar
                    setTimeout(() => {
                        handleSelectSubcategory(derivedSubcatId);
                    }, 0);
                }
            } else {
                setDerivedCategory(null);
                setDerivedSubcategory(null);
                if (!selectedCategory) setSubcategories([]);
            }


        } catch (err) {
            if (currentFetchId !== lastFetchId.current) return;
            console.error("Error productos:", err);
            if (!append) {
                setProducts([]);
                setFilteredProducts([]);
            }
        } finally {
            loadingRef.current = false;
            setLoading(false);
            setLoadingMore(false);
        }
    }, [buildParams]);

    useEffect(() => {
        const handleScroll = () => {
            if (!hasMore || loadingRef.current) return;
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            if (scrollY + windowHeight >= documentHeight - 500) {
                setLoadingMore(true);
                fetchProducts(true);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasMore, fetchProducts]);

    const handleLoadMore = () => {
        if (hasMore && !loadingRef.current) {
            setLoadingMore(true);
            fetchProducts(true);
        }
    };

    useEffect(() => {
        if (!restored) return;

        setLoading(true);
        pageRef.current = 1;
        fetchProducts(false);
    }, [restored, selectedCategory, selectedSubcategories, selectedFilters, priceRange, searchTerm]);

    const resetFilters = () => {
        setSelectedCategory(null);
        setSelectedSubcategories([]);
        setSelectedFilters([]);
        setPriceRange([0, 10000000]);
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
            setDerivedSubcategory(null);
            setSelectedCategory(null);
            setSelectedSubcategories([]);
            setSelectedFilters([]);
            setSubcategoryFilters([]);
        } else {
            setUserChangedFilters(false);
            setDerivedCategory(null);
            setDerivedSubcategory(null);
        }
    };

    const FiltersContent = (
        <div>
            <h2 style={{ marginBottom: 12 }}>Categorías</h2>
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
                                setDerivedSubcategory(null);
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

            <h2 style={{ marginBottom: 12 }}>Subcategorías</h2>
            {displayedCategory ? (
                Array.isArray(subcategories) && subcategories.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {subcategories.map((sub: any) => (
                            <Checkbox
                                key={sub.id}
                                checked={selectedSubcategories.includes(sub.id)}
                                onChange={() => {
                                    handleSelectSubcategory(sub.id);

                                    if (searchTerm) {
                                        setSearchTerm("");
                                        setDerivedCategory(null);
                                        setDerivedSubcategory(null);
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

            <h2 style={{ marginBottom: 12 }}>Filtros</h2>
            {displayedSubcategory ? (
                subcategoryFilters.map((filter) => (
                    <div key={filter.id} style={{ marginBottom: 8 }}>
                        <h3 style={{ marginBottom: 12 }}>{filter.name}</h3>
                        <div style={{ display: "flex", flexDirection: "column", marginLeft: 10 }}>
                            {filter.filter_option_detail.map((opt: any) => (
                                <div key={opt.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                                    <Checkbox
                                        key={opt.id}
                                        checked={selectedFilters.includes(opt.id)}
                                        onChange={() => {
                                            setSelectedFilters((prev) =>
                                                prev.includes(opt.id) ? prev.filter((id) => id !== opt.id) : [...prev, opt.id]
                                            );
                                        }}
                                    >
                                        {opt.name}
                                    </Checkbox>
                                    <span>
                                        ({opt.products})
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <div style={{ color: "#888" }}>Selecciona una subcategoría</div>
            )}

            <Divider />

            <h2 style={{ marginBottom: 12 }}>Precio</h2>
            <div style={{ padding: "0 8px" }}>
                <Slider
                    range
                    min={0}
                    max={10000000}
                    step={50000}
                    value={priceRange}
                    onChange={(val) => {
                        if (Array.isArray(val)) {
                            const [min, max] = val;
                            const roundedMin = Math.max(0, Math.round(min / 100000) * 100000);
                            const roundedMax = Math.max(0, Math.round(max / 100000) * 100000);
                            setPriceRange([roundedMin, roundedMax]);
                            debouncedSetPrice([roundedMin, roundedMax]);
                        }
                    }}
                    tooltip={{
                        formatter: (value) =>
                            value !== undefined
                                ? `$ ${value.toLocaleString("es-CO", { minimumFractionDigits: 0 })}`
                                : "",
                    }}
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
                    zIndex: 2,
                    padding: 16,
                    background: "white",
                    position: "relative",
                    backgroundColor: "#ffffffdd",
                    //    position: 'sticky', top: 0,
                    //     background: '#20c5eadd',
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
                                marginLeft: 35,
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
                                top: "100%",
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
                        style={{ position: 'sticky', top: 0, height: "100vh", background: '#fff', padding: 20, color: 'black', overflowY: 'auto' }}
                    >
                        {FiltersContent}
                    </Sider>
                ) : (
                    <Drawer
                        title="Filtros"
                        placement="left"
                        onClose={() => setDrawerVisible(false)}
                        style={{ background: "#e5e1d7", height: "100dvh" }}
                        open={drawerVisible}
                        width={280}
                    >
                        {FiltersContent}
                    </Drawer>
                )}

                {/* right products */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '9vh',
                    background: '#ffffff',
                    width: "100%"
                }}>
                    <Content style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: 0,
                    }}>
                        {loading ? (
                            <div style={{ textAlign: "center", minHeight: "60vh", paddingTop: 60 }}>
                                <Spin size="large" />
                            </div>
                        ) : (
                            <div style={{ margin: "0 auto", padding: 30 }}>
                                {filteredProducts.length === 0 ? (
                                    <div style={{ textAlign: "center", paddingTop: 40 }}>
                                        <Empty description="No se encontraron productos" />
                                    </div>
                                ) : (
                                    <>
                                        <Row gutter={[20, 20]}>
                                            {filteredProducts.map((product: any) => {
                                                const discountPercent = calculateDiscountPercent(
                                                    product.active_discount,
                                                    product.final_price,
                                                    product.final_price_discount
                                                );
                                                const images = getProductImages(product);
                                                return (
                                                    <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                                                        <ProductCard
                                                            images={images}
                                                            id={product.id}
                                                            name={product.name}
                                                            image={product.image_cover}
                                                            price={product.final_price_discount}
                                                            originalPrice={product.active_discount > 0 ? product.final_price : null}
                                                            rating={product.average_rating}
                                                            discountPercent={discountPercent}
                                                            isNew={isNewProduct(product.created_at)}
                                                            initialIsFavorite={product.is_favorite || false}
                                                        />
                                                    </Col>
                                                );
                                            })}
                                        </Row>

                                        {hasMore && (
                                            <div style={{ textAlign: "center", marginTop: "40px" }}>
                                                <Button
                                                    onClick={handleLoadMore}
                                                    loading={loadingMore}
                                                    disabled={loadingMore}
                                                >
                                                    {loadingMore ? "Cargando..." : "Ver más productos"}
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </Content>

                    {/* Footer fijado abajo */}
                    <div style={{ marginTop: 10 }}>
                        <FooterHome />
                    </div>
                </div>
            </Layout>
        </Layout>
    );
};