import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/backend/useAuth";

export interface RequireUnauthenticatedProps {
  children?: React.ReactNode,
}

export default function RequireUnauthenticated({ children }: RequireUnauthenticatedProps) {
  const { getAuthInfo } = useAuth();

  const shouldNavigate = getAuthInfo().isAuthenticated;

  return (
    <>
      {shouldNavigate
        ? <Navigate to="/home" />
        : children}
    </>
  );
}