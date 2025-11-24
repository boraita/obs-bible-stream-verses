import { searchCharacters, selectBible } from '../api/getData';
import { displayBible } from './sendMessage';
import { getBibleOptions } from '../config/bibleConfig.js';
import obsWebSocket from './obsWebSocket.js';

const bgContent = new BroadcastChannel('bgContent');
const TAB_ELEMENTS = ['tab-text', 'tab-bibleText', 'tab-listText', 'tab-obsWebSocket', 'tab-setBg'];

let bgContentBtn = null;

function attachTabListeners() {
  TAB_ELEMENTS.forEach((tabId) => {
    const element = document.getElementById(tabId);
    if (element) {
      element.addEventListener('click', openTab);
    }
  });
}

function populateBibleVersionSelect() {
  const bibleSelect = document.getElementById('bible-version');
  if (bibleSelect) {
    const options = getBibleOptions();
    bibleSelect.innerHTML = options
      .map((opt) => `<option value="${opt.value}">${opt.label}</option>`)
      .join('');
  }
}

function attachBibleVersionListener() {
  const bibleVersion = document.getElementById('bible-version');
  if (bibleVersion) {
    bibleVersion.addEventListener('change', async () => {
      selectBible(document.getElementById('bible-version').value);
    });
  }
}

function initializeEventListeners() {
  bgContentBtn = document.getElementById('bg-container-btn');
  if (bgContentBtn) {
    bgContentBtn.addEventListener('click', handleBgContent);
  }

  populateBibleVersionSelect();
  attachTabListeners();
  attachBibleVersionListener();
}

function findTabIndex(tabs, selectedTab) {
  for (let i = 0; i < tabs.length; i++) {
    if (tabs[i] === selectedTab) {
      return i;
    }
  }
  return -1;
}

function switchTabsWithFallback(tabs, selectedIndex) {
  if (window.panelStyleManager) {
    window.panelStyleManager.switchTabs(tabs, selectedIndex);
  } else {
    Array.from(tabs).forEach((tab, index) => {
      tab.style.display = index === selectedIndex ? 'block' : 'none';
    });
  }
}

function updateTabButtons(tabButtons, selectedIndex) {
  Array.from(tabButtons).forEach((button, index) => {
    if (index === selectedIndex) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
}

function openTab(event) {
  const tabName = event.target.id.replace('tab-', '');
  const tabs = document.getElementsByClassName('tab-area');
  const tabButtons = document.getElementsByClassName('tab-button');
  const selectedTab = document.getElementById(tabName);

  if (!selectedTab) return;

  const selectedIndex = findTabIndex(tabs, selectedTab);
  switchTabsWithFallback(tabs, selectedIndex);
  updateTabButtons(tabButtons, selectedIndex);
}

function createVerseElement(verseData, index) {
  const name = verseData.name;
  const cleanedName = name.replace(/:/g, '-').replace(/\s/g, '').toLowerCase();

  const pElement = document.createElement('p');
  pElement.id = cleanedName;
  pElement.innerHTML = `<span>${name.toUpperCase()}</span><div class="verse-text">${verseData.verse}</div>`;

  return pElement;
}

async function loadInitialVerses() {
  const bblVerseDiv = document.getElementById('bible-verse');
  const bibleData = await searchCharacters('Génesis 1');

  for (let i = 0; i < 31; i++) {
    const verseElement = createVerseElement(bibleData[i], i);
    bblVerseDiv.appendChild(verseElement);
    displayBible(verseElement, i);
  }
}

async function handleBgContent() {
  const isShowed = bgContentBtn.innerHTML === 'Mostrar';

  if (isShowed) {
    if (obsWebSocket.connected) {
      try {
        const shouldChange = await shouldAutoChangeScene();

        if (shouldChange) {
          await changeToTargetScene();
        }

        const dskStatus = await obsWebSocket.checkDownstreamKeyerStatus();

        if (dskStatus) {
          showDSKStatus(dskStatus);

          if (dskStatus.hasDSK && !dskStatus.dskActive) {
            console.warn('⚠️ Downstream keyer found but not active');
          }
        }
      } catch (error) {
        console.error('❌ Error checking OBS status:', error);
      }
    }

    bgContent.postMessage('shown');
    bgContentBtn.innerHTML = 'Ocultar';
  } else {
    if (obsWebSocket.connected) {
      const autoSceneEnabled = localStorage.getItem('obsAutoSceneEnabled') === 'true';
      if (autoSceneEnabled) {
        await changeToReturnScene();
      }
    }

    bgContent.postMessage('hidden');
    bgContentBtn.innerHTML = 'Mostrar';
  }
}

function showDSKStatus(status) {
  const statusContainer = document.getElementById('obs-status') || createStatusContainer();

  const statusHTML = `
    <div class="obs-dsk-status">
      <strong>🎬 OBS Scene:</strong> ${status.sceneName}<br>
      <strong>🔑 Downstream Keyer:</strong> ${status.hasDSK ? '✅ Found' : '❌ Not found'}<br>
      ${status.hasDSK ? `<strong>Status:</strong> ${status.dskActive ? '🟢 Active' : '🔴 Inactive'}` : ''}
      ${status.dskSources.length > 0 ? `<br><strong>Sources:</strong> ${status.dskSources.map((s) => s.name).join(', ')}` : ''}
    </div>
  `;

  statusContainer.innerHTML = statusHTML;
  statusContainer.style.display = 'block';

  setTimeout(() => {
    statusContainer.style.display = 'none';
  }, 5000);
}

function createStatusContainer() {
  const container = document.createElement('div');
  container.id = 'obs-status';
  container.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 15px;
    border-radius: 8px;
    border: 2px solid #4CAF50;
    z-index: 10000;
    font-family: monospace;
    font-size: 12px;
    max-width: 300px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    display: none;
  `;
  document.body.appendChild(container);
  return container;
}

function initializeBrowserVisibility() {
  bgContent.postMessage('hidden');

  if (bgContentBtn) {
    bgContentBtn.innerHTML = 'Mostrar';
  }
}

loadInitialVerses();

function clearInlineStyles(tabs) {
  Array.from(tabs).forEach((tab) => {
    tab.style.display = '';
  });
}

function activateDefaultTab(tabs, activeTabIndex) {
  if (window.panelStyleManager) {
    window.panelStyleManager.switchTabs(tabs, activeTabIndex);
  } else {
    Array.from(tabs).forEach((tab, index) => {
      tab.style.display = index === activeTabIndex ? 'block' : 'none';
    });
  }
}

function initializeTabs() {
  console.log('🏗️ Initializing tabs...');

  const tabs = document.getElementsByClassName('tab-area');
  const tabButtons = document.getElementsByClassName('tab-button');
  const activeTabIndex = 1;

  console.log(`📊 Tabs found: ${tabs.length}`);
  console.log(`🔘 Buttons found: ${tabButtons.length}`);

  Array.from(tabs).forEach((tab, i) => {
    console.log(`📄 Tab ${i}: ${tab.id}`);
  });

  Array.from(tabButtons).forEach((button, i) => {
    console.log(`� Button ${i}: ${button.id}`);
  });

  if (tabs.length <= activeTabIndex) {
    console.error('❌ Not enough tabs available');
    return;
  }

  console.log(`🎯 Activating default tab: ${tabs[activeTabIndex].id}`);

  clearInlineStyles(tabs);
  activateDefaultTab(tabs, activeTabIndex);
  updateTabButtons(tabButtons, activeTabIndex);

  console.log(`✅ Tabs initialized - Active tab: ${activeTabIndex} (${tabs[activeTabIndex]?.id})`);
}

/**
 * Initialize OBS WebSocket connection
 */
function initializeOBSWebSocket() {
  console.log('🔌 Initializing OBS WebSocket...');

  // Set up event listeners
  obsWebSocket.onConnected(() => {
    console.log('✅ Connected to OBS WebSocket');
    updateOBSConnectionStatus(true);
  });

  obsWebSocket.onDisconnected(() => {
    console.log('⚠️ Disconnected from OBS WebSocket');
    updateOBSConnectionStatus(false);
  });

  obsWebSocket.onSceneChanged((sceneName) => {
    console.log(`🎬 Scene changed to: ${sceneName}`);
  });

  // Attempt to connect
  obsWebSocket.connect().catch((error) => {
    console.error('❌ Failed to initialize OBS WebSocket:', error);
  });
}

/**
 * Update OBS connection status indicator
 */
function updateOBSConnectionStatus(connected) {
  let indicator = document.getElementById('obs-connection-indicator');

  if (!indicator) {
    indicator = document.createElement('div');
    indicator.id = 'obs-connection-indicator';
    indicator.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      z-index: 9999;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    `;
    indicator.title = 'OBS WebSocket Status';
    document.body.appendChild(indicator);
  }

  indicator.style.backgroundColor = connected ? '#4CAF50' : '#f44336';
  indicator.title = connected ? 'OBS WebSocket: Connected' : 'OBS WebSocket: Disconnected';
}

function initializePanel() {
  console.log('🚀 Starting panel initialization...');

  initializeEventListeners();

  if (window.panelStyleManager) {
    window.panelStyleManager.init();
    console.log('✅ Panel style manager initialized');
  } else {
    console.warn('⚠️ Panel style manager not available');
  }

  initializeTabs();

  initializeBrowserVisibility();

  // Initialize OBS WebSocket connection
  initializeOBSWebSocket();

  // Initialize OBS WebSocket Panel UI
  initializeOBSWebSocketPanel();

  console.log('✅ Panel fully initialized');
}

/**
 * Initialize OBS WebSocket Panel UI
 */
function initializeOBSWebSocketPanel() {
  console.log('🎛️ Initializing OBS WebSocket Panel UI...');

  // Load saved configuration
  loadOBSConfig();

  // Connect button
  const connectBtn = document.getElementById('obs-connect-btn');
  if (connectBtn) {
    connectBtn.addEventListener('click', handleOBSConnect);
  }

  // Disconnect button
  const disconnectBtn = document.getElementById('obs-disconnect-btn');
  if (disconnectBtn) {
    disconnectBtn.addEventListener('click', handleOBSDisconnect);
  }

  // Save config button
  const saveConfigBtn = document.getElementById('obs-save-config-btn');
  if (saveConfigBtn) {
    saveConfigBtn.addEventListener('click', handleSaveOBSConfig);
  }

  // Test connection button
  const testConnectionBtn = document.getElementById('obs-test-connection-btn');
  if (testConnectionBtn) {
    testConnectionBtn.addEventListener('click', handleTestConnection);
  }

  // Refresh scene button
  const refreshSceneBtn = document.getElementById('obs-refresh-scene-btn');
  if (refreshSceneBtn) {
    refreshSceneBtn.addEventListener('click', handleRefreshScene);
  }

  // Refresh scenes list button
  const refreshScenesBtn = document.getElementById('obs-refresh-scenes-btn');
  if (refreshScenesBtn) {
    refreshScenesBtn.addEventListener('click', handleRefreshScenesList);
  }

  // Check DSK button
  const checkDSKBtn = document.getElementById('obs-check-dsk-btn');
  if (checkDSKBtn) {
    checkDSKBtn.addEventListener('click', handleCheckDSK);
  }

  // Auto scene change checkbox
  const autoSceneEnabled = document.getElementById('obs-auto-scene-enabled');
  if (autoSceneEnabled) {
    autoSceneEnabled.addEventListener('change', handleAutoSceneToggle);
    // Load saved state
    autoSceneEnabled.checked = localStorage.getItem('obsAutoSceneEnabled') === 'true';
    handleAutoSceneToggle();
  }

  // Save scene config button
  const saveSceneConfigBtn = document.getElementById('obs-save-scene-config-btn');
  if (saveSceneConfigBtn) {
    saveSceneConfigBtn.addEventListener('click', handleSaveSceneConfig);
  }

  // Test scene change button
  const testSceneChangeBtn = document.getElementById('obs-test-scene-change-btn');
  if (testSceneChangeBtn) {
    testSceneChangeBtn.addEventListener('click', handleTestSceneChange);
  }

  // Register callbacks for WebSocket events
  obsWebSocket.onConnected(() => {
    console.log('🎉 Panel detected OBS connection');
    updatePanelConnectionStatus(true);
  });

  obsWebSocket.onDisconnected(() => {
    console.log('⚠️ Panel detected OBS disconnection');
    updatePanelConnectionStatus(false);

    // Update button states
    const connectBtn = document.getElementById('obs-connect-btn');
    const disconnectBtn = document.getElementById('obs-disconnect-btn');
    if (connectBtn) {
      connectBtn.disabled = false;
      connectBtn.textContent = '🔌 Connect';
    }
    if (disconnectBtn) {
      disconnectBtn.disabled = true;
    }
  });

  console.log('✅ OBS WebSocket Panel UI initialized');
}

/**
 * Load OBS configuration from localStorage
 */
function loadOBSConfig() {
  const host = localStorage.getItem('obsWebSocketHost') || 'localhost';
  const port = localStorage.getItem('obsWebSocketPort') || '4455';
  const password = localStorage.getItem('obsWebSocketPassword') || '';

  const hostInput = document.getElementById('obs-host');
  const portInput = document.getElementById('obs-port');
  const passwordInput = document.getElementById('obs-password');

  if (hostInput) hostInput.value = host;
  if (portInput) portInput.value = port;
  if (passwordInput) passwordInput.value = password;
}

/**
 * Save OBS configuration to localStorage
 */
function handleSaveOBSConfig() {
  const host = document.getElementById('obs-host').value.trim();
  const port = document.getElementById('obs-port').value.trim();
  const password = document.getElementById('obs-password').value;

  if (!host) {
    showNotification('❌ Host cannot be empty', 'error');
    return;
  }

  if (!port || isNaN(port)) {
    showNotification('❌ Port must be a valid number', 'error');
    return;
  }

  localStorage.setItem('obsWebSocketHost', host);
  localStorage.setItem('obsWebSocketPort', port);
  localStorage.setItem('obsWebSocketPassword', password);

  // Update obsWebSocket config
  obsWebSocket.config.host = host;
  obsWebSocket.config.port = parseInt(port, 10);
  obsWebSocket.config.password = password;

  console.log('💾 Configuration saved:', {
    host,
    port: parseInt(port, 10),
    hasPassword: !!password,
  });

  showNotification('💾 Configuration saved!', 'success');
}

/**
 * Test OBS connection without saving
 */
async function handleTestConnection() {
  const host = document.getElementById('obs-host').value.trim();
  const port = document.getElementById('obs-port').value.trim();
  const password = document.getElementById('obs-password').value;
  const testBtn = document.getElementById('obs-test-connection-btn');

  if (!host || !port) {
    showNotification('❌ Please fill in host and port', 'error');
    return;
  }

  try {
    testBtn.disabled = true;
    testBtn.textContent = '🧪 Testing...';

    console.log('🧪 Testing connection to OBS WebSocket...');
    console.log('Test configuration:', { host, port: parseInt(port, 10), hasPassword: !!password });

    // Create a test WebSocket connection
    const wsUrl = `ws://${host}:${port}`;
    console.log('Attempting to connect to:', wsUrl);

    const testWs = new WebSocket(wsUrl);

    const testResult = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        testWs.close();
        reject(new Error('Connection timeout. Make sure OBS is running and WebSocket is enabled.'));
      }, 5000);

      testWs.onopen = () => {
        clearTimeout(timeout);
        console.log('✅ Test WebSocket opened successfully');
      };

      testWs.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('📩 Test received message:', message);

          if (message.op === 0) {
            // Hello message
            clearTimeout(timeout);
            testWs.close();

            if (message.d.authentication && !password) {
              resolve({
                success: true,
                needsPassword: true,
                message: 'Connection successful but OBS requires a password!',
              });
            } else {
              resolve({
                success: true,
                needsPassword: false,
                message: 'Connection successful!',
              });
            }
          }
        } catch (error) {
          console.error('Error parsing test message:', error);
        }
      };

      testWs.onerror = (error) => {
        clearTimeout(timeout);
        console.error('❌ Test WebSocket error:', error);
        reject(new Error('Cannot connect to OBS. Check host and port.'));
      };

      testWs.onclose = () => {
        clearTimeout(timeout);
      };
    });

    if (testResult.needsPassword) {
      showNotification('⚠️ ' + testResult.message, 'info');
    } else {
      showNotification('✅ ' + testResult.message, 'success');
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
    showNotification('❌ Test failed: ' + error.message, 'error');
  } finally {
    testBtn.disabled = false;
    testBtn.textContent = '🧪 Test Connection';
  }
}

/**
 * Handle OBS connect button click
 */
async function handleOBSConnect() {
  const connectBtn = document.getElementById('obs-connect-btn');
  const disconnectBtn = document.getElementById('obs-disconnect-btn');

  try {
    connectBtn.disabled = true;
    connectBtn.textContent = '🔄 Connecting...';

    // Update config from inputs
    handleSaveOBSConfig();

    console.log('🔌 Attempting to connect to OBS WebSocket...');
    console.log('Configuration:', {
      host: obsWebSocket.config.host,
      port: obsWebSocket.config.port,
      hasPassword: !!obsWebSocket.config.password,
    });

    // Wait for connection to complete
    await obsWebSocket.connect();

    console.log('✅ Successfully connected to OBS WebSocket');

    connectBtn.disabled = true;
    connectBtn.textContent = '🔌 Connect';
    disconnectBtn.disabled = false;

    updatePanelConnectionStatus(true);

    // Small delay to ensure connection is fully established
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Refresh scene and scenes list
    try {
      await handleRefreshScene();
      await handleRefreshScenesList();
    } catch (error) {
      console.error('⚠️ Failed to fetch initial data:', error);
    }

    showNotification('✅ Connected to OBS!', 'success');
  } catch (error) {
    console.error('❌ Failed to connect:', error);
    connectBtn.disabled = false;
    connectBtn.textContent = '🔌 Connect';
    updatePanelConnectionStatus(false);

    let errorMessage = error.message;
    if (errorMessage.includes('timeout')) {
      errorMessage = 'Connection timeout. Make sure OBS is running with WebSocket enabled.';
    } else if (errorMessage.includes('error')) {
      errorMessage = 'Cannot connect. Check host and port settings.';
    }

    showNotification('❌ Failed to connect: ' + errorMessage, 'error');
  }
}

/**
 * Handle OBS disconnect button click
 */
function handleOBSDisconnect() {
  const connectBtn = document.getElementById('obs-connect-btn');
  const disconnectBtn = document.getElementById('obs-disconnect-btn');

  console.log('🔌 Disconnecting from OBS...');

  obsWebSocket.disconnect();

  connectBtn.disabled = false;
  connectBtn.textContent = '🔌 Connect';
  disconnectBtn.disabled = true;

  updatePanelConnectionStatus(false);
  clearPanelData();

  showNotification('🔌 Disconnected from OBS', 'info');
}

/**
 * Handle refresh scene button click
 */
async function handleRefreshScene() {
  try {
    const sceneName = await obsWebSocket.getCurrentScene();
    const sceneElement = document.getElementById('obs-current-scene');
    if (sceneElement) {
      sceneElement.textContent = sceneName || '-';
    }
  } catch (error) {
    console.error('❌ Failed to get current scene:', error);
    showNotification('❌ Failed to get scene: ' + error.message, 'error');
  }
}

/**
 * Handle refresh scenes list button click
 */
async function handleRefreshScenesList() {
  const scenesList = document.getElementById('obs-scenes-list');
  if (!scenesList) return;

  try {
    scenesList.innerHTML = '<li class="empty-state">Loading scenes...</li>';

    const response = await obsWebSocket.sendRequest('GetSceneList');
    const scenes = response.scenes || [];
    const currentScene = response.currentProgramSceneName;

    if (scenes.length === 0) {
      scenesList.innerHTML = '<li class="empty-state">No scenes found</li>';
      return;
    }

    scenesList.innerHTML = scenes
      .map((scene) => {
        const isActive = scene.sceneName === currentScene;
        return `
        <li class="${isActive ? 'active-scene' : ''}">
          <span class="scene-name">${scene.sceneName}</span>
          ${isActive ? '<span class="scene-badge">Active</span>' : ''}
        </li>
      `;
      })
      .join('');

    // Also update scene selectors and monitor list
    updateSceneSelectors(scenes);
    updateMonitorScenesList(scenes);
  } catch (error) {
    console.error('❌ Failed to get scenes list:', error);
    scenesList.innerHTML = '<li class="empty-state">Failed to load scenes</li>';
    showNotification('❌ Failed to get scenes: ' + error.message, 'error');
  }
}

/**
 * Update scene selector dropdowns
 */
function updateSceneSelectors(scenes) {
  const targetSceneSelect = document.getElementById('obs-target-scene');
  const returnSceneSelect = document.getElementById('obs-return-scene');

  if (!targetSceneSelect || !returnSceneSelect) return;

  // Save current selections
  const currentTarget = localStorage.getItem('obsTargetScene') || '';
  const currentReturn = localStorage.getItem('obsReturnScene') || '';

  // Update target scene selector
  targetSceneSelect.innerHTML =
    '<option value="">-- Select Scene --</option>' +
    scenes
      .map(
        (scene) =>
          `<option value="${scene.sceneName}" ${scene.sceneName === currentTarget ? 'selected' : ''}>
        ${scene.sceneName}
      </option>`
      )
      .join('');

  // Update return scene selector
  returnSceneSelect.innerHTML =
    '<option value="">-- Keep Current Scene --</option>' +
    scenes
      .map(
        (scene) =>
          `<option value="${scene.sceneName}" ${scene.sceneName === currentReturn ? 'selected' : ''}>
        ${scene.sceneName}
      </option>`
      )
      .join('');
}

/**
 * Update monitor scenes list with checkboxes
 */
function updateMonitorScenesList(scenes) {
  const monitorList = document.getElementById('obs-monitor-scenes-list');
  if (!monitorList) return;

  // Load saved monitor scenes
  const savedMonitorScenes = JSON.parse(localStorage.getItem('obsMonitorScenes') || '[]');

  monitorList.innerHTML = scenes
    .map((scene) => {
      const isChecked = savedMonitorScenes.includes(scene.sceneName);
      return `
      <div class="monitor-scene-item">
        <input 
          type="checkbox" 
          id="monitor-${scene.sceneName.replace(/\s+/g, '-')}" 
          value="${scene.sceneName}"
          ${isChecked ? 'checked' : ''}
        />
        <label for="monitor-${scene.sceneName.replace(/\s+/g, '-')}">
          ${scene.sceneName}
        </label>
      </div>
    `;
    })
    .join('');
}

/**
 * Handle check DSK button click
 */
async function handleCheckDSK() {
  try {
    const dskStatus = await obsWebSocket.checkDownstreamKeyerStatus();

    // Update DSK count
    const dskCount = document.getElementById('obs-dsk-count');
    if (dskCount) {
      dskCount.textContent = dskStatus.dskSources.length.toString();
    }

    // Update DSK status
    const dskStatusEl = document.getElementById('obs-dsk-status');
    if (dskStatusEl) {
      dskStatusEl.textContent = dskStatus.hasDSK
        ? dskStatus.dskActive
          ? '🟢 Active'
          : '🔴 Inactive'
        : '❌ Not found';
    }

    // Update DSK sources list
    const dskSourcesList = document.getElementById('obs-dsk-sources-list');
    if (dskSourcesList && dskStatus.dskSources.length > 0) {
      dskSourcesList.innerHTML = dskStatus.dskSources
        .map(
          (source) => `
        <div class="dsk-source-item">
          <span class="dsk-source-name">${source.name}</span>
          <span class="dsk-source-status ${source.enabled ? 'enabled' : 'disabled'}">
            ${source.enabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      `
        )
        .join('');
    } else if (dskSourcesList) {
      dskSourcesList.innerHTML =
        '<p style="color: #888; text-align: center; padding: 12px;">No DSK sources found</p>';
    }

    showNotification(`🔑 DSK Status: ${dskStatus.hasDSK ? 'Found' : 'Not found'}`, 'info');
  } catch (error) {
    console.error('❌ Failed to check DSK:', error);
    showNotification('❌ Failed to check DSK: ' + error.message, 'error');
  }
}

/**
 * Update panel connection status indicator
 */
function updatePanelConnectionStatus(connected) {
  const statusIndicator = document.getElementById('obs-status-indicator');
  const statusText = document.getElementById('obs-status-text');

  if (statusIndicator) {
    statusIndicator.className = connected
      ? 'status-dot status-connected'
      : 'status-dot status-disconnected';
  }

  if (statusText) {
    statusText.textContent = connected ? 'Connected' : 'Disconnected';
  }
}

/**
 * Clear panel data when disconnected
 */
function clearPanelData() {
  const currentScene = document.getElementById('obs-current-scene');
  const scenesList = document.getElementById('obs-scenes-list');
  const dskCount = document.getElementById('obs-dsk-count');
  const dskStatus = document.getElementById('obs-dsk-status');
  const dskSourcesList = document.getElementById('obs-dsk-sources-list');

  if (currentScene) currentScene.textContent = '-';
  if (scenesList)
    scenesList.innerHTML = '<li class="empty-state">Connect to OBS to see scenes</li>';
  if (dskCount) dskCount.textContent = '-';
  if (dskStatus) dskStatus.textContent = '-';
  if (dskSourcesList) dskSourcesList.innerHTML = '';
}

/**
 * Handle auto scene toggle
 */
function handleAutoSceneToggle() {
  const checkbox = document.getElementById('obs-auto-scene-enabled');
  const configContent = document.getElementById('obs-scene-config-content');

  if (!checkbox || !configContent) return;

  const isEnabled = checkbox.checked;
  configContent.style.display = isEnabled ? 'block' : 'none';

  localStorage.setItem('obsAutoSceneEnabled', isEnabled.toString());
}

/**
 * Save scene configuration
 */
function handleSaveSceneConfig() {
  const targetScene = document.getElementById('obs-target-scene').value;
  const returnScene = document.getElementById('obs-return-scene').value;

  // Get selected monitor scenes
  const monitorCheckboxes = document.querySelectorAll(
    '#obs-monitor-scenes-list input[type="checkbox"]:checked'
  );
  const monitorScenes = Array.from(monitorCheckboxes).map((cb) => cb.value);

  // Validate
  if (monitorScenes.length === 0) {
    showNotification('⚠️ Please select at least one scene to monitor', 'error');
    return;
  }

  if (!targetScene) {
    showNotification('⚠️ Please select a target scene', 'error');
    return;
  }

  // Save configuration
  localStorage.setItem('obsMonitorScenes', JSON.stringify(monitorScenes));
  localStorage.setItem('obsTargetScene', targetScene);
  localStorage.setItem('obsReturnScene', returnScene);

  console.log('💾 Scene configuration saved:', {
    monitorScenes,
    targetScene,
    returnScene,
  });

  showNotification('💾 Scene configuration saved!', 'success');
}

/**
 * Test scene change
 */
async function handleTestSceneChange() {
  const targetScene = document.getElementById('obs-target-scene').value;

  if (!targetScene) {
    showNotification('⚠️ Please select a target scene first', 'error');
    return;
  }

  try {
    console.log('🧪 Testing scene change to:', targetScene);
    await obsWebSocket.setCurrentScene(targetScene);

    showNotification(`✅ Changed to scene: ${targetScene}`, 'success');

    // Update the current scene display
    await handleRefreshScene();
  } catch (error) {
    console.error('❌ Failed to change scene:', error);
    showNotification('❌ Failed to change scene: ' + error.message, 'error');
  }
}

/**
 * Check if current scene should trigger auto change
 */
async function shouldAutoChangeScene() {
  const autoSceneEnabled = localStorage.getItem('obsAutoSceneEnabled') === 'true';
  if (!autoSceneEnabled) return false;

  const monitorScenes = JSON.parse(localStorage.getItem('obsMonitorScenes') || '[]');
  if (monitorScenes.length === 0) return false;

  try {
    const currentScene = await obsWebSocket.getCurrentScene();
    return monitorScenes.includes(currentScene);
  } catch (error) {
    console.error('❌ Failed to check current scene:', error);
    return false;
  }
}

/**
 * Change to target scene when showing content
 */
async function changeToTargetScene() {
  const targetScene = localStorage.getItem('obsTargetScene');
  if (!targetScene) return;

  try {
    console.log('🎬 Auto-changing to target scene:', targetScene);
    await obsWebSocket.setCurrentScene(targetScene);
    showNotification(`🎬 Changed to scene: ${targetScene}`, 'info');
  } catch (error) {
    console.error('❌ Failed to auto-change scene:', error);
    showNotification('❌ Failed to change scene: ' + error.message, 'error');
  }
}

/**
 * Change to return scene when hiding content
 */
async function changeToReturnScene() {
  const returnScene = localStorage.getItem('obsReturnScene');
  if (!returnScene) {
    console.log('ℹ️ No return scene configured, keeping current scene');
    return;
  }

  try {
    console.log('↩️ Auto-changing back to return scene:', returnScene);
    await obsWebSocket.setCurrentScene(returnScene);
    showNotification(`↩️ Returned to scene: ${returnScene}`, 'info');
  } catch (error) {
    console.error('❌ Failed to auto-change return scene:', error);
    showNotification('❌ Failed to return to scene: ' + error.message, 'error');
  }
}

/**
 * Show notification to user
 */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = 'obs-notification';
  notification.textContent = message;

  const colors = {
    success: '#4CAF50',
    error: '#f44336',
    info: '#2196F3',
  };

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 24px;
    background: ${colors[type] || colors.info};
    color: white;
    border-radius: 4px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    z-index: 10000;
    font-size: 14px;
    font-weight: 500;
    animation: slideIn 0.3s ease-out;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePanel);
} else {
  initializePanel();
}

export { openTab };
