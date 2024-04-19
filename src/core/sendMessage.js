const channel = new BroadcastChannel("myChannel");

const btnHistory = document.getElementById("history");

var historyOfBibleVerse = [];

document.getElementById("sendButton").addEventListener("click", () => {
  const message = document.getElementById("messageInput").value;
  channel.postMessage(message);
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
});

document.addEventListener("keyup", doc_keyUp, false);

function displayBible(verse, index) {

  verse.addEventListener("click", (event) => {
    if (event.target.tagName === "P") {
      const message = event.target.innerHTML;
      channel.postMessage(message);
      event.target.style.backgroundColor = "#222255";

      historyOfBibleVerse.push({ name: event.target.id, verse: message });

      const maxHistorySize = 20;
      if (historyOfBibleVerse.length > maxHistorySize) {
        historyOfBibleVerse.shift();
      }
    }
    let bibleVerseDiv = document.getElementById("bible-verse");

    let pElements = bibleVerseDiv.querySelectorAll("p");

    let bibleVerses = Array.from(pElements);
    // Set background color of all verses to #222222
    bibleVerses.forEach((v, i) => {
      if (i !== index) {
        v.style.backgroundColor = "#222222";
      }
    });
  });

}

btnHistory.addEventListener("click", function () {
  const bblVerseDiv = document.getElementById("bible-verse");
  bblVerseDiv.innerHTML = "";
  historyOfBibleVerse.forEach((entry, index) => {
    const pElement = document.createElement("p");
    pElement.id = entry.name;
    pElement.innerHTML = entry.verse;
    bblVerseDiv.appendChild(pElement);
    displayBible(pElement, index);
  });
});

export { displayBible };
