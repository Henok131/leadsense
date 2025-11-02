#!/bin/bash
# Script to verify and prepare VPS for Supabase function deployment
# Run this on your VPS

echo "======================================"
echo "VPS Supabase Setup Verification"
echo "======================================"
echo ""

# 1. Check if project directory exists
PROJECT_DIR="/root/asenay-leadsense"
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ Project directory not found: $PROJECT_DIR"
    echo "Creating directory..."
    mkdir -p "$PROJECT_DIR"
    echo "✅ Directory created"
else
    echo "✅ Project directory exists: $PROJECT_DIR"
fi

# 2. Create function directories
echo ""
echo "Creating function directories..."
mkdir -p "$PROJECT_DIR/supabase/functions/autoScoreLead"
mkdir -p "$PROJECT_DIR/supabase/functions/processUnscoredLeads"
echo "✅ Directories created"

# 3. Check if index.ts files exist
echo ""
echo "Checking for function files..."
if [ -f "$PROJECT_DIR/supabase/functions/autoScoreLead/index.ts" ]; then
    echo "✅ autoScoreLead/index.ts found"
else
    echo "❌ autoScoreLead/index.ts NOT FOUND"
    echo "   You need to upload this file from your Windows machine"
fi

if [ -f "$PROJECT_DIR/supabase/functions/processUnscoredLeads/index.ts" ]; then
    echo "✅ processUnscoredLeads/index.ts found"
else
    echo "❌ processUnscoredLeads/index.ts NOT FOUND"
    echo "   You need to upload this file from your Windows machine"
fi

# 4. Check Supabase CLI
echo ""
echo "Checking Supabase CLI..."
if command -v supabase &> /dev/null; then
    echo "✅ Supabase CLI installed: $(supabase --version)"
else
    echo "❌ Supabase CLI not found"
    echo "   Install it with: curl -fsSL https://supabase.com/install.sh | sh"
fi

# 5. Check Docker
echo ""
echo "Checking Docker..."
if command -v docker &> /dev/null; then
    if docker ps &> /dev/null; then
        echo "✅ Docker is running"
    else
        echo "⚠️  Docker is installed but not running"
        echo "   Start it with: systemctl start docker"
    fi
else
    echo "❌ Docker not found"
fi

# 6. Navigate to project
echo ""
echo "======================================"
echo "Next Steps:"
echo "======================================"
echo ""
echo "1. Upload files from Windows:"
echo "   From Windows PowerShell:"
echo "   scp supabase/functions/autoScoreLead/index.ts root@your-vps:/root/asenay-leadsense/supabase/functions/autoScoreLead/"
echo "   scp supabase/functions/processUnscoredLeads/index.ts root@your-vps:/root/asenay-leadsense/supabase/functions/processUnscoredLeads/"
echo ""
echo "2. Navigate to project:"
echo "   cd $PROJECT_DIR"
echo ""
echo "3. Link to Supabase (fix permissions if needed):"
echo "   supabase link --project-ref vwryhloimldyaytobnol"
echo ""
echo "4. Deploy functions:"
echo "   supabase functions deploy autoScoreLead"
echo "   supabase functions deploy processUnscoredLeads"
echo ""

