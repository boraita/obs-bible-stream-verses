import { searchCharacters, searchInBibleText } from "../api/getData";
import { displayBible } from "./sendMessage";

function createVerseElement(verse, index) {
  const cleanedName = verse.name
    .replace(/:/g, "-")
    .replace(/\s/g, "")
    .toLowerCase();

  const pElement = document.createElement("p");
  pElement.id = cleanedName;
  pElement.innerHTML = `<span>${verse.name.toUpperCase()}</span> ${verse.verse}`;
  
  return pElement;
}

async function searchBible(query) {
  const bblVerseDiv = document.getElementById("bible-verse");
  bblVerseDiv.innerHTML = "";
  
  const lowercaseQuery = query.toLowerCase();
  const versicles = await filterVersicles(lowercaseQuery);
  
  versicles.forEach((verse, index) => {
    const verseElement = createVerseElement(verse, index);
    bblVerseDiv.appendChild(verseElement);
    displayBible(verseElement, index);
  });
}

async function filterVersicles(query) {
  return /\d/.test(query)
    ? await searchCharacters(query)
    : await searchInBibleText(query);
}

async function handleSearch(event) {
  if (event) {
    event.preventDefault();
  }

  const inputField = document.getElementById("bible-input");
  const searchQuery = inputField.value.trim();

  if (searchQuery) {
    await searchBible(searchQuery);
  }
}

const submitButton = document.getElementById("bible-submit");
if (submitButton) {
  submitButton.addEventListener("click", handleSearch);
}

const inputField = document.getElementById("bible-input");
if (inputField) {
  inputField.addEventListener("keydown", async function (event) {
    if (event.key === "Enter") {
      await handleSearch(event);
    }
  });
}

export { searchBible };
