import { Outlet, useLocation } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import ErrorDisplay from "../components/ErrorDisplay";
import './styles/MainLayout.css';
import { useAuth } from "../lib/backend/useAuth";
import { useEffect, useState } from "react";
import Button from "../components/Button";

export default function MainLayout() {
  const { getAuthInfo } = useAuth();
  const location = useLocation();
  const [shouldResetErrorBoundary, setShouldResetErrorBoundary] = useState(false);

  useEffect(() => {
    setShouldResetErrorBoundary(true);
  }, [location.key]);

  const logInButton = getAuthInfo().isAuthenticated
    ? undefined
    : (
      <Button className="main-layout-navbar-button-login" kind="link" to="/auth">
        Log In
      </Button>
    );

  return (
    <div className='main-layout'>
      <div className='main-layout-navbar'>
        <div className='main-layout-navbar-left'>
          <Button className="main-layout-navbar-button-home" kind="link" to="/home">
            Home
          </Button>
        </div>
        <div className='main-layout-navbar-right'>
          {logInButton}
          <Button className="main-layout-navbar-button-write" kind="link" to="/write">
            Write
          </Button>
        </div>
      </div>
      <ErrorBoundary
        fallbackRender={(props) => {
          if (shouldResetErrorBoundary) {
            props.resetErrorBoundary();
            setShouldResetErrorBoundary(false);
          }

          const message = props.error instanceof Error
            ? props.error.message
            : undefined;
          
          return (
            <ErrorDisplay message={message} />
          );
        }}>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
}