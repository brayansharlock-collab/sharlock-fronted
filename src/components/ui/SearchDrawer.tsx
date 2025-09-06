// src/components/SearchDrawer.tsx
import React, { useState, useEffect, useMemo } from "react";
import { Drawer, Button, Spin } from "antd";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { SearchBarAntd } from "./Search";
import { ProductCard } from "./ProductCard";
import { productService } from "../../service/productService";
import searchAnimation from "../../assets/ilustrations/search.gif";
import { Link } from "react-router-dom";

interface Subcategory {
    id: number;
    name: string;
    slug: string;
    category_detail: { id: number; name: string };
}

interface Category {
    id: number;
    name: string;
    slug: string;
    sub_category: Subcategory[];
}

interface Product {
    id: number;
    name: string;
    image_cover: string;
    price: string;
    discount: string;
    active_discount: number;
    rating?: number;
    is_active: boolean;
    subcategory: Subcategory;
}

interface SearchDrawerProps {
    isScrolled: boolean;
    onSearch?: (term: string, results: Product[]) => void;
}

export const SearchDrawer: React.FC<SearchDrawerProps> = ({ isScrolled, onSearch }) => {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [selectedSubcategories, setSelectedSubcategories] = useState<number[]>([]);

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [loading, setLoading] = useState(false);

    const [filteredResults, setFilteredResults] = useState<Product[]>([]);

    const showDrawer = () => setOpen(true);
    const onClose = () => {
        setOpen(false);
        setSearchTerm("");
        setSelectedCategories([]);
        setSelectedSubcategories([]);
    };

    useEffect(() => {
        if (open) {
            setLoading(true);
            Promise.all([
                productService.list(),
                productService.categories(),
                productService.subcategories(),
            ])
                .then(([prods, cats, subs]) => {
                    setProducts(prods);
                    setCategories(cats);
                    setSubcategories(subs);
                })
                .catch((err) => console.error("Error al cargar datos:", err))
                .finally(() => setLoading(false));
        }
    }, [open]);

    const handleCategoryToggle = (id: number) => {
        setSelectedCategories((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        );
        // when unchecking a category, also remove its subcategories
        setSelectedSubcategories((prev) =>
            prev.filter((sId) => {
                const sub = subcategories.find((s) => s.id === sId);
                return sub ? (sub.category_detail.id === id ? false : true) : true;
            })
        );
    };

    const handleSubcategoryToggle = (id: number) => {
        setSelectedSubcategories((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    };

    const filteredSubcategories = useMemo(() => {
        if (selectedCategories.length === 0) return subcategories;
        return subcategories.filter((sub) => selectedCategories.includes(sub.category_detail.id));
    }, [subcategories, selectedCategories]);

    const filteredProducts = useMemo(() => {
        const base = filteredResults.length > 0 ? filteredResults : products;

        return base.filter((product) => {
            const matchesCategory = selectedCategories.length
                ? selectedCategories.includes(product.subcategory.category_detail.id)
                : true;

            const matchesSubcategory = selectedSubcategories.length
                ? selectedSubcategories.includes(product.subcategory.id)
                : true;

            return matchesCategory && matchesSubcategory;
        });
    }, [filteredResults, products, selectedCategories, selectedSubcategories]);

    const handleSearch = (term: string, results: Product[]) => {
        setSearchTerm(term); // guardamos el término
        setFilteredResults(results); // guardamos resultados que vienen del SearchBar
        onSearch?.(term, results); // si el padre quiere escuchar
    };

    const showInitialState = !loading && !searchTerm && selectedCategories.length === 0 && selectedSubcategories.length === 0;

    return (
        <>
            {/* Ícono de búsqueda */}
            <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45 }}
                onClick={showDrawer}
                style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            >
                <SearchOutlined
                    style={{
                        fontSize: "18px",
                        color: isScrolled ? "#000" : "#fff",
                    }}
                />
            </motion.div>

            <Drawer
                title={
                    <div style={{ fontWeight: 700, fontSize: 18, color: "#111" }}>
                        🔎 Encuentra tus productos
                    </div>
                }
                placement="top"
                height="100vh"
                open={open}
                onClose={onClose}
                closeIcon={<CloseOutlined style={{ color: "#1f1f1f", fontSize: 16 }} />}
                styles={{
                    body: { padding: 0, backgroundColor: "#fff", display: "flex", flexDirection: "column" },
                    header: { borderBottom: "1px solid #eee", padding: "18px 24px" },
                }}
                maskClosable
            >
                {/* Top search area */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    style={{ padding: 24, background: "linear-gradient(90deg,#ffffff 0%, #f7fafc 100%)", borderBottom: "1px solid #f4f4f4", display: "flex", flexDirection: "column", gap: 16 }}
                >
                    <SearchBarAntd
                        products={products}
                        onSearch={handleSearch}
                        className="w-full"
                    />

                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                        <div style={{ minWidth: 240, flex: "1 1 240px" }}>
                            <div style={{ fontWeight: 600, marginBottom: 8 }}>Categorías</div>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {categories.map((cat) => {
                                    const checked = selectedCategories.includes(cat.id);
                                    return (
                                        <motion.label
                                            key={cat.id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 8,
                                                padding: "8px 12px",
                                                borderRadius: 10,
                                                background: checked ? "#eef6ff" : "#fff",
                                                boxShadow: checked ? "0 6px 18px rgba(10,40,100,0.06)" : "0 4px 12px rgba(15,15,15,0.02)",
                                                cursor: "pointer",
                                                userSelect: "none",
                                                border: "1px solid rgba(0,0,0,0.04)",
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() => handleCategoryToggle(cat.id)}
                                                style={{ width: 16, height: 16 }}
                                            />
                                            <span style={{ fontSize: 13 }}>{cat.name}</span>
                                        </motion.label>
                                    );
                                })}
                            </div>
                        </div>

                        <div style={{ minWidth: 240, flex: "1 1 240px" }}>
                            <div style={{ fontWeight: 600, marginBottom: 8 }}>Subcategorías</div>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {filteredSubcategories.map((sub) => {
                                    const checked = selectedSubcategories.includes(sub.id);
                                    return (
                                        <motion.label
                                            key={sub.id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 8,
                                                padding: "6px 10px",
                                                borderRadius: 8,
                                                background: checked ? "#fff7ed" : "#fff",
                                                boxShadow: checked ? "0 6px 18px rgba(100,50,10,0.06)" : "0 4px 12px rgba(15,15,15,0.02)",
                                                cursor: "pointer",
                                                userSelect: "none",
                                                border: "1px solid rgba(0,0,0,0.03)",
                                                fontSize: 13,
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() => handleSubcategoryToggle(sub.id)}
                                                style={{ width: 14, height: 14 }}
                                            />
                                            <span>{sub.name}</span>
                                        </motion.label>
                                    );
                                })}
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <Button onClick={() => { setSearchTerm(""); setSelectedCategories([]); setSelectedSubcategories([]); }}>
                                Quitar todos los filtros
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Results area */}
                <div style={{ flex: 1, padding: 24, overflowY: "auto", backgroundColor: "#fbfcfe" }}>
                    {loading ? (
                        <div style={{ textAlign: "center", marginTop: 80 }}>
                            <Spin size="large" />
                            <p style={{ marginTop: 12, fontSize: 16, color: "#666" }}>Cargando productos...</p>
                        </div>
                    ) : showInitialState ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} style={{ textAlign: "center", marginTop: 80, color: "#555", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                            <img src={searchAnimation} alt="Empieza tu búsqueda" style={{ width: "20%", maxWidth: 320, opacity: 0.95 }} />
                            <h2 style={{ marginTop: 24, fontWeight: 700, fontSize: 20 }}>¿Qué estás buscando hoy?</h2>
                            <p style={{ fontSize: 15, color: "#7a7a7a" }}>Usa la barra y los filtros para encontrar tus productos favoritos</p>
                        </motion.div>
                    ) : filteredProducts.length > 0 ? (
                        <div>
                            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: 24 }}>
                                <Link to="/productos">
                                    <Button variant="outlined">Ver más productos</Button>
                                </Link>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: 16 }}>
                                {filteredProducts.slice(0, 6).map((product) => {
                                    const cleanPrice = parseFloat(product.price.replace(/\./g, "")) || 0;
                                    const originalPrice =
                                        product.discount && product.active_discount
                                            ? cleanPrice + cleanPrice * 0.2
                                            : undefined;

                                    return (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ duration: 0.35 }}
                                            style={{ borderRadius: 12 }}
                                        >
                                            <ProductCard
                                                id={product.id}
                                                name={product.name}
                                                image={product.image_cover}
                                                price={cleanPrice}
                                                originalPrice={originalPrice}
                                                rating={product.rating || 4.5}
                                                isNew={false}
                                            />
                                        </motion.div>
                                    );
                                })}
                            </div>

                        </div>
                    ) : (
                        <div style={{ textAlign: "center", marginTop: 80, color: "#999", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                            <img src="/src/assets/ilustrations/search.svg" alt="Sin resultados" style={{ width: "50%", maxWidth: 300, opacity: 0.75 }} />
                            <h3 style={{ marginTop: 24, fontSize: 18 }}>No se encontraron productos</h3>
                            <p style={{ fontSize: 15 }}>Intenta con otro término o ajusta los filtros.</p>
                        </div>
                    )}
                </div>
            </Drawer>
        </>
    );
};
