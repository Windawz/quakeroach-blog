import { Link, Outlet } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import ErrorDisplay from "../components/ErrorDisplay";
import './MainLayout.css';
import { useAuth } from "../hooks/auth";

export default function MainLayout() {
  const auth = useAuth();

  const logInButton = auth.isAuthenticated
    ? undefined
    : (
      <Link className='box button main-layout-navbar-button-login' to='/auth'>
        Log In
      </Link>
    );

  const devPageButton = process.env.NODE_ENV === 'development'
    ? (
      <Link className='box button main-layout-navbar-button-dev' to='/dev'>
        Dev
      </Link>
    )
    : undefined;

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
          {devPageButton}
        </div>
      </div>
      <ErrorBoundary fallbackRender={(props) => <ErrorDisplay error={props.error as Error} />}>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
}