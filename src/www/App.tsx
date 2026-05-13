import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { ToastContainer } from 'react-toastify'
import Utility from './data/Utility'
import Content from './view/Content'

import './styles/globals.css'

function App() {
  const theme = Utility.useIsDark()
  
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
