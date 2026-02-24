import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Prevent server-side fetch polyfills from breaking the browser
if (typeof window !== 'undefined') {
  const nativeFetch = window.fetch;
  Object.defineProperty(window, 'fetch', {
    configurable: false,
    enumerable: true,
    get: () => nativeFetch,
    set: () => {
      console.warn('Attempted to override window.fetch - blocked.');
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
