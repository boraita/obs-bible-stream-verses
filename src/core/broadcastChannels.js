const bgContainer = document.getElementById("bg-container");
const messageDisplay = document.getElementById("messageDisplay");
const bgContainerBtn = document.getElementById('bg-container-btn');
const channel = new BroadcastChannel("myChannel");
const bgContent = new BroadcastChannel("bgContent");
const settingsChannel = new BroadcastChannel("settings");

// Text channel
channel.onmessage = (event) => {
  const message = event.data;
  messageDisplay.innerHTML = message;
  localStorage.setItem('savedMessage', message);

  if (savedTitleColor) {
    const dspans = document.querySelectorAll("#messageDisplay span");
    dspans.forEach(dspan => dspan.style.color = savedTitleColor);
  }
};

// settings channel
settingsChannel.onmessage = (event) => {

  switch (Object.keys(event.data)?.[0]) {
    case 'selectedFont':
      const selectedFont = event.data['selectedFont'];
      bgContainer.style.fontFamily = selectedFont;
      localStorage.setItem('fontFamily', selectedFont);
      break;
    case 'opacityColor':
      const opacityColor = event.data['opacityColor'];
      bgContainer.style.backgroundColor = opacityColor;
      localStorage.setItem('bgColor', opacityColor);
      break;
    case 'roundedCorner':
      const roundedCorner = event.data['roundedCorner'];
      bgContainer.style.borderRadius = roundedCorner + "px";
      localStorage.setItem('borderRadius', roundedCorner);
      break;
    case 'selectedBgColor':
      const selectedBgColor = event.data['selectedBgColor'];
      bgContainer.style.backgroundColor = selectedBgColor;
      localStorage.setItem('bgColor', selectedBgColor);
      break;
    case 'selectedFontColor':
      const selectedFontColor = event.data['selectedFontColor'];
      bgContainer.style.color = selectedFontColor;
      localStorage.setItem('fontColor', selectedFontColor);
      break;
    case 'selectedTitleColor':
      const selectedTitleColor = event.data['selectedTitleColor'];
      const spans = document.querySelectorAll("#messageDisplay span");
      spans.forEach(span => span.style.color = selectedTitleColor);
      localStorage.setItem('titleColor', selectedTitleColor);
      break;
    case 'currentBoldState':
      const currentBoldState = event.data['currentBoldState'];
      messageDisplay.style.fontWeight = currentBoldState;
      localStorage.setItem('boldState', currentBoldState);
      break;
    case 'currentItalicState':
      const currentItalicState = event.data['currentItalicState'];
      messageDisplay.style.fontStyle = currentItalicState;
      localStorage.setItem('italicState', currentItalicState);
      break;
    case 'currentUnderlineState':
      const currentUnderlineState = event.data['currentUnderlineState'];
      messageDisplay.style.textDecoration = currentUnderlineState;
      localStorage.setItem('underlineState', currentUnderlineState);
      break;
    case 'selectedTextAlignment':
      const selectedTextAlignment = event.data['selectedTextAlignment'];
      messageDisplay.style.textAlign = selectedTextAlignment;
      localStorage.setItem('textAlign', selectedTextAlignment);
      break;
  }
};

// container hidden or shown
bgContent.onmessage = (event) => {
  if (event.data === 'hidden') {
    bgContainer.style.display = 'none';
  } else {
    bgContainer.style.display = 'inline';
  }
};

export { channel, bgContent, settingsChannel };
