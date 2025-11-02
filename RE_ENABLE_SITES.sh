#!/bin/bash

echo "Re-enabling sites one by one to find the culprit..."
echo ""

# Re-enable sites one at a time and test
echo "=== Enabling sales.asenaytech.com only ==="
sudo mv /etc/nginx/sites-enabled/bookkeeper.asenaytech.com.disabled /etc/nginx/sites-enabled/bookkeeper.asenaytech.com.disabled2 2>/dev/null
sudo mv /etc/nginx/sites-enabled/bookkeeping.asenaytech.com.disabled /etc/nginx/sites-enabled/bookkeeping.asenaytech.com.disabled2 2>/dev/null
sudo mv /etc/nginx/sites-enabled/lead.asenaytech.com.disabled /etc/nginx/sites-enabled/lead.asenaytech.com.disabled2 2>/dev/null
sudo mv /etc/nginx/sites-enabled/n8n.conf.disabled /etc/nginx/sites-enabled/n8n.conf.disabled2 2>/dev/null

echo "Now test nginx..."
sudo nginx -t

