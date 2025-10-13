import { searchCharacters, selectBible } from "../api/getData";
import { displayBible } from "./sendMessage";
import { getBibleOptions } from "../config/bibleConfig.js";

const bgContent = new BroadcastChannel("bgContent");
const TAB_ELEMENTS = ['tab-text', 'tab-bibleText', 'tab-listText', 'tab-setBg'];

let bgContentBtn = null;

function attachTabListeners() {
  TAB_ELEMENTS.forEach(tabId => {
    const element = document.getElementById(tabId);
    if (element) {
      element.addEventListener('click', openTab);
      console.log(`✅ Event listener added for: ${tabId}`);
    } else {
      console.warn(`⚠️ Element not found: ${tabId}`);
    }
  });
}

function populateBibleVersionSelect() {
  const bibleSelect = document.getElementById("bible-version");
  if (bibleSelect) {
    const options = getBibleOptions();
    console.log('📚 Populating Bible options:', options);
    bibleSelect.innerHTML = options
      .map(opt => `<option value="${opt.value}">${opt.label}</option>`)
      .join('');
    console.log(`✅ Bible select populated with ${options.length} options`);
  } else {
    console.error('❌ Bible select element not found');
  }
}

function attachBibleVersionListener() {
  const bibleVersion = document.getElementById("bible-version");
  if (bibleVersion) {
    bibleVersion.addEventListener("change", async () => {
      selectBible(document.getElementById("bible-version").value);
    });
  }
}

function initializeEventListeners() {
  bgContentBtn = document.getElementById("bg-container-btn");
  if (bgContentBtn) {
    bgContentBtn.addEventListener("click", handleBgContent);
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
    console.log('🎨 Using panelStyleManager');
    window.panelStyleManager.switchTabs(tabs, selectedIndex);
  } else {
    console.log('⚠️ Using traditional fallback method');
    Array.from(tabs).forEach((tab, index) => {
      tab.style.display = index === selectedIndex ? "block" : "none";
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
  console.log('🖱️ Tab click detected:', event.target.id);
  
  const tabName = event.target.id.replace("tab-", "");
  const tabs = document.getElementsByClassName("tab-area");
  const tabButtons = document.getElementsByClassName("tab-button");
  const selectedTab = document.getElementById(tabName);
  
  console.log(`📋 Switching to tab: ${tabName}`);
  console.log(`📊 Total tabs found: ${tabs.length}`);
  console.log(`🔘 Total buttons found: ${tabButtons.length}`);
  
  if (!selectedTab) {
    console.error(`❌ Tab not found: ${tabName}`);
    return;
  }
  
  const selectedIndex = findTabIndex(tabs, selectedTab);
  console.log(`🎯 Selected tab index: ${selectedIndex}`);
  
  switchTabsWithFallback(tabs, selectedIndex);
  updateTabButtons(tabButtons, selectedIndex);
  
  console.log(`✅ Tab ${tabName} activated successfully`);
}

function createVerseElement(verseData, index) {
  const name = verseData.name;
  const cleanedName = name.replace(/:/g, "-").replace(/\s/g, "").toLowerCase();

  const pElement = document.createElement("p");
  pElement.id = cleanedName;
  pElement.innerHTML = `<span>${name.toUpperCase()}</span><div class="verse-text">${verseData.verse}</div>`;
  
  return pElement;
}

async function loadInitialVerses() {
  const bblVerseDiv = document.getElementById("bible-verse");
  const bibleData = await searchCharacters('Génesis 1');

  for (let i = 0; i < 31; i++) {
    const verseElement = createVerseElement(bibleData[i], i);
    bblVerseDiv.appendChild(verseElement);
    displayBible(verseElement, i);
  }
}

function handleBgContent() {
  const isShowed = bgContentBtn.innerHTML === "Mostrar";
  bgContent.postMessage(isShowed ? "shown" : "hidden");
  bgContentBtn.innerHTML = isShowed ? "Ocultar" : "Mostrar";
}


function initializeBrowserVisibility() {
  bgContent.postMessage("hidden");
  
  if (bgContentBtn) {
    bgContentBtn.innerHTML = "Mostrar";
    console.log('✅ Browser overlay initialized as hidden');
  }
}

loadInitialVerses();

function clearInlineStyles(tabs) {
  Array.from(tabs).forEach(tab => {
    tab.style.display = '';
    console.log(`🧹 Clearing inline style from: ${tab.id}`);
  });
}

function activateDefaultTab(tabs, activeTabIndex) {
  if (window.panelStyleManager) {
    console.log('🎨 Using panelStyleManager to initialize tabs');
    window.panelStyleManager.switchTabs(tabs, activeTabIndex);
  } else {
    console.log('⚠️ panelStyleManager not available, using traditional method');
    Array.from(tabs).forEach((tab, index) => {
      tab.style.display = index === activeTabIndex ? "block" : "none";
      console.log(`${index === activeTabIndex ? '👁️' : '🙈'} Tab ${tab.id}: ${tab.style.display}`);
    });
  }
}

function initializeTabs() {
  console.log('🏗️ Initializing tabs...');
  
  const tabs = document.getElementsByClassName("tab-area");
  const tabButtons = document.getElementsByClassName("tab-button");
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
  
  console.log('✅ Panel fully initialized');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePanel);
} else {
  initializePanel();
}

export { openTab };
