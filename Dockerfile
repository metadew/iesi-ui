# Stage 1 - Install dependencies and build the app
FROM node:12.20 AS build-env

# Copy files to container and build
RUN mkdir /app
COPY . /app/

WORKDIR /app/
RUN npm install --unsafe-perm=true --allow-root
RUN npm run init-env-config

ENV API_URL https://localhost:8080/api
ENV API_TIMEOUT 10

RUN npm run build --url=$API_URL --timeout=$API_TIMEOUT

# Stage 2 - Create the runtime image
FROM nginx

COPY nginx.conf /etc/nginx/conf.d/configfile.template
COPY --from=build-env /app/build/ /usr/share/nginx/html
ENV PORT 8080

RUN . ~/.bashrc
RUN /bin/bash -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf"
CMD sh -c "nginx -g 'daemon off;'"


EXPOSE $PORT