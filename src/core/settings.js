import { hexToRgba } from "./utils";

//  setttings for font family
const fontElement = document.getElementById("fontStyle");
const opacityRange = document.getElementById("opacity");
const settingsChannel = new BroadcastChannel("settings");
const roundedCorner = document.getElementById("rounded-corner");

fontElement.addEventListener("change", function() {
    let selectedValue = fontElement.options[fontElement.selectedIndex].value;
    settingsChannel.postMessage({ selectedFont: selectedValue });
});

//  Dealing with opacity color

opacityRange.addEventListener("input", () => {
    let currentOpacity = opacityRange.value / 10;
    if (localStorage.getItem('bgColor') === null) {
        localStorage.setItem('bgColor', 'rgba(0, 0, 0, 1)');
    }
    let bgColor = localStorage.getItem('bgColor');
    
    let rgbValues = bgColor.match(/\d+/g);
    let newColor = `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, ${currentOpacity})`;

    settingsChannel.postMessage({ opacityColor: newColor });
});

//  handling rounded corner

roundedCorner.addEventListener("input", () => {
    let currentRoundedCorner = roundedCorner.value;
    
    settingsChannel.postMessage({ roundedCorner: currentRoundedCorner });
});


// handle backgroundColor
const bgColorInput = document.getElementById("bgColor");
bgColorInput.addEventListener("input", () => {
    let selectedColor = bgColorInput.value;
    let collectdBgColor = localStorage.getItem('bgColor');

    const rgbaParts = collectdBgColor.split(",");
    const alphaValue = rgbaParts.length === 4 ? parseFloat(rgbaParts[3]) : 1;
    let newColor = hexToRgba(selectedColor, alphaValue);
    
    settingsChannel.postMessage({ selectedBgColor: newColor });
    
});


// handle Font Color
const fontColorInput = document.getElementById("fontColor");
fontColorInput.addEventListener("input", function () {
    let selectedColor = fontColorInput.value;
    
    settingsChannel.postMessage({ selectedFontColor: selectedColor });
});

// handle Title Color
const titleColorInput = document.getElementById("titleColor");
titleColorInput.addEventListener("input", function () {
    let selectedColor = titleColorInput.value;
    
    settingsChannel.postMessage({ selectedTitleColor: selectedColor });
});

// handle Title Color
const boldButton = document.getElementById("bold");
boldButton.addEventListener("click", function () {
    let currentBoldState = localStorage.getItem('boldState') || 'normal';
    const newBoldState = (currentBoldState === 'bold') ? 'normal' : 'bold';
    boldButton.style.fontWeight = currentBoldState;
    if (currentBoldState === 'bold'){
        boldButton.style.backgroundColor  = '#555';
    }else{
        boldButton.style.backgroundColor ='#55a' 
    }
    
    settingsChannel.postMessage({ currentBoldState: newBoldState });
    console.log("Bold button");
});

// handle italic state
const italicButton = document.getElementById("italic");
italicButton.addEventListener("click", function () {
    let currentItalicState = localStorage.getItem('italicState') || 'normal';
    const newItalicState = (currentItalicState === 'italic') ? 'normal' : 'italic';
    italicButton.style.fontWeight = newItalicState;
    if (currentItalicState === 'italic'){
        italicButton.style.backgroundColor  = '#555';
        italicButton.style.fontStyle  = 'normal';
    }else{
        italicButton.style.backgroundColor ='#55a'
        italicButton.style.fontStyle  = 'italic';
    }
    
    settingsChannel.postMessage({ currentItalicState: newItalicState });
});


// handle Underline state
const underlineButton = document.getElementById("underline");
underlineButton.addEventListener("click", function () {
    let currentUnderlineState = localStorage.getItem('underlineState') || 'none';
    const newUnderlineState = (currentUnderlineState === 'underline') ? 'none' : 'underline';
    underlineButton.style.fontWeight = newUnderlineState;
    if (currentUnderlineState === 'underline'){
        underlineButton.style.backgroundColor  = '#555';
        underlineButton.style.textDecoration  = 'none';
    }else{
        underlineButton.style.backgroundColor ='#55a' 
        underlineButton.style.textDecoration  = 'underline';
    }
    
    settingsChannel.postMessage({ currentUnderlineState: newUnderlineState });
});


//  setttings for font family
const textAlignElement = document.getElementById("textAlign");
const selectedAlignment = textAlignElement.options[textAlignElement.selectedIndex].value;

textAlignElement.addEventListener("change", function() {
    let selectedValue = textAlignElement.options[textAlignElement.selectedIndex].value;
    
    settingsChannel.postMessage({ selectedTextAlignment: selectedValue });
});

