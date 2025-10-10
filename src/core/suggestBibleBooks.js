import { getBibleChapterBooksList } from "../api/getData";

let selectedBibleVersion;
let bookOfBibles;
const bibleInput = document.getElementById("bible-input");
const suggestionsList = document.getElementById("suggestions");
let selectedSuggestionIndex = -1;

function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

async function getBooksOfTheBible() {
  const currentVersion = document.getElementById("bible-version").value;
  
  if (currentVersion !== selectedBibleVersion) {
    bookOfBibles = await getBibleChapterBooksList();
    selectedBibleVersion = currentVersion;
  }
  
  return bookOfBibles;
}

function resetSuggestionsStyles() {
  Array.from(suggestionsList.children).forEach(child => {
    child.style.backgroundColor = "#222";
  });
}

function scrollToSuggestion(element) {
  const suggestionHeight = element.offsetHeight;
  const scrollTop = element.offsetTop - suggestionHeight * 2;
  suggestionsList.scrollTop = scrollTop;
}

function updateInput(index) {
  if (index < 0 || index >= suggestionsList.children.length) {
    return;
  }

  resetSuggestionsStyles();

  const selectedSuggestion = suggestionsList.children[index];
  bibleInput.value = selectedSuggestion.textContent;
  selectedSuggestion.style.backgroundColor = "#444";

  scrollToSuggestion(selectedSuggestion);
}

function createSuggestionItem(book, index) {
  const listItem = document.createElement("li");
  listItem.textContent = book;
  listItem.addEventListener("click", () => {
    updateInput(index);
    document.getElementById("bible-submit").click();
    suggestionsList.innerHTML = "";
  });
  return listItem;
}

bibleInput.addEventListener("input", async function () {
  const inputValue = bibleInput.value.toLowerCase();
  const inputSearch = removeAccents(inputValue);
  const books = await getBooksOfTheBible();
  const filteredBooks = books.filter((book) =>
    removeAccents(book).toLowerCase().includes(inputSearch)
  );

  suggestionsList.innerHTML = "";

  filteredBooks.forEach((book, index) => {
    const listItem = createSuggestionItem(book, index);
    suggestionsList.appendChild(listItem);
  });

  selectedSuggestionIndex = -1;
});

function handleArrowDown(event) {
  event.preventDefault();
  const maxIndex = suggestionsList.children.length;
  selectedSuggestionIndex = (selectedSuggestionIndex + 1) % maxIndex;
  updateInput(selectedSuggestionIndex);
}

function handleArrowUp(event) {
  event.preventDefault();
  const maxIndex = suggestionsList.children.length;
  selectedSuggestionIndex = (selectedSuggestionIndex - 1 + maxIndex) % maxIndex;
  updateInput(selectedSuggestionIndex);
}

function handleEnterKey(event) {
  event.preventDefault();
  suggestionsList.innerHTML = "";
}

bibleInput.addEventListener("keydown", function (event) {
  const keyHandlers = {
    "ArrowDown": handleArrowDown,
    "ArrowUp": handleArrowUp,
    "Enter": handleEnterKey
  };

  const handler = keyHandlers[event.key];
  if (handler) {
    handler(event);
  }
});

export { getBooksOfTheBible, updateInput };
