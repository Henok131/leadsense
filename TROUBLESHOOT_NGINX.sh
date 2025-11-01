#!/bin/bash

# Quick diagnostic script to find SSL certificate references

echo "Checking NGINX configs for SSL certificate references..."
echo ""

# Check main nginx.conf
echo "=== Main nginx.conf ==="
sudo grep -n "ssl_certificate" /etc/nginx/nginx.conf || echo "No SSL certs in main config"

echo ""
echo "=== sites-available/* ==="
sudo grep -n "ssl_certificate" /etc/nginx/sites-available/* || echo "No SSL certs in sites-available"

echo ""
echo "=== sites-enabled/* ==="
sudo grep -n "ssl_certificate" /etc/nginx/sites-enabled/* || echo "No SSL certs in sites-enabled"

echo ""
echo "=== Current sales.asenaytech.com config ==="
sudo cat /etc/nginx/sites-available/sales.asenaytech.com

