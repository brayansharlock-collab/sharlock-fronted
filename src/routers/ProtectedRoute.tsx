import { Navigate } from "react-router-dom";
import { tokenStorage } from "../utils/token";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = tokenStorage.getAccessToken();
  console.log(token);
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
