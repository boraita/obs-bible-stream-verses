import { searchCharacters, selectBible } from "../api/getData";
import { displayBible } from "./sendMessage";

const bgContent = new BroadcastChannel("bgContent");
const bgContentBtn = document.getElementById("bg-container-btn");
bgContentBtn.addEventListener("click", handleBgContent);
document.getElementById('tab-text').addEventListener('click', openTab)
document.getElementById('tab-bibleText').addEventListener('click', openTab)
document.getElementById('tab-listText').addEventListener('click', openTab)
document.getElementById('tab-setBg').addEventListener('click', openTab)
document.getElementById("bible-version").addEventListener("change", async () => {
  selectBible(document.getElementById("bible-version").value);
});

function openTab(event) {
  const tabName = event.target.id.replace("tab-", "");
  const tabs = document.getElementsByClassName("tab-area");
  const selectedTab = document.getElementById(tabName);
  
  // Usar el gestor de estilos si está disponible
  if (window.panelStyleManager) {
    // Encontrar el índice del tab seleccionado
    let selectedIndex = -1;
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i] === selectedTab) {
        selectedIndex = i;
        break;
      }
    }
    
    window.panelStyleManager.switchTabs(tabs, selectedIndex);
  } else {
    // Fallback al método tradicional
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].style.display = "none";
    }
    if (selectedTab) {
      selectedTab.style.display = "block";
    }
  }
}

const bblVerseDiv = document.getElementById("bible-verse");
const bibleData = await searchCharacters('Génesis 1');

// Obtener la versión inicial para mostrar en los versículos predeterminados
const bibleVersionSelect = document.getElementById('bible-version');
const initialVersionDisplay = getVersionDisplayName(bibleVersionSelect ? bibleVersionSelect.value : 'kdsh');

for (let i = 0; i < 31; i++) {
  const name = bibleData[i].name;
  const cleanedName = name.replace(/:/g, "-").replace(/\s/g, "").toLowerCase();

  const pElement = document.createElement("p");
  pElement.id = cleanedName;
  pElement.innerHTML = `<span>${name.toUpperCase()}</span> ${
    bibleData[i].verse
  }`;
  bblVerseDiv.appendChild(pElement);
  displayBible(pElement, i);
}

// Función helper para obtener nombres descriptivos de las versiones
function getVersionDisplayName(versionCode) {
  const versionNames = {
    'kdsh': 'KADOSH',
    'lbla': 'LBLA', 
    'nvi': 'NVI',
    'nvic': 'NVIC',
    'btx': 'BTX',
    'btx4': 'BTX4'
  };
  return versionNames[versionCode] || versionCode.toUpperCase();
}

function handleBgContent() {
  const isShowed = bgContentBtn.innerHTML === "Mostrar";
  bgContent.postMessage(isShowed ? "shown" : "hidden");
  bgContentBtn.innerHTML =
    bgContentBtn.innerHTML === "Mostrar" ? "Ocultar" : "Mostrar";
}

// Inicializar el gestor de estilos del panel cuando el DOM esté listo
function initializePanelStyleManager() {
  if (window.panelStyleManager) {
    window.panelStyleManager.init();
    console.log('✅ Gestor de estilos del panel inicializado');
  } else {
    console.warn('⚠️ Gestor de estilos del panel no disponible');
  }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePanelStyleManager);
} else {
  initializePanelStyleManager();
}

export { openTab };
