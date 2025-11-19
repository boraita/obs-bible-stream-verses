# Changelog

All notable changes to the OBS Bible Plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.3.0] - 2025-11-19

### Added
- **Complete Linting & Formatting System**:
  - ESLint 8.57.1 with TypeScript support for code quality validation
  - Prettier 3.6.2 for consistent code formatting across the entire codebase
  - Stylelint 16.25.0 with SCSS support for style validation
  - Pre-configured VS Code settings for automatic formatting on save
  - VS Code extensions recommendations for optimal development experience
- **SCSS Migration**: Converted all CSS files to SCSS for better maintainability
  - `browser_style.scss` - Browser source overlay styles
  - `cp_style.scss` - Control panel styles
  - `dynamic-styles.scss` - Dynamic browser styles
  - `panel-dynamic-styles.scss` - Dynamic panel styles
- **TypeScript Type Definitions**: Added `src/types/styles.d.ts` for SCSS module imports
- **NPM Scripts**:
  - `lint` / `lint:fix` - ESLint validation and auto-fix
  - `lint:style` / `lint:style:fix` - Stylelint validation and auto-fix
  - `format` / `format:check` - Prettier formatting
  - `format:all` - Run all formatters and fixers in one command
- **Comprehensive Documentation**:
  - `LINTING.md` - Complete guide for linting and formatting tools
  - `SETUP_SUMMARY.md` - Detailed setup and configuration summary

### Changed
- **Code Style Standardization**: Entire codebase formatted with single quotes convention
  - 35+ JavaScript files reformatted
  - 4 TypeScript files reformatted
  - All HTML, JSON, and Markdown files formatted consistently
- **Webpack Configuration**: Updated to support SCSS compilation with sass-loader
- **TypeScript Configuration**: Enhanced `tsconfig.json` for better type checking
- **Build Pipeline**: Integrated SCSS compilation into webpack build process

### Technical
- Installed and configured `sass` and `sass-loader` for SCSS support
- Configured ESLint with TypeScript parser and recommended rules
- Set up Prettier with single quote preference and trailing commas
- Configured Stylelint with SCSS standard configuration
- Separated linting concerns: ESLint for logic, Prettier for formatting, Stylelint for styles
- Added proper ignore files for each tool (.eslintignore, .prettierignore)
- Created workspace settings for consistent VS Code behavior

### Developer Experience
- Automatic code formatting on save in VS Code
- Clear separation of concerns between linting tools
- Consistent code style across all file types
- Better error detection during development
- Improved code maintainability with SCSS features ready to use (variables, mixins, nesting)

### Documentation
- Updated `AGENTS.md` with linting and formatting guidelines
- Added detailed tool usage examples in `LINTING.md`
- Created comprehensive setup documentation in `SETUP_SUMMARY.md`
- Included troubleshooting guide for common linting issues

### Infrastructure
- Added `.eslintrc.json` with TypeScript-aware configuration
- Added `.prettierrc` with single quote and formatting preferences
- Added `.stylelintrc.json` with SCSS linting rules
- Added `.vscode/settings.json` for consistent editor behavior
- Added `.vscode/extensions.json` with recommended extensions

## [2.2.0] - 2025-11-03

### Added
- **OBS WebSocket Integration**: Complete OBS WebSocket v5.x support for advanced automation
  - Real-time connection status indicator with visual feedback
  - Scene management and monitoring capabilities
  - Automatic scene switching when showing/hiding verses
  - Downstream Keyer (DSK) status checking and monitoring
- **OBS Control Panel**: New dedicated tab in control panel with:
  - WebSocket connection management (connect/disconnect)
  - Configuration settings (host, port, password)
  - Test connection functionality with detailed feedback
  - Current scene display and refresh
  - Complete scenes list with active scene highlighting
  - DSK source detection and status
- **Automatic Scene Change System**:
  - Configure multiple scenes to monitor
  - Set target scene for when verses are shown
  - Optional return scene when verses are hidden
  - Smart conditional switching (only triggers if current scene is monitored)
  - Test scene change functionality
- **OBS WebSocket Configuration**: Persistent storage of connection settings
- **Real-time Scene Detection**: Automatic detection of current active scene
- **Visual Notifications**: Toast notifications for OBS actions and status changes
- **Connection Testing**: Pre-connection test to validate settings before connecting

### Changed
- Updated control panel UI with new OBS tab
- Enhanced browser overlay integration with OBS scene management
- Improved error handling and user feedback for OBS operations
- Restructured control_app.js with OBS WebSocket panel initialization

### Technical
- Implemented OBS WebSocket Protocol v5.x with authentication
- Added SHA256 authentication for password-protected OBS instances
- Created obsWebSocket.js singleton for connection management
- Added obsWebSocketConfig.js for centralized configuration
- Implemented promise-based connection handling with timeout
- Added automatic reconnection logic with exponential backoff
- Created comprehensive OBS integration documentation

### Documentation
- Added OBS_WEBSOCKET_INTEGRATION.md with setup and usage guide
- Updated README.md with OBS WebSocket features
- Added configuration examples and troubleshooting tips

### Security
- Secure password storage in localStorage
- SHA256 challenge-response authentication
- No plain-text password transmission

## [2.1.0] - 2025-10-13

### Added
- **Testing Suite**: Comprehensive testing system with 3 test files:
  - `testAlgorithm.js` - Algorithm consistency and differentiation testing (20 verses)
  - `testBibleSelection.js` - Bible configuration validation (6 versions)
  - `testSnapshot.js` - Snapshot-based regression testing with JSON baseline
- **RVR60 Bible**: Included Reina-Valera 1960 as reference Bible in repository
- **TESTING.md**: New documentation file for testing guidelines
- **Snapshot System**: MD5-based snapshot validation to detect unintended changes
- Test modes: `--quick` and `--verbose` flags for flexible testing

### Changed
- **Centralized Configuration**: Refactored `sendMessage.js` to use `BIBLE_MAP` from `bibleConfig.js`
- **Bible Config**: Fixed `getBibleMap()` to use correct name property from `BIBLE_CONFIG`
- **Code Quality**: Improved maintainability with DRY principles and centralized configuration
- **Testing Files**: Consolidated from 7+ redundant test files to 3 essential ones
- **English Content**: All test data and verse references translated to English
- **Kadosh Bible**: Updated display name from "Kadosh" to "Kadosh Israelita" for clarity

### Removed
- **Redundant Tests**: Deleted `testDirecto.js`, `testAvanzado.js`, and `testFinal.js`
- Eliminated duplicate and unnecessary test files

### Fixed
- Bug in `getBibleMap()` where it returned key instead of `BIBLE_CONFIG[key].name`
- Inconsistent naming conventions across test files

### Documentation
- Updated README.md with RVR60 reference note
- Improved testing documentation with clear usage examples
- Added comprehensive test suite documentation in `testing/README.md`

### Infrastructure
- Modified `.gitignore` to include RVR60.sqlite in repository
- Updated `.npmignore` to exclude developer documentation from distribution
- All tests provide proper exit codes for CI/CD integration

## [2.0.0] - Previous Release

### Added
- Initial lazy loading architecture
- 6 Bible versions support (KDSH, LBLA, NVI, NTV, BTX, RVR60)
- Dual search functionality (reference and text)
- Custom Browser Dock for OBS
- Browser Source overlay
- Optimized bundle size (95% reduction)

---

**Note**: For detailed changes in each version, see the [Releases page](https://github.com/boraita/obs-bible-plugin/releases).
