import { RouteObject } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import WritePage from "../pages/WritePage";
import NotFoundPage from "../pages/NotFoundPage";
import MainLayout from "../layouts/MainLayout";

export const routes: RouteObject[] = [
  {
    Component: MainLayout,
    children: [
      {
        path: "home",
        Component: HomePage,
      },
      {
        path: "login",
        Component: LoginPage,
      },
      {
        path: "write",
        Component: WritePage,
      },
      {
        path: "*",
        Component: NotFoundPage,
      },
    ],
  },
];