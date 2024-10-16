import { Outlet } from "react-router-dom";
import Belt from "../components/Belt";
import Button from "../components/Button";
import { ErrorBoundary } from "react-error-boundary";
import ErrorDisplay from "../components/ErrorDisplay";
import AppError from "../errors/AppError";
import './MainLayout.css';

export default function MainLayout() {
  return (
    <div className='main-layout'>
      <div className="top-nav-bar">
        <Button url="/home">Home</Button>
        <Belt direction="horizontal">
          <Button url="/write">Write</Button>
          <Button url="/login">Log In</Button>
        </Belt>
      </div>
      <ErrorBoundary fallbackRender={(props) => <ErrorDisplay error={props.error as AppError} />}>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
}