import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { API_BASE_URL } from './services/api/endpoints'

// Pre-warm backend connection (eliminates cold start wait time in supermarkets)
fetch(`${API_BASE_URL.replace(/\/scan.*$/, '')}/health`).catch(() => {});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
