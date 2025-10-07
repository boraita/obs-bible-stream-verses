import { searchCharacters, searchInBibleText } from "../api/getData";
import { displayBible } from "./sendMessage";

async function searchBible(query) {
  const bblVerseDiv = document.getElementById("bible-verse");
  bblVerseDiv.innerHTML = "";
  const lowercaseQuery = query.toLowerCase();
  const versicles = await filterVersicles(lowercaseQuery);
  
  // Obtener la versión de Biblia seleccionada para mostrar en la interfaz
  const bibleVersionSelect = document.getElementById('bible-version');
  const selectedVersionDisplay = getVersionDisplayName(bibleVersionSelect ? bibleVersionSelect.value : 'kdsh');
  
  versicles.forEach((verse, index) => {
    const cleanedName = verse.name
      .replace(/:/g, "-")
      .replace(/\s/g, "")
      .toLowerCase();

    const pElement = document.createElement("p");
    pElement.id = cleanedName;
    pElement.innerHTML = `<span>${verse.name.toUpperCase()}</span> ${
      verse.verse
    }`;
    bblVerseDiv.appendChild(pElement);
    displayBible(pElement, index)
  });
}
async function filterVersicles(query) {
  return /\d/.test(query)
    ? await searchCharacters(query)
    : await searchInBibleText(query);
}

const submitButton = document.getElementById("bible-submit");
submitButton.addEventListener("click", async function (event) {
  event.preventDefault(); // Prevent the form from submitting

  const inputField = document.getElementById("bible-input");
  const searchQuery = inputField.value.trim();

  if (searchQuery !== "") {
    await searchBible(searchQuery);
  }
});

const inputField = document.getElementById("bible-input");

inputField.addEventListener("keydown", async function (event) {
  if (event.key === "Enter") {
    const searchQuery = inputField.value.trim();

    if (searchQuery !== "") {
      await searchBible(searchQuery);
    }
  }
});

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

export { searchBible };
