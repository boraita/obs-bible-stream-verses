function searchBible(query) {
  bblVerseDiv.innerHTML = ""; 
  const lowercaseQuery = query.toLowerCase();
  const bibleData = getBibleData();
  for (let i = 0; i < bibleData.length; i++) {
    const name = bibleData[i].name.toLowerCase(); 
    const verse = bibleData[i].verse.toLowerCase();

    if (name.includes(lowercaseQuery) || verse.includes(lowercaseQuery)) {
      const cleanedName = bibleData[i].name.replace(/:/g, '-').replace(/\s/g, '').toLowerCase();
      // const ariParts = bibleData[i].ari.split(':');
      // const middleAriPart = ariParts[2];

      const pElement = document.createElement('p');
      pElement.id = cleanedName;
      pElement.innerHTML = `<span>${name.toUpperCase()}</span> ${bibleData[i].verse}`;
      bblVerseDiv.appendChild(pElement);
    }
  }
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