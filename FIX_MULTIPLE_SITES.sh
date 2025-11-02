#!/bin/bash

echo "Checking all enabled sites for SSL certificate references..."
echo ""

# Check each enabled site
for site in /etc/nginx/sites-enabled/*; do
    site_name=$(basename $site)
    echo "=== $site_name ==="
    
    # Check if this site references SSL certificates for sales.asenaytech.com
    if grep -q "sales.asenaytech.com" "$site"; then
        if grep -q "ssl_certificate.*sales.asenaytech.com" "$site"; then
            echo "❌ FOUND SSL CERT REFERENCE in $site_name"
            grep -n "ssl_certificate.*sales.asenaytech.com" "$site"
            echo ""
        fi
    fi
done

echo ""
echo "Now checking main nginx.conf..."
grep -n "sales.asenaytech.com" /etc/nginx/nginx.conf || echo "No references found in main config"

