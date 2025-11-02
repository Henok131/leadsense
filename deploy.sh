#!/bin/bash

# LeadSense CRM - Production Deployment Script
# Usage: ./deploy.sh

set -e  # Exit on any error

echo "🚀 Starting LeadSense deployment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
SERVER_IP="${SERVER_IP:-your.server.ip}"
SERVER_USER="${SERVER_USER:-root}"
APP_PATH="${APP_PATH:-/var/www/lead.asenaytech.com}"
REMOTE_HOST="${SERVER_USER}@${SERVER_IP}"

# Step 1: Build the project
echo -e "${BLUE}📦 Step 1: Building production bundle...${NC}"
npm run build

if [ ! -d "dist" ]; then
  echo -e "${RED}❌ Error: dist folder not found after build${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Build completed${NC}"

# Step 2: Upload files to server
echo -e "${BLUE}📤 Step 2: Uploading files to server...${NC}"

# Create remote directory if it doesn't exist
ssh ${REMOTE_HOST} "mkdir -p ${APP_PATH}/dist"

# Upload dist folder
scp -r dist/* ${REMOTE_HOST}:${APP_PATH}/dist/

# Upload configuration files
scp docker-compose.yml ${REMOTE_HOST}:${APP_PATH}/
scp nginx.conf ${REMOTE_HOST}:${APP_PATH}/

echo -e "${GREEN}✅ Files uploaded${NC}"

# Step 3: Restart Docker services
echo -e "${BLUE}🔄 Step 3: Restarting services...${NC}"

ssh ${REMOTE_HOST} << 'ENDSSH'
  cd /var/www/lead.asenaytech.com
  docker compose down
  docker compose up -d
  docker compose ps
ENDSSH

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${BLUE}🌐 Your app is live at: https://lead.asenaytech.com${NC}"

