#!/bin/bash

# OBS Bible Stream Verses - Full Release Package Script
# This script creates a COMPLETE distribution with ALL bible versions
# For personal/internal use only

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
VERSION=$(node -p "require('./package.json').version")
PACKAGE_NAME="obs-bible-stream-verses-FULL-v${VERSION}"
RELEASE_DIR="releases/${PACKAGE_NAME}"
ZIP_FILE="releases/${PACKAGE_NAME}.zip"

echo -e "${MAGENTA}========================================${NC}"
echo -e "${MAGENTA}OBS Bible Stream Verses - FULL Release${NC}"
echo -e "${MAGENTA}Version: ${VERSION}${NC}"
echo -e "${MAGENTA}⚠️  INCLUDES ALL BIBLE VERSIONS${NC}"
echo -e "${MAGENTA}========================================${NC}"
echo ""

# Step 1: Check if dist/ exists
echo -e "${YELLOW}[1/7] Checking if dist/ folder exists...${NC}"
if [ ! -d "dist" ]; then
    echo -e "${RED}Error: dist/ folder not found!${NC}"
    echo -e "${YELLOW}Please run 'pnpm build' first.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ dist/ folder found${NC}"
echo ""

# Step 2: Create release directory
echo -e "${YELLOW}[2/7] Creating release directory...${NC}"
rm -rf "${RELEASE_DIR}"
mkdir -p "${RELEASE_DIR}/v${VERSION}-FULL"
echo -e "${GREEN}✓ Release directory created: ${RELEASE_DIR}${NC}"
echo ""

# Step 3: Copy COMPLETE dist/ folder with ALL bibles
echo -e "${YELLOW}[3/7] Copying COMPLETE dist/ folder (ALL BIBLES)...${NC}"
cp -r dist/* "${RELEASE_DIR}/v${VERSION}-FULL/"

# Count bible files
BIBLE_COUNT=$(ls -1 dist/bible-*.js 2>/dev/null | wc -l | tr -d ' ')
echo -e "${GREEN}✓ dist/ folder copied with ${BIBLE_COUNT} bible versions${NC}"

# List all bibles
echo -e "${BLUE}📖 Bible versions included:${NC}"
for bible in dist/bible-*.js; do
    BIBLE_NAME=$(basename "$bible")
    BIBLE_SIZE=$(du -h "$bible" | cut -f1)
    echo -e "   - ${BIBLE_NAME} (${BIBLE_SIZE})"
done
echo ""

# Step 4: Copy LICENSE and README
echo -e "${YELLOW}[4/7] Copying documentation files...${NC}"
if [ -f "LICENSE" ]; then
    cp LICENSE "${RELEASE_DIR}/"
    echo -e "${GREEN}✓ LICENSE copied${NC}"
else
    echo -e "${YELLOW}⚠ LICENSE file not found${NC}"
fi

# Copy README for full version
if [ -f "README.md" ]; then
    cp README.md "${RELEASE_DIR}/"
    echo -e "${GREEN}✓ README.md copied${NC}"
fi

# Create FULL version marker file
cat > "${RELEASE_DIR}/VERSION_INFO.txt" << EOF
OBS Bible Stream Verses - FULL VERSION
Version: ${VERSION}
Build Date: $(date +"%Y-%m-%d %H:%M:%S")

This is the COMPLETE version including ALL bible translations.

Included Bible Versions:
EOF

# Add bible list to version info
for bible in dist/bible-*.js; do
    BIBLE_NAME=$(basename "$bible" | sed 's/bible-//' | sed 's/\.[^.]*\.js//' | tr '[:lower:]' '[:upper:]')
    echo "  - ${BIBLE_NAME}" >> "${RELEASE_DIR}/VERSION_INFO.txt"
done

# Create RELEASE_TYPE file
cat > "${RELEASE_DIR}/RELEASE_TYPE.txt" << EOF
Release Type: FULL
Version: ${VERSION}
Build Date: $(date +"%Y-%m-%d %H:%M:%S")
Includes: All Bible versions
EOF

echo -e "${GREEN}✓ Version info created${NC}"
echo ""

# Step 5: Verify critical files
echo -e "${YELLOW}[5/7] Verifying critical files...${NC}"
REQUIRED_FILES=(
    "v${VERSION}-FULL/panel.html"
    "v${VERSION}-FULL/browser.html"
    "v${VERSION}-FULL/panel.js"
    "v${VERSION}-FULL/browser.js"
    "v${VERSION}-FULL/sql-library.js"
)

ALL_PRESENT=true
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "${RELEASE_DIR}/${file}" ]; then
        echo -e "${RED}✗ Missing: ${file}${NC}"
        ALL_PRESENT=false
    else
        echo -e "${GREEN}✓ Found: ${file}${NC}"
    fi
done

if [ "$ALL_PRESENT" = false ]; then
    echo -e "${RED}Error: Some required files are missing!${NC}"
    exit 1
fi
echo ""

# Step 6: Create ZIP file
echo -e "${YELLOW}[6/7] Creating ZIP file...${NC}"
cd releases
rm -f "${PACKAGE_NAME}.zip"
zip -r "${PACKAGE_NAME}.zip" "${PACKAGE_NAME}/" > /dev/null
cd ..
echo -e "${GREEN}✓ ZIP file created: ${ZIP_FILE}${NC}"
echo ""

# Step 7: Display summary
echo -e "${YELLOW}[7/7] Package summary...${NC}"
ZIP_SIZE=$(du -h "${ZIP_FILE}" | cut -f1)
DIST_SIZE=$(du -sh "${RELEASE_DIR}/dist" | cut -f1)
TOTAL_FILES=$(find "${RELEASE_DIR}" -type f | wc -l | tr -d ' ')

echo -e "  ${BLUE}Package:${NC} ${PACKAGE_NAME}.zip"
echo -e "  ${BLUE}Size:${NC} ${MAGENTA}${ZIP_SIZE}${NC}"
echo -e "  ${BLUE}dist/ Size:${NC} ${DIST_SIZE}"
echo -e "  ${BLUE}Total Files:${NC} ${TOTAL_FILES}"
echo -e "  ${BLUE}Bible Versions:${NC} ${BIBLE_COUNT}"
echo -e "  ${BLUE}Location:${NC} $(pwd)/${ZIP_FILE}"
echo ""

# Display file tree
echo -e "${BLUE}Package contents (top level):${NC}"
tree -L 2 "${RELEASE_DIR}" 2>/dev/null || find "${RELEASE_DIR}" -maxdepth 2 -print | sed 's|[^/]*/| |g' | head -20
echo ""

# Final instructions
echo -e "${MAGENTA}========================================${NC}"
echo -e "${MAGENTA}✓ FULL Release package created!${NC}"
echo -e "${MAGENTA}========================================${NC}"
echo ""
echo -e "${BLUE}Package Details:${NC}"
echo -e "  ${GREEN}✓${NC} All ${BIBLE_COUNT} bible versions included"
echo -e "  ${GREEN}✓${NC} Ready for personal/internal use"
echo -e "  ${GREEN}✓${NC} Complete documentation included"
echo ""
echo -e "${YELLOW}⚠️  NOTE: This is a FULL version for personal use${NC}"
echo -e "${YELLOW}   Public releases should use the standard package-release.sh${NC}"
echo ""
echo -e "${BLUE}To test locally:${NC}"
echo -e "  cd releases && unzip ${PACKAGE_NAME}.zip && cd ${PACKAGE_NAME}"
echo -e "  # Then verify dist/ folder contents"
echo ""

