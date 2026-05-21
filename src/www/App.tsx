import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { ToastContainer } from 'react-toastify'
import useIsDark from './hooks/useIsDark'
import Content from './view/Content'

import './styles/globals.css'

// eslint-disable-next-line react-refresh/only-export-components
function App() {
  const theme = useIsDark()
  
  return (
    <StrictMode>
      
      <Content />
      
      <ToastContainer
        autoClose={2000}
        theme={theme} 
      />
    
    </StrictMode>
  )
}

const docRoot = document.getElementById('root')
if (docRoot !== null) {
  ReactDOM.createRoot(docRoot).render(<App />)
}
