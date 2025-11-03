#!/bin/bash

# OBS Bible Plugin - Create GitHub Release v2.2.0
# This script creates a git tag and prepares for GitHub release

set -e

VERSION="2.2.0"
TAG="v${VERSION}"

echo "========================================="
echo "Creating GitHub Release ${TAG}"
echo "========================================="
echo ""

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  Warning: You have uncommitted changes"
    echo ""
    git status --short
    echo ""
    read -p "Do you want to continue anyway? (y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Aborted"
        exit 1
    fi
fi

echo "[1/5] Checking if release package exists..."
RELEASE_ZIP="releases/obs-bible-stream-verses-v${VERSION}.zip"
if [ ! -f "$RELEASE_ZIP" ]; then
    echo "❌ Error: Release package not found: $RELEASE_ZIP"
    echo "   Run 'pnpm package' first"
    exit 1
fi
echo "✓ Release package found: $RELEASE_ZIP"
echo ""

echo "[2/5] Checking if tag already exists..."
if git rev-parse "$TAG" >/dev/null 2>&1; then
    echo "⚠️  Tag $TAG already exists"
    read -p "Do you want to delete and recreate it? (y/N) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git tag -d "$TAG"
        git push origin ":refs/tags/$TAG" 2>/dev/null || true
        echo "✓ Existing tag deleted"
    else
        echo "❌ Aborted"
        exit 1
    fi
fi
echo ""

echo "[3/5] Creating git tag..."
git tag -a "$TAG" -m "Release version ${VERSION} - OBS WebSocket Integration

Major Features:
- Complete OBS WebSocket v5.x integration
- Automatic scene switching system
- Downstream Keyer (DSK) support
- Real-time scene management
- Secure authentication with SHA256

See RELEASE_NOTES_v${VERSION}.md for full details."

echo "✓ Tag $TAG created"
echo ""

echo "[4/5] Displaying tag info..."
git show "$TAG" --no-patch
echo ""

echo "[5/5] Next steps..."
echo "========================================="
echo ""
echo "To push the tag to GitHub, run:"
echo "  git push origin $TAG"
echo ""
echo "Then create a GitHub Release:"
echo "  1. Go to: https://github.com/boraita/obs-bible-plugin/releases/new"
echo "  2. Select tag: $TAG"
echo "  3. Title: OBS Bible Plugin v${VERSION} - OBS WebSocket Integration"
echo "  4. Copy content from: releases/RELEASE_NOTES_v${VERSION}.md"
echo "  5. Upload asset: $RELEASE_ZIP"
echo "  6. Click 'Publish release'"
echo ""
echo "========================================="
echo "✓ Release preparation complete!"
echo "========================================="
