# Changelog

All notable changes to the OBS Bible Plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
