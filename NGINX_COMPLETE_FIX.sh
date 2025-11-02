#!/bin/bash

echo "🔍 Complete NGINX diagnostic and fix script"
echo ""

# Check main nginx.conf
echo "=== Checking main nginx.conf ==="
if sudo grep -q "sales.asenaytech.com" /etc/nginx/nginx.conf; then
    echo "❌ FOUND sales.asenaytech.com in main nginx.conf"
    sudo grep -n "sales.asenaytech.com" /etc/nginx/nginx.conf
else
    echo "✅ No sales.asenaytech.com in main config"
fi

echo ""
echo "=== Checking sales.asenaytech.com file content ==="
sudo cat /etc/nginx/sites-available/sales.asenaytech.com

echo ""
echo "=== Checking sites-enabled links ==="
sudo ls -la /etc/nginx/sites-enabled/ | grep sales

echo ""
echo "=== Full grep for sales.asenaytech.com ==="
sudo grep -rn "sales.asenaytech.com" /etc/nginx/ | grep -v ".disabled"

