import { RouterProvider } from 'react-router';
import GlobalProvider from './providers/GlobalProvider';
import router from './router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalProvider>
        <RouterProvider router={router} />
      </GlobalProvider>
    </QueryClientProvider>
  );
}

export default App;
