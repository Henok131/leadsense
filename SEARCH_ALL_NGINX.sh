#!/bin/bash

echo "Searching ALL nginx files for sales.asenaytech.com SSL references..."
echo ""

# Search everywhere
echo "=== Searching /etc/nginx/ recursively ==="
sudo find /etc/nginx -type f -exec grep -l "sales.asenaytech.com" {} \;

echo ""
echo "=== Searching for fullchain.pem references ==="
sudo grep -rn "fullchain.pem" /etc/nginx/ 2>/dev/null | grep "sales.asenaytech.com"

echo ""
echo "=== Checking all *.conf files in /etc/nginx/conf.d/ ==="
sudo ls -la /etc/nginx/conf.d/ 2>/dev/null
sudo grep -rn "sales.asenaytech.com" /etc/nginx/conf.d/ 2>/dev/null

echo ""
echo "=== Listing ALL enabled sites symlinks ==="
sudo ls -la /etc/nginx/sites-enabled/

echo ""
echo "=== Checking what the symlinks point to ==="
for link in /etc/nginx/sites-enabled/*; do
    if [ -L "$link" ]; then
        echo "Link: $link → $(readlink $link)"
    fi
done

