# Stage 1: Build React (Vite)
FROM node:20 as build

WORKDIR /app

# Copy package.json from root
COPY package*.json ./

RUN npm install --legacy-peer-deps

# Copy all project files
COPY . .

# Set working dir to frontend folder
WORKDIR /app/src

# Build frontend (Vite outputs dist/ into root by default => /app/dist)
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy built files from root dist folder
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
