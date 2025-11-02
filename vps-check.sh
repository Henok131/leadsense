#!/bin/bash
# Quick verification script for VPS setup
# Run this on your VPS: bash vps-check.sh

echo "========================================"
echo "VPS Setup Verification"
echo "========================================"
echo ""

PROJECT_DIR="/root/asenay-leadsense"

# 1. Check project directory
echo "1. Checking project directory..."
if [ -d "$PROJECT_DIR" ]; then
    echo "   ✅ Project directory exists: $PROJECT_DIR"
else
    echo "   ❌ Project directory missing: $PROJECT_DIR"
    echo "   Creating directory..."
    mkdir -p "$PROJECT_DIR/supabase/functions/autoScoreLead"
    mkdir -p "$PROJECT_DIR/supabase/functions/processUnscoredLeads"
    echo "   ✅ Directories created"
fi

# 2. Check function files
echo ""
echo "2. Checking function files..."
if [ -f "$PROJECT_DIR/supabase/functions/autoScoreLead/index.ts" ]; then
    echo "   ✅ autoScoreLead/index.ts exists"
    echo "   Size: $(wc -l < $PROJECT_DIR/supabase/functions/autoScoreLead/index.ts) lines"
else
    echo "   ❌ autoScoreLead/index.ts MISSING"
    echo "   Upload from Windows using:"
    echo "   scp supabase/functions/autoScoreLead/index.ts root@your-vps:/root/asenay-leadsense/supabase/functions/autoScoreLead/"
fi

if [ -f "$PROJECT_DIR/supabase/functions/processUnscoredLeads/index.ts" ]; then
    echo "   ✅ processUnscoredLeads/index.ts exists"
    echo "   Size: $(wc -l < $PROJECT_DIR/supabase/functions/processUnscoredLeads/index.ts) lines"
else
    echo "   ❌ processUnscoredLeads/index.ts MISSING"
    echo "   Upload from Windows using:"
    echo "   scp supabase/functions/processUnscoredLeads/index.ts root@your-vps:/root/asenay-leadsense/supabase/functions/processUnscoredLeads/"
fi

# 3. Check Supabase CLI
echo ""
echo "3. Checking Supabase CLI..."
if command -v supabase &> /dev/null; then
    echo "   ✅ Supabase CLI installed"
    echo "   Version: $(supabase --version)"
else
    echo "   ❌ Supabase CLI not found"
    echo "   Install with: curl -fsSL https://supabase.com/install.sh | sh"
fi

# 4. Check Supabase initialization
echo ""
echo "4. Checking Supabase initialization..."
cd "$PROJECT_DIR" 2>/dev/null
if [ -f ".supabase/config.toml" ]; then
    echo "   ✅ Supabase initialized"
    echo "   Project ref: $(grep 'project_id' .supabase/config.toml 2>/dev/null | cut -d'"' -f2 || echo 'Not set')"
else
    echo "   ⚠️  Supabase not initialized in project"
    echo "   Run: cd $PROJECT_DIR && supabase init"
fi

# 5. Check Docker
echo ""
echo "5. Checking Docker..."
if command -v docker &> /dev/null; then
    if docker ps &> /dev/null; then
        echo "   ✅ Docker is running"
    else
        echo "   ❌ Docker installed but not running"
        echo "   Start with: systemctl start docker"
    fi
else
    echo "   ❌ Docker not found"
fi

# 6. Check login status
echo ""
echo "6. Checking Supabase login..."
if supabase projects list &> /dev/null; then
    echo "   ✅ Logged in to Supabase"
else
    echo "   ⚠️  Not logged in or connection issue"
    echo "   Run: supabase login"
fi

echo ""
echo "========================================"
echo "Summary"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Upload missing function files from Windows"
echo "2. Navigate to: cd $PROJECT_DIR"
echo "3. Link project: supabase link --project-ref vwryhloimldyaytobnol"
echo "4. Deploy functions: supabase functions deploy autoScoreLead"
echo ""

