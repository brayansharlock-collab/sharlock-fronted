import { StrictMode } from 'react'
import { ConfigProvider, theme } from 'antd'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
<ConfigProvider
  theme={{
    token: {
      colorPrimary: '#7a6449',        // Color principal (ej. botones, selects)
      colorText: '#1f2937',           // Color del texto
      colorBgBase: '#ffffff',         // Fondo blanco
      fontFamily: 'Inter, Arial, sans-serif', // Fuente por defecto
      borderRadius: 8,       
    },
    components: {
      Typography: {
        fontFamily: 'Lora, serif',    // Fuente elegante para títulos
      },
      Button: {
        colorPrimary: '#7a6449',
        colorPrimaryHover: '#6b5640',
        fontWeight: 500,
        fontFamily: 'Lora, serif',
        borderRadius: 8,              // Ya lo tenías
      },
      Input: {
        fontFamily: 'Lora, serif',
        borderRadius: 8,              // Inputs
      },
      Select: {
        borderRadius: 8,              // Dropdowns
        // option: {
        //   borderRadius: 8,
        // },
      },
       Carousel: {
        arrowSize: 53,
        arrowOffset: 50,
        dotGap: 20              // Carruseles
      },
      DatePicker: {
        borderRadius: 8,              // Calendarios
      },
      Card: {
        borderRadius: 8,              // Tarjetas
      },
      Modal: {
        borderRadius: 8,              // Modales
      },
      Table: {
        borderRadius: 8,              // Tablas
      },
      Badge: {
        borderRadius: 8,              // Badges
      },
      Pagination: {
        borderRadius: 8,              // Paginación
      },
    },
  }}
>
      <App />
    </ConfigProvider>
  </StrictMode>,
)
