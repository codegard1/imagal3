# Use Node 12 or higher
FROM node:14 AS builder

WORKDIR /usr/src/app

COPY package*.json .

# Install dependencies from package-lock.json
# RUN npm ci
RUN npm ci --only=production

# Install the Gatsby CLI 2.x.x 
RUN npm install -g gatsby-cli@2.19.3

COPY . .

# Build app to public/
RUN gatsby build

FROM nginx:alpine AS server

WORKDIR /usr/share/nginx/html

# Remove NGINX default files
RUN rm -rf ./*

# Copy public/ from app source to NGINX dir
COPY --from=builder /usr/src/app/public .

# Define entrypoint for the app executable
ENTRYPOINT ["nginx", "-g", "daemon off;"]
