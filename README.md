
# 📖 OBS Bible Stream Verses

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/boraita/obs-bible-plugin/releases)
[![OBS Studio](https://img.shields.io/badge/OBS%20Studio-27.0%2B-blueviolet.svg)](https://obsproject.com/)

Display Bible verses beautifully in your OBS streams with an easy-to-use control panel and customizable overlay.

## 🎯 What is it?

**OBS Bible Stream Verses** is a modern tool for streamers who want to display Bible passages during their broadcasts. It provides:
- **Control Panel**: Custom Browser Dock for searching and selecting verses
- **Overlay**: Browser Source that displays verses on your stream
- **Offline**: No internet connection required
- **Optimized**: Lazy loading architecture (only 2.6 MB initial load)

Perfect for church services, Bible studies, Christian content creators, and worship streams.

## ✨ Features

- 🔍 **Dual Search**: Find verses by reference (`John 3:16`) or by text content
- 📚 **6 Bible Versions**: Kadosh, Americas, NVI, NTV, BTX, RVR60
- ⚡ **Performance**: Optimized with lazy loading (95% size reduction)
- 🎨 **Customizable**: Easy to modify styling and add new translations
- 🌐 **100% Offline**: All databases are local
- 🆓 **Free & Open Source**: MIT License

## 📦 Quick Start

### For Users (Pre-built Release)

1. **Download** the latest release from [Releases page](https://github.com/boraita/obs-bible-plugin/releases)
2. **Extract** the ZIP file to a folder
3. **Follow** the step-by-step guide in `INSTALLATION.md` (included in download)

Detailed installation instructions: **[INSTALLATION.md](INSTALLATION.md)**

> 📖 **Note**: The plugin includes **RVR60 (Reina-Valera 1960)** as the reference Bible version. This is a public domain Spanish translation included for testing and immediate use. You can add more Bible versions following the instructions below.

### For Developers

```bash
# Clone the repository
git clone https://github.com/boraita/obs-bible-plugin.git
cd obs-bible-plugin

# Install dependencies
pnpm install

# Development with hot reload
pnpm start

# Production build
pnpm build

# Create release package
pnpm release
```

## 🔧 Adding New Bibles

1. **Obtain** a SQLite database file (`.sqlite`) with the Bible translation
   - Source: https://www.ph4.org or any trusted provider
   - Required tables: `book`, `verse` (standard Bible database schema)

2. **Copy** the file to `src/db/` folder:
   ```bash
   cp /path/to/BIBLE.sqlite src/db/
   ```

3. **Configure** in `src/config/bibleConfig.js`:
   ```javascript
   export const BIBLE_CONFIG = {
     // ... existing Bibles
     newBible: {
       name: "newBible",
       displayName: "NB",              // Short name for UI
       fullName: "New Bible Version",  // Full name
       requiresTagCleaning: false,     // Set true if contains HTML tags
       loader: () => import("../db/BIBLE.sqlite")
     }
   };
   ```

4. **Rebuild**:
   ```bash
   pnpm build
   ```

The new Bible will automatically appear in the version selector!

## 🎬 Using in Your Stream

1. **Open** the Control Panel dock in OBS
2. **Select** your preferred Bible version from the dropdown
3. **Search** for verses:
   - By reference: `Genesis 1:1`, `Psalm 23`, `Matthew 5:1-10`
   - By text: Type any words from the verse
4. **Click** on a verse result to display it on your overlay
5. The verse appears instantly on your Browser Source!

## 📚 Documentation

- **[INSTALLATION.md](INSTALLATION.md)** - Complete installation guide for OBS
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute to the project
- **[SECURITY.md](SECURITY.md)** - Security policy and privacy information
- **[AGENTS.md](AGENTS.md)** - Developer guidelines and code architecture
- **[BUILD_INFO.md](BUILD_INFO.md)** - Technical build documentation

## 🚀 Release Process

For maintainers creating a new release:

1. Review **[RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md)** for complete steps
2. Build and test: `pnpm build`
3. Create package: `pnpm release`
4. Create GitHub Release with the generated ZIP
5. Optionally submit to OBS Forum using **[OBS_FORUM_SUBMISSION.md](OBS_FORUM_SUBMISSION.md)**

## 🌟 Key Technical Highlights

- **Modern JavaScript**: ES6+ with modules and async/await
- **Webpack 5**: Code splitting and lazy loading
- **SQL.js**: Fast local SQLite queries
- **BroadcastChannel**: Real-time communication between panel and overlay
- **Clean Code**: DRY principles, Single Responsibility, maintainable architecture

## 🤝 Contributing

Contributions are welcome! Whether it's:
- 🐛 Bug reports
- 💡 Feature suggestions
- 📖 Documentation improvements
- 🌍 New Bible translations
- 💻 Code contributions

See **[CONTRIBUTING.md](CONTRIBUTING.md)** for guidelines.

## 🔐 Security & Privacy

- ✅ No data collection or tracking
- ✅ No external API calls
- ✅ All data stored locally
- ✅ Open source for transparency

Read more: **[SECURITY.md](SECURITY.md)**

## 📄 License

This project is licensed under the **MIT License** - free for personal and commercial use.

See [LICENSE](LICENSE) for details.

## 👨‍💻 Credits

- **Developer**: Rafael Montaño
- **Bible Databases**: https://www.ph4.org
- **Originally inspired by**: [Tosin-JD/obs-bible-plugin](https://github.com/Tosin-JD/obs-bible-plugin)

## 📜 Project History

This project was originally forked from [Tosin-JD/obs-bible-plugin](https://github.com/Tosin-JD/obs-bible-plugin) but has been **completely rewritten** for version 2.0.0 with:
- New Clean Code architecture
- Performance optimization (lazy loading)
- Centralized configuration system
- Comprehensive documentation
- Independent development direction

The current codebase shares no functionality with the original fork and represents a fresh start.

## 🔗 Links

- **GitHub**: https://github.com/boraita/obs-bible-plugin
- **Issues**: https://github.com/boraita/obs-bible-plugin/issues
- **Releases**: https://github.com/boraita/obs-bible-plugin/releases
- **OBS Forum**: [Coming soon]

## 💬 Support

- 📝 Check existing [Issues](https://github.com/boraita/obs-bible-plugin/issues)
- 🆕 Create a new issue for bugs or feature requests
- 💬 Start a [Discussion](https://github.com/boraita/obs-bible-plugin/discussions) for questions

---

**Made with ❤️ for the streaming community | Enjoy displaying God's Word! 🙏✨**