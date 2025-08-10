import { StrictMode } from 'react'
import { ConfigProvider, theme } from 'antd'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#7a6449',     // Color principal
          colorText: '#1f2937',        // Texto normal (gris oscuro)
          colorBgBase: '#ffffff',      // Fondo base (blanco)
          fontFamily: 'Inter, Arial, sans-serif', // Fuente global para texto
        },
        components: {
          Typography: {
            fontFamily: 'Lora, serif', // Fuente para títulos y encabezados
          },
          Button: {
            colorPrimary: '#7a6449',
            colorPrimaryHover: '#6b5640',
            borderRadius: 8,
            fontWeight: 500,
            fontFamily: 'Lora, serif'
          },
          Input: {
            fontFamily: 'Lora, serif'
          },
        },
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>,
)
