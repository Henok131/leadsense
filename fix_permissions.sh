#!/bin/bash

# Fix file permissions and verify deployment

echo "Checking files on server..."
ssh root@72.61.156.126 "ls -la /usr/share/nginx/html/"

echo ""
echo "Checking permissions..."
ssh root@72.61.156.126 "ls -la /usr/share/nginx/html/assets/"

echo ""
echo "Fixing permissions..."
ssh root@72.61.156.126 "chown -R www-data:www-data /usr/share/nginx/html && chmod -R 755 /usr/share/nginx/html"

echo ""
echo "Verifying permissions..."
ssh root@72.61.156.126 "ls -la /usr/share/nginx/html/assets/"

