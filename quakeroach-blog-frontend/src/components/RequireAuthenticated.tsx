import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/backend/useAuth";

export interface RequireAuthenticatedProps {
  children?: React.ReactNode,
}

export default function RequireAuthenticated({ children }: RequireAuthenticatedProps) {
  const { getAuthInfo } = useAuth();

  const shouldNavigate = !getAuthInfo().isAuthenticated;

  return (
    <>
      {shouldNavigate
        ? <Navigate to="/auth" />
        : children}
    </>
  );
}