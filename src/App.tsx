import { RouterProvider } from 'react-router';
import { CurrencyProvider } from './providers/currency-provider';
import GlobalProvider from './providers/GlobalProvider';
import router from './router';

function App() {
  return (
    <GlobalProvider>
      <CurrencyProvider>
        <RouterProvider router={router} />
      </CurrencyProvider>
    </GlobalProvider>
  );
}

export default App;
