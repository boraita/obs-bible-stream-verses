#!/bin/bash

# OBS Bible Stream Verses - Release Package Script
# This script creates a ready-to-distribute ZIP file for OBS Forum

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
VERSION=$(node -p "require('./package.json').version")
PACKAGE_NAME="obs-bible-stream-verses-v${VERSION}"
RELEASE_DIR="releases/${PACKAGE_NAME}"
ZIP_FILE="releases/${PACKAGE_NAME}.zip"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}OBS Bible Stream Verses Release Packager${NC}"
echo -e "${BLUE}Version: ${VERSION}${NC}"
echo -e "${BLUE}========================================${NC}"
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
mkdir -p "${RELEASE_DIR}"
echo -e "${GREEN}✓ Release directory created: ${RELEASE_DIR}${NC}"
echo ""

# Step 3: Copy dist/ folder
echo -e "${YELLOW}[3/7] Copying dist/ folder...${NC}"
cp -r dist "${RELEASE_DIR}/"
echo -e "${GREEN}✓ dist/ folder copied${NC}"
echo ""

# Step 4: Copy documentation files
echo -e "${YELLOW}[4/7] Copying documentation...${NC}"
cp README.md "${RELEASE_DIR}/"
if [ -f "INSTALLATION.md" ]; then
    cp INSTALLATION.md "${RELEASE_DIR}/"
fi
cp SECURITY.md "${RELEASE_DIR}/"
cp CONTRIBUTING.md "${RELEASE_DIR}/"
if [ -f "LICENSE" ]; then
    cp LICENSE "${RELEASE_DIR}/"
fi
echo -e "${GREEN}✓ Documentation copied${NC}"
echo ""

# Step 5: Verify critical files
echo -e "${YELLOW}[5/7] Verifying critical files...${NC}"
REQUIRED_FILES=(
    "dist/panel.html"
    "dist/browser.html"
    "dist/panel.js"
    "dist/browser.js"
    "README.md"
    "SECURITY.md"
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
echo -e "  ${BLUE}Package:${NC} ${PACKAGE_NAME}.zip"
echo -e "  ${BLUE}Size:${NC} ${ZIP_SIZE}"
echo -e "  ${BLUE}dist/ Size:${NC} ${DIST_SIZE}"
echo -e "  ${BLUE}Location:${NC} $(pwd)/${ZIP_FILE}"
echo ""

# Display file tree
echo -e "${BLUE}Package contents:${NC}"
tree -L 2 "${RELEASE_DIR}" || find "${RELEASE_DIR}" -maxdepth 2 -print | sed 's|[^/]*/| |g'
echo ""

# Final instructions
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Release package created successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "  1. Test the package by extracting and following INSTALLATION.md"
echo -e "  2. Create a GitHub Release at: ${YELLOW}https://github.com/boraita/obs-bible-plugin/releases/new${NC}"
echo -e "  3. Upload ${ZIP_FILE} as a release asset"
echo -e "  4. Submit to OBS Forum using OBS_FORUM_SUBMISSION.md"
echo ""
echo -e "${BLUE}To test locally:${NC}"
echo -e "  cd releases && unzip ${PACKAGE_NAME}.zip && cd ${PACKAGE_NAME}"
echo -e "  # Then follow the README.md instructions"
echo ""
