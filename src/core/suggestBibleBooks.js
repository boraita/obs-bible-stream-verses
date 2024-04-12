
let selectedBibleVersion;
let bookOfBibles;
const bibleInput = document.getElementById("bible-input");
const suggestionsList = document.getElementById("suggestions");
let selectedSuggestionIndex = -1;

function getBooksOfTheBible() {
  if (document.getElementById('bible-version').value !== selectedBibleVersion) {
    const bibleData = getBibleData();
    const bibleBooks = bibleData.map(book => {
      const books = book.name.split(" ");
      const verses = books.pop();
      books.push(verses.split(":")[0])
      return books.join(" ");
    });
    bookOfBibles = [...new Set(bibleBooks)];
    selectedBibleVersion = document.getElementById('bible-version').value;
  }
  return bookOfBibles;
}

function updateInput(index) {
  if (index >= 0 && index < suggestionsList.children.length) {
    for (let item = suggestionsList.children.length - 1; item >= 0; item--) {
      suggestionsList.children[item].style.backgroundColor = "#222";
    }

    const selectedSuggestion = suggestionsList.children[index];
    bibleInput.value = selectedSuggestion.textContent;
    selectedSuggestion.style.backgroundColor = "#444";

    // Calculate the scroll position to ensure the selected item is visible
    const suggestionHeight = selectedSuggestion.offsetHeight;
    const scrollTop = selectedSuggestion.offsetTop - (suggestionHeight * 2); // Adjust as needed
    suggestionsList.scrollTop = scrollTop;
  }
}

bibleInput.addEventListener("input", function () {
  const inputValue = bibleInput.value.toLowerCase();
  const inputSearch = removeAccents(inputValue);
  const filteredBooks = getBooksOfTheBible().filter(book => removeAccents(book).toLowerCase().includes(inputSearch));

  suggestionsList.innerHTML = "";

  filteredBooks.forEach((book, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = book;
    // Add a click event listener to each suggestion
    listItem.addEventListener("click", () => {
      updateInput(index);
      document.getElementById("bible-submit").click();
      suggestionsList.innerHTML = "";
    });
    suggestionsList.appendChild(listItem);
  });

  // Reset the selected suggestion index
  selectedSuggestionIndex = -1;
});

bibleInput.addEventListener("keydown", function (event) {
  if (event.key === "ArrowDown") {
    event.preventDefault();
    selectedSuggestionIndex =
      (selectedSuggestionIndex + 1) % suggestionsList.children.length;
    updateInput(selectedSuggestionIndex);
  } else if (event.key === "ArrowUp") {
    // Handle Arrow Up key press
    event.preventDefault();
    selectedSuggestionIndex =
      (selectedSuggestionIndex - 1 + suggestionsList.children.length) %
      suggestionsList.children.length;
    updateInput(selectedSuggestionIndex);
  } else if (event.key === "Enter") {
    // Handle Enter key press to clear suggestions
    event.preventDefault();
    suggestionsList.innerHTML = "";
  }
});

function removeAccents(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}