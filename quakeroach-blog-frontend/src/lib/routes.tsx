import { RouteObject } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AuthPage from '../pages/AuthPage';
import WritePage from '../pages/WritePage';
import NotFoundPage from '../pages/NotFoundPage';
import MainLayout from '../layouts/MainLayout';
import RequireAuthenticated from '../components/RequireAuthenticated';
import RequireUnauthenticated from '../components/RequireUnauthenticated';

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
          element: <RequireUnauthenticated>
            <AuthPage />
          </RequireUnauthenticated>,
        },
        {
          path: "write",
          element: <RequireAuthenticated>
            <WritePage />
          </RequireAuthenticated>,
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