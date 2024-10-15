import { ErrorBoundary } from "react-error-boundary";
import { Outlet } from "react-router-dom";
import ErrorDisplay from "./ErrorDisplay";
import AppError from "../types/AppError";

export default function ErrorBoundaryLayout() {
  return (
    <ErrorBoundary fallbackRender={(props) => <ErrorDisplay error={props.error as AppError} />}>
      <Outlet />
    </ErrorBoundary>
  );
}