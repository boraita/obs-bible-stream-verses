const booksOfTheBible = [
  "Génesis ", "Éxodo ", "Levítico ", "Números ", "Deuteronomio ",
  "Josué ", "Jueces ", "Rut ", "1 Samuel ", "2 Samuel ", "1 Reyes ",
  "2 Reyes ", "1 Crónicas ", "2 Crónicas ", "Esdras ", "Nehemías ",
  "Ester ", "Job ", "Salmos ", "Proverbios ",
  "Eclesiastés ", "Cantar de los Cantares ", "Isaías ", "Jeremías ", "Lamentaciones ",
  "Ezequiel ", "Daniel ", "Oseas ", "Joel ", "Amós ",
  "Abdías ", "Jonás ", "Miqueas ", "Nahúm ", "Habacuc ",
  "Sofonías ", "Hageo ", "Zacarías ", "Malaquías ",
  "Mateo ", "Marcos ", "Lucas ", "Juan ", "Hechos ",
  "Romanos ", "1 Corintios ", "2 Corintios ", "Gálatas ",
  "Efesios ", "Filipenses ", "Colosenses ", "1 Tesalonicenses ", "2 Tesalonicenses ",
  "1 Timoteo ", "2 Timoteo ", "Tito ", "Filemón ", "Hebreos ", "Santiago ", "1 Pedro ",
  "2 Pedro ", "1 Juan ", "2 Juan ", "3 Juan ", "Judas ", "Apocalipsis "
];


const bibleInput = document.getElementById("bible-input");


const suggestionsList = document.getElementById("suggestions");
let selectedSuggestionIndex = -1; // Index of the currently selected suggestion


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
  const inputSearch = removeAccents(inputValue)
  const filteredBooks = booksOfTheBible.filter(book => removeAccents(book).toLowerCase().includes(inputSearch));

  suggestionsList.innerHTML = "";

  filteredBooks.forEach((book, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = book;
    // Add a click event listener to each suggestion
    listItem.addEventListener("click", () => {
      updateInput(index);
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