#!/bin/sh
for i in $(env | grep VITE_)
do
    key=$(echo $i | cut -d '=' -f 1)
    value=$(echo $i | cut -d '=' -f 2-)
    echo $key=$value

    # find dist -type f \( -name '*.js' -o -name '*.css' \) -exec sed -i "s|${key}|${value}|g" '{}' +
    find dist -type f -exec sed -i "s|${key}|${value}|g" '{}' +
done

exec serve -s dist -l 3000