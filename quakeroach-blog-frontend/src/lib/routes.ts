import { RouteObject } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AuthPage from '../pages/AuthPage';
import WritePage from '../pages/WritePage';
import NotFoundPage from '../pages/NotFoundPage';
import MainLayout from '../layouts/MainLayout';

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
          path: "auth",
          Component: AuthPage,
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

  return routes;
}

export const routes: RouteObject[] = makeRoutes();