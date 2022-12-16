# Stage 1 - Install dependencies and build the app
FROM node:14.17.6 AS build-env

ENV API_URL http://localhost:8080/api
ENV API_TIMEOUT 10

WORKDIR /app
COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
RUN npm install --unsafe-perm=true --allow-root

COPY . /app
RUN npm run init-env-config
RUN npm run build --url=$API_URL --timeout=$API_TIMEOUT

# Stage 2 - Create the runtime image
FROM nginx

ENV PORT 8080

COPY --from=build-env /app/build/ /usr/share/nginx/html
COPY docker/nginx.template /etc/nginx/conf.d/nginx.template
COPY docker/env-config.template.json /usr/share/nginx/html/env-config.json
COPY docker/run.sh /usr/share/nginx/html/run.sh

RUN chmod 777 /usr/share/nginx/html/run.sh

EXPOSE $PORT
ENTRYPOINT ["/usr/share/nginx/html/run.sh"]