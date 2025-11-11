// routers/PublicRoute.tsx
import { Navigate } from "react-router-dom";
import { tokenStorage } from "../utils/token";
import type { ReactNode } from "react";

interface PublicRouteProps {
  children: ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const token = tokenStorage.getAccessToken(); 

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
}