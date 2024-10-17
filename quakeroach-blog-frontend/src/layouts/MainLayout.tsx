import { Outlet } from "react-router-dom";
import Button from "../components/Button";
import { ErrorBoundary } from "react-error-boundary";
import ErrorDisplay from "../components/ErrorDisplay";
import AppError from "../errors/AppError";
import './MainLayout.css';

export default function MainLayout() {
  return (
    <div className='main-layout'>
      <div className="main-layout-navbar">
        <div className="main-layout-navbar-left">
          <Button url="/home" className='main-layout-navbar-button-home'>Home</Button>
        </div>
        <div className="main-layout-navbar-right">
          <Button url="/login" className='main-layout-navbar-button-login'>Log In</Button>
          <Button url="/write" className='main-layout-navbar-button-write'>Write</Button>
        </div>
      </div>
      <ErrorBoundary fallbackRender={(props) => <ErrorDisplay error={props.error as AppError} />}>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
}