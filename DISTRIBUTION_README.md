# 📖 OBS Bible Stream Verses v2.0.0

Thank you for downloading **OBS Bible Stream Verses**! This tool allows you to display Bible verses in your OBS streaming setup.

## 🚀 Quick Start Guide

### Step 1: Locate Your Files
You should see these files in this folder:
- `panel.html` - Control panel for searching verses
- `browser.html` - Overlay for displaying verses on stream
- `*.js` files - Application code and Bible databases

### Step 2: Get the Full Path
You need the **full absolute path** to these files. Here's how:

**Windows:**
1. Right-click on `panel.html`
2. Select "Properties"
3. Copy the "Location" path
4. Add `\panel.html` to the end
5. Replace `\` with `/`
6. Add `file:///` at the beginning
7. Example: `file:///C:/Users/YourName/Downloads/obs-bible-stream-verses/panel.html`

**macOS:**
1. Right-click on `panel.html`
2. Hold Option key and select "Copy panel.html as Pathname"
3. Add `file://` at the beginning
4. Example: `file:///Users/YourName/Downloads/obs-bible-stream-verses/panel.html`

**Linux:**
1. Right-click on `panel.html`
2. Select "Properties" or "Copy Location"
3. Add `file://` at the beginning
4. Example: `file:///home/YourName/Downloads/obs-bible-stream-verses/panel.html`

### Step 3: Add Control Panel to OBS
1. Open OBS Studio
2. Go to **View** → **Docks** → **Custom Browser Docks**
3. In the dialog:
   - **Dock Name**: `Bible Control Panel`
   - **URL**: Paste the path from Step 2 (to `panel.html`)
4. Click **Apply**

You should see the control panel appear as a dock in OBS!

### Step 4: Add Browser Source to Your Scene
1. In your OBS scene, click the **+** button under Sources
2. Select **Browser**
3. Name it: `Bible Verses`
4. In the properties:
   - **URL**: Change `panel.html` to `browser.html` in the path from Step 2
   - **Width**: 1920 (or match your canvas width)
   - **Height**: 1080 (or match your canvas height)
5. Click **OK**

### Step 5: Start Using It!
1. In the Control Panel dock, select a Bible version
2. Type a verse reference (e.g., `John 3:16`) or search for text
3. Click on a verse from the results
4. The verse will appear on your stream overlay!

## 📚 Bible Versions Included
- **Kadosh** (KDSH) - Kadosh Israelita
- **Americas** (LBLA) - La Biblia de las Américas
- **NVI** (NVI) - Nueva Versión Internacional
- **NTV** (NTV) - Nueva Traducción Viviente
- **BTX** (BTX) - Biblia Textual
- **RVR60** (RVR60) - Reina-Valera 1960

## 🎨 Customizing the Overlay
The default overlay has a simple transparent background with white text. To customize:
1. You'll need to edit the source code and rebuild
2. See the full documentation in the GitHub repository
3. Link: https://github.com/boraita/obs-bible-plugin

## 🔧 Troubleshooting

### Control Panel Not Loading
- ✅ Check that the file path is correct and starts with `file://`
- ✅ Use absolute paths, not relative paths
- ✅ Make sure all files are in the same folder
- ✅ Try refreshing the dock: Right-click dock title → Refresh

### Overlay Not Showing Verses
- ✅ Ensure both Control Panel AND Browser Source are added
- ✅ Check that the Browser Source is visible in your scene
- ✅ Verify the Browser Source uses `browser.html`, not `panel.html`
- ✅ Try clicking "Refresh browser when scene becomes active" in source properties

### Bible Not Loading
- ✅ Check that all `.js` files are present in the folder
- ✅ Don't move or rename any files
- ✅ Try restarting OBS

### Alternative: Local Server
If `file://` paths don't work, you can run a local web server:

**Python (Windows/Mac/Linux):**
```bash
cd /path/to/this/folder
python -m http.server 8080
```

Then use:
- Control Panel: `http://localhost:8080/panel.html`
- Browser Source: `http://localhost:8080/browser.html`

## 📖 Full Documentation
For detailed instructions, adding new Bibles, and more:
- **Installation Guide**: `INSTALLATION.md` (included in download)
- **GitHub Repository**: https://github.com/boraita/obs-bible-plugin
- **Report Issues**: https://github.com/boraita/obs-bible-plugin/issues

## 📄 License
This software is free and open source under the MIT License.
- ✅ Free for personal and commercial use
- ✅ Modify and distribute freely
- ✅ No warranty provided

## 👨‍💻 Credits
- **Developer**: Rafael Montaño
- **Bible Databases**: https://www.ph4.org
- **License**: MIT

## 💬 Support
- **Issues/Bugs**: Report on GitHub Issues
- **Questions**: Open a GitHub Discussion
- **OBS Forum**: [Link to forum thread]

---

**Enjoy streaming with Bible verses! 🎉📖✨**

Version: 2.0.0
Release Date: 2024
