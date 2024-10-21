import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import ErrorDisplay from "../components/ErrorDisplay";
import AppError from "../errors/AppError";
import './MainLayout.css';

export default function MainLayout() {
  return (
    <div className='main-layout'>
      <div className='main-layout-navbar'>
        <div className='main-layout-navbar-left'>
          <a className='button main-layout-navbar-button-home' href='/home'>
            Home
          </a>
        </div>
        <div className='main-layout-navbar-right'>
          <a className='button main-layout-navbar-button-login' href='/login'>
          Log In
        </a>
          <a className='button main-layout-navbar-button-write' href='/write'>
          Write
        </a>
        </div>
      </div>
      <ErrorBoundary fallbackRender={(props) => <ErrorDisplay error={props.error as AppError} />}>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
}