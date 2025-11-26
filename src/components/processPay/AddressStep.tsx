import { useState, useEffect } from "react";
import { Button, List, Typography, message } from "antd";
import { addressService } from "../../service/addressService";
import AddressFormModal from "../profile/AddressModal";

const { Text } = Typography;

export default function AddressStep({ checkoutData, setCheckoutData }: any) {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const data = await addressService.getAll();
      setAddresses(data);

      if (data.length > 0 && !checkoutData.selectedAddress) {
        const principal = data.find((a: any) => a.is_principal);
        setCheckoutData((prev: any) => ({
          ...prev,
          selectedAddress: principal || data[0],
        }));
      }
    } catch (err) {
      message.error("Error al cargar direcciones");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (addr: any) => {
    setCheckoutData((prev: any) => ({
      ...prev,
      selectedAddress: addr,
    }));
  };

  const handleAddressSaved = () => {
    setModalOpen(false);
    loadAddresses();
  };

  return (
    <>
      <Text strong>Selecciona tu dirección de envío</Text>
      <List
        loading={loading}
        dataSource={addresses}
        style={{
          height: "30vh",
          overflowY: "auto",
        }}
        renderItem={(item) => {
          const isSelected =
            checkoutData.selectedAddress?.id != null &&
            String(checkoutData.selectedAddress.id) === String(item.id);

          return (
            <List.Item
              style={{
                cursor: "pointer",
                backgroundColor: isSelected ? "#e6f7ff" : "transparent",
                borderLeft: isSelected ? "3px solid #7a6449" : "none",
                paddingLeft: isSelected ? "12px" : "15px",
                transition: "background-color 0.2s, border-left 0.2s",
              }}
              onClick={() => handleSelect(item)}
            >
              {item.address}, {item.city?.name}
              {item.is_principal && <Text type="success"> (Principal)</Text>}
            </List.Item>
          );
        }}
      />

      <Button
        type="link"
        style={{ marginTop: "1rem", color: "#7a6449" }}
        onClick={() => setModalOpen(true)}
      >
        + Agregar nueva dirección
      </Button>

      {!checkoutData.selectedAddress && (
        <Text type="danger" style={{ display: "block", marginTop: "1rem" }}>
          Debes seleccionar una dirección para continuar.
        </Text>
      )}

      <AddressFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={handleAddressSaved}
      />
    </>
  );
}