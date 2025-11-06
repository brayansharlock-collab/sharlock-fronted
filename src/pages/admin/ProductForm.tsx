import { useState } from "react";
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

    const handleAddStock = () => setStocks([...stocks, { media: [] }]);

    const handleStockChange = (index: number, updated: StockItem) => {
        const newStocks = [...stocks];
        newStocks[index] = updated;
        setStocks(newStocks);
    };


    const handleSubmit = async (values: ProductFormValues) => {
        setLoading(true)

        try {
            await productService.createProductWithStocks(values, imageCover, stocks)
            message.success("✅ Producto creado correctamente")

            form.resetFields()
            setStocks([])
            setImageCover(null)
        } catch (error) {
            console.error(error)
            message.error("❌ Error al crear el producto")
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteStock = (index: number) => {
        const updatedStocks = stocks.filter((_, i) => i !== index)
        setStocks(updatedStocks)
    }

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
            <Card
                style={{
                    borderRadius: 20,
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    style={{ marginTop: 10 }}
                >
                    <Row gutter={24}>
                        {/* <Col xs={24} md={12}>
                            <Form.Item
                                label="Activo"
                                name="is_active"
                                valuePropName="checked"
                                tooltip="Activa o desactiva el producto en el catálogo"
                            >
                                <Switch defaultChecked />
                            </Form.Item>
                        </Col> */}

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
                            <Form.Item label="Descripción" name="description">
                                <Input.TextArea
                                    rows={13}
                                    placeholder="Describe brevemente el producto..."
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Subcategoría"
                                name="subcategory"
                                rules={[{ required: true, message: "Selecciona una subcategoría" }]}
                            >
                                <Select
                                    placeholder="Selecciona una opción"
                                    options={[
                                        { label: "Ropa", value: 3 },
                                        { label: "Accesorios", value: 4 },
                                    ]}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item label="Imagen principal del producto">
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
