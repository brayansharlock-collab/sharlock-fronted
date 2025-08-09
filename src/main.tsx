import { StrictMode } from 'react'
import { ConfigProvider } from 'antd'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'Lora, serif', // Global: títulos y párrafos
        },
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>,
)
