# 🎯 Quick Reference Guide - OBS Bible Stream Verses

## 📂 Project Structure

```
obs-bible-plugin/
├── 📄 README.md                    # Main project documentation
├── 📄 INSTALLATION.md              # Installation guide for OBS users
├── 📄 DISTRIBUTION_README.md       # Quick start (included in release ZIP)
├── 📄 OBS_FORUM_SUBMISSION.md      # Forum submission template
├── 📄 RELEASE_CHECKLIST.md         # Release process steps
├── 📄 SUBMISSION_SUMMARY.md        # Executive summary (this stage)
├── 📄 CONTRIBUTING.md              # Contribution guidelines
├── 📄 SECURITY.md                  # Security policy
├── 📄 AGENTS.md                    # Developer guidelines
├── 📄 package.json                 # NPM configuration (v2.0.0)
├── 📄 webpack.config.js            # Build configuration
├── 📄 .gitignore                   # Git exclusions
├── 📄 .npmignore                   # Distribution exclusions
│
├── 📁 src/                         # Source code
│   ├── 📁 api/                     # Database access layer
│   ├── 📁 core/                    # Business logic & controllers
│   ├── 📁 config/                  # Configuration (Bible versions)
│   ├── 📁 db/                      # SQLite Bible files (6 versions)
│   ├── 📁 public/                  # HTML entry points
│   ├── 📁 styles/                  # CSS stylesheets
│   └── 📁 utils/                   # Utilities
│
├── 📁 dist/                        # Built output (production ready)
│   ├── panel.html                  # Control panel entry
│   ├── panel.js                    # Panel bundle (~478 KB)
│   ├── browser.html                # Overlay entry
│   ├── browser.js                  # Browser bundle (~300 KB)
│   ├── sql-library.js              # SQL.js library (~1.2 MB)
│   └── [BIBLE].js × 6              # Lazy-loaded Bibles (6-23 MB each)
│
├── 📁 scripts/                     # Automation scripts
│   └── package-release.sh          # Release packager
│
└── 📁 testing/                     # Test scripts (excluded from dist)
```

---

## 🚀 Command Reference

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `pnpm install` | Install dependencies | First time setup, after pulling changes |
| `pnpm start` | Dev server with hot reload | Development work |
| `pnpm dev` | Single build (development) | Quick validation |
| `pnpm build` | Production build | Before release, testing |
| `pnpm release` | Build + create release package | Creating release for distribution |

---

## 📋 Documentation Quick Links

### For End Users
- **[INSTALLATION.md](INSTALLATION.md)** - How to install in OBS
- **[DISTRIBUTION_README.md](DISTRIBUTION_README.md)** - Quick start guide (in ZIP)

### For Contributors
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute
- **[AGENTS.md](AGENTS.md)** - Code guidelines & architecture

### For Maintainers
- **[RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md)** - Release process
- **[OBS_FORUM_SUBMISSION.md](OBS_FORUM_SUBMISSION.md)** - Forum submission template
- **[SUBMISSION_SUMMARY.md](SUBMISSION_SUMMARY.md)** - Current status overview

### General
- **[README.md](README.md)** - Project overview
- **[SECURITY.md](SECURITY.md)** - Security & privacy policy

---

## 🎯 Workflow Cheatsheet

### Development Workflow
```bash
# 1. Start development
pnpm start

# 2. Make changes in src/
# Files auto-reload in browser

# 3. Test in OBS
# Point Custom Browser Dock to http://localhost:8080/panel.html
# Point Browser Source to http://localhost:8080/browser.html

# 4. Build for testing
pnpm build

# 5. Test built version in OBS
# Point to file:///path/to/dist/panel.html
```

### Release Workflow
```bash
# 1. Ensure you're on main branch
git checkout main
git pull origin main

# 2. Update version in package.json (if needed)
# Edit version field to "2.0.0" or "2.1.0", etc.

# 3. Create production build and package
pnpm release

# 4. Output will be in releases/ folder
# obs-bible-stream-verses-v2.0.0.zip

# 5. Test the package locally
cd releases
unzip obs-bible-stream-verses-v2.0.0.zip
cd obs-bible-stream-verses-v2.0.0
# Follow README.md instructions

# 6. Create GitHub Release
# Upload ZIP file as asset

# 7. Submit to OBS Forum
# Use OBS_FORUM_SUBMISSION.md as template
```

---

## 🔧 Adding a New Bible Translation

### Quick Steps
1. **Get SQLite file**: Download `.sqlite` file (e.g., from ph4.org)
2. **Copy to db**: `cp BIBLE.sqlite src/db/`
3. **Edit config**: Add entry in `src/config/bibleConfig.js`
4. **Rebuild**: `pnpm build`

### Config Template
```javascript
// In src/config/bibleConfig.js
export const BIBLE_CONFIG = {
  // ... existing configs
  
  newBible: {
    name: "newBible",                    // Internal identifier
    displayName: "NB",                   // Short UI label
    fullName: "New Bible Version",       // Full name
    requiresTagCleaning: false,          // true if has HTML tags
    loader: () => import("../db/NEW.sqlite")  // Lazy loader
  }
};
```

---

## 📦 What Gets Distributed

### In Release ZIP
```
obs-bible-stream-verses-v2.0.0/
├── README.md (from DISTRIBUTION_README.md)
├── INSTALLATION.md
├── SECURITY.md
├── LICENSE (if exists)
└── dist/
    ├── panel.html
    ├── panel.js
    ├── browser.html
    ├── browser.js
    ├── sql-library.js
    └── [BIBLE].js × 6
```

### Excluded from Distribution
- `/src/` - Source code (available on GitHub)
- `/testing/` - Test scripts
- `/node_modules/` - Dependencies
- `/scripts/` - Build scripts
- `webpack.config.js` - Build config
- Developer documentation (AGENTS.md, BUILD_INFO.md, etc.)

---

## 🎨 Customization Points

### Styling
- **Panel**: `src/styles/cp_style.css`
- **Overlay**: `src/styles/browser_style.css`

### Behavior
- **Search Logic**: `src/core/searchBible.js`
- **Data Access**: `src/api/getData.js`
- **Panel Controller**: `src/core/control_app.js`
- **Overlay Controller**: `src/core/browser_app.js`

### Configuration
- **Bible Versions**: `src/config/bibleConfig.js`
- **Build Settings**: `webpack.config.js`

---

## 🐛 Common Issues & Solutions

### Issue: Control Panel not loading in OBS
**Solution**: 
- Check file path starts with `file://`
- Use absolute path, not relative
- Right-click dock → Refresh

### Issue: Overlay not showing verses
**Solution**:
- Ensure both panel AND browser source are added
- Verify Browser Source uses `browser.html`
- Check source dimensions (1920x1080)

### Issue: Bible not loading
**Solution**:
- Verify all `.js` files in `dist/` folder
- Check browser console for errors (F12)
- Rebuild: `pnpm build`

### Issue: Build fails
**Solution**:
```bash
# Clean and rebuild
rm -rf dist/ node_modules/
pnpm install
pnpm build
```

---

## 📊 Performance Metrics

| Metric | Value | Notes |
|--------|-------|-------|
| Initial Load | 2.6 MB | 95% reduction from 54MB |
| panel.js | ~478 KB | Control panel bundle |
| browser.js | ~300 KB | Overlay bundle |
| sql-library.js | ~1.2 MB | SQLite engine |
| Bible files | 6-23 MB each | Loaded on-demand |
| Search speed | <100ms | Average query time |
| Bible switch | ~1s | First load, then cached |

---

## 🔗 Important URLs

- **GitHub Repo**: https://github.com/boraita/obs-bible-plugin
- **Releases**: https://github.com/boraita/obs-bible-plugin/releases
- **Issues**: https://github.com/boraita/obs-bible-plugin/issues
- **OBS Forum**: https://obsproject.com/forum/
- **OBS Resources**: https://obsproject.com/forum/resources/
- **Bible Source**: https://www.ph4.org

---

## ✅ Pre-Flight Checklist

Before releasing or submitting:

- [ ] All tests pass in OBS
- [ ] Documentation reviewed and updated
- [ ] Version number updated in package.json
- [ ] CHANGELOG updated (if you have one)
- [ ] Screenshots taken and optimized
- [ ] GitHub Release created
- [ ] ZIP file tested on clean system
- [ ] Forum account ready

---

## 💡 Pro Tips

1. **Testing**: Always test the ZIP package on a clean system before public release
2. **Screenshots**: Take screenshots in OBS, not external editor (looks more authentic)
3. **Versioning**: Use semantic versioning (MAJOR.MINOR.PATCH)
4. **Forum**: Respond to forum questions within 24-48 hours
5. **GitHub**: Use Issues for bugs, Discussions for questions
6. **Updates**: Release updates regularly with user-requested features

---

**Quick Access**: Bookmark this page for fast reference! 📌
