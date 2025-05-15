# Stage 1: Build the Angular application
FROM node:20-alpine as build
WORKDIR /app

# Copia os arquivos de dependência
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit --no-fund --loglevel=error

# Copia o restante do código
COPY . .

# Compila o projeto Angular
RUN npm run build -- --configuration production

# Stage 2: Servir com http-server
FROM node:20-alpine
WORKDIR /app
RUN npm install -g http-server --no-audit --no-fund --loglevel=error

# Ajuste aqui o caminho correto do dist gerado
COPY --from=build /app/dist/task-manager /app

EXPOSE 8080
CMD ["http-server", "-p", "8080", "-a", "0.0.0.0"]
