# --- Etapa 1: Construcción ---
FROM node:22-alpine

WORKDIR /app

# Copiar dependencias
COPY package*.json ./

RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto que usa Vite (5173)
EXPOSE 5173

# Comando para ejecutar el servidor de desarrollo
CMD ["npm", "run", "dev", "--", "--host"]
