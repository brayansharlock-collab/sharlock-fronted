import { useState, useEffect } from "react";
import {
    Form,
    Input,
    InputNumber,
    Button,
    Select,
    Upload,
    message,
    Card,
    Divider,
    Row,
    Col,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import ProductStockForm from "../../components/admin/ProductStockForm";
import { productService } from "../../service/productService";

interface MediaItem {
    file: File;
    is_image: boolean;
    order: number;
}

interface StockItem {
    size?: string;
    color?: string;
    quantity?: number;
    media?: MediaItem[];
}

interface ProductFormValues {
    is_active: boolean;
    name: string;
    description?: string;
    price: number;
    subcategory: number;
}

const ProductForm = () => {
    const [form] = Form.useForm<ProductFormValues>();
    const [stocks, setStocks] = useState<StockItem[]>([]);
    const [imageCover, setImageCover] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // ✅ NUEVOS ESTADOS
    const [categories, setCategories] = useState<any[]>([]);
    const [subcategories, setSubcategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    // ✅ Cargar categorías
    useEffect(() => {
        (async () => {
            try {
                const cats = await productService.categories();
                setCategories(Array.isArray(cats) ? cats : []);
            } catch (err) {
                console.error("Error categorías:", err);
            }
        })();
    }, []);

    // ✅ Cargar subcategorías según categoría seleccionada
    useEffect(() => {
        (async () => {
            if (!selectedCategory) {
                setSubcategories([]);
                return;
            }

            try {
                const selectedCat = categories.find((c) => c.id === selectedCategory);
                setSubcategories(selectedCat?.sub_category || []);
            } catch (err) {
                console.error("Error subcategorías:", err);
                setSubcategories([]);
            }
        })();
    }, [selectedCategory, categories]);

    const handleAddStock = () => setStocks([...stocks, { media: [] }]);

    const handleStockChange = (index: number, updated: StockItem) => {
        const newStocks = [...stocks];
        newStocks[index] = updated;
        setStocks(newStocks);
    };

    const handleDeleteStock = (index: number) => {
        const updatedStocks = stocks.filter((_, i) => i !== index);
        setStocks(updatedStocks);
    };

    const [messageApi, contextHolder] = message.useMessage();

    const handleSubmit = async (values: ProductFormValues) => {
        if (!imageCover) {
            messageApi.open({
                type: 'error',
                content: '❌ Debes subir una imagen principal del producto',
            });
            return;
        }

        if (stocks.length === 0) {
            messageApi.open({
                type: 'error',
                content: '❌ Debes añadir al menos una variante de producto',
            });
            return;
        }

        for (const [i, stock] of stocks.entries()) {
            if (!stock.size || !stock.color || !stock.quantity) {
                messageApi.open({
                    type: 'warning',
                    content: `⚠️ Completa todos los campos en la variante #${i + 1}`,
                });
                return;
            }
            if (!stock.media || stock.media.length === 0) {
                messageApi.open({
                    type: 'warning',
                    content: `⚠️ Debes subir al menos una imagen en la variante #${i + 1}`,
                });
                return;
            }
        }

        setLoading(true);

        try {
            await productService.createProductWithStocks(values, imageCover, stocks);

            messageApi.open({
                type: 'success',
                content: '✅ Producto creado correctamente',
            });

            form.resetFields();
            setStocks([]);
            setImageCover(null);
        } catch (error) {
            console.error(error);
            messageApi.open({
                type: 'error',
                content: '❌ Error al crear el producto',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
                margin: "0 auto",
                padding: "40px 20px",
            }}
        >
            {contextHolder}
            <Card style={{ borderRadius: 20 }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    style={{ marginTop: 10 }}
                >
                    <Row gutter={24}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Nombre del producto"
                                name="name"
                                rules={[{ required: true, message: "El nombre es obligatorio" }]}
                            >
                                <Input placeholder="Ejemplo: Camiseta Oversize" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Precio"
                                name="price"
                                rules={[{ required: true, message: "El precio es obligatorio" }]}
                            >
                                <InputNumber
                                    prefix="$"
                                    min={0}
                                    style={{ width: "100%" }}
                                    placeholder="79000"
                                />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                label="Descripción"
                                name="description"
                                rules={[{ required: true, message: "La descripción es obligatoria" }]}
                            >
                                <Input.TextArea
                                    rows={13}
                                    placeholder="Describe brevemente el producto..."
                                />
                            </Form.Item>
                        </Col>

                        {/* ✅ Select de Categoría */}
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Categoría"
                                name="category"
                                rules={[{ required: true, message: "Selecciona una categoría" }]}
                            >
                                <Select
                                    placeholder="Selecciona una categoría"
                                    options={categories.map((cat) => ({
                                        label: cat.name,
                                        value: cat.id,
                                    }))}
                                    onChange={(val) => setSelectedCategory(val)}
                                />
                            </Form.Item>
                        </Col>

                        {/* ✅ Select dependiente de Subcategoría */}
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Subcategoría"
                                name="subcategory"
                                rules={[{ required: true, message: "Selecciona una subcategoría" }]}
                            >
                                <Select
                                    placeholder={
                                        selectedCategory
                                            ? "Selecciona una subcategoría"
                                            : "Selecciona una categoría primero"
                                    }
                                    disabled={!selectedCategory}
                                    options={subcategories.map((sub: any) => ({
                                        label: sub.name,
                                        value: sub.id,
                                    }))}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item label="Imagen principal del producto" required>
                                <Upload
                                    listType="picture-card"
                                    beforeUpload={() => false}
                                    maxCount={1}
                                    onChange={({ fileList }) => setImageCover(fileList[0])}
                                >
                                    {imageCover ? null : (
                                        <div>
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>Subir imagen</div>
                                        </div>
                                    )}
                                </Upload>
                                {!imageCover && (
                                    <div style={{ color: "red", fontSize: 12 }}>
                                        ⚠️ La imagen principal es obligatoria
                                    </div>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider style={{ margin: "40px 0 20px" }}>
                        <span style={{ fontWeight: 600, fontSize: 16 }}>
                            📦 Variantes del producto
                        </span>
                    </Divider>

                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {stocks.map((s, i) => (
                            <ProductStockForm
                                key={i}
                                index={i}
                                value={s}
                                onChange={(updated) => handleStockChange(i, updated)}
                                onDelete={handleDeleteStock}
                            />
                        ))}

                        <Button
                            type="dashed"
                            onClick={handleAddStock}
                            block
                            icon={<PlusOutlined />}
                        >
                            Añadir Variante (Stock)
                        </Button>
                    </div>

                    <div style={{ textAlign: "center", marginTop: 40 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            loading={loading}
                            style={{
                                borderRadius: 10,
                                padding: "0 40px",
                                fontWeight: 600,
                            }}
                        >
                            Crear Producto
                        </Button>
                    </div>
                </Form>
            </Card>
        </motion.div>
    );
};

export default ProductForm;
