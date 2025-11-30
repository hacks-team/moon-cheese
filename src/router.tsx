import PageLayout from '@/layout/PageLayout';
import { createBrowserRouter } from 'react-router';
import { Center } from 'styled-system/jsx';
import ErrorSection from './components/ErrorSection';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import ShoppingCartPage from './pages/ShoppingCartPage';

function GlobalErrorPage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <Center minH="screen">
      <ErrorSection onRetry={handleRetry} />
    </Center>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <PageLayout />,
    errorElement: <GlobalErrorPage />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/product/:id',
        element: <ProductDetailPage />,
      },
      {
        path: '/shopping-cart',
        element: <ShoppingCartPage />,
      },
    ],
  },
]);

export default router;
