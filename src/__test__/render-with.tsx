import { type RenderOptions, render } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import PageLayout from '@/layout/PageLayout';
import GlobalProvider from '@/provider/GlobalProvider';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
  route?: string;
  router?: {
    initialEntries?: string[];
  };
}

function AllTheProviders({ children, route = '/' }: { children: ReactNode; route?: string }) {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <PageLayout />,
        children: [
          {
            path: '/',
            element: children,
          },
          {
            path: '/product/:id',
            element: children,
          },
          {
            path: '/shopping-cart',
            element: children,
          },
        ],
      },
    ],
    {
      initialEntries: [route],
      initialIndex: 0,
    }
  );

  return (
    <GlobalProvider>
      <RouterProvider router={router} />
    </GlobalProvider>
  );
}

export function renderWith(ui: ReactElement, options: CustomRenderOptions = {}) {
  const { route = '/', router, ...renderOptions } = options;
  const initialRoute = router?.initialEntries?.[0] || route;

  return render(ui, {
    wrapper: ({ children }) => <AllTheProviders route={initialRoute}>{children}</AllTheProviders>,
    ...renderOptions,
  });
}
