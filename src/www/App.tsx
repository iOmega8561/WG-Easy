import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import './styles/globals.css'

// Lazy loading
const Content = lazy(() => import('./view/Content'))

// Loading fallback component
const LoadingFallback: React.FC = () => (
  <div className="
  min-h-screen flex 
  items-center justify-center 
  bg-white">
    <div className="text-center">
      <div className="
      w-16 h-16 
      border-4 border-primary border-t-transparent 
      rounded-full 
      animate-spin 
      mx-auto mb-4"/>
    </div>
  </div>
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<LoadingFallback />}>
      <Content />
    </Suspense>
  </React.StrictMode>,
)