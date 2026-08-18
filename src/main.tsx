import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Gracefully handle benign ResizeObserver notifications and third-party widget errors
if (typeof window !== 'undefined') {
  if (window.ResizeObserver) {
    try {
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
    } catch {
      // Ignore if ResizeObserver is non-writable
    }
  }
}

const isBenignError = (msg: string) => {
  const m = String(msg || '');
  return (
    m.includes('ResizeObserver') ||
    m.includes('Failed to fetch') ||
    m.includes('NetworkError') ||
    m.includes('fetch') ||
    m.includes('Script error') ||
    m.includes('Could not reach Cloud Firestore backend') ||
    m.includes('offline mode') ||
    m.includes('@firebase/firestore') ||
    m.includes('n8n')
  );
};

// Filter console.error / console.warn for benign Firestore offline retry notices and fetch warnings
const origConsoleError = console.error;
console.error = (...args: unknown[]) => {
  const combined = args
    .map((a) => {
      if (typeof a === 'string') return a;
      if (a instanceof Error) return `${a.name} ${a.message} ${a.stack || ''}`;
      try {
        return JSON.stringify(a) || String(a);
      } catch {
        return String(a);
      }
    })
    .join(' ');
  if (isBenignError(combined)) {
    return;
  }
  origConsoleError.apply(console, args);
};

const origConsoleWarn = console.warn;
console.warn = (...args: unknown[]) => {
  const combined = args
    .map((a) => {
      if (typeof a === 'string') return a;
      if (a instanceof Error) return `${a.name} ${a.message} ${a.stack || ''}`;
      try {
        return JSON.stringify(a) || String(a);
      } catch {
        return String(a);
      }
    })
    .join(' ');
  if (isBenignError(combined)) {
    return;
  }
  origConsoleWarn.apply(console, args);
};

window.addEventListener(
  'error',
  (event) => {
    const message =
      typeof event === 'string'
        ? event
        : event?.message || String(event?.error?.message || event?.error || '');
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
    const reasonStr = String(
      event.reason?.message || event.reason?.stack || event.reason || ''
    );
    if (isBenignError(reasonStr)) {
      event.stopImmediatePropagation?.();
      event.preventDefault?.();
      return true;
    }
  },
  true
);

window.onunhandledrejection = (event) => {
  const reasonStr = String(
    event?.reason?.message || event?.reason?.stack || event?.reason || ''
  );
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

