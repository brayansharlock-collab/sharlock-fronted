import './index.css'

//router
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routers/ProtectedRoute";

//components and pages
import Home from "./pages/home";
import Login from "./pages/login";
import CartPage from './pages/CartPage';
import Register from './pages/register';
import ProcessPay from './pages/process.pay';
import ProfilePage from './pages/ProfilePage';
import ResetPassword from './pages/ResetPassword';
import ProductDetail from './pages/ProductDetail';
import { ProductsPage } from './pages/ProductsPage';
import FinalStep from './components/processPay/SuccessStep';
import RequestResetPassword from './pages/RequestResetPassword';
import ProductsPageAdmin from './pages/admin/page';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/options" element={<ProductsPageAdmin />} />

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/producto/:slug/:id" element={<ProductDetail />} />
        <Route path="/Checkout/:contentdisplay" element={<FinalStep />} />

        <Route path="/forgot-password" element={<RequestResetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/Checkout"
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
