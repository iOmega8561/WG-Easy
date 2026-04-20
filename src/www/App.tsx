import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import './globals.css'

// Lazy loading per code-splitting
// const Home = lazy(() => import('./View'))

// Loading fallback component
const LoadingFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
    </div>
  </div>
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<LoadingFallback />}>
      {/* main content goes here */}
    </Suspense>
  </React.StrictMode>,
)