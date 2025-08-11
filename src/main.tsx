import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App.tsx';
import { enableMocking } from '@/server/brower.ts';
import './index.css';

enableMocking({
  serviceWorker: {
    url: '/mockServiceWorker.js',
  },
  onUnhandledRequest: 'bypass',
}).then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
