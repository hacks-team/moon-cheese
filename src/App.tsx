import { RouterProvider } from 'react-router';
import GlobalProvider from './providers/GlobalProvider';
import router from './router';

function App() {
  return (
    <GlobalProvider>
      <RouterProvider router={router} />
    </GlobalProvider>
  );
}

export default App;
