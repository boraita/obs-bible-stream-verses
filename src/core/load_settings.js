// Check if a background color is saved in localStorage
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

// Obtener elementos del DOM primero
const bgContainer = document.getElementById("bg-container");
const messageDisplay = document.getElementById("messageDisplay");

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
        const shadowSize = localStorage.getItem('titleShadowSize') || '1';
        const shadowColor = localStorage.getItem('titleShadowColor') || '#000000';
        span.style.textShadow = `${shadowSize}px ${shadowSize}px 2px ${shadowColor}`;
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

// Nuevas configuraciones avanzadas
const savedBackgroundGradient = localStorage.getItem('backgroundGradient');
const savedTextGradient = localStorage.getItem('textGradient');
const savedTextShadow = localStorage.getItem('textShadow');
const savedTextStroke = localStorage.getItem('textStroke');
const savedTextGlow = localStorage.getItem('textGlow');
const savedContainerPadding = localStorage.getItem('containerPadding');
const savedContainerOpacity = localStorage.getItem('containerOpacity');
const savedRoundedCorner = localStorage.getItem('roundedCorner');
const savedTextAnimation = localStorage.getItem('textAnimation');
const savedAnimationDuration = localStorage.getItem('animationDuration');

// Aplicar valores por defecto si no existen configuraciones guardadas
if (!localStorage.getItem('bgColor')) {
    // Fondo transparente por defecto para streaming minimalista
    const defaultBgColor = 'rgba(0, 0, 0, 0)';
    if (bgContainer) bgContainer.style.backgroundColor = defaultBgColor;
}

if (!localStorage.getItem('borderRadius')) {
    // Esquinas por defecto 5px
    if (bgContainer) bgContainer.style.borderRadius = '5px';
}

if (!localStorage.getItem('containerPadding')) {
    // Padding por defecto más minimalista para streaming
    if (bgContainer) bgContainer.style.padding = '8px';
}

if (savedMessage) {
    messageDisplay.innerHTML = savedMessage;
}

// Aplicar fondo (degradado o sólido)
if (savedBackgroundGradient) {
    bgContainer.style.background = savedBackgroundGradient;
} else if (savedBgColor) {
    // Si hay opacidad guardada, aplicarla al color
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

// Aplicar color de texto o degradado
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

// Aplicar configuraciones del título
const savedTitleShow = localStorage.getItem('titleShow');
const savedTitleFontSize = localStorage.getItem('titleFontSize');
const savedTitlePositionX = localStorage.getItem('titlePositionX');
const savedTitlePositionY = localStorage.getItem('titlePositionY');
const savedTitleSpacing = localStorage.getItem('titleSpacing');
const savedTitleFontWeight = localStorage.getItem('titleFontWeight');
const savedTitleShadow = localStorage.getItem('titleShadow');
const savedTitleShadowColor = localStorage.getItem('titleShadowColor');
const savedTitleShadowSize = localStorage.getItem('titleShadowSize');
const savedTitleBoxMargin = localStorage.getItem('titleBoxMargin');

// Aplicar visibilidad del título
if (savedTitleShow !== null) {
    messageDisplay.style.display = savedTitleShow === 'true' ? 'block' : 'none';
}

// Aplicar posición del título a los spans
const titleSpans = document.querySelectorAll("#messageDisplay span");
if (savedTitlePositionX && titleSpans.length > 0) {
    titleSpans.forEach(span => {
        span.style.left = `${savedTitlePositionX}px`;
    });
} else if (titleSpans.length > 0) {
    // Aplicar posición por defecto si no hay configuración guardada
    titleSpans.forEach(span => {
        span.style.left = '10px';
    });
}

if (savedTitlePositionY && titleSpans.length > 0) {
    titleSpans.forEach(span => {
        span.style.top = `${savedTitlePositionY}px`;
    });
} else if (titleSpans.length > 0) {
    // Aplicar posición por defecto si no hay configuración guardada
    titleSpans.forEach(span => {
        span.style.top = '10px';
    });
}

// Aplicar color del título (guardado o por defecto)
const titleColor = savedTitleColor || '#ffffff'; // Blanco por defecto
const dspans = document.querySelectorAll("#messageDisplay span");
dspans.forEach(dspan => {
    dspan.style.color = titleColor;
    // Aplicar color al stroke si tiene recuadro
    if (dspan.classList.contains('title-with-box')) {
        dspan.style.webkitTextStroke = `1.5px ${titleColor}`;
        dspan.style.textStroke = `1.5px ${titleColor}`;
    }
});

// Aplicar configuraciones adicionales del título
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
        
        // Aplicar sombra del título
        if (savedTitleShadow === 'true') {
            const shadowColor = savedTitleShadowColor || '#000000';
            const shadowSize = savedTitleShadowSize || '2';
            span.style.textShadow = `${shadowSize}px ${shadowSize}px 2px ${shadowColor}`;
        }
    });
}

// Aplicar estado del recuadro del título
const savedTitleBox = localStorage.getItem('titleBoxEnabled');
if (savedTitleBox === 'true') {
    const titleSpans = document.querySelectorAll("#messageDisplay span");
    titleSpans.forEach(span => {
        span.classList.add('title-with-box');
        // Aplicar configuraciones avanzadas del recuadro
        applyInitialTitleBoxStyles(span);
    });
}

// Función para aplicar estilos iniciales del recuadro del título
function applyInitialTitleBoxStyles(titleSpan) {
    const configs = {
        size: localStorage.getItem('titleBoxSize') || 'medium',
        padding: localStorage.getItem('titleBoxPadding') || '8',
        margin: localStorage.getItem('titleBoxMargin') || '10',
        fullWidth: localStorage.getItem('titleBoxFullWidth') === 'true',
        color: localStorage.getItem('titleBoxColor') || '#ffffff',
        opacity: localStorage.getItem('titleBoxOpacity') || '80',
        border: localStorage.getItem('titleBoxBorder') || '1',
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
    }

    // Aplicar color de fondo
    const r = parseInt(configs.color.slice(1, 3), 16);
    const g = parseInt(configs.color.slice(3, 5), 16);
    const b = parseInt(configs.color.slice(5, 7), 16);
    const bgColor = `rgba(${r}, ${g}, ${b}, ${configs.opacity / 100})`;
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
    } else {
        titleSpan.style.borderRadius = '0';
    }

    // Aplicar desenfoque
    if (configs.blur) {
        titleSpan.style.backdropFilter = 'blur(5px)';
    } else {
        titleSpan.style.backdropFilter = 'none';
    }

    // Aplicar margen
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

// Aplicar efectos de texto avanzados
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
    // Limpiar cualquier borde de texto previo si no hay configuración guardada
    applyTextEffectToContent('webkitTextStroke', 'none');
}

if (savedContainerPadding) {
    bgContainer.style.padding = savedContainerPadding + 'px';
}

// Aplicar animación si está configurada
if (savedTextAnimation && savedTextAnimation !== 'none') {
    if (savedAnimationDuration) {
        messageDisplay.style.animationDuration = savedAnimationDuration;
    }
    
    // Agregar clase de animación
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

// Aplicar configuraciones del contenedor que faltaban

if (savedRoundedCorner && bgContainer) {
    bgContainer.style.borderRadius = savedRoundedCorner + 'px';
}

if (savedContainerPadding && bgContainer) {
    bgContainer.style.padding = savedContainerPadding + 'px';
}

// Aplicar opacidad del contenedor
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

// Aplicar esquinas redondeadas
if (savedRoundedCorner && bgContainer) {
    bgContainer.style.borderRadius = savedRoundedCorner + 'px';
}