# Multi-stage
# 1) Node image for building frontend assets
# 2) nginx stage to serve frontend assets

# Name the node stage "staging"
FROM node:12 AS staging
# Set working directory
WORKDIR /app
# Copy all files from current directory to working dir in image
COPY package*.json /app/

RUN npm install

COPY ./ /app/

RUN npm run build --url=temporary-url
RUN sed -i 's/temporary-url//g' /app/build/env-config.json

# nginx state for serving content
FROM nginx:alpine
# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*
# Copy static assets from staging
COPY --from=staging /app/build .
COPY --from=staging /app/nginx.conf /etc/nginx/conf.d/default.conf
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
