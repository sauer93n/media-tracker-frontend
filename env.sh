#!/bin/sh
for i in $(env | grep MT_)
do
    key=$(echo $i | cut -d '=' -f 1)
    value=$(echo $i | cut -d '=' -f 2-)
    echo $key=$value

    # sed JS and CSS only
    find /app/dist -type f \( -name '*.js' -o -name '*.css' \) -exec sed -i "s|${key}|${value}|g" '{}' +
done

exec serve -s /app/dist -l 3000