import { getBibleData } from "./filesHandle";

const bgContent = new BroadcastChannel("bgContent");
const bgContentBtn = document.getElementById("bg-container-btn");
bgContentBtn.addEventListener("click", handleBgContent);
document.getElementById('tab-text').addEventListener('click', openTab)
document.getElementById('tab-bibleText').addEventListener('click', openTab)
document.getElementById('tab-listText').addEventListener('click', openTab)
document.getElementById('tab-setBg').addEventListener('click', openTab)

function openTab(event) {
  const tabName = event.target.id.replace("tab-", "");
  var tabs = document.getElementsByClassName("tab-area");
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].style.display = "none";
  }
  var selectedTab = document.getElementById(tabName);
  if (selectedTab) {
    selectedTab.style.display = "block";
  }
}

const bblVerseDiv = document.getElementById("bible-verse");
const bibleData = getBibleData();
for (let i = 0; i < 31; i++) {
  const name = bibleData[i].name;
  const cleanedName = name.replace(/:/g, "-").replace(/\s/g, "").toLowerCase();

  const pElement = document.createElement("p");
  pElement.id = cleanedName;
  pElement.innerHTML = `<span>${name.toUpperCase()}</span> ${
    bibleData[i].verse
  }`;
  bblVerseDiv.appendChild(pElement);
}

function handleBgContent() {
  const isShowed = bgContentBtn.innerHTML === "Mostrar";
  bgContent.postMessage(isShowed ? "shown" : "hidden");
  bgContentBtn.innerHTML =
    bgContentBtn.innerHTML === "Mostrar" ? "Ocultar" : "Mostrar";
}

export { openTab };
