import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import ErrorDisplay from "../components/ErrorDisplay";
import './MainLayout.css';

export default function MainLayout() {
  const devPageButton = process.env.NODE_ENV === 'development'
    ? (
      <a className='box button main-layout-navbar-button-dev' href='/dev'>
        Dev
      </a>
    )
    : undefined;

  return (
    <div className='main-layout'>
      <div className='main-layout-navbar'>
        <div className='main-layout-navbar-left'>
          <a className='box button main-layout-navbar-button-home' href='/home'>
            Home
          </a>
        </div>
        <div className='main-layout-navbar-right'>
          <a className='box button main-layout-navbar-button-login' href='/auth'>
            Log In
          </a>
          <a className='box button main-layout-navbar-button-write' href='/write'>
            Write
          </a>
          {devPageButton}
        </div>
      </div>
      <ErrorBoundary fallbackRender={(props) => <ErrorDisplay error={props.error as Error} />}>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
}