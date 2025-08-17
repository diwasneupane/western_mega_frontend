import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MobilePrototypeFrame from './pages/MobilePrototypeFrame.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MobilePrototypeFrame />
  </StrictMode>,
)
