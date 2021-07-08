# Stage 1 - Install dependencies and build the app
FROM node:12.20 AS build-env

# Copy files to container and build
RUN mkdir /app
COPY . /app/

WORKDIR /app/
RUN npm install
RUN npm run init-env-config
RUN npm rebuild node-sass
RUN npm run build --url='https://localhost:8080/api' --timeout=10

# Stage 2 - Create the runtime image
FROM nginx

COPY nginx.conf /etc/nginx/conf.d/configfile.template
COPY --from=build-env /app/build/ /usr/share/nginx/html
COPY env-config.template /usr/share/nginx/html/

ENV PORT 8080
ENV API_URL http://localhost:8080/api
ENV API_TIMEOUT 10

EXPOSE $PORT

CMD sh -c "envsubst '\$PORT:\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && envsubst '\$API_URL:\$API_URL,\$API_TIMEOUT:\$API_TIMEOUT' < /usr/share/nginx/html/env-config.template > /usr/share/nginx/html/env-config.json && nginx -g 'daemon off;'"
