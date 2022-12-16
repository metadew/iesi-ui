#!/bin/bash

echo running the IESI UI container ...
echo Filling configuration placeholders ...

tmp=$(mktemp)
env_config_file=/usr/share/nginx/html/env-config.json
nginx_config_file=/etc/nginx/conf.d/nginx.template

envsubst < "$env_config_file" > "$tmp" && mv "$tmp" "$env_config_file"
envsubst '$PORT' < "$nginx_config_file" > /etc/nginx/conf.d/default.conf

chmod 777 $env_config_file



echo Fill completed
echo Starting the IESI UI container ...

nginx -g 'daemon off;'
