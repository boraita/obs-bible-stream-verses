# Release Checklist for OBS Forum

## Pre-Release Steps

### 1. Build Production Version
```bash
# Ensure you're on the main/master branch
git checkout main

# Pull latest changes
git pull origin main

# Install dependencies if needed
pnpm install

# Create production build
NODE_ENV=production pnpm build
```

### 2. Verify Build Output
Check that `dist/` folder contains:
- ✅ `panel.html` (~5 KB)
- ✅ `panel.js` (~478 KB)
- ✅ `browser.html` (~5 KB)
- ✅ `browser.js` (~300 KB)
- ✅ `sql-library.js` (~1.2 MB)
- ✅ `BTX.js` (~7 MB)
- ✅ `BTX4.js` (~7 MB)
- ✅ `KDSH.js` (~23 MB)
- ✅ `NVI.js` (~6 MB)
- ✅ `NVIC.js` (~6 MB)
- ✅ `RVR60.js` (~6 MB)

**Total size**: ~60 MB

### 3. Test Installation Locally
Before releasing, test the complete installation process:

1. Copy `dist/` folder to a temporary location
2. Follow `INSTALLATION.md` instructions step-by-step
3. Test in OBS:
   - Add Custom Browser Dock with correct path
   - Add Browser Source with correct path
   - Verify control panel loads
   - Verify Bible versions dropdown works
   - Test searching by reference (e.g., "John 3:16")
   - Test searching by text content
   - Verify verse displays on browser source overlay
   - Test with multiple Bible versions
   - Test theme switching (if implemented)

### 4. Create Release Package

#### Option A: Manual ZIP Creation
```bash
# Create a clean release folder
mkdir -p releases/v2.0.0

# Copy dist folder
cp -r dist releases/v2.0.0/

# Copy documentation
cp README.md releases/v2.0.0/
cp INSTALLATION.md releases/v2.0.0/
cp SECURITY.md releases/v2.0.0/
cp LICENSE releases/v2.0.0/

# Create ZIP file
cd releases
zip -r obs-bible-stream-verses-v2.0.0.zip v2.0.0/
```

#### Option B: GitHub Release
1. Go to GitHub repository
2. Click "Releases" → "Create a new release"
3. Tag version: `v2.0.0`
4. Release title: "OBS Bible Stream Verses v2.0.0"
5. Description: Copy from `OBS_FORUM_SUBMISSION.md` → Version History
6. Attach ZIP file from Option A
7. Mark as "Latest release"
8. Publish

### 5. Create Screenshots for Forum

Take screenshots of:

1. **Control Panel Dock**
   - Show in OBS interface
   - Display search interface with Bible version selector
   - Show search results
   - Highlight the clean UI

2. **Browser Source Overlay**
   - Capture a verse being displayed on stream
   - Show different styling (if applicable)
   - Demonstrate how it looks on actual stream

3. **Search Functionality**
   - Search by reference result
   - Search by text content result
   - Multiple verses in results

4. **Setup Process**
   - Custom Browser Dock dialog filled out
   - Browser Source properties dialog

**Screenshot Specifications:**
- Format: PNG or JPG
- Max size: 2 MB per image (forum limit)
- Recommended resolution: 1920x1080 or 1280x720
- Use OBS's built-in screenshot feature for authenticity

### 6. Optional: Create Demo Video

Consider creating a short demo video (1-3 minutes):
- Show installation process
- Demonstrate searching for verses
- Show verse appearing on stream overlay
- Highlight key features

**Video Specifications:**
- Format: MP4 (H.264)
- Max size: 100 MB (typical forum limit)
- Resolution: 1920x1080 or 1280x720
- Duration: 1-3 minutes
- Upload to YouTube and link in forum post

## Forum Submission Process

### 1. Create Forum Account
- Go to https://obsproject.com/forum/
- Click "Register" (top right)
- Complete registration process
- Verify email

### 2. Submit Resource
1. Navigate to Resources section: https://obsproject.com/forum/resources/
2. Click "Post resource" (if available) or find submission button
3. Fill out the form using content from `OBS_FORUM_SUBMISSION.md`:
   - **Category**: Tools
   - **Title**: OBS Bible Stream Verses - Display Bible Passages in Your Stream
   - **Short Description**: Copy from OBS_FORUM_SUBMISSION.md
   - **Full Description**: Copy from OBS_FORUM_SUBMISSION.md
   - **Version**: 2.0.0
   - **External Download URL**: Link to GitHub Release
   - **License**: MIT License
   - **Pricing**: Free
   - **Tags**: bible, verses, scripture, christian, streaming, overlay, browser-source, custom-dock, spanish, translation, search, religious

4. Upload screenshots (drag and drop into description)
5. Add external links:
   - GitHub: https://github.com/boraita/obs-bible-plugin
   - Releases: https://github.com/boraita/obs-bible-plugin/releases
   - Issues: https://github.com/boraita/obs-bible-plugin/issues

6. Preview before submitting
7. Submit for review/publication

### 3. Post-Submission
- Monitor forum thread for questions
- Respond to user feedback
- Update resource when new versions are released
- Link forum post in GitHub README

## Version Update Process (Future Releases)

When releasing v2.1.0, v2.2.0, etc.:

1. Update `package.json` version
2. Update `OBS_FORUM_SUBMISSION.md` with new features
3. Create new GitHub Release
4. Update forum resource:
   - Add new version entry
   - Update download link
   - Post update announcement in resource thread

## Checklist Summary

- [ ] Production build created and verified
- [ ] Installation tested locally in OBS
- [ ] Release package created (ZIP)
- [ ] GitHub Release published
- [ ] Screenshots taken and optimized
- [ ] Demo video created (optional)
- [ ] Forum account created/verified
- [ ] Resource submitted to forum
- [ ] GitHub README updated with forum link
- [ ] Monitor forum thread for initial feedback

---

**Once submitted, your tool will be available to the OBS community! 🎉**
