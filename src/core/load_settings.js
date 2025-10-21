
const savedBgColor = localStorage.getItem('bgColor');
const savedFontFamily = localStorage.getItem('fontFamily');
const savedFontColor = localStorage.getItem('fontColor');
const savedBorderRadius = localStorage.getItem('borderRadius');
const savedTitleColor = localStorage.getItem('titleColor');
var savedMessage = localStorage.getItem('savedMessage');
var savedBoldState = localStorage.getItem('boldState');
var savedItalicState = localStorage.getItem('italicState');
var savedUnderlineState = localStorage.getItem('underlineState');
var savedTextAlign = localStorage.getItem('textAlign');


const bgContainer = document.getElementById("bg-container");
const messageDisplay = document.getElementById("messageDisplay");


function applyTextEffectToContent(styleProperty, value) {
  
  messageDisplay.style[styleProperty] = value;
  
  
  const titleSpans = document.querySelectorAll("#messageDisplay span");
  titleSpans.forEach(span => {
    if (styleProperty === 'textShadow') {
      
      const titleShadowEnabled = localStorage.getItem('titleShadow') === 'true';
      if (titleShadowEnabled) {
        const shadowSize = localStorage.getItem('titleShadowSize') || '1';
        const shadowColor = localStorage.getItem('titleShadowColor') || '#000000';
        span.style.textShadow = `${shadowSize}px ${shadowSize}px 2px ${shadowColor}`;
      } else {
        span.style.textShadow = 'none';
      }
    } else if (styleProperty === 'webkitTextStroke') {
      
      const titleColor = localStorage.getItem('titleColor') || '#ffffff';
      const strokeEnabled = localStorage.getItem('titleBoxStroke') !== 'false';
      
      if (strokeEnabled && span.classList.contains('title-with-box')) {
        span.style.webkitTextStroke = `1.5px ${titleColor}`;
        span.style.textStroke = `1.5px ${titleColor}`;
      } else {
        span.style.webkitTextStroke = '0px transparent';
        span.style.textStroke = '0px transparent';
      }
    } else {
      
      span.style[styleProperty] = 'initial';
    }
  });
}

function setTitleStroke(span, enabled) {
  if (!span) return;
  if (enabled) {
    const strokeColor = localStorage.getItem('titleColor') || '#ffffff';
    span.style.webkitTextStroke = `1.5px ${strokeColor}`;
    span.style.textStroke = `1.5px ${strokeColor}`;
  } else {
    span.style.webkitTextStroke = '0px transparent';
    span.style.textStroke = '0px transparent';
  }
}


const savedBackgroundGradient = localStorage.getItem('backgroundGradient');
const savedTextGradient = localStorage.getItem('textGradient');
const savedTextShadow = localStorage.getItem('textShadow');
const savedTextStroke = localStorage.getItem('textStroke');
const savedTextGlow = localStorage.getItem('textGlow');
const savedContainerPadding = localStorage.getItem('containerPadding');
const savedContainerMargin = localStorage.getItem('containerMargin');
const savedContainerOpacity = localStorage.getItem('containerOpacity');
const savedRoundedCorner = localStorage.getItem('roundedCorner');
const savedTextAnimation = localStorage.getItem('textAnimation');
const savedAnimationDuration = localStorage.getItem('animationDuration');


if (!localStorage.getItem('bgColor')) {
    
    const defaultBgColor = 'rgba(255, 255, 255, 1)';
    if (bgContainer) bgContainer.style.backgroundColor = defaultBgColor;
    localStorage.setItem('bgColor', defaultBgColor);
}

if (!localStorage.getItem('fontColor')) {
    
    const defaultFontColor = '#000000';
    if (bgContainer) bgContainer.style.color = defaultFontColor;
    localStorage.setItem('fontColor', defaultFontColor);
}

if (!localStorage.getItem('titleColor')) {
    
    const defaultTitleColor = '#000000';
    const titleSpans = document.querySelectorAll("#messageDisplay span");
    titleSpans.forEach(span => {
        span.style.color = defaultTitleColor;
    });
    localStorage.setItem('titleColor', defaultTitleColor);
}

if (!localStorage.getItem('fontFamily')) {
    
    const defaultFont = 'Poppins';
    if (bgContainer) bgContainer.style.fontFamily = defaultFont;
    localStorage.setItem('fontFamily', defaultFont);
}

if (!localStorage.getItem('borderRadius')) {
    
    if (bgContainer) bgContainer.style.borderRadius = '5px';
}

if (!localStorage.getItem('containerPadding')) {
    if (messageDisplay) messageDisplay.style.padding = '0px';
}

if (!localStorage.getItem('containerMargin')) {
    
    if (messageDisplay) messageDisplay.style.margin = '0px';
}

if (savedMessage) {
    messageDisplay.innerHTML = savedMessage;
}


if (savedBackgroundGradient) {
    bgContainer.style.background = savedBackgroundGradient;
} else if (savedBgColor) {
    
    if (savedContainerOpacity) {
        let bgColor = savedBgColor;
        if (bgColor.startsWith('#')) {
            const hex = bgColor.slice(1);
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            bgColor = `rgba(${r}, ${g}, ${b}, ${savedContainerOpacity})`;
        }
        bgContainer.style.backgroundColor = bgColor;
    } else {
        bgContainer.style.backgroundColor = savedBgColor;
    }
}

if (savedFontFamily) {
    bgContainer.style.fontFamily = savedFontFamily;
}


if (savedTextGradient) {
    messageDisplay.style.background = savedTextGradient;
    messageDisplay.style.webkitBackgroundClip = 'text';
    messageDisplay.style.webkitTextFillColor = 'transparent';
    messageDisplay.style.backgroundClip = 'text';
} else if (savedFontColor) {
    messageDisplay.style.color = savedFontColor;
}

if (savedBorderRadius) {
    bgContainer.style.borderRadius = savedBorderRadius + 'px';
}


const savedTitleShow = localStorage.getItem('titleShow');
const savedTitleFontSize = localStorage.getItem('titleFontSize');
const savedTitlePositionX = localStorage.getItem('titlePositionX');
const savedTitlePositionY = localStorage.getItem('titlePositionY');
const savedTitleSpacing = localStorage.getItem('titleSpacing');
const savedTitleFontWeight = localStorage.getItem('titleFontWeight');
const savedTitleShadow = localStorage.getItem('titleShadow');
const savedTitleShadowColor = localStorage.getItem('titleShadowColor');
const savedTitleShadowSize = localStorage.getItem('titleShadowSize');
const savedTitleStroke = localStorage.getItem('titleStroke');
const savedTitleStrokeColor = localStorage.getItem('titleStrokeColor');
const savedTitleStrokeWidth = localStorage.getItem('titleStrokeWidth');
const savedTitleBoxMargin = localStorage.getItem('titleBoxMargin');
const savedTitleBoxStroke = localStorage.getItem('titleBoxStroke') === 'true';


if (savedTitleShow !== null) {
    messageDisplay.style.display = savedTitleShow === 'true' ? 'block' : 'none';
} else {
    
    messageDisplay.style.display = 'block';
}


const titleSpans = document.querySelectorAll("#messageDisplay span");
if (savedTitlePositionX && titleSpans.length > 0) {
    titleSpans.forEach(span => {
        span.style.left = `${savedTitlePositionX}px`;
    });
} else if (titleSpans.length > 0) {
    
    titleSpans.forEach(span => {
        span.style.left = '10px';
    });
}

if (savedTitlePositionY && titleSpans.length > 0) {
    titleSpans.forEach(span => {
        span.style.top = `${savedTitlePositionY}px`;
    });
} else if (titleSpans.length > 0) {
    
    titleSpans.forEach(span => {
        span.style.top = '10px';
    });
}


const titleColor = savedTitleColor || '#ffffff'; 
const dspans = document.querySelectorAll("#messageDisplay span");
dspans.forEach(dspan => {
    dspan.style.color = titleColor;
    
    if (dspan.classList.contains('title-with-box')) {
        setTitleStroke(dspan, savedTitleBoxStroke);
    } else {
        setTitleStroke(dspan, false);
    }
});


if (savedTitleFontSize || savedTitleSpacing || savedTitleFontWeight || savedTitleShadow || savedTitleBoxMargin) {
    const titleSpans = document.querySelectorAll("#messageDisplay span");
    titleSpans.forEach(span => {
        if (savedTitleFontSize) {
            span.style.fontSize = `${savedTitleFontSize}px`;
        }
        if (savedTitleSpacing) {
            span.style.letterSpacing = `${savedTitleSpacing}px`;
        }
        if (savedTitleFontWeight) {
            span.style.fontWeight = savedTitleFontWeight;
        }
        if (savedTitleBoxMargin) {
            span.style.marginBottom = `${savedTitleBoxMargin}px`;
        }
        
        
        if (savedTitleShadow === 'true') {
            const shadowColor = savedTitleShadowColor || '#000000';
            const shadowSize = savedTitleShadowSize || '2';
            span.style.textShadow = `${shadowSize}px ${shadowSize}px 2px ${shadowColor}`;
        }
        
        
        if (savedTitleStroke === 'true') {
            const strokeColor = savedTitleStrokeColor || '#000000';
            const strokeWidth = savedTitleStrokeWidth || '1';
            span.style.webkitTextStroke = `${strokeWidth}px ${strokeColor}`;
        }
    });
}


const savedTitleBox = localStorage.getItem('titleBoxEnabled');
if (savedTitleBox === 'true') {
    const titleSpans = document.querySelectorAll("#messageDisplay span");
    titleSpans.forEach(span => {
        span.classList.add('title-with-box');
        
        applyInitialTitleBoxStyles(span);
    });
} else {
    const titleSpans = document.querySelectorAll("#messageDisplay span");
    const savedAlignment = localStorage.getItem('titleAlignment') || 'left';
    titleSpans.forEach(span => {
        span.classList.add(`title-align-${savedAlignment}`);
        setTitleStroke(span, false);
    });
}

if (window.updateMessagePadding) {
    window.updateMessagePadding();
}


function applyInitialTitleBoxStyles(titleSpan) {
    const configs = {
        size: localStorage.getItem('titleBoxSize') || 'medium',
        padding: localStorage.getItem('titleBoxPadding') || '8',
        margin: localStorage.getItem('titleBoxMargin') || '10',
        fullWidth: localStorage.getItem('titleBoxFullWidth') === 'true',
        color: localStorage.getItem('titleBoxColor') || '#ffffff',
        opacity: localStorage.getItem('titleBoxOpacity') || '80',
        border: localStorage.getItem('titleBoxBorder') || '1',
        borderColor: localStorage.getItem('titleBoxBorderColor') || '#ffffff',
        radius: localStorage.getItem('titleBoxRadius') || '6',
        blur: localStorage.getItem('titleBoxBlur') !== 'false',
        stroke: localStorage.getItem('titleBoxStroke') !== 'false'
    };

    
    titleSpan.classList.remove('size-small', 'size-medium', 'size-large');
    if (configs.size === 'custom') {
        titleSpan.style.padding = `${configs.padding}px ${parseInt(configs.padding) * 1.5}px`;
    } else {
        titleSpan.classList.add(`size-${configs.size}`);
    }

    
    if (configs.fullWidth) {
        titleSpan.classList.add('full-width');
    }

    
    const r = parseInt(configs.color.slice(1, 3), 16);
    const g = parseInt(configs.color.slice(3, 5), 16);
    const b = parseInt(configs.color.slice(5, 7), 16);
    const bgColor = `rgba(${r}, ${g}, ${b}, ${configs.opacity / 100})`;
    titleSpan.style.backgroundColor = bgColor;

    
    if (configs.border > 0) {
        titleSpan.style.border = `${configs.border}px solid ${configs.borderColor}`;
    } else {
        titleSpan.style.border = 'none';
    }

    setTitleStroke(titleSpan, configs.stroke);

    
    if (!configs.fullWidth) {
        titleSpan.style.borderRadius = `${configs.radius}px`;
    } else {
        titleSpan.style.borderRadius = '0';
    }

    
    if (configs.blur) {
        titleSpan.style.backdropFilter = 'blur(5px)';
    } else {
        titleSpan.style.backdropFilter = 'none';
    }

    
    titleSpan.style.marginBottom = `${configs.margin}px`;
}

if (savedBoldState){
    messageDisplay.style.fontWeight = savedBoldState;
}

if (savedItalicState){
    messageDisplay.style.fontStyle = savedItalicState;
}

if (savedUnderlineState){
    messageDisplay.style.textDecoration = savedUnderlineState;
}

if (savedTextAlign) {
    messageDisplay.style.textAlign = savedTextAlign;
}


if (savedTextShadow || savedTextGlow) {
    let shadowEffect = '';
    if (savedTextShadow) shadowEffect += savedTextShadow;
    if (savedTextGlow) {
        if (shadowEffect) shadowEffect += ', ';
        shadowEffect += savedTextGlow;
    }
    applyTextEffectToContent('textShadow', shadowEffect);
}

if (savedTextStroke) {
    const strokeData = JSON.parse(savedTextStroke);
    applyTextEffectToContent('webkitTextStroke', `${strokeData.width} ${strokeData.color}`);
} else {
    if (messageDisplay) {
        messageDisplay.style.webkitTextStroke = '';
        messageDisplay.style.textStroke = '';
    }
}

if (savedContainerMargin) {
    messageDisplay.style.margin = savedContainerMargin + 'px';
}


if (savedTextAnimation && savedTextAnimation !== 'none') {
    if (savedAnimationDuration) {
        messageDisplay.style.animationDuration = savedAnimationDuration;
    }
    
    
    switch (savedTextAnimation) {
        case 'fadeIn':
            messageDisplay.classList.add('fade-in');
            break;
        case 'slideInFromLeft':
            messageDisplay.classList.add('slide-in-left');
            break;
        case 'slideInFromRight':
            messageDisplay.classList.add('slide-in-right');
            break;
        case 'slideInFromTop':
            messageDisplay.classList.add('slide-in-top');
            break;
        case 'slideInFromBottom':
            messageDisplay.classList.add('slide-in-bottom');
            break;
        case 'zoomIn':
            messageDisplay.classList.add('zoom-in');
            break;
        case 'typewriter':
            messageDisplay.classList.add('typewriter');
            break;
    }
}

if (savedTextAlign){
    messageDisplay.style.textAlign = savedTextAlign;
}



if (savedRoundedCorner && bgContainer) {
    bgContainer.style.borderRadius = savedRoundedCorner + 'px';
}

if (savedContainerPadding && messageDisplay) {
    localStorage.setItem('containerPadding', savedContainerPadding);
    if (window.updateMessagePadding) {
        window.updateMessagePadding();
    } else {
        const paddingValue = parseInt(savedContainerPadding, 10) || 0;
        const hasTitle = messageDisplay.classList.contains('message-with-title');
        const topPadding = hasTitle ? Math.max(paddingValue, 60) : paddingValue;
        messageDisplay.style.paddingLeft = `${paddingValue}px`;
        messageDisplay.style.paddingRight = `${paddingValue}px`;
        messageDisplay.style.paddingBottom = `${paddingValue}px`;
        messageDisplay.style.paddingTop = `${topPadding}px`;
    }
}


if (savedContainerOpacity && bgContainer) {
    const currentBgColor = localStorage.getItem('bgColor') || '#000000';
    if (currentBgColor.startsWith('#')) {
        const hex = currentBgColor.slice(1);
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        bgContainer.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${savedContainerOpacity})`;
    }
}


if (savedRoundedCorner && bgContainer) {
    bgContainer.style.borderRadius = savedRoundedCorner + 'px';
}
