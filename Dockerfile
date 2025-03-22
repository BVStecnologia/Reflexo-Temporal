# Estágio de build
FROM node:20-alpine as build

WORKDIR /app

# Copiar arquivos de dependências
COPY package.json package-lock.json ./
RUN npm ci

# Copiar o restante dos arquivos
COPY . .

# Construir a aplicação
RUN npm run build

# Estágio de produção
FROM nginx:stable-alpine

# Copiar a configuração do nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Configuração para SPA (Single Page Application)
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
