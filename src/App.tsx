import './index.css'

//router
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routers/ProtectedRoute";

//components and pages
import Login from "./pages/login";
import Home from "./pages/home";
import ProcessPay from './pages/process.pay';
import CartPage from './pages/CartPage';
import AnimatedNav from './components/ui/nav';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />



        <Route path="/Checkout" element={<ProcessPay />} />
        <Route path="/Profile" element={<ProfilePage />} />
        <Route path="/CarPage" element={<CartPage />} />

        <Route path="/login" element={<Login
          onSwitchToRegister={() => {
            console.log("Ir a registro");
          }}
          onSwitchToForgot={() => {
            console.log("Ir a recuperar contraseña");
          }}
        />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Route path="/" element={<Home />} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
