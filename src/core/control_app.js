const bgContent = new BroadcastChannel("bgContent");
const bgContentBtn = document.getElementById('bg-container-btn');

function openTab(tabName) {
  var tabs = document.getElementsByClassName('tab-area');
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].style.display = 'none';
  }
  var selectedTab = document.getElementById(tabName);
  if (selectedTab) {
    selectedTab.style.display = 'block';
  }
}

const bblVerseDiv = document.getElementById('bible-verse');
bibleData = getBibleData();
for (let i = 0; i < 31; i++) {
  const name = bibleData[i].name;

  const cleanedName = name.replace(/:/g, '-').replace(/\s/g, '').toLowerCase();
  const ariParts = bibleData[i].ari.split(':');
  const middleAriPart = ariParts[2];

  const pElement = document.createElement('p');
  pElement.id = cleanedName;
  pElement.innerHTML = `<span>${name.toUpperCase()}</span> ${bibleData[i].verse}`;
  bblVerseDiv.appendChild(pElement);
}

function handleBgContent() {

  if (bgContentBtn.innerHTML === 'Mostrar') {
    bgContent.postMessage('shown');
    bgContentBtn.innerHTML = 'Ocultar';
  } else {
    bgContent.postMessage('hidden');
    bgContentBtn.innerHTML = 'Mostrar';
  }

}


