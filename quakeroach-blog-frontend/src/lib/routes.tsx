import { RouteObject } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AuthPage from '../pages/AuthPage';
import WritePage from '../pages/WritePage';
import MainLayout from '../layouts/MainLayout';
import RequireAuthenticated from '../components/RequireAuthenticated';
import RequireUnauthenticated from '../components/RequireUnauthenticated';
import ErrorDisplay from '../components/ErrorDisplay';
import BlogPostViewPage from '../pages/BlogPostViewPage';

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
          path: "blogpost/:blogPostId",
          element: <BlogPostViewPage />
        },
        {
          path: "*",
          element: <ErrorDisplay message="Page not found" />,
        },
      ],
    },
  ];

  return routes;
}

export const routes: RouteObject[] = makeRoutes();