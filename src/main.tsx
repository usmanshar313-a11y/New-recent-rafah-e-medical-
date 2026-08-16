import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Gracefully handle benign ResizeObserver notifications and third-party widget errors
if (typeof window !== 'undefined' && window.ResizeObserver) {
  const OriginalResizeObserver = window.ResizeObserver;
  window.ResizeObserver = class PatchedResizeObserver extends OriginalResizeObserver {
    constructor(callback: ResizeObserverCallback) {
      super((entries, observer) => {
        window.requestAnimationFrame(() => {
          try {
            callback(entries, observer);
          } catch {
            // Suppress benign resize observer recursion
          }
        });
      });
    }
  };
}

const isBenignError = (msg: string) => {
  return (
    msg.includes('ResizeObserver') ||
    msg.includes('Failed to fetch') ||
    msg.includes('Script error') ||
    msg.includes('NetworkError')
  );
};

window.addEventListener(
  'error',
  (event) => {
    const message = typeof event === 'string' ? event : event?.message || String(event?.error || '');
    if (isBenignError(message)) {
      event.stopImmediatePropagation?.();
      event.preventDefault?.();
      return true;
    }
  },
  true
);

window.onerror = (message) => {
  const msgStr = String(message || '');
  if (isBenignError(msgStr)) {
    return true;
  }
};

window.addEventListener(
  'unhandledrejection',
  (event) => {
    const reasonStr = String(event.reason?.message || event.reason || '');
    if (isBenignError(reasonStr)) {
      event.stopImmediatePropagation?.();
      event.preventDefault?.();
      return true;
    }
  },
  true
);

window.onunhandledrejection = (event) => {
  const reasonStr = String(event?.reason?.message || event?.reason || '');
  if (isBenignError(reasonStr)) {
    event.preventDefault();
    return true;
  }
};


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

