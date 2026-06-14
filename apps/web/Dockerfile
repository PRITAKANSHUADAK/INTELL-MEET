FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY apps/web/package.json ./apps/web/
COPY apps/web/vite.config.ts ./apps/web/

RUN npm install

COPY apps/web/ ./apps/web/

WORKDIR /app/apps/web

RUN npm run build

# Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
