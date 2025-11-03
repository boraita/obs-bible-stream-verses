# Changelog

All notable changes to the OBS Bible Plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
