import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// ✅ COMO DEVE FICAR (CORRETO):
import App from "./App";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
