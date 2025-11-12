FROM node:20

WORKDIR /app

# Copy root package.json
COPY package*.json ./

RUN npm install --legacy-peer-deps

# Copy all project files
COPY . .

WORKDIR /app/server

EXPOSE 5000

CMD ["node", "server.js"]
