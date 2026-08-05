import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ROUTES } from '@/constants/app';
import App from '@/App';
import { PageLoader } from '@/components/Loader/PageLoader';
import { ProtectedRoute } from '@/routes/ProtectedRoute';

// Route-level code splitting — each page ships in its own chunk.
const HomePage = lazy(() => import('@/pages/Home/HomePage'));
const LoginPage = lazy(() => import('@/pages/Login/LoginPage'));

function withSuspense(node: React.ReactNode) {
  return <Suspense fallback={<PageLoader />}>{node}</Suspense>;
}

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: ROUTES.home, element: <ProtectedRoute>{withSuspense(<HomePage />)}</ProtectedRoute> },
      { path: ROUTES.login, element: withSuspense(<LoginPage />) },
    ],
  },
]);
