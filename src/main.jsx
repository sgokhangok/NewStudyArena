import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// 1. Eski sistem (Mevcut)
import { GlobalStateProvider } from './context/GlobalState.jsx' 
// 2. Yeni Nesil Modüler Sistem (Yeni Eklenen)
import { AiCommander2Provider } from './context/AiCommander2Context.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* KRİTİK MONTAJ: İç içe (Nested) Provider yapısı. 
       Bu sayede App içindeki her yer hem eski verilere hem de 
       yeni modüler AiCommander2 sistemine erişebilecek.
    */}
    <GlobalStateProvider>
      <AiCommander2Provider>
        <App />
      </AiCommander2Provider>
    </GlobalStateProvider>
  </React.StrictMode>,
)