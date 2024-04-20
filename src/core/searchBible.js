import { searchCharacters, searchInBibleText } from "../api/getData";
import { displayBible } from "./sendMessage";

async function searchBible(query) {
  const bblVerseDiv = document.getElementById("bible-verse");
  bblVerseDiv.innerHTML = "";
  const lowercaseQuery = query.toLowerCase();
  const versicles = await filterVersicles(lowercaseQuery);
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
    // displayBible();
  }
});

const inputField = document.getElementById("bible-input");

inputField.addEventListener("keydown", async function (event) {
  if (event.key === "Enter") {
    const searchQuery = inputField.value.trim();

    if (searchQuery !== "") {
      await searchBible(searchQuery);
      // displayBible();
    }
  }
});

export { searchBible };
