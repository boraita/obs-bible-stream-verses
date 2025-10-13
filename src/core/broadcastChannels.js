import { processVerseText } from "../api/getData.js";

const containerElement = document.getElementById("bg-container");
const messageDisplay = document.getElementById("messageDisplay");

const messageChannel = new BroadcastChannel("myChannel");
const visibilityChannel = new BroadcastChannel("bgContent");
const settingsChannel = new BroadcastChannel("settings");
const fontAdjustChannel = new BroadcastChannel("adjustFont");

const DEFAULT_PADDING = 15;
const DEFAULT_TITLE_PADDING = 60;
const TITLE_STROKE_WIDTH = '1.5px';

function setTitleStroke(span, enabled) {
  if (!span) return;
  
  if (enabled) {
    const strokeColor = localStorage.getItem('titleColor') || '#ffffff';
    span.style.webkitTextStroke = `${TITLE_STROKE_WIDTH} ${strokeColor}`;
    span.style.textStroke = `${TITLE_STROKE_WIDTH} ${strokeColor}`;
  } else {
    span.style.webkitTextStroke = '0px transparent';
    span.style.textStroke = '0px transparent';
  }
}

function updateMessagePadding() {
  if (!messageDisplay) return;
  
  const storedPadding = parseInt(localStorage.getItem('containerPadding') || DEFAULT_PADDING, 10);
  const paddingValue = isNaN(storedPadding) ? DEFAULT_PADDING : storedPadding;
  const hasTitle = messageDisplay.classList.contains('message-with-title');
  const topPadding = hasTitle ? Math.max(paddingValue, DEFAULT_TITLE_PADDING) : Math.max(paddingValue, DEFAULT_PADDING);

  messageDisplay.style.paddingLeft = `${paddingValue}px`;
  messageDisplay.style.paddingRight = `${paddingValue}px`;
  messageDisplay.style.paddingBottom = `${paddingValue}px`;
  messageDisplay.style.paddingTop = `${topPadding}px`;
}

/**
 * Applies text effects only to content, preserving title styling
 * @param {string} styleProperty - CSS property name
 * @param {string} value - CSS property value
 */
function applyTextEffectToContent(styleProperty, value) {
  messageDisplay.style[styleProperty] = value;
  
  const titleSpans = document.querySelectorAll("#messageDisplay span");
  titleSpans.forEach(span => {
    if (styleProperty === 'textShadow') {
      const titleShadowEnabled = localStorage.getItem('titleShadow') === 'true';
      if (titleShadowEnabled) {
        const shadowSize = localStorage.getItem('titleShadowSize') || '2';
        const shadowColor = localStorage.getItem('titleShadowColor') || '#000000';
        span.style.textShadow = `${shadowSize}px ${shadowSize}px 4px ${shadowColor}`;
      } else {
        span.style.textShadow = 'none';
      }
    } else if (styleProperty === 'webkitTextStroke') {
      const titleColor = localStorage.getItem('titleColor') || '#ffffff';
      span.style.webkitTextStroke = `${TITLE_STROKE_WIDTH} ${titleColor}`;
    } else {
      span.style[styleProperty] = 'initial';
    }
  });
}

/**
 * Applies all title configuration settings to span elements
 */
function applyTitleConfiguration() {
  const titleSpans = document.querySelectorAll("#messageDisplay span");
  const strokeEnabled = localStorage.getItem('titleBoxStroke') !== 'false';
  
  titleSpans.forEach(span => {
    const titleX = localStorage.getItem('titlePositionX') || '10';
    const titleY = localStorage.getItem('titlePositionY') || '10';
    span.style.left = `${titleX}px`;
    span.style.top = `${titleY}px`;
    
    const titleColor = localStorage.getItem('titleColor') || '#ffffff';
    span.style.color = titleColor;
    
    if (span.classList.contains('title-with-box')) {
      setTitleStroke(span, strokeEnabled);
    } else {
      setTitleStroke(span, false);
    }
    
    const titleFontSize = localStorage.getItem('titleFontSize');
    if (titleFontSize) {
      span.style.fontSize = `${titleFontSize}px`;
    }
    
    const titleFontWeight = localStorage.getItem('titleFontWeight');
    if (titleFontWeight) {
      span.style.fontWeight = titleFontWeight;
    }
    
    const titleSpacing = localStorage.getItem('titleSpacing');
    if (titleSpacing) {
      span.style.letterSpacing = `${titleSpacing}px`;
    }
    
    const titleShadowEnabled = localStorage.getItem('titleShadow') === 'true';
    if (titleShadowEnabled) {
      const shadowColor = localStorage.getItem('titleShadowColor') || '#000000';
      const shadowSize = localStorage.getItem('titleShadowSize') || '2';
      span.style.textShadow = `${shadowSize}px ${shadowSize}px 4px ${shadowColor}`;
    }
  });
}

/**
 * Applies title box state (with box or aligned)
 */
function applyTitleBoxState() {
  const titleBoxEnabled = localStorage.getItem('titleBoxEnabled') === 'true';
  const alignment = localStorage.getItem('titleAlignment') || 'left';
  const titleSpans = document.querySelectorAll("#messageDisplay span");
  
  if (titleBoxEnabled) {
    titleSpans.forEach(span => {
      span.classList.add('title-with-box');
      applyTitleBoxStyles(span);
    });
  } else {
    titleSpans.forEach(span => {
      span.classList.add(`title-align-${alignment}`);
      setTitleStroke(span, false);
    });
  }
}

/**
 * Handles incoming text messages and displays them with pre-calculated font size
 * This is the main message receiver for verse display
 */
messageChannel.onmessage = (event) => {
  const message = typeof event.data === 'string' 
    ? processVerseText(event.data) 
    : event.data;
  
  console.log('📨 Message received, pre-calculating font size...');
  
  const hasTitle = message.includes('<span>');
  let calculatedFontSize = null;
  
  if (window.preCalculateFontSize && containerElement) {
    const analysis = window.preCalculateFontSize(
      message,
      containerElement.clientWidth,
      containerElement.clientHeight,
      hasTitle
    );
    calculatedFontSize = analysis.fontSize;
    console.log(`✅ Pre-calculated: ${calculatedFontSize}px (before DOM injection)`);
  }
  
  messageDisplay.innerHTML = '';
  
  if (calculatedFontSize) {
    messageDisplay.style.fontSize = `${calculatedFontSize}px`;
    console.log(`🎨 fontSize applied BEFORE injection: ${calculatedFontSize}px`);
  } else {
    messageDisplay.style.fontSize = '';
    messageDisplay.style.removeProperty('font-size');
  }
  
  messageDisplay.innerHTML = message;
  console.log('✅ Content injected with pre-calculated size (no flash)');
  
  localStorage.setItem('savedMessage', message);

  applyTitleConfiguration();
  applyTitleBoxState();
  
  updateMessagePadding();

  messageDisplay.style.visibility = 'visible';
  messageDisplay.style.opacity = '1';
  
  console.log('✅ Text received with pre-calculated size');
};

settingsChannel.onmessage = (event) => {

  switch (Object.keys(event.data)?.[0]) {
    case 'selectedFont':
      const selectedFont = event.data['selectedFont'];
      containerElement.style.fontFamily = selectedFont;
      localStorage.setItem('fontFamily', selectedFont);
      console.log('✅ Font changed:', selectedFont);
      break;
    case 'opacityColor':
      const opacityColor = event.data['opacityColor'];
      containerElement.style.backgroundColor = opacityColor;
      localStorage.setItem('bgColor', opacityColor);
      break;
    case 'containerOpacity':
      const containerOpacity = event.data['containerOpacity'];
      containerElement.style.backgroundColor = containerOpacity;
      localStorage.setItem('bgColor', containerOpacity);
      break;
    case 'roundedCorner':
      const roundedCorner = event.data['roundedCorner'];
      containerElement.style.borderRadius = roundedCorner + "px";
      localStorage.setItem('borderRadius', roundedCorner);
      break;
    case 'selectedBgColor':
      const selectedBgColor = event.data['selectedBgColor'];
      containerElement.style.backgroundColor = selectedBgColor;
      localStorage.setItem('bgColor', selectedBgColor);
      break;
    case 'selectedFontColor':
      const selectedFontColor = event.data['selectedFontColor'];
      if (!localStorage.getItem('textGradient')) {
        containerElement.style.color = selectedFontColor;
      }
      localStorage.setItem('fontColor', selectedFontColor);
      break;
    case 'selectedTitleColor':
      const selectedTitleColor = event.data['selectedTitleColor'];
      const spans = document.querySelectorAll("#messageDisplay span");
      const strokeEnabledFromColor = localStorage.getItem('titleBoxStroke') !== 'false';
      spans.forEach(span => {
        span.style.color = selectedTitleColor;
        if (span.classList.contains('title-with-box')) {
          setTitleStroke(span, strokeEnabledFromColor);
        }
      });
      localStorage.setItem('titleColor', selectedTitleColor);
      break;
    case 'titleAlignment':
      const alignment = event.data['titleAlignment'];
      const allSpans = document.querySelectorAll("#messageDisplay span");
      allSpans.forEach(span => {
        if (!span.classList.contains('title-with-box')) {
          span.classList.remove('title-align-left', 'title-align-center', 'title-align-right');
          span.classList.add(`title-align-${alignment}`);
        }
      });
      localStorage.setItem('titleAlignment', alignment);
      console.log(`📐 Title alignment changed to: ${alignment}`);
      break;
    case 'titleBoxEnabled':
      const titleBoxEnabled = event.data['titleBoxEnabled'];
      const titleSpans = document.querySelectorAll("#messageDisplay span");
      titleSpans.forEach(span => {
        if (titleBoxEnabled) {
          span.classList.add('title-with-box');
          span.classList.remove('title-align-left', 'title-align-center', 'title-align-right');
          applyTitleBoxStyles(span);
          console.log('📦 Title box enabled');
        } else {
          span.classList.remove('title-with-box');
          span.removeAttribute('style');
          setTitleStroke(span, false);
          const savedAlignment = localStorage.getItem('titleAlignment') || 'left';
          span.classList.add(`title-align-${savedAlignment}`);
          console.log('📦 Title box disabled');
        }
      });
      localStorage.setItem('titleBoxEnabled', titleBoxEnabled);
      updateMessagePadding();
      break;
    
    case 'titleBoxSize':
      updateTitleBoxSize(event.data['titleBoxSize']);
      break;
    case 'titleBoxPadding':
      updateTitleBoxPadding(event.data['titleBoxPadding']);
      break;
    case 'titleBoxFullWidth':
      updateTitleBoxFullWidth(event.data['titleBoxFullWidth']);
      break;
    case 'titleBoxWidth':
      updateTitleBoxWidth(event.data['titleBoxWidth']);
      break;
    case 'titleBoxColor':
      updateTitleBoxColor(event.data['titleBoxColor']);
      break;
    case 'titleBoxStroke':
      updateTitleBoxStroke(event.data['titleBoxStroke']);
      break;
    case 'titleBoxOpacity':
      updateTitleBoxOpacity(event.data['titleBoxOpacity']);
      break;
    case 'titleBoxBorder':
      updateTitleBoxBorder(event.data['titleBoxBorder']);
      break;
    case 'titleBoxBorderColor':
      updateTitleBoxBorderColor(event.data['titleBoxBorderColor']);
      break;
    case 'titleBoxRadius':
      updateTitleBoxRadius(event.data['titleBoxRadius']);
      break;
    case 'titleBoxBlur':
      updateTitleBoxBlur(event.data['titleBoxBlur']);
      break;
    
    case 'titleShow':
      updateTitleShow(event.data['titleShow']);
      break;
    case 'titleFontSize':
      updateTitleFontSize(event.data['titleFontSize']);
      break;
    case 'titlePositionX':
      updateTitlePositionX(event.data['titlePositionX']);
      break;
    case 'titlePositionY':
      updateTitlePositionY(event.data['titlePositionY']);
      break;
    case 'titleSpacing':
      updateTitleSpacing(event.data['titleSpacing']);
      break;
    case 'titleFontWeight':
      updateTitleFontWeight(event.data['titleFontWeight']);
      break;
    case 'titleShadow':
      updateTitleShadow(event.data['titleShadow']);
      break;
    case 'titleShadowColor':
      updateTitleShadowColor(event.data['titleShadowColor']);
      break;
    case 'titleShadowSize':
      updateTitleShadowSize(event.data['titleShadowSize']);
      break;
    case 'titleStroke':
      updateTitleStroke(event.data['titleStroke']);
      break;
    case 'titleStrokeColor':
      updateTitleStrokeColor(event.data['titleStrokeColor']);
      break;
    case 'titleStrokeWidth':
      updateTitleStrokeWidth(event.data['titleStrokeWidth']);
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
    
    
    case 'backgroundType':
      const backgroundType = event.data['backgroundType'];
      localStorage.setItem('backgroundType', backgroundType);
      break;
      
    case 'backgroundGradient':
      const backgroundGradient = event.data['backgroundGradient'];
      containerElement.style.background = backgroundGradient;
      localStorage.setItem('backgroundGradient', backgroundGradient);
      break;
      
    case 'gradientColor2':
      const gradientColor2 = event.data['gradientColor2'];
      localStorage.setItem('gradientColor2', gradientColor2);
      break;
      
    case 'textGradient':
      const textGradient = event.data['textGradient'];
      if (textGradient) {
        messageDisplay.style.background = textGradient;
        messageDisplay.style.webkitBackgroundClip = 'text';
        messageDisplay.style.webkitTextFillColor = 'transparent';
        messageDisplay.style.backgroundClip = 'text';
        localStorage.setItem('textGradient', textGradient);
      } else {
        messageDisplay.style.background = 'none';
        messageDisplay.style.webkitBackgroundClip = 'initial';
        messageDisplay.style.webkitTextFillColor = 'initial';
        messageDisplay.style.backgroundClip = 'initial';
        messageDisplay.style.color = localStorage.getItem('fontColor') || '#ffffff';
        localStorage.removeItem('textGradient');
      }
      break;
      
    case 'textShadow':
      const textShadow = event.data['textShadow'];
      if (textShadow === 'none') {
        applyTextEffectToContent('textShadow', 'none');
        localStorage.removeItem('textShadow');
      } else {
        applyTextEffectToContent('textShadow', textShadow);
        localStorage.setItem('textShadow', textShadow);
      }
      break;
      
    case 'textStroke':
      const textStroke = event.data['textStroke'];
      if (textStroke) {
        applyTextEffectToContent('webkitTextStroke', `${textStroke.width} ${textStroke.color}`);
        localStorage.setItem('textStroke', JSON.stringify(textStroke));
      } else {
        applyTextEffectToContent('webkitTextStroke', 'none');
        localStorage.removeItem('textStroke');
      }
      break;
      
    case 'textGlow':
      const textGlow = event.data['textGlow'];
      if (textGlow) {
        const existingShadow = localStorage.getItem('textShadow');
        const combinedShadow = existingShadow ? `${existingShadow}, ${textGlow}` : textGlow;
        applyTextEffectToContent('textShadow', combinedShadow);
        localStorage.setItem('textGlow', textGlow);
      } else {
        const existingShadow = localStorage.getItem('textShadow');
        applyTextEffectToContent('textShadow', existingShadow || 'none');
        localStorage.removeItem('textGlow');
      }
      break;
      
    case 'containerPadding':
      const containerPadding = event.data['containerPadding'];
      localStorage.setItem('containerPadding', containerPadding);
      updateMessagePadding();
      console.log('✅ Padding updated:', containerPadding);
      break;

    case 'containerMargin':
      const containerMargin = event.data['containerMargin'];
      messageDisplay.style.margin = containerMargin + 'px';
      localStorage.setItem('containerMargin', containerMargin);
      console.log('✅ Margin updated:', containerMargin);
      break;
      
    case 'textAnimation':
      const textAnimation = event.data['textAnimation'];
      const animationDuration = event.data['animationDuration'] || '1s';
      
      messageDisplay.classList.remove('fade-in', 'slide-in-left', 'slide-in-right', 
                                     'slide-in-top', 'slide-in-bottom', 'zoom-in', 'typewriter');
      
      if (textAnimation && textAnimation !== 'none') {
        messageDisplay.style.animationDuration = animationDuration;
        
        switch (textAnimation) {
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
      
      localStorage.setItem('textAnimation', textAnimation);
      localStorage.setItem('animationDuration', animationDuration);
      break;
  }
};

visibilityChannel.onmessage = (event) => {
  if (event.data === 'hidden') {
    containerElement.style.display = 'none';
    console.log('🙈 Container hidden');
  } else {
    containerElement.style.display = 'flex';
    const titleShowState = localStorage.getItem('titleShow');
    if (titleShowState === 'true' || titleShowState === null) {
      messageDisplay.style.display = 'flex';
    }
    console.log('👁️ Container shown');
  }
};

fontAdjustChannel.onmessage = (event) => {
  if (event.data === 'adjust') {
    console.log('Manual font adjustment requested');
    if (window.manualAdjustFontSize) {
      window.manualAdjustFontSize();
    } else if (window.adjustFontSize) {
      window.adjustFontSize();
    }
  }
};

function applyTitleBoxStyles(titleSpan) {
  const configs = {
    size: localStorage.getItem('titleBoxSize') || 'medium',
    padding: localStorage.getItem('titleBoxPadding') || '12',
    fullWidth: localStorage.getItem('titleBoxFullWidth') === 'true',
    color: localStorage.getItem('titleBoxColor') || '#000000',
    opacity: localStorage.getItem('titleBoxOpacity') || '70',
    border: localStorage.getItem('titleBoxBorder') || '2',
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
    applyFullWidthStyles(titleSpan);
  } else {
    titleSpan.classList.remove('full-width');
  }

  const bgColor = hexToRgba(configs.color, configs.opacity / 100);
  titleSpan.style.backgroundColor = bgColor;

  if (configs.border > 0) {
    titleSpan.style.border = `${configs.border}px solid currentColor`;
  } else {
    titleSpan.style.border = 'none';
  }

  setTitleStroke(titleSpan, configs.stroke);

  if (!configs.fullWidth) {
    titleSpan.style.borderRadius = `${configs.radius}px`;
  }

  if (configs.blur) {
    titleSpan.style.backdropFilter = 'blur(5px)';
  } else {
    titleSpan.style.backdropFilter = 'none';
  }

  updateMessagePadding();
}

function updateTitleBoxSize(size) {
  const titleSpans = document.querySelectorAll("#messageDisplay span.title-with-box");
  titleSpans.forEach(span => {
    span.classList.remove('size-small', 'size-medium', 'size-large');
    if (size !== 'custom') {
      span.classList.add(`size-${size}`);
      span.style.padding = '';
    }
  });
  localStorage.setItem('titleBoxSize', size);
}

function updateTitleBoxPadding(padding) {
  const titleSpans = document.querySelectorAll("#messageDisplay span.title-with-box");
  const size = localStorage.getItem('titleBoxSize');
  if (size === 'custom') {
    titleSpans.forEach(span => {
      span.style.padding = `${padding}px ${parseInt(padding) * 1.5}px`;
    });
  }
  localStorage.setItem('titleBoxPadding', padding);
}

function updateTitleBoxFullWidth(fullWidth) {
  const titleSpans = document.querySelectorAll("#messageDisplay span.title-with-box");
  titleSpans.forEach(span => {
    if (fullWidth) {
      span.classList.add('full-width');
      applyFullWidthStyles(span);
    } else {
      span.classList.remove('full-width');
      
      span.style.transform = '';
      span.style.width = '';
      span.style.borderLeft = '';
      
      const radius = localStorage.getItem('titleBoxRadius') || '6';
      span.style.borderRadius = `${radius}px`;
    }
  });
  localStorage.setItem('titleBoxFullWidth', fullWidth);
}

function updateTitleBoxWidth(width) {
  const titleSpans = document.querySelectorAll("#messageDisplay span.title-with-box.full-width");
  titleSpans.forEach(span => {
    applyFullWidthStyles(span);
  });
  localStorage.setItem('titleBoxWidth', width);
}

function applyFullWidthStyles(span) {

  const currentLeft = parseInt(span.style.left) || parseInt(localStorage.getItem('titlePositionX')) || 10;

  const widthPercent = parseInt(localStorage.getItem('titleBoxWidth')) || 100;

  const totalWidth = `calc(${widthPercent}% + ${currentLeft}px)`;

  const titleAlignment = localStorage.getItem('titleFullWidthAlignment') || 'center';

  span.style.transform = `translateX(-${currentLeft}px)`;
  span.style.width = totalWidth;
  span.style.borderLeft = 'none';
  span.style.borderRadius = '0';
  span.style.textAlign = titleAlignment;
  
  console.log(`📐 Full-width title: alignment ${titleAlignment}`);
}

function updateTitleBoxColor(color) {
  const opacity = localStorage.getItem('titleBoxOpacity') || '70';
  const bgColor = hexToRgba(color, opacity / 100);
  const strokeEnabled = localStorage.getItem('titleBoxStroke') !== 'false';
  const titleSpans = document.querySelectorAll("#messageDisplay span.title-with-box");
  titleSpans.forEach(span => {
    span.style.backgroundColor = bgColor;
    setTitleStroke(span, strokeEnabled);
  });
  localStorage.setItem('titleBoxColor', color);
}

function updateTitleBoxOpacity(opacity) {
  const color = localStorage.getItem('titleBoxColor') || '#000000';
  const bgColor = hexToRgba(color, opacity / 100);
  const strokeEnabled = localStorage.getItem('titleBoxStroke') !== 'false';
  const titleSpans = document.querySelectorAll("#messageDisplay span.title-with-box");
  titleSpans.forEach(span => {
    span.style.backgroundColor = bgColor;
    setTitleStroke(span, strokeEnabled);
  });
  localStorage.setItem('titleBoxOpacity', opacity);
}

function updateTitleBoxBorder(border) {
  const borderColor = localStorage.getItem('titleBoxBorderColor') || '#ffffff';
  const titleSpans = document.querySelectorAll("#messageDisplay span.title-with-box");
  titleSpans.forEach(span => {
    if (border > 0) {
      span.style.border = `${border}px solid ${borderColor}`;
    } else {
      span.style.border = 'none';
    }
  });
  localStorage.setItem('titleBoxBorder', border);
}

function updateTitleBoxBorderColor(color) {
  const border = localStorage.getItem('titleBoxBorder') || '1';
  const titleSpans = document.querySelectorAll("#messageDisplay span.title-with-box");
  titleSpans.forEach(span => {
    if (border > 0) {
      span.style.border = `${border}px solid ${color}`;
    }
  });
  localStorage.setItem('titleBoxBorderColor', color);
}

function updateTitleBoxRadius(radius) {
  const fullWidth = localStorage.getItem('titleBoxFullWidth') === 'true';
  if (!fullWidth) {
    const titleSpans = document.querySelectorAll("#messageDisplay span.title-with-box");
    titleSpans.forEach(span => {
      span.style.borderRadius = `${radius}px`;
    });
  }
  localStorage.setItem('titleBoxRadius', radius);
}

function updateTitleBoxBlur(blur) {
  const titleSpans = document.querySelectorAll("#messageDisplay span.title-with-box");
  titleSpans.forEach(span => {
    if (blur) {
      span.style.backdropFilter = 'blur(5px)';
    } else {
      span.style.backdropFilter = 'none';
    }
  });
  localStorage.setItem('titleBoxBlur', blur);
}

function updateTitleBoxStroke(enabled) {
  const titleSpans = document.querySelectorAll("#messageDisplay span.title-with-box");
  titleSpans.forEach(span => {
    setTitleStroke(span, enabled);
  });
  localStorage.setItem('titleBoxStroke', enabled);
}

function updateTitleShow(show) {
  const messageDisplay = document.getElementById("messageDisplay");
  if (messageDisplay) {
    messageDisplay.style.display = show ? 'block' : 'none';
  }
  localStorage.setItem('titleShow', show);
}

function updateTitleFontSize(fontSize) {
  const titleSpans = document.querySelectorAll("#messageDisplay span");
  titleSpans.forEach(span => {
    span.style.fontSize = `${fontSize}px`;
  });
  localStorage.setItem('titleFontSize', fontSize);
}

function updateTitlePositionX(positionX) {
  const titleSpans = document.querySelectorAll("#messageDisplay span");
  titleSpans.forEach(span => {
    span.style.left = `${positionX}px`;
  });
  localStorage.setItem('titlePositionX', positionX);
}

function updateTitlePositionY(positionY) {
  const titleSpans = document.querySelectorAll("#messageDisplay span");
  titleSpans.forEach(span => {
    span.style.top = `${positionY}px`;
  });
  localStorage.setItem('titlePositionY', positionY);
}

function updateTitleSpacing(spacing) {
  const titleSpans = document.querySelectorAll("#messageDisplay span");
  titleSpans.forEach(span => {
    span.style.letterSpacing = `${spacing}px`;
  });
  localStorage.setItem('titleSpacing', spacing);
}

function updateTitleFontWeight(fontWeight) {
  const titleSpans = document.querySelectorAll("#messageDisplay span");
  titleSpans.forEach(span => {
    span.style.fontWeight = fontWeight;
  });
  localStorage.setItem('titleFontWeight', fontWeight);
}

function updateTitleShadow(shadow) {
  const titleSpans = document.querySelectorAll("#messageDisplay span");
  if (shadow) {
    const shadowColor = localStorage.getItem('titleShadowColor') || '#000000';
    const shadowSize = localStorage.getItem('titleShadowSize') || '2';
    titleSpans.forEach(span => {
      span.style.textShadow = `${shadowSize}px ${shadowSize}px 4px ${shadowColor}`;
    });
  } else {
    titleSpans.forEach(span => {
      span.style.textShadow = 'none';
    });
  }
  localStorage.setItem('titleShadow', shadow);
}

function updateTitleShadowColor(color) {
  const shadow = localStorage.getItem('titleShadow') === 'true';
  if (shadow) {
    const shadowSize = localStorage.getItem('titleShadowSize') || '2';
    const titleSpans = document.querySelectorAll("#messageDisplay span");
    titleSpans.forEach(span => {
      span.style.textShadow = `${shadowSize}px ${shadowSize}px 4px ${color}`;
    });
  }
  localStorage.setItem('titleShadowColor', color);
}

function updateTitleShadowSize(size) {
  const shadow = localStorage.getItem('titleShadow') === 'true';
  if (shadow) {
    const shadowColor = localStorage.getItem('titleShadowColor') || '#000000';
    const titleSpans = document.querySelectorAll("#messageDisplay span");
    titleSpans.forEach(span => {
      span.style.textShadow = `${size}px ${size}px 4px ${shadowColor}`;
    });
  }
  localStorage.setItem('titleShadowSize', size);
}

function updateTitleStroke(enabled) {
  const titleSpans = document.querySelectorAll("#messageDisplay span");
  
  if (enabled) {
    const strokeColor = localStorage.getItem('titleStrokeColor') || '#000000';
    const strokeWidth = localStorage.getItem('titleStrokeWidth') || '1';
    titleSpans.forEach(span => {
      span.style.webkitTextStroke = `${strokeWidth}px ${strokeColor}`;
    });
  } else {
    titleSpans.forEach(span => {
      span.style.webkitTextStroke = 'none';
    });
  }
  
  localStorage.setItem('titleStroke', enabled);
}

function updateTitleStrokeColor(color) {
  const strokeEnabled = localStorage.getItem('titleStroke') === 'true';
  if (strokeEnabled) {
    const strokeWidth = localStorage.getItem('titleStrokeWidth') || '1';
    const titleSpans = document.querySelectorAll("#messageDisplay span");
    titleSpans.forEach(span => {
      span.style.webkitTextStroke = `${strokeWidth}px ${color}`;
    });
  }
  localStorage.setItem('titleStrokeColor', color);
}

function updateTitleStrokeWidth(width) {
  const strokeEnabled = localStorage.getItem('titleStroke') === 'true';
  if (strokeEnabled) {
    const strokeColor = localStorage.getItem('titleStrokeColor') || '#000000';
    const titleSpans = document.querySelectorAll("#messageDisplay span");
    titleSpans.forEach(span => {
      span.style.webkitTextStroke = `${width}px ${strokeColor}`;
    });
  }
  localStorage.setItem('titleStrokeWidth', width);
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

window.applyTitleBoxStyles = applyTitleBoxStyles;
window.updateMessagePadding = updateMessagePadding;

/**
 * Initialize browser overlay state
 * Sets the container as hidden by default on page load
 */
function initializeBrowserState() {
  if (containerElement) {
    containerElement.style.display = 'none';
    console.log('🔒 Browser overlay initialized as hidden');
  }
  
  if (messageDisplay) {
    messageDisplay.innerHTML = '';
    console.log('🧹 Message display cleared');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeBrowserState);
} else {
  initializeBrowserState();
}

export { 
  messageChannel as channel, 
  visibilityChannel as bgContent, 
  settingsChannel, 
  fontAdjustChannel as adjustFontChannel 
};
