import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Gracefully handle unhandled network fetch errors from third-party widgets / webhooks
window.addEventListener('unhandledrejection', (event) => {
  if (
    event.reason &&
    (event.reason.message === 'Failed to fetch' ||
      event.reason.name === 'TypeError' ||
      String(event.reason).includes('Failed to fetch') ||
      String(event.reason).includes('NetworkError'))
  ) {
    console.warn('Network request failed gracefully (suppressed):', event.reason);
    event.preventDefault();
  }
});

window.addEventListener('error', (event) => {
  if (
    event.message &&
    (event.message.includes('Failed to fetch') ||
      event.message.includes('Script error.') ||
      event.message.includes('ResizeObserver loop'))
  ) {
    console.warn('Window error suppressed:', event.message);
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

