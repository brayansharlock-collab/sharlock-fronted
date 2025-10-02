// src/main.tsx
import { StrictMode } from 'react';
import { ConfigProvider } from 'antd';
import { createRoot } from 'react-dom/client';
import App from './App';

import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#7a6449',
            colorText: '#1f2937',
            colorBgBase: '#ffffff',
            fontFamily: 'Inter, Arial, sans-serif',
            borderRadius: 8,
          },
          components: {
            Typography: {
              fontFamily: 'Lora, serif',
            },
            Button: {
              colorPrimary: '#7a6449',
              colorPrimaryHover: '#6b5640',
              fontWeight: 500,
              fontFamily: 'Lora, serif',
              borderRadius: 8,
            },
            Input: {
              fontFamily: 'Lora, serif',
              borderRadius: 8,
            },
            Select: {
              borderRadius: 8,
            },
            Carousel: {
              arrowSize: 53,
              arrowOffset: 50,
              dotGap: 20,
            },
            DatePicker: {
              borderRadius: 8,
            },
            Card: {
              borderRadius: 8,
            },
            Modal: {
              borderRadius: 8,
            },
            Table: {
              borderRadius: 8,
            },
            Badge: {
              borderRadius: 8,
            },
            Pagination: {
              borderRadius: 8,
            },
          },
        }}
      >
        <App />
      </ConfigProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);