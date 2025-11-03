# OBS Bible Plugin v2.2.0 - OBS WebSocket Integration 🎬

## 🎉 What's New

This release introduces **complete OBS WebSocket integration**, allowing the plugin to communicate directly with OBS Studio for advanced automation and scene management.

### ✨ Major Features

#### 🔌 OBS WebSocket Integration
- **Real-time connection** to OBS Studio via WebSocket Protocol v5.x
- **Visual connection status** indicator with animated feedback
- **Secure authentication** with SHA256 password protection
- **Automatic reconnection** with exponential backoff

#### 🎬 Automatic Scene Switching
- **Smart scene detection** - Monitor multiple scenes simultaneously
- **Conditional switching** - Only triggers when current scene is in monitored list
- **Target scene configuration** - Automatically switch to designated scene when showing verses
- **Return scene option** - Optionally return to previous scene when hiding verses
- **Test mode** - Test your scene changes before going live

#### 📊 Scene Management
- **Live scene list** with active scene highlighting
- **Current scene display** with one-click refresh
- **Scene status monitoring** in real-time
- **Quick scene switching** from control panel

#### 🔑 Downstream Keyer (DSK) Support
- **DSK detection** - Automatically detect downstream keyer sources
- **Status monitoring** - Check if DSK is active or inactive
- **Source listing** - View all DSK sources and their states
- **Visual feedback** - Toast notifications for DSK status

### 🎛️ New OBS Control Panel Tab

A dedicated OBS tab in the control panel provides:
- ✅ Connection management (Connect/Disconnect)
- ⚙️ Configuration settings (Host, Port, Password)
- 🧪 Test connection before committing
- 📺 Current scene display and refresh
- 📋 Complete scenes list
- 🔄 Auto scene change configuration
- 🔑 DSK status and sources

### 🔒 Security

- **Secure storage** - Connection settings saved in localStorage
- **Encrypted authentication** - SHA256 challenge-response protocol
- **No plain-text passwords** - Passwords never transmitted in clear text
- **Optional password** - Works with or without OBS password protection

## 📦 Installation

> **⚠️ Note**: This release includes only the **RVR60 sample Bible**. Other Bible versions must be downloaded separately from the repository or built from source.

1. **Download** `obs-bible-stream-verses-v2.2.0.zip` from this release
2. **Extract** the ZIP file
3. **Open OBS Studio**
4. **Add Custom Browser Dock**:
   - Go to `View` → `Docks` → `Custom Browser Docks`
   - Name: `Bible Control Panel`
   - URL: `file:///path/to/obs-bible-stream-verses-v2.2.0/dist/panel.html`
5. **Add Browser Source** (for overlay):
   - Add a new Browser source to your scene
   - URL: `file:///path/to/obs-bible-stream-verses-v2.2.0/dist/browser.html`
   - Width: 1920, Height: 1080

### 📖 Additional Bible Versions

This release includes only **RVR60** as a sample Bible. To use other Bible versions:

**Option 1: Download pre-built versions** (if available)
- Check the [Releases page](https://github.com/boraita/obs-bible-plugin/releases) for separate Bible downloads

**Option 2: Build from source**
1. Clone the repository: `git clone https://github.com/boraita/obs-bible-plugin.git`
2. Install dependencies: `pnpm install`
3. Build: `pnpm build`
4. Copy the generated `bible-*.js` files from `dist/` to your installation

**Available Bible versions:**
- 📖 RVR60 - Reina-Valera 1960 (included)
- 📖 NVI - Nueva Versión Internacional
- 📖 NTV - Nueva Traducción Viviente
- 📖 LBLA - La Biblia de las Américas
- 📖 KDSH - Kadosh Israelita
- 📖 BTX - Biblia Textual
- 📖 TLA - Traducción en Lenguaje Actual

## ⚙️ OBS WebSocket Setup

### Enable WebSocket in OBS

1. Open **OBS Studio**
2. Go to `Tools` → `WebSocket Server Settings`
3. Check **"Enable WebSocket server"**
4. Note the **Server Port** (default: 4455)
5. (Optional) Set a **Server Password** for security
6. Click **OK**

### Configure Plugin

1. Open the **Bible Control Panel** dock in OBS
2. Go to the **OBS** tab
3. Enter your settings:
   - **Host**: `localhost` (or OBS IP address)
   - **Port**: `4455` (or your configured port)
   - **Password**: Your OBS WebSocket password (if set)
4. Click **🧪 Test Connection** to verify
5. Click **💾 Save Configuration**
6. Click **🔌 Connect**

### Setup Automatic Scene Switching

1. Ensure you're connected to OBS WebSocket
2. Click **🔄 Refresh Scenes List**
3. In the **Auto Scene Change** section:
   - ✅ Enable **Auto Scene Change**
   - ☑️ Select scenes to **monitor** (can select multiple)
   - Select **target scene** (scene to switch to when showing verses)
   - (Optional) Select **return scene** (scene to return to when hiding)
4. Click **💾 Save Scene Configuration**
5. Click **🧪 Test Scene Change** to verify

## 🚀 Usage

Once configured:
1. **Show verses**: Click "Mostrar" button
   - If current scene is monitored → Automatically switches to target scene
   - If not monitored → No scene change occurs
2. **Hide verses**: Click "Ocultar" button
   - If return scene configured → Returns to that scene
   - If not configured → Stays on current scene

## 📝 What's Changed

### Added
- Complete OBS WebSocket v5.x integration
- Automatic scene switching system
- OBS control panel tab with full management
- DSK status checking and monitoring
- Real-time scene detection and switching
- Visual notifications for OBS actions
- Connection testing functionality
- Persistent configuration storage
- Comprehensive OBS integration documentation

### Changed
- Enhanced control panel UI with OBS tab
- Improved error handling for OBS operations
- Better user feedback with toast notifications
- Updated project description

### Technical
- Implemented obsWebSocket.js singleton
- Added obsWebSocketConfig.js for configuration
- Promise-based connection handling with timeout
- Automatic reconnection with exponential backoff
- SHA256 authentication implementation

## 📚 Documentation

- [OBS WebSocket Integration Guide](docs/OBS_WEBSOCKET_INTEGRATION.md) - Detailed setup and usage
- [README.md](README.md) - Updated with OBS features
- [CHANGELOG.md](CHANGELOG.md) - Complete version history

## 🐛 Bug Reports

Found a bug? Please [open an issue](https://github.com/boraita/obs-bible-plugin/issues) with:
- OBS Studio version
- Plugin version (2.2.0)
- Steps to reproduce
- Expected vs actual behavior

## 🙏 Acknowledgments

Special thanks to the OBS WebSocket Protocol developers and the OBS Studio community.

---

**Full Changelog**: [v2.1.1...v2.2.0](https://github.com/boraita/obs-bible-plugin/compare/v2.1.1...v2.2.0)

**Download**: `obs-bible-stream-verses-v2.2.0.zip` (21 MB)
