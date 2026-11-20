# Build con Node y servido con Nginx sin privilegios (puerto 8080, usuario no root).
# En CI se construye para linux/amd64 y linux/arm64.
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Ruta relativa: Nginx reenvia /api al backend (ver nginx.conf.template)
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.29-alpine
# PL-02: Trivy encontró vulnerabilidades críticas con arreglo en paquetes de Alpine de la imagen base.
# Se aplican los parches del sistema y se vuelve al usuario sin privilegios de la imagen (101).
USER root
RUN apk upgrade --no-cache
USER 101
# A donde reenviar /api. En Docker Compose y Kubernetes el servicio se llama "api".
ENV API_UPSTREAM=http://api:3000
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
