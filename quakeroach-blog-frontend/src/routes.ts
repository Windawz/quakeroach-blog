import { RouteObject } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import WritePage from "./pages/WritePage";
import ErrorBoundaryLayout from "./components/ErrorBoundaryLayout";
import NotFoundPage from "./pages/NotFoundPage";

export const ROUTES: RouteObject[] = [
  {
    path: "/",
    Component: ErrorBoundaryLayout,
    children: [
      {
        path: "main",
        Component: MainPage,
      },
      {
        path: "login",
        Component: LoginPage,
      },
      {
        path: "write",
        Component: WritePage,
      },
    ],
  },
  {
    path: "",
    Component: NotFoundPage,
  },
];