import { getBibleData } from "./filesHandle";
import { displayBible } from "./sendMessage";

function searchBible(query) {
  const bblVerseDiv = document.getElementById("bible-verse");
  bblVerseDiv.innerHTML = "";
  const lowercaseQuery = query.toLowerCase();
  const versicles = filterVersicles(lowercaseQuery);
  versicles.forEach((verse) => {
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
  });
}

function filterVersicles(query) {
  const versicles = getBibleData().filter((verseFiltered) => {
    const name = verseFiltered.name.toLowerCase();
    const verse = verseFiltered.verse.toLowerCase();
    if (name.includes(query) && /\d/.test(query)) {
      const numberMatchQuery = query.match(/\d+/g);
      const number = numberMatchQuery?.[numberMatchQuery.length - 1];
      const verseMatchQuery = verseFiltered.name.match(/\d+/g);
      const verseNumber = verseMatchQuery?.[verseMatchQuery.length - 2];
      return number === verseNumber;
    } else if (name.includes(query)) {
      return name;
    } else if (verse.includes(query)) {
      return verse;
    }
  });
  return versicles;
}

const submitButton = document.getElementById("bible-submit");
submitButton.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent the form from submitting

  const inputField = document.getElementById("bible-input");
  const searchQuery = inputField.value.trim();

  if (searchQuery !== "") {
    searchBible(searchQuery);
    displayBible();
  }
});

const inputField = document.getElementById("bible-input");

inputField.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const searchQuery = inputField.value.trim();

    if (searchQuery !== "") {
      searchBible(searchQuery);
      displayBible();
    }
  }
});

export { searchBible };