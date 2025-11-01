#!/bin/bash

echo "Cleaning up .disabled files..."

# Remove .disabled files from sites-available
sudo rm -f /etc/nginx/sites-available/*.disabled

# Remove .disabled2 files too
sudo rm -f /etc/nginx/sites-available/*.disabled2

# Check what's actually enabled
echo ""
echo "Currently enabled sites:"
sudo ls -la /etc/nginx/sites-enabled/

echo ""
echo "Testing NGINX config..."
sudo nginx -t

