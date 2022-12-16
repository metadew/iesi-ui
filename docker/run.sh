#!/bin/bash

echo running the IESI UI container ...
echo Filling configuration placeholders ...

tmp=$(mktemp)
nginx_config_file=/etc/nginx/conf.d/default.conf
env_config_file=/usr/share/nginx/html/env-config.json

envsubst < "$nginx_config_file" > "$tmp" && mv "$tmp" "$nginx_config_file"
envsubst $PORT < "$nginx_config_file" > /etc/nginx/conf.d/default-test.conf



echo Fill completed
echo Starting the IESI UI container ...

nginx -g 'daemon off;'
