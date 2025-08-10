import './index.css'

import Home from './pages/home';
import Login from "./pages/login"


import { ProductCard } from "./components/ProductCard";


function App() {
  return (
    <>
    <Home />

      {/* <Login
        onSwitchToRegister={() => {
          console.log("Ir a registro");
        }}
        onSwitchToForgot={() => {
          console.log("Ir a recuperar contraseña");
        }}
      /> */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "2rem", // 24px, equivalente a gap-6
          width: "80%",
          padding: 30
        }}
      >
        <ProductCard
          id={1}
          name="Camiseta Oversize"
          price={29.99}
          originalPrice={222.99}
          image='https://cuerosvelezco.vtexassets.com/arquivos/ids/295085/1039855-31-01-Camisa-de-cuero.jpg?v=638899417920800000'
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
          image='https://cuerosvelezco.vtexassets.com/arquivos/ids/293997/1039854-20-04-Top-de-cuero.jpg?v=638866494147530000'
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
          image='https://cuerosvelezco.vtexassets.com/arquivos/ids/293957/1039842-09-01-Vestido-maxi.jpg?v=638866474641530000'
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
          image='https://cuerosvelezco.vtexassets.com/arquivos/ids/293999/1039854-20-06-Top-de-cuero.jpg?v=638866494396470000'
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
