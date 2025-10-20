
#!/bin/bash

# ============================================
# Asphalt OS - Quick GitHub Push Script
# ============================================

echo "🚀 Asphalt OS - GitHub Push Helper"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    echo "Run: cd /home/ubuntu/asphalt_paving_maps"
    exit 1
fi

echo "✅ Git repository detected"
echo ""

# Show current status
echo "📊 Current Status:"
git log --oneline -1
echo ""

# Check remote
echo "🔗 Remote Repository:"
git remote -v | grep push
echo ""

# Prompt for token
echo "🔐 To push to GitHub, you need a Personal Access Token"
echo ""
echo "Get your token here: https://github.com/settings/tokens"
echo "(Click 'Generate new token (classic)' and select 'repo' scope)"
echo ""
read -p "Paste your GitHub token (ghp_...): " GITHUB_TOKEN
echo ""

# Validate token format
if [[ ! $GITHUB_TOKEN =~ ^ghp_ ]]; then
    echo "⚠️  Warning: Token should start with 'ghp_'"
    read -p "Continue anyway? (y/n): " CONTINUE
    if [[ $CONTINUE != "y" ]]; then
        echo "❌ Aborted"
        exit 1
    fi
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
echo ""

git push https://${GITHUB_TOKEN}@github.com/NXConner/Asphalt-OS_Overwatch-Systems.git master

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Your code is now on GitHub!"
    echo ""
    echo "View it here: https://github.com/NXConner/Asphalt-OS_Overwatch-Systems"
    echo ""
else
    echo ""
    echo "❌ Push failed. Check your token and try again."
    echo ""
    echo "Troubleshooting:"
    echo "1. Verify token has 'repo' scope"
    echo "2. Check repository exists: https://github.com/NXConner/Asphalt-OS_Overwatch-Systems"
    echo "3. Ensure you have write access"
    echo ""
fi
