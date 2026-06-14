FROM node:20-alpine

WORKDIR /app

# Copy root package.json for workspaces
COPY package.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/api/tsconfig.json ./apps/api/

RUN npm install

COPY apps/api/ ./apps/api/

WORKDIR /app/apps/api

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
