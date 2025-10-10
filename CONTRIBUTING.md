# Contributing to OBS Bible Stream Verses

Thank you for your interest in contributing to **OBS Bible Stream Verses**! This document provides guidelines for contributing to the project.

## 🤝 Ways to Contribute

### 1. Report Bugs
If you find a bug, please create an issue on GitHub with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- OBS version and operating system
- Screenshots or error messages if applicable

### 2. Suggest Features
Have an idea for a new feature? Open an issue with:
- Clear description of the feature
- Use case and benefits
- Example or mockup if applicable

### 3. Add Bible Translations
To add a new Bible translation:
1. Obtain a SQLite database with the Bible in the required format
2. Follow the instructions in [README.md](README.md#-adding-more-bibles)
3. Submit a Pull Request with the configuration changes

### 4. Improve Documentation
Documentation improvements are always welcome:
- Fix typos or unclear instructions
- Add examples or screenshots
- Translate documentation to other languages

### 5. Code Contributions
See the "Development Setup" section below.

## 🛠️ Development Setup

### Prerequisites
- Node.js 16+ and pnpm 8+
- Git
- OBS Studio 27.0+ (for testing)

### Getting Started

1. **Fork the repository** on GitHub

2. **Clone your fork**:
```bash
git clone https://github.com/YOUR_USERNAME/obs-bible-plugin.git
cd obs-bible-plugin
```

3. **Install dependencies**:
```bash
pnpm install
```

4. **Start development server**:
```bash
pnpm start
```

5. **Build for production**:
```bash
pnpm build
```

### Project Structure
See [AGENTS.md](AGENTS.md) for detailed project structure and guidelines.

Key directories:
- `src/core/` - UI controllers and business logic
- `src/api/` - Database access layer
- `src/config/` - Configuration files (Bible versions, etc.)
- `src/public/` - HTML entry points
- `src/styles/` - CSS stylesheets
- `src/db/` - SQLite Bible databases

## 📝 Code Style Guidelines

### JavaScript
- Use ES6+ modules with explicit exports
- Two-space indentation
- Double quotes for strings
- Descriptive variable and function names in camelCase
- Files named after their exported responsibility
- Add comments only for non-obvious behavior

Example:
```javascript
// Good
export function processVerseText(text, bibleVersion) {
  if (!text) return "";
  
  const cleaned = cleanHtmlTags(text);
  return cleaned.trim();
}

// Avoid
export function process(t, v) {
  return t ? cleanHtmlTags(t).trim() : "";
}
```

### HTML
- Kebab-case for IDs and classes
- Semantic HTML elements
- Accessibility attributes where applicable

### CSS
- Kebab-case for class names
- Group related properties
- Use CSS custom properties for theme values

## 🔍 Testing Your Changes

### Manual Testing in OBS
1. Build your changes: `pnpm build`
2. In OBS, point Custom Browser Dock to `file:///path/to/dist/panel.html`
3. Add Browser Source with `file:///path/to/dist/browser.html`
4. Test all functionality:
   - Search by reference
   - Search by text content
   - Switch Bible versions
   - Verify overlay displays correctly
   - Test edge cases (empty searches, special characters, etc.)

### Browser Testing
You can also test in a regular browser:
1. Run `pnpm start`
2. Open `http://localhost:8080/panel.html`
3. Open `http://localhost:8080/browser.html` in another tab

## 📋 Pull Request Process

1. **Create a feature branch**:
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes** following the code style guidelines

3. **Test thoroughly** in OBS and browser

4. **Commit your changes**:
```bash
git add .
git commit -m "feat: brief description of your changes"
```

Use conventional commit messages:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

5. **Push to your fork**:
```bash
git push origin feature/your-feature-name
```

6. **Create a Pull Request** on GitHub with:
   - Clear title and description
   - Link to related issue (if applicable)
   - Screenshots or screen recording of UI changes
   - Testing steps you performed

## 🐛 Debugging Tips

### Enable Browser DevTools in OBS
1. Right-click on the Custom Browser Dock or Browser Source
2. Select "Interact" (for Browser Source) or right-click dock title
3. Press F12 to open DevTools
4. Check Console for errors and Network tab for loading issues

### Common Issues
- **Bible not loading**: Check that all `.js` files are present in `dist/`
- **Overlay not updating**: Verify BroadcastChannel communication in Console
- **Build errors**: Check webpack output for specific error messages

## 📚 Resources

- [OBS Custom Browser Docks Documentation](https://obsproject.com/kb/custom-browser-docks)
- [OBS Browser Source Documentation](https://obsproject.com/wiki/Sources-Guide#browsersource)
- [Webpack Documentation](https://webpack.js.org/)
- [SQL.js Documentation](https://sql.js.org/)

## ❓ Questions?

If you have questions about contributing:
- Open a GitHub Discussion
- Check existing issues for similar questions
- Read the [README.md](README.md) and [AGENTS.md](AGENTS.md)

## 🎉 Recognition

All contributors will be acknowledged in the project documentation. Thank you for helping make OBS Bible Stream Verses better!

---

**Happy coding! 🚀**
