import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
// Spark runtime shim - fire immediately since we're not in Spark environment
if (typeof window !== 'undefined' && !window.__sparkRuntimeLoaded) {
  window.__sparkRuntimeLoaded = true;
  window.dispatchEvent(new Event('sparkRuntimeLoaded'));
}

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'

import "./main.css"
import "./styles/theme.css"
import "./index.css"

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <App />
   </ErrorBoundary>
)
