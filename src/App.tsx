import './index.css'

//router
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routers/ProtectedRoute";

//components and pages
import Home from "./pages/home";
import Login from "./pages/login";
import CartPage from './pages/CartPage';
import ProcessPay from './pages/process.pay';
import AnimatedNav from './components/ui/nav';
import ProfilePage from './pages/ProfilePage';
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login
          onSwitchToRegister={() => {
            console.log("Ir a registro");
          }}
          onSwitchToForgot={() => {
            console.log("Ir a recuperar contraseña");
          }}
        />} />

        <Route path="/producto/:slug/:id" element={<ProductDetail />} />


        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <ProcessPay />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/CarPage"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
