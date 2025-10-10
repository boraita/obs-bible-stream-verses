const channel = new BroadcastChannel("myChannel");

const btnHistory = document.getElementById("history");

var historyOfBibleVerse = [];

document.getElementById("sendButton").addEventListener("click", () => {
  const message = document.getElementById("messageInput").value;
  channel.postMessage(message);
  
  // Ajustar tamaño INMEDIATAMENTE después de enviar texto libre
  setTimeout(() => {
    const adjustChannel = new BroadcastChannel("adjustFont");
    adjustChannel.postMessage("adjust");
    adjustChannel.close();
  }, 50); // Reducido a 50ms para aplicación más rápida
});

function doc_keyUp(e) {
  // this would test for whichever key is 40 (down arrow) and the ctrl key at the same time
  if (e.ctrlKey && e.code === "ArrowDown") {
    // call your function to do the thing
    const message = document.getElementById("messageInput").value;
    channel.postMessage(message);
  }
}

document.getElementById("sendList").addEventListener("click", () => {
  const listTitle = document.getElementById("listTitle").value;
  const listItems = document.getElementById("listItems").value;

  const listArray = listItems.split("\n");

  // Create a new unordered list (<ul>)
  const ulElement = document.createElement("ul");

  listArray.forEach((itemText) => {
    // Create a list item (<li>)
    const liElement = document.createElement("li");

    // Set the text content of the list item
    liElement.textContent = itemText;

    // Append the list item to the unordered list
    ulElement.appendChild(liElement);
  });

  const ulHtml = ulElement.outerHTML;

  // Create a string to represent the entire message
  const message = `<span>${listTitle}</span>\n${ulHtml}`;
  channel.postMessage(message);
  
  // Ajustar tamaño INMEDIATAMENTE después de enviar lista
  setTimeout(() => {
    const adjustChannel = new BroadcastChannel("adjustFont");
    adjustChannel.postMessage("adjust");
    adjustChannel.close();
  }, 50); // Reducido a 50ms para aplicación más rápida
});

document.addEventListener("keyup", doc_keyUp, false);

// Función para manejar la selección visual de versículos
function updateVerseSelection(selectedVerse, selectedIndex) {
  const bibleVerseDiv = document.getElementById("bible-verse");
  const pElements = bibleVerseDiv.querySelectorAll("p");
  
  // Remover selección de todos los versículos
  pElements.forEach((verse, i) => {
    verse.classList.remove('selected');
    if (i !== selectedIndex) {
      verse.style.backgroundColor = "#222222";
    }
  });
  
  // Aplicar selección al versículo actual
  selectedVerse.classList.add('selected');
  selectedVerse.style.backgroundColor = "#222255";
  
  console.log(`✨ Versículo seleccionado: ${selectedVerse.id}`);
}

function displayBible(verse, index) {

  verse.addEventListener("click", (event) => {
    // Encontrar el elemento P clickeado, sin importar dónde se hizo click dentro del área
    const clickedVerse = event.target.tagName === "P" ? event.target : event.target.closest('p');
    
    if (clickedVerse) {
      console.log(`📖 Versículo seleccionado: ${clickedVerse.id}`);
      
      // Obtener la versión de Biblia seleccionada
      const bibleVersionSelect = document.getElementById('bible-version');
      const selectedVersion = bibleVersionSelect ? bibleVersionSelect.value.toUpperCase() : '';
      
      // Obtener el mensaje original
      const originalMessage = clickedVerse.innerHTML;
      
      // Modificar el título para incluir la versión
      let enhancedMessage = originalMessage;
      if (selectedVersion && originalMessage.includes('<span>')) {
        enhancedMessage = originalMessage.replace(
          /(<span>)([^<]+)(<\/span>)/,
          `$1$2 - ${selectedVersion}$3`
        );
      }
      
      // Efecto visual de click
      clickedVerse.classList.add('clicked');
      setTimeout(() => {
        clickedVerse.classList.remove('clicked');
      }, 300);
      
      // Enviar el mensaje con la versión incluida
      channel.postMessage(enhancedMessage);
      
      console.log(`📚 Enviando versículo con versión: ${selectedVersion}`);
      
      // Enviar señal para ajustar tamaño INMEDIATAMENTE después de mostrar el texto
      setTimeout(() => {
        const adjustChannel = new BroadcastChannel("adjustFont");
        adjustChannel.postMessage("adjust");
        adjustChannel.close();
      }, 50); // Reducido para aplicación más rápida del tamaño fijo
      
      // Actualizar selección visual
      updateVerseSelection(clickedVerse, index);

      historyOfBibleVerse.push({ name: clickedVerse.id, verse: originalMessage });

      const maxHistorySize = 20;
      if (historyOfBibleVerse.length > maxHistorySize) {
        historyOfBibleVerse.shift();
      }
    }
  });
  
  // Mejorar accesibilidad
  verse.setAttribute('role', 'button');
  verse.setAttribute('tabindex', '0');
  verse.setAttribute('aria-label', `Seleccionar versículo ${verse.textContent.substring(0, 50)}...`);
  
  // Soporte para teclado
  verse.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      verse.click();
    }
  });

}

btnHistory.addEventListener("click", function () {
  const bblVerseDiv = document.getElementById("bible-verse");
  bblVerseDiv.innerHTML = "";
  
  // Obtener la versión actual para mostrar en el historial
  const bibleVersionSelect = document.getElementById('bible-version');
  const currentVersionDisplay = getVersionDisplayName(bibleVersionSelect ? bibleVersionSelect.value : 'kdsh');
  
  historyOfBibleVerse.forEach((entry, index) => {
    const pElement = document.createElement("p");
    pElement.id = entry.name;
    pElement.innerHTML = entry.verse;
    bblVerseDiv.appendChild(pElement);
    displayBible(pElement, index);
  });
});

// Función helper para obtener nombres descriptivos de las versiones
function getVersionDisplayName(versionCode) {
  const versionNames = {
    'kdsh': 'KADOSH',
    'lbla': 'LBLA', 
    'nvi': 'NVI',
    'btx': 'BTX',
  };
  return versionNames[versionCode] || versionCode.toUpperCase();
}

export { displayBible };
