const bgContainer = document.getElementById("bg-container");
const messageDisplay = document.getElementById("messageDisplay");
const channel = new BroadcastChannel("myChannel");
const bgContent = new BroadcastChannel("bgContent");
const settingsChannel = new BroadcastChannel("settings");
const adjustFontChannel = new BroadcastChannel("adjustFont");
const savedTitleColor = localStorage.getItem('titleColor');

// Función para aplicar efectos de texto solo al contenido (no a los títulos)
function applyTextEffectToContent(styleProperty, value) {
  // Aplicar al contenedor principal para el texto base
  messageDisplay.style[styleProperty] = value;
  
  // Remover el efecto de todos los spans de título para que no se vean afectados
  const titleSpans = document.querySelectorAll("#messageDisplay span");
  titleSpans.forEach(span => {
    if (styleProperty === 'textShadow') {
      // Para títulos, mantener solo su propia sombra si la tienen configurada
      const titleShadowEnabled = localStorage.getItem('titleShadow') === 'true';
      if (titleShadowEnabled) {
        const shadowSize = localStorage.getItem('titleShadowSize') || '2';
        const shadowColor = localStorage.getItem('titleShadowColor') || '#000000';
        span.style.textShadow = `${shadowSize}px ${shadowSize}px 4px ${shadowColor}`;
      } else {
        span.style.textShadow = 'none';
      }
    } else if (styleProperty === 'webkitTextStroke') {
      // Para títulos, mantener solo su propio borde si lo tienen
      const titleColor = localStorage.getItem('titleColor') || '#ffffff';
      // Mantener el borde del título independiente de los efectos del texto
      span.style.webkitTextStroke = `1.5px ${titleColor}`;
    } else {
      // Para otros efectos, asegurar que los títulos no los hereden
      span.style[styleProperty] = 'initial';
    }
  });
}

// Text channel
channel.onmessage = (event) => {
  const message = event.data;
  messageDisplay.innerHTML = message;
  localStorage.setItem('savedMessage', message);

  // Aplicar todas las configuraciones del título a los nuevos spans
  const dspans = document.querySelectorAll("#messageDisplay span");
  dspans.forEach(dspan => {
    // Aplicar posicionamiento
    const savedTitleX = localStorage.getItem('titlePositionX') || '10';
    const savedTitleY = localStorage.getItem('titlePositionY') || '10';
    dspan.style.left = savedTitleX + 'px';
    dspan.style.top = savedTitleY + 'px';
    
    // Aplicar color (guardado o por defecto)
    const savedTitleColor = localStorage.getItem('titleColor') || '#ffffff';
    dspan.style.color = savedTitleColor;
    // Aplicar color al stroke si tiene recuadro
    if (dspan.classList.contains('title-with-box')) {
      dspan.style.webkitTextStroke = `1.5px ${savedTitleColor}`;
      dspan.style.textStroke = `1.5px ${savedTitleColor}`;
    }
    
    // Aplicar tamaño de fuente
    const savedTitleFontSize = localStorage.getItem('titleFontSize');
    if (savedTitleFontSize) {
      dspan.style.fontSize = savedTitleFontSize + 'px';
    }
    
    // Aplicar peso de fuente
    const savedTitleFontWeight = localStorage.getItem('titleFontWeight');
    if (savedTitleFontWeight) {
      dspan.style.fontWeight = savedTitleFontWeight;
    }
    
    // Aplicar espaciado entre letras
    const savedTitleSpacing = localStorage.getItem('titleSpacing');
    if (savedTitleSpacing) {
      dspan.style.letterSpacing = savedTitleSpacing + 'px';
    }
    
    // Aplicar sombra personalizada
    const savedTitleShadow = localStorage.getItem('titleShadow');
    if (savedTitleShadow === 'true') {
      const shadowColor = localStorage.getItem('titleShadowColor') || '#000000';
      const shadowSize = localStorage.getItem('titleShadowSize') || '2';
      dspan.style.textShadow = `${shadowSize}px ${shadowSize}px 4px ${shadowColor}`;
    }
    

  });
  
  // Aplicar estado del recuadro a nuevos títulos
  const savedTitleBox = localStorage.getItem('titleBoxEnabled');
  if (savedTitleBox === 'true') {
    const dspans2 = document.querySelectorAll("#messageDisplay span");
    dspans2.forEach(dspan => {
      dspan.classList.add('title-with-box');
      applyTitleBoxStyles(dspan);
    });
  }
  
  // Asegurar que el texto sea visible y ajustar el tamaño
  messageDisplay.style.visibility = 'visible';
  messageDisplay.style.opacity = '1';
  
  // No auto-ajustar - solo mostrar el texto
  console.log('Texto recibido, sin auto-ajuste');
};

// settings channel
settingsChannel.onmessage = (event) => {

  switch (Object.keys(event.data)?.[0]) {
    case 'selectedFont':
      const selectedFont = event.data['selectedFont'];
      bgContainer.style.fontFamily = selectedFont;
      localStorage.setItem('fontFamily', selectedFont);
      // Ajustar tamaño después de cambiar la fuente
      if (window.forceAdjustFontSize) {
        window.forceAdjustFontSize();
      }
      break;
    case 'opacityColor':
      const opacityColor = event.data['opacityColor'];
      bgContainer.style.backgroundColor = opacityColor;
      localStorage.setItem('bgColor', opacityColor);
      break;
    case 'containerOpacity':
      const containerOpacity = event.data['containerOpacity'];
      bgContainer.style.backgroundColor = containerOpacity;
      localStorage.setItem('bgColor', containerOpacity);
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
      // Solo aplicar color sólido si no hay degradado activo
      if (!localStorage.getItem('textGradient')) {
        bgContainer.style.color = selectedFontColor;
      }
      localStorage.setItem('fontColor', selectedFontColor);
      break;
    case 'selectedTitleColor':
      const selectedTitleColor = event.data['selectedTitleColor'];
      const spans = document.querySelectorAll("#messageDisplay span");
      spans.forEach(span => {
        span.style.color = selectedTitleColor;
        // Actualizar también el color del stroke si tiene recuadro
        if (span.classList.contains('title-with-box')) {
          span.style.webkitTextStroke = `1.5px ${selectedTitleColor}`;
          span.style.textStroke = `1.5px ${selectedTitleColor}`;
        }
      });
      localStorage.setItem('titleColor', selectedTitleColor);
      break;
    case 'titleBoxEnabled':
      const titleBoxEnabled = event.data['titleBoxEnabled'];
      const titleSpans = document.querySelectorAll("#messageDisplay span");
      titleSpans.forEach(span => {
        if (titleBoxEnabled) {
          span.classList.add('title-with-box');
          applyTitleBoxStyles(span);
          console.log('📦 Recuadro del título activado');
        } else {
          span.classList.remove('title-with-box');
          span.removeAttribute('style');
          console.log('📦 Recuadro del título desactivado');
        }
      });
      localStorage.setItem('titleBoxEnabled', titleBoxEnabled);
      break;
    
    // Nuevas configuraciones del recuadro del título
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
    case 'titleBoxOpacity':
      updateTitleBoxOpacity(event.data['titleBoxOpacity']);
      break;
    case 'titleBoxBorder':
      updateTitleBoxBorder(event.data['titleBoxBorder']);
      break;
    case 'titleBoxRadius':
      updateTitleBoxRadius(event.data['titleBoxRadius']);
      break;
    case 'titleBoxBlur':
      updateTitleBoxBlur(event.data['titleBoxBlur']);
      break;
    
    // Configuraciones del título
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
    
    // ========== NUEVAS FUNCIONALIDADES AVANZADAS ==========
    
    case 'backgroundType':
      const backgroundType = event.data['backgroundType'];
      localStorage.setItem('backgroundType', backgroundType);
      break;
      
    case 'backgroundGradient':
      const backgroundGradient = event.data['backgroundGradient'];
      bgContainer.style.background = backgroundGradient;
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
        // Combinar con sombra existente si la hay
        const existingShadow = localStorage.getItem('textShadow');
        const combinedShadow = existingShadow ? `${existingShadow}, ${textGlow}` : textGlow;
        applyTextEffectToContent('textShadow', combinedShadow);
        localStorage.setItem('textGlow', textGlow);
      } else {
        // Mantener solo la sombra normal si existe
        const existingShadow = localStorage.getItem('textShadow');
        applyTextEffectToContent('textShadow', existingShadow || 'none');
        localStorage.removeItem('textGlow');
      }
      break;
      
    case 'containerPadding':
      const containerPadding = event.data['containerPadding'];
      bgContainer.style.padding = containerPadding + 'px';
      localStorage.setItem('containerPadding', containerPadding);
      // Ajustar tamaño después de cambiar el padding
      if (window.forceAdjustFontSize) {
        window.forceAdjustFontSize();
      }
      break;
      
    case 'textAnimation':
      const textAnimation = event.data['textAnimation'];
      const animationDuration = event.data['animationDuration'] || '1s';
      
      // Remover clases de animación existentes
      messageDisplay.classList.remove('fade-in', 'slide-in-left', 'slide-in-right', 
                                     'slide-in-top', 'slide-in-bottom', 'zoom-in', 'typewriter');
      
      if (textAnimation && textAnimation !== 'none') {
        messageDisplay.style.animationDuration = animationDuration;
        
        // Agregar clase según el tipo de animación
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

// container hidden or shown
bgContent.onmessage = (event) => {
  if (event.data === 'hidden') {
    bgContainer.style.display = 'none';
  } else {
    bgContainer.style.display = 'inline';
  }
};

// Ajuste manual de fuente cuando se solicita específicamente
adjustFontChannel.onmessage = (event) => {
  if (event.data === 'adjust') {
    console.log('Solicitado ajuste manual de fuente');
    if (window.manualAdjustFontSize) {
      window.manualAdjustFontSize();
    } else if (window.adjustFontSize) {
      window.adjustFontSize();
    }
  }
};

// Funciones helper para configuraciones del recuadro del título
function applyTitleBoxStyles(titleSpan) {
  const configs = {
    size: localStorage.getItem('titleBoxSize') || 'medium',
    padding: localStorage.getItem('titleBoxPadding') || '12',
    fullWidth: localStorage.getItem('titleBoxFullWidth') === 'true',
    color: localStorage.getItem('titleBoxColor') || '#000000',
    opacity: localStorage.getItem('titleBoxOpacity') || '70',
    border: localStorage.getItem('titleBoxBorder') || '2',
    radius: localStorage.getItem('titleBoxRadius') || '6',
    blur: localStorage.getItem('titleBoxBlur') !== 'false'
  };

  // Aplicar tamaño
  titleSpan.classList.remove('size-small', 'size-medium', 'size-large');
  if (configs.size === 'custom') {
    titleSpan.style.padding = `${configs.padding}px ${parseInt(configs.padding) * 1.5}px`;
  } else {
    titleSpan.classList.add(`size-${configs.size}`);
  }

  // Aplicar ancho completo
  if (configs.fullWidth) {
    titleSpan.classList.add('full-width');
    applyFullWidthStyles(titleSpan);
  } else {
    titleSpan.classList.remove('full-width');
  }

  // Aplicar color de fondo
  const bgColor = hexToRgba(configs.color, configs.opacity / 100);
  titleSpan.style.backgroundColor = bgColor;

  // Aplicar borde
  if (configs.border > 0) {
    titleSpan.style.border = `${configs.border}px solid currentColor`;
  } else {
    titleSpan.style.border = 'none';
  }

  // Aplicar radio de borde
  if (!configs.fullWidth) {
    titleSpan.style.borderRadius = `${configs.radius}px`;
  }

  // Aplicar desenfoque
  if (configs.blur) {
    titleSpan.style.backdropFilter = 'blur(5px)';
  } else {
    titleSpan.style.backdropFilter = 'none';
  }
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
      
      // Restaurar estado normal
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
  // Obtener la posición actual del título
  const currentLeft = parseInt(span.style.left) || parseInt(localStorage.getItem('titlePositionX')) || 10;
  
  // Obtener el ancho personalizado
  const widthPercent = parseInt(localStorage.getItem('titleBoxWidth')) || 100;
  
  // Calcular el ancho total basado en el porcentaje
  const totalWidth = `calc(${widthPercent}% + ${currentLeft}px)`;
  
  // Obtener alineación del texto para ancho completo
  const titleAlignment = localStorage.getItem('titleFullWidthAlignment') || 'center';
  
  // Aplicar estilos
  span.style.transform = `translateX(-${currentLeft}px)`;
  span.style.width = totalWidth;
  span.style.borderLeft = 'none';
  span.style.borderRadius = '0';
  
  // NUEVA FUNCIONALIDAD: Aplicar alineación del texto
  span.style.textAlign = titleAlignment;
  console.log(`📐 Título ancho completo: alineación ${titleAlignment}`);
}

function updateTitleBoxColor(color) {
  const opacity = localStorage.getItem('titleBoxOpacity') || '70';
  const bgColor = hexToRgba(color, opacity / 100);
  const titleSpans = document.querySelectorAll("#messageDisplay span.title-with-box");
  titleSpans.forEach(span => {
    span.style.backgroundColor = bgColor;
  });
  localStorage.setItem('titleBoxColor', color);
}

function updateTitleBoxOpacity(opacity) {
  const color = localStorage.getItem('titleBoxColor') || '#000000';
  const bgColor = hexToRgba(color, opacity / 100);
  const titleSpans = document.querySelectorAll("#messageDisplay span.title-with-box");
  titleSpans.forEach(span => {
    span.style.backgroundColor = bgColor;
  });
  localStorage.setItem('titleBoxOpacity', opacity);
}

function updateTitleBoxBorder(border) {
  const titleSpans = document.querySelectorAll("#messageDisplay span.title-with-box");
  titleSpans.forEach(span => {
    if (border > 0) {
      span.style.border = `${border}px solid currentColor`;
    } else {
      span.style.border = 'none';
    }
  });
  localStorage.setItem('titleBoxBorder', border);
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

// Funciones para configuración del título
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

// Función helper para convertir hex a rgba
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Exponer funciones globalmente para uso desde otros módulos
window.applyTitleBoxStyles = applyTitleBoxStyles;

export { channel, bgContent, settingsChannel, adjustFontChannel };
