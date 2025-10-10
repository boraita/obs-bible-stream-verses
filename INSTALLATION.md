# OBS Bible Stream Verses - Installation Guide

## Overview
**OBS Bible Stream Verses** is a free tool that allows you to display Bible verses in your OBS streaming setup. It uses Custom Browser Docks and Browser Sources to provide a control panel and an overlay for displaying Bible passages in real-time.

## Features
- 🔍 Search by reference (e.g., "John 3:16") or by text content
- 📚 6 Bible versions included: Kadosh, Americas, NVI, NTV, BTX, RVR60
- ⚡ Lazy loading architecture (only loads selected Bible)
- 🎨 Customizable overlay styling
- 🌐 No external dependencies - works completely offline
- 🆓 100% Free and Open Source (MIT License)

## System Requirements
- OBS Studio 27.0 or later
- Modern web browser support (Chromium 88+)
- Approximately 60 MB of disk space for Bible databases

## Installation Instructions

### Option 1: Download Pre-built Release (Recommended)
1. Go to the [Releases page](https://github.com/boraita/obs-bible-plugin/releases)
2. Download the latest `obs-bible-stream-verses-v2.x.x.zip`
3. Extract the ZIP file to a folder on your computer
4. Continue to "Setting up in OBS" below

### Option 2: Build from Source
If you want to customize or build from source:

```bash
# Clone the repository
git clone https://github.com/boraita/obs-bible-plugin.git
cd obs-bible-plugin

# Install dependencies (requires pnpm)
pnpm install

# Build production version
pnpm build
```

The built files will be in the `dist/` folder.

## Setting up in OBS

### Step 1: Add Control Panel (Custom Browser Dock)
1. In OBS, go to **View** → **Docks** → **Custom Browser Docks**
2. In the dialog that appears:
   - **Dock Name**: `Bible Control Panel` (or any name you prefer)
   - **URL**: 
     - If using file: `file:///PATH/TO/dist/panel.html`
     - If using local server: `http://localhost:8080/panel.html`
   - Example path (Windows): `file:///C:/obs-bible-stream-verses/dist/panel.html`
   - Example path (Mac): `file:///Users/yourusername/obs-bible-stream-verses/dist/panel.html`
   - Example path (Linux): `file:///home/yourusername/obs-bible-stream-verses/dist/panel.html`
3. Click **Apply**

The control panel dock will appear in your OBS interface.

### Step 2: Add Browser Source (Overlay)
1. In your OBS scene, click the **+** button under Sources
2. Select **Browser**
3. Name it "Bible Verses" (or any name you prefer)
4. In the properties:
   - **URL**: 
     - If using file: `file:///PATH/TO/dist/browser.html`
     - If using local server: `http://localhost:8080/browser.html`
   - **Width**: 1920 (or your canvas width)
   - **Height**: 1080 (or your canvas height)
   - ✅ Check "Shutdown source when not visible" (optional, for performance)
   - ✅ Check "Refresh browser when scene becomes active" (optional)
5. Click **OK**

### Step 3: Position and Style the Overlay
1. In your OBS scene, resize and position the Bible Verses source
2. You can customize the appearance by editing `src/styles/browser_style.css` and rebuilding

## Usage

### Searching for Bible Verses
1. In the Control Panel dock, select your preferred Bible version from the dropdown
2. Search for verses by:
   - **Reference**: Type `John 3:16`, `Psalm 23:1`, `Genesis 1:1`, etc.
   - **Text Content**: Type any text from the verse
3. Click on the verse result to display it on the overlay

### Adding More Bibles
See the [README.md](https://github.com/boraita/obs-bible-plugin/blob/main/README.md) for instructions on how to add additional Bible translations.

## Troubleshooting

### Control Panel or Overlay Not Loading
- **Check file paths**: Make sure the path to `panel.html` and `browser.html` is correct
- **Use absolute paths**: Don't use relative paths like `./dist/panel.html`
- **Check file permissions**: Ensure OBS has read access to the files

### Bible Not Loading
- Check the browser console in the Control Panel for errors
- Ensure all files from the `dist/` folder are present
- Try refreshing the dock: Right-click the dock title → **Refresh**

### Overlay Not Showing Verses
- Ensure both the Control Panel and Browser Source are added
- Check that the Browser Source dimensions are correct
- Verify that the source is not hidden or on a different scene

### Local Server Option
If file:// URLs don't work, you can run a local server:

```bash
cd dist
python -m http.server 8080
```

Then use `http://localhost:8080/panel.html` and `http://localhost:8080/browser.html`

## Support & Contributing
- **GitHub**: https://github.com/boraita/obs-bible-plugin
- **Issues**: Report bugs or request features on GitHub Issues
- **Contributions**: Pull requests are welcome!

## License
MIT License - Free to use, modify, and distribute.

## Credits
Developed by Rafael Montaño
Bible databases sourced from https://www.ph4.org

---

**Enjoy streaming with Bible verses! 📖✨**
