import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// GlobalStateProvider'ı içeri aktardığından emin ol!
import { GlobalStateProvider } from './context/GlobalState.jsx' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* KRİTİK: App mutlaka GlobalStateProvider içinde olmalı! */}
    <GlobalStateProvider>
      <App />
    </GlobalStateProvider>
  </React.StrictMode>,
)