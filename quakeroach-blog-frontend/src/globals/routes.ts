import { RouteObject } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import WritePage from '../pages/WritePage';
import NotFoundPage from '../pages/NotFoundPage';
import MainLayout from '../layouts/MainLayout';
import DevPage from '../pages/DevPage';

function makeRoutes(): RouteObject[] {
  const routes: RouteObject[] = [
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

  if (process.env.NODE_ENV === 'development') {
    routes[0].children?.push({
      path: "dev",
      Component: DevPage,
    });
  }

  return routes;
}

export const routes: RouteObject[] = makeRoutes();