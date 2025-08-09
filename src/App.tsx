import './index.css'
import Login from "./pages/login"
import { ProductCard } from "./components/ui/ProductCard";


function App() {
  return (
    <>
      <Login
        onSwitchToRegister={() => {
          console.log("Ir a registro");
        }}
        onSwitchToForgot={() => {
          console.log("Ir a recuperar contraseña");
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 2fr))",
          gap: "1.5rem", // 24px, equivalente a gap-6
        }}
      >
        <ProductCard
          id={1}
          name="Camiseta Oversize"
          price={29.99}
          originalPrice={222.99}
          quantity={2}
          updateQuantity={(id, newQty) => {
            console.log(`Actualizar producto con ID ${id} a cantidad: ${newQty}`);
          }}
          removeItem={(id) => {
            console.log(`Eliminar producto con ID ${id}`);
          }}
        />
        <ProductCard
          id={1}
          name="Camiseta Oversize"
          price={29.99}
          quantity={2}
          updateQuantity={(id, newQty) => {
            console.log(`Actualizar producto con ID ${id} a cantidad: ${newQty}`);
          }}
          removeItem={(id) => {
            console.log(`Eliminar producto con ID ${id}`);
          }}
        />
        <ProductCard
          id={1}
          name="Camiseta Oversize"
          price={29.99}
          quantity={2}
          isNew={true}
          updateQuantity={(id, newQty) => {
            console.log(`Actualizar producto con ID ${id} a cantidad: ${newQty}`);
          }}
          removeItem={(id) => {
            console.log(`Eliminar producto con ID ${id}`);
          }}
        />
        <ProductCard
          id={1}
          name="Camiseta Oversize"
          price={29.99}
          quantity={2}
          updateQuantity={(id, newQty) => {
            console.log(`Actualizar producto con ID ${id} a cantidad: ${newQty}`);
          }}
          removeItem={(id) => {
            console.log(`Eliminar producto con ID ${id}`);
          }}
        />
        <ProductCard
          id={1}
          name="Camiseta Oversize"
          price={29.99}
          quantity={2}
          updateQuantity={(id, newQty) => {
            console.log(`Actualizar producto con ID ${id} a cantidad: ${newQty}`);
          }}
          removeItem={(id) => {
            console.log(`Eliminar producto con ID ${id}`);
          }}
        />
      </div>

    </>
  )
}

export default App
