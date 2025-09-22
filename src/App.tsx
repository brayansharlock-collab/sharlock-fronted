import './index.css'

//router
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routers/ProtectedRoute";

//components and pages
import Home from "./pages/home";
import Login from "./pages/login";
import CartPage from './pages/CartPage';
import ProcessPay from './pages/process.pay';
// import AnimatedNav from './components/ui/nav';
import ProfilePage from './pages/ProfilePage';
import ProductDetail from './pages/ProductDetail';
import Register from './pages/register';
import { ProductsPage } from './pages/ProductsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<ProductsPage />} />
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
