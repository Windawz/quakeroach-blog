import { Link, Outlet, useLocation } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import ErrorDisplay from "../components/ErrorDisplay";
import './MainLayout.css';
import { useAuth } from "../lib/backend/useAuth";
import { useEffect, useState } from "react";

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
      <Link className='box button main-layout-navbar-button-login' to='/auth'>
        Log In
      </Link>
    );

  return (
    <div className='main-layout'>
      <div className='main-layout-navbar'>
        <div className='main-layout-navbar-left'>
          <Link className='box button main-layout-navbar-button-home' to='/home'>
            Home
          </Link>
        </div>
        <div className='main-layout-navbar-right'>
          {logInButton}
          <Link className='box button main-layout-navbar-button-write' to='/write'>
            Write
          </Link>
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