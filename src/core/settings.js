import { hexToRgba } from "./utils";

/* ==========================================
   🎛️ ELEMENTOS DEL DOM - CONFIGURACIÓN
   ========================================== */

// 📡 Canal de comunicación
const settingsChannel = new BroadcastChannel("settings");

// 🎨 ESTILOS BÁSICOS
const fontElement = document.getElementById("fontStyle");
const opacityRange = document.getElementById("opacity");
const roundedCorner = document.getElementById("rounded-corner");
const bgColorInput = document.getElementById("bgColor");
const fontColorInput = document.getElementById("fontColor");
const containerPadding = document.getElementById("containerPadding");

// 🏷️ CONFIGURACIÓN DEL TÍTULO
const titleColor = document.getElementById("titleColor");
const autoTitleColor = document.getElementById("autoTitleColor");
const titleFontSize = document.getElementById("titleFontSize");
const titlePositionX = document.getElementById("titlePositionX");
const titlePositionY = document.getElementById("titlePositionY");
const titleSpacing = document.getElementById("titleSpacing");
const titleFontWeight = document.getElementById("titleFontWeight");
const titleShadow = document.getElementById("titleShadow");
const titleShadowColor = document.getElementById("titleShadowColor");
const titleShadowSize = document.getElementById("titleShadowSize");
const titleShadowColorGroup = document.getElementById("titleShadowColorGroup");
const titleShadowSizeGroup = document.getElementById("titleShadowSizeGroup");

// 📦 RECUADRO DEL TÍTULO
const titleBoxEnabled = document.getElementById("titleBoxEnabled");
const titleBoxSize = document.getElementById("titleBoxSize");
const titleBoxPadding = document.getElementById("titleBoxPadding");
const titleBoxFullWidth = document.getElementById("titleBoxFullWidth");
const titleBoxWidth = document.getElementById("titleBoxWidth");
const titleBoxWidthGroup = document.getElementById("titleBoxWidthGroup");
const titleBoxColor = document.getElementById("titleBoxColor");
const titleBoxOpacity = document.getElementById("titleBoxOpacity");
const titleBoxBorder = document.getElementById("titleBoxBorder");
const titleBoxRadius = document.getElementById("titleBoxRadius");
const titleBoxBlur = document.getElementById("titleBoxBlur");
const customBoxSize = document.getElementById("customBoxSize");

// 🌈 EFECTOS AVANZADOS Y DEGRADADOS
const backgroundTypeSelect = document.getElementById("backgroundType");
const gradientColor2 = document.getElementById("gradientColor2");
const gradientColor3 = document.getElementById("gradientColor3");
const gradientAngle = document.getElementById("gradientAngle");
const textColorType = document.getElementById("textColorType");
const textGradientColor2 = document.getElementById("textGradientColor2");
// 🎭 ANIMACIONES
const textAnimation = document.getElementById("textAnimation");
const animationDuration = document.getElementById("animationDuration");

/* ==========================================
   🔧 FUNCIONES AUXILIARES
   ========================================== */

// 🎨 Función para obtener el color opuesto basado en luminancia
function getOppositeColor(hexColor) {
    // Remover el # si existe
    const hex = hexColor.replace('#', '');
    
    // Convertir hex a RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calcular luminancia usando la fórmula estándar
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Retornar negro para fondos claros, blanco para fondos oscuros
    return luminance > 0.5 ? '#000000' : '#ffffff';
}

/* ==========================================
   🎧 EVENT LISTENERS - CONFIGURACIÓN
   ========================================== */

/* ------------------------------------------
   🎨 ESTILOS BÁSICOS
   ------------------------------------------ */

// 🔤 Familia de fuentes
fontElement.addEventListener("change", function() {
    let selectedValue = fontElement.options[fontElement.selectedIndex].value;
    settingsChannel.postMessage({ selectedFont: selectedValue });
});

// 👻 Opacidad del contenedor
opacityRange.addEventListener("input", () => {
    let currentOpacity = opacityRange.value / 10;
    
    let bgColor = localStorage.getItem('bgColor') || '#000000';
    
    if (bgColor.startsWith('#')) {
        const hex = bgColor.slice(1);
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        bgColor = `rgba(${r}, ${g}, ${b}, 1)`;
    }
    
    // Actualizar display de opacidad
    const percentage = Math.round(currentOpacity * 100);
    const opacityDisplay = document.getElementById('opacityDisplay');
    if (opacityDisplay) {
        opacityDisplay.textContent = percentage + '%';
    }
    
    let rgbValues = bgColor.match(/\d+/g);
    if (rgbValues && rgbValues.length >= 3) {
        let newColor = `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, ${currentOpacity})`;
        settingsChannel.postMessage({ containerOpacity: newColor });
    }
});

// 🔄 Esquinas redondeadas
roundedCorner.addEventListener("input", () => {
    let currentCorner = roundedCorner.value;
    
    // Actualizar display
    const roundedCornerDisplay = document.getElementById('roundedCornerDisplay');
    if (roundedCornerDisplay) {
        roundedCornerDisplay.textContent = currentCorner + 'px';
    }
    
    settingsChannel.postMessage({ roundedCorner: currentCorner });
});

// 🎨 Color de fondo
if (bgColorInput) {
    bgColorInput.addEventListener("input", function() {
        const color = bgColorInput.value;
        localStorage.setItem('bgColor', color);
        settingsChannel.postMessage({ selectedBgColor: color });
    });
}

// 🖋️ Color de fuente
if (fontColorInput) {
    fontColorInput.addEventListener("input", function() {
        const color = fontColorInput.value;
        localStorage.setItem('fontColor', color);
        settingsChannel.postMessage({ selectedFontColor: color });
    });
}

/* ------------------------------------------
   🏷️ CONFIGURACIÓN DEL TÍTULO
   ------------------------------------------ */

// 🔄 Botón de color automático (inteligente)
if (autoTitleColor) {
    autoTitleColor.addEventListener("click", function() {
        const bgColor = localStorage.getItem('bgColor') || '#000000';
        const oppositeColor = getOppositeColor(bgColor);
        
        if (titleColor) {
            titleColor.value = oppositeColor;
            localStorage.setItem('titleColor', oppositeColor);
            settingsChannel.postMessage({ selectedTitleColor: oppositeColor });
        }
    });
}

// 🎨 Color del título
if (titleColor) {
    titleColor.addEventListener("input", function() {
        const color = titleColor.value;
        localStorage.setItem('titleColor', color);
        settingsChannel.postMessage({ selectedTitleColor: color });
    });
}

// 📏 Tamaño de fuente del título
if (titleFontSize) {
    titleFontSize.addEventListener('input', function() {
        const size = titleFontSize.value;
        document.getElementById('titleFontSizeDisplay').textContent = size + 'px';
        localStorage.setItem('titleFontSize', size);
        settingsChannel.postMessage({ titleFontSize: size });
    });
}

// ↔️ Posición X del título
if (titlePositionX) {
    titlePositionX.addEventListener('input', function() {
        const posX = titlePositionX.value;
        document.getElementById('titlePositionXDisplay').textContent = posX + 'px';
        localStorage.setItem('titlePositionX', posX);
        settingsChannel.postMessage({ titlePositionX: posX });
    });
}

// ↕️ Posición Y del título
if (titlePositionY) {
    titlePositionY.addEventListener('input', function() {
        const posY = titlePositionY.value;
        document.getElementById('titlePositionYDisplay').textContent = posY + 'px';
        localStorage.setItem('titlePositionY', posY);
        settingsChannel.postMessage({ titlePositionY: posY });
    });
}

// 📝 Espaciado entre letras
if (titleSpacing) {
    titleSpacing.addEventListener('input', function() {
        const spacing = titleSpacing.value;
        document.getElementById('titleSpacingDisplay').textContent = spacing + 'px';
        localStorage.setItem('titleSpacing', spacing);
        settingsChannel.postMessage({ titleSpacing: spacing });
    });
}

// 💪 Peso de fuente del título
if (titleFontWeight) {
    titleFontWeight.addEventListener('change', function() {
        const weight = titleFontWeight.value;
        localStorage.setItem('titleFontWeight', weight);
        settingsChannel.postMessage({ titleFontWeight: weight });
    });
}

// 🌑 Sombra del título
if (titleShadow) {
    titleShadow.addEventListener('change', function() {
        const enabled = titleShadow.checked;
        
        // Usar el gestor de estilos si está disponible
        if (window.panelStyleManager) {
            window.panelStyleManager.toggleTitleShadowControls(enabled);
        } else {
            // Fallback al método tradicional
            if (titleShadowColorGroup) titleShadowColorGroup.style.display = enabled ? 'block' : 'none';
            if (titleShadowSizeGroup) titleShadowSizeGroup.style.display = enabled ? 'block' : 'none';
        }
        
        localStorage.setItem('titleShadow', enabled);
        settingsChannel.postMessage({ titleShadow: enabled });
    });
}

// 🎨 Color de sombra del título
if (titleShadowColor) {
    titleShadowColor.addEventListener('input', function() {
        const color = titleShadowColor.value;
        localStorage.setItem('titleShadowColor', color);
        settingsChannel.postMessage({ titleShadowColor: color });
    });
}

// 📐 Tamaño de sombra del título
if (titleShadowSize) {
    titleShadowSize.addEventListener('input', function() {
        const size = titleShadowSize.value;
        document.getElementById('titleShadowSizeDisplay').textContent = size + 'px';
        localStorage.setItem('titleShadowSize', size);
        settingsChannel.postMessage({ titleShadowSize: size });
    });
}

/* ------------------------------------------
   📦 RECUADRO DEL TÍTULO
   ------------------------------------------ */

// ✅ Activar recuadro del título
if (titleBoxEnabled) {
    titleBoxEnabled.addEventListener("change", function () {
        const isEnabled = titleBoxEnabled.checked;
        localStorage.setItem('titleBoxEnabled', isEnabled);
        settingsChannel.postMessage({ titleBoxEnabled: isEnabled });
    });
}

// 📐 Tamaño del recuadro
if (titleBoxSize) {
    titleBoxSize.addEventListener('change', function() {
        const size = titleBoxSize.value;
        document.getElementById('titleBoxSizeDisplay').textContent = size.charAt(0).toUpperCase() + size.slice(1);
        
        // Usar el gestor de estilos si está disponible
        if (window.panelStyleManager) {
            window.panelStyleManager.toggleTitleBoxCustomSize(size === 'custom');
        } else {
            // Fallback al método tradicional
            if (customBoxSize) {
                customBoxSize.style.display = size === 'custom' ? 'block' : 'none';
            }
        }
        
        localStorage.setItem('titleBoxSize', size);
        settingsChannel.postMessage({ titleBoxSize: size });
    });
}

// 🎚️ Padding del recuadro
if (titleBoxPadding) {
    titleBoxPadding.addEventListener('input', function() {
        const padding = titleBoxPadding.value;
        document.getElementById('titleBoxPaddingDisplay').textContent = padding + 'px';
        localStorage.setItem('titleBoxPadding', padding);
        settingsChannel.postMessage({ titleBoxPadding: padding });
    });
}

// ↔️ Ancho completo
if (titleBoxFullWidth) {
    titleBoxFullWidth.addEventListener('change', function() {
        const fullWidth = titleBoxFullWidth.checked;
        localStorage.setItem('titleBoxFullWidth', fullWidth);
        settingsChannel.postMessage({ titleBoxFullWidth: fullWidth });
        
        // Usar el gestor de estilos si está disponible
        if (window.panelStyleManager) {
            window.panelStyleManager.toggleTitleBoxFullWidthControls(fullWidth);
        } else {
            // Fallback al método tradicional
            if (titleBoxWidthGroup) {
                titleBoxWidthGroup.style.display = fullWidth ? 'block' : 'none';
            }
            const titleAlignmentGroup = document.getElementById('titleAlignmentGroup');
            if (titleAlignmentGroup) {
                titleAlignmentGroup.style.display = fullWidth ? 'block' : 'none';
            }
        }
    });
}

// 📏 Ancho personalizado
if (titleBoxWidth) {
    titleBoxWidth.addEventListener('input', function() {
        const width = titleBoxWidth.value;
        const display = document.getElementById('titleBoxWidthDisplay');
        if (display) display.textContent = width + '%';
        localStorage.setItem('titleBoxWidth', width);
        settingsChannel.postMessage({ titleBoxWidth: width });
    });
}

// 📐 Alineación de texto en ancho completo
const titleFullWidthAlignment = document.getElementById('titleFullWidthAlignment');
if (titleFullWidthAlignment) {
    titleFullWidthAlignment.addEventListener('change', function() {
        const alignment = titleFullWidthAlignment.value;
        localStorage.setItem('titleFullWidthAlignment', alignment);
        settingsChannel.postMessage({ titleFullWidthAlignment: alignment });
        console.log(`📐 Alineación del título cambiada a: ${alignment}`);
    });
}

// 🎨 Color del recuadro
if (titleBoxColor) {
    titleBoxColor.addEventListener('input', function() {
        const color = titleBoxColor.value;
        localStorage.setItem('titleBoxColor', color);
        settingsChannel.postMessage({ titleBoxColor: color });
    });
}

// 👻 Opacidad del recuadro
if (titleBoxOpacity) {
    titleBoxOpacity.addEventListener('input', function() {
        const opacity = titleBoxOpacity.value;
        document.getElementById('titleBoxOpacityDisplay').textContent = opacity + '%';
        localStorage.setItem('titleBoxOpacity', opacity);
        settingsChannel.postMessage({ titleBoxOpacity: opacity });
    });
}

// 🔳 Borde del recuadro
if (titleBoxBorder) {
    titleBoxBorder.addEventListener('input', function() {
        const border = titleBoxBorder.value;
        document.getElementById('titleBoxBorderDisplay').textContent = border + 'px';
        localStorage.setItem('titleBoxBorder', border);
        settingsChannel.postMessage({ titleBoxBorder: border });
    });
}

// 🔘 Radio del recuadro
if (titleBoxRadius) {
    titleBoxRadius.addEventListener('input', function() {
        const radius = titleBoxRadius.value;
        document.getElementById('titleBoxRadiusDisplay').textContent = radius + 'px';
        localStorage.setItem('titleBoxRadius', radius);
        settingsChannel.postMessage({ titleBoxRadius: radius });
    });
}

// 🌊 Blur del recuadro
if (titleBoxBlur) {
    titleBoxBlur.addEventListener('change', function() {
        const blur = titleBoxBlur.checked;
        localStorage.setItem('titleBoxBlur', blur);
        settingsChannel.postMessage({ titleBoxBlur: blur });
    });
}

/* ==========================================
   📂 CARGA DE CONFIGURACIONES GUARDADAS
   ========================================== */

/* ------------------------------------------
   🎨 ESTILOS BÁSICOS GUARDADOS
   ------------------------------------------ */

// Cargar colores básicos
const savedBgColor = localStorage.getItem('bgColor');
if (savedBgColor && bgColorInput) {
    bgColorInput.value = savedBgColor;
}

const savedFontColor = localStorage.getItem('fontColor');
if (savedFontColor && fontColorInput) {
    fontColorInput.value = savedFontColor;
}

// Cargar color del título
const savedTitleColor = localStorage.getItem('titleColor');
if (savedTitleColor && titleColor) {
    titleColor.value = savedTitleColor;
}

/* ------------------------------------------
   🏷️ CONFIGURACIÓN DEL TÍTULO GUARDADA
   ------------------------------------------ */

// Obtener valores guardados del título con valores por defecto
const savedTitleFontSize = localStorage.getItem('titleFontSize') || '20';
const savedTitlePositionX = localStorage.getItem('titlePositionX') || '10';
const savedTitlePositionY = localStorage.getItem('titlePositionY') || '10';
const savedTitleSpacing = localStorage.getItem('titleSpacing') || '0';
const savedTitleFontWeight = localStorage.getItem('titleFontWeight') || 'normal';
const savedTitleShadow = localStorage.getItem('titleShadow') === 'true';
const savedTitleShadowColor = localStorage.getItem('titleShadowColor') || '#000000';
const savedTitleShadowSize = localStorage.getItem('titleShadowSize') || '2';

// Aplicar configuraciones del título
if (titleFontSize) {
    titleFontSize.value = savedTitleFontSize;
    document.getElementById('titleFontSizeDisplay').textContent = savedTitleFontSize + 'px';
}

if (titlePositionX) {
    titlePositionX.value = savedTitlePositionX;
    document.getElementById('titlePositionXDisplay').textContent = savedTitlePositionX + 'px';
}

if (titlePositionY) {
    titlePositionY.value = savedTitlePositionY;
    document.getElementById('titlePositionYDisplay').textContent = savedTitlePositionY + 'px';
}

if (titleSpacing) {
    titleSpacing.value = savedTitleSpacing;
    document.getElementById('titleSpacingDisplay').textContent = savedTitleSpacing + 'px';
}

if (titleFontWeight) {
    titleFontWeight.value = savedTitleFontWeight;
}

if (titleShadow) {
    titleShadow.checked = savedTitleShadow;
    
    // Usar el gestor de estilos si está disponible
    if (window.panelStyleManager) {
        window.panelStyleManager.toggleTitleShadowControls(savedTitleShadow);
    } else {
        // Fallback al método tradicional
        if (titleShadowColorGroup) titleShadowColorGroup.style.display = savedTitleShadow ? 'block' : 'none';
        if (titleShadowSizeGroup) titleShadowSizeGroup.style.display = savedTitleShadow ? 'block' : 'none';
    }
}

if (titleShadowColor) {
    titleShadowColor.value = savedTitleShadowColor;
}

if (titleShadowSize) {
    titleShadowSize.value = savedTitleShadowSize;
    document.getElementById('titleShadowSizeDisplay').textContent = savedTitleShadowSize + 'px';
}

/* ------------------------------------------
   📦 RECUADRO DEL TÍTULO GUARDADO
   ------------------------------------------ */

// Obtener valores guardados del recuadro con valores por defecto
const savedTitleBoxEnabled = localStorage.getItem('titleBoxEnabled') === 'true';
const savedTitleBoxSize = localStorage.getItem('titleBoxSize') || 'medium';
const savedTitleBoxPadding = localStorage.getItem('titleBoxPadding') || '8';
const savedTitleBoxFullWidth = localStorage.getItem('titleBoxFullWidth') === 'true';
const savedTitleBoxWidth = localStorage.getItem('titleBoxWidth') || '100';
const savedTitleFullWidthAlignment = localStorage.getItem('titleFullWidthAlignment') || 'center';
const savedTitleBoxColor = localStorage.getItem('titleBoxColor') || '#ffffff';
const savedTitleBoxOpacity = localStorage.getItem('titleBoxOpacity') || '80';
const savedTitleBoxBorder = localStorage.getItem('titleBoxBorder') || '1';
const savedTitleBoxRadius = localStorage.getItem('titleBoxRadius') || '6';
const savedTitleBoxBlur = localStorage.getItem('titleBoxBlur') !== 'false';

// Aplicar configuraciones del recuadro
if (titleBoxEnabled) {
    titleBoxEnabled.checked = savedTitleBoxEnabled;
}

if (titleBoxSize) {
    titleBoxSize.value = savedTitleBoxSize;
    document.getElementById('titleBoxSizeDisplay').textContent = savedTitleBoxSize.charAt(0).toUpperCase() + savedTitleBoxSize.slice(1);
    
    // Usar el gestor de estilos si está disponible
    if (window.panelStyleManager) {
        window.panelStyleManager.toggleTitleBoxCustomSize(savedTitleBoxSize === 'custom');
    } else {
        // Fallback al método tradicional
        if (customBoxSize) {
            customBoxSize.style.display = savedTitleBoxSize === 'custom' ? 'block' : 'none';
        }
    }
}

if (titleBoxPadding) {
    titleBoxPadding.value = savedTitleBoxPadding;
    document.getElementById('titleBoxPaddingDisplay').textContent = savedTitleBoxPadding + 'px';
}

if (titleBoxFullWidth) {
    titleBoxFullWidth.checked = savedTitleBoxFullWidth;
    
    // Usar el gestor de estilos si está disponible
    if (window.panelStyleManager) {
        window.panelStyleManager.toggleTitleBoxFullWidthControls(savedTitleBoxFullWidth);
    } else {
        // Fallback al método tradicional
        if (titleBoxWidthGroup) {
            titleBoxWidthGroup.style.display = savedTitleBoxFullWidth ? 'block' : 'none';
        }
        if (titleAlignmentGroup) {
            titleAlignmentGroup.style.display = savedTitleBoxFullWidth ? 'block' : 'none';
        }
    }
}

if (titleBoxWidth) {
    titleBoxWidth.value = savedTitleBoxWidth;
    const display = document.getElementById('titleBoxWidthDisplay');
    if (display) display.textContent = savedTitleBoxWidth + '%';
}

if (titleFullWidthAlignment) {
    titleFullWidthAlignment.value = savedTitleFullWidthAlignment;
}

if (titleBoxColor) {
    titleBoxColor.value = savedTitleBoxColor;
}

if (titleBoxOpacity) {
    titleBoxOpacity.value = savedTitleBoxOpacity;
    document.getElementById('titleBoxOpacityDisplay').textContent = savedTitleBoxOpacity + '%';
}

if (titleBoxBorder) {
    titleBoxBorder.value = savedTitleBoxBorder;
    document.getElementById('titleBoxBorderDisplay').textContent = savedTitleBoxBorder + 'px';
}

if (titleBoxRadius) {
    titleBoxRadius.value = savedTitleBoxRadius;
    document.getElementById('titleBoxRadiusDisplay').textContent = savedTitleBoxRadius + 'px';
}

if (titleBoxBlur) {
    titleBoxBlur.checked = savedTitleBoxBlur;
}

/* ------------------------------------------
   📦 CONFIGURACIÓN DEL CONTENEDOR
   ------------------------------------------ */

// Aplicar valores por defecto del contenedor si no existen
if (!localStorage.getItem('opacity')) {
    localStorage.setItem('opacity', '5'); // 50% opacidad
    if (opacityRange) opacityRange.value = '5';
}

if (!localStorage.getItem('borderRadius')) {
    localStorage.setItem('borderRadius', '5'); // 5px esquinas
    if (roundedCorner) {
        roundedCorner.value = '5';
        document.getElementById('cornerDisplay').textContent = '5px';
    }
}

if (!localStorage.getItem('containerPadding')) {
    localStorage.setItem('containerPadding', '2'); // 2px padding
    if (containerPadding) {
        containerPadding.value = '2';
        document.getElementById('paddingDisplay').textContent = '2px';
    }
}

/* ------------------------------------------
   🌈 EFECTOS AVANZADOS Y DEGRADADOS
   ------------------------------------------ */

// Obtener valores guardados de degradados con valores por defecto
const savedBackgroundType = localStorage.getItem('backgroundType') || 'solid';
const savedGradientColor2 = localStorage.getItem('gradientColor2') || '#ff6b6b';
const savedGradientColor3 = localStorage.getItem('gradientColor3') || '#4ecdc4';
const savedGradientAngle = localStorage.getItem('gradientAngle') || '45';
const savedTextColorType = localStorage.getItem('textColorType') || 'solid';
const savedTextGradientColor2 = localStorage.getItem('textGradientColor2') || '#ff9a9a';

// 🎨 Obtener valores guardados de efectos de texto
const savedTextShadow = localStorage.getItem('textShadow');
const savedTextStroke = localStorage.getItem('textStroke');
const savedTextGlow = localStorage.getItem('textGlow');

// 🎭 Obtener valores guardados de animaciones
const savedTextAnimation = localStorage.getItem('textAnimation');
const savedAnimationDuration = localStorage.getItem('animationDuration');

// Aplicar configuraciones de degradados
if (backgroundTypeSelect) {
    backgroundTypeSelect.value = savedBackgroundType;
    const gradientControls = document.getElementById('gradientControls');
    const color2Container = document.getElementById('gradientColor2Container');
    const color3Container = document.getElementById('gradientColor3Container');
    
    if (savedBackgroundType === 'solid') {
        if (gradientControls) gradientControls.style.display = 'none';
        if (color2Container) color2Container.style.display = 'none';
        if (color3Container) color3Container.style.display = 'none';
    } else {
        if (gradientControls) gradientControls.style.display = 'block';
        if (color2Container) color2Container.style.display = 'block';
        if (color3Container) color3Container.style.display = 'block';
    }
}

if (gradientColor2) {
    gradientColor2.value = savedGradientColor2;
}

if (gradientColor3) {
    gradientColor3.value = savedGradientColor3;
}

if (gradientAngle) {
    gradientAngle.value = savedGradientAngle;
    const angleDisplay = document.getElementById('gradientAngleDisplay');
    if (angleDisplay) {
        angleDisplay.textContent = savedGradientAngle + '°';
    }
}

if (textColorType) {
    textColorType.value = savedTextColorType;
    
    // Usar el gestor de estilos si está disponible
    if (window.panelStyleManager) {
        window.panelStyleManager.toggleTextGradientColor2Container(savedTextColorType === 'gradient');
    } else {
        // Fallback al método tradicional
        const container = document.getElementById('textGradientColor2Container');
        if (container) {
            container.style.display = savedTextColorType === 'gradient' ? 'block' : 'none';
        }
    }
}

if (textGradientColor2) {
    textGradientColor2.value = savedTextGradientColor2;
}

// 🎨 Aplicar configuraciones guardadas de efectos de texto
if (savedTextShadow) {
    const shadowParts = savedTextShadow.match(/(-?\d+)px\s+(-?\d+)px\s+(\d+)px\s+(#[0-9a-f]{6}|rgb\([^)]+\)|rgba\([^)]+\))/i);
    if (shadowParts) {
        const textShadowEnabled = document.getElementById('textShadowEnabled');
        const textShadowColor = document.getElementById('textShadowColor');
        const textShadowX = document.getElementById('textShadowX');
        const textShadowY = document.getElementById('textShadowY');
        const textShadowBlur = document.getElementById('textShadowBlur');
        const textShadowControls = document.getElementById('textShadowControls');
        
        if (textShadowEnabled) textShadowEnabled.checked = true;
        if (textShadowColor) textShadowColor.value = shadowParts[4];
        if (textShadowX) textShadowX.value = shadowParts[1];
        if (textShadowY) textShadowY.value = shadowParts[2];
        if (textShadowBlur) textShadowBlur.value = shadowParts[3];
        
        // Usar el gestor de estilos si está disponible
        if (window.panelStyleManager) {
            window.panelStyleManager.toggleTextShadowControls(true);
        } else {
            // Fallback al método tradicional
            if (textShadowControls) textShadowControls.style.display = 'block';
        }
        
        // Actualizar displays
        const shadowXDisplay = document.getElementById('shadowXDisplay');
        const shadowYDisplay = document.getElementById('shadowYDisplay');
        const shadowBlurDisplay = document.getElementById('shadowBlurDisplay');
        if (shadowXDisplay) shadowXDisplay.textContent = shadowParts[1] + 'px';
        if (shadowYDisplay) shadowYDisplay.textContent = shadowParts[2] + 'px';
        if (shadowBlurDisplay) shadowBlurDisplay.textContent = shadowParts[3] + 'px';
    }
}

if (savedTextStroke) {
    try {
        const strokeData = JSON.parse(savedTextStroke);
        const textStrokeEnabled = document.getElementById('textStrokeEnabled');
        const textStrokeColor = document.getElementById('textStrokeColor');
        const textStrokeWidth = document.getElementById('textStrokeWidth');
        const textStrokeControls = document.getElementById('textStrokeControls');
        
        if (textStrokeEnabled) textStrokeEnabled.checked = true;
        if (textStrokeColor) textStrokeColor.value = strokeData.color;
        if (textStrokeWidth) textStrokeWidth.value = parseFloat(strokeData.width);
        
        // Usar el gestor de estilos si está disponible
        if (window.panelStyleManager) {
            window.panelStyleManager.toggleTextStrokeControls(true);
        } else {
            // Fallback al método tradicional
            if (textStrokeControls) textStrokeControls.style.display = 'block';
        }
        
        // Actualizar display
        const strokeWidthDisplay = document.getElementById('strokeWidthDisplay');
        if (strokeWidthDisplay) strokeWidthDisplay.textContent = strokeData.width;
    } catch (e) {
        console.log('Error parsing text stroke data:', e);
    }
}

if (savedTextGlow) {
    const glowMatch = savedTextGlow.match(/0 0 (\d+)px ([^,]+)/);
    if (glowMatch) {
        const textGlowEnabled = document.getElementById('textGlowEnabled');
        const textGlowColor = document.getElementById('textGlowColor');
        const textGlowIntensity = document.getElementById('textGlowIntensity');
        const textGlowControls = document.getElementById('textGlowControls');
        
        if (textGlowEnabled) textGlowEnabled.checked = true;
        if (textGlowColor) textGlowColor.value = glowMatch[2];
        if (textGlowIntensity) textGlowIntensity.value = glowMatch[1];
        
        // Usar el gestor de estilos si está disponible
        if (window.panelStyleManager) {
            window.panelStyleManager.toggleTextGlowControls(true);
        } else {
            // Fallback al método tradicional
            if (textGlowControls) textGlowControls.style.display = 'block';
        }
        
        // Actualizar display
        const glowIntensityDisplay = document.getElementById('glowIntensityDisplay');
        if (glowIntensityDisplay) glowIntensityDisplay.textContent = glowMatch[1] + 'px';
    }
}

// 🎭 Aplicar configuraciones guardadas de animaciones
if (savedTextAnimation && textAnimation) {
    textAnimation.value = savedTextAnimation;
}

if (savedAnimationDuration && animationDuration) {
    animationDuration.value = savedAnimationDuration;
    const durationDisplay = document.getElementById('animationDurationDisplay');
    if (durationDisplay) {
        durationDisplay.textContent = savedAnimationDuration + 's';
    }
}

// ========================================
//   🎨 PRESETS DE ESTILO PREDEFINIDOS
// ========================================

// 📦 Definición de presets - Nombres descriptivos del estilo
const presets = {
    sombra: {
        backgroundType: 'solid',
        bgColor: 'rgba(0, 0, 0, 0.8)',
        fontColor: '#ffffff',
        titleColor: '#ffffff',
        titleFontWeight: 'bold',
        fontFamily: 'Poppins',
        textShadow: { enabled: true, color: '#000000', x: 1, y: 1, blur: 2 },
        containerPadding: 12
    },
    claro: {
        backgroundType: 'solid',
        bgColor: 'rgba(245, 245, 245, 0.95)',
        fontColor: '#000000',
        titleColor: '#000000',
        titleFontWeight: '600',
        fontFamily: 'Inter',
        textShadow: { enabled: false },
        containerPadding: 14
    },
    blanco: {
        backgroundType: 'solid',
        bgColor: 'rgba(255, 255, 255, 0.9)',
        fontColor: '#000000',
        titleColor: '#000000',
        titleFontWeight: 'bold',
        fontFamily: 'Poppins',
        textShadow: { enabled: false },
        containerPadding: 10
    },
    grueso: {
        backgroundType: 'solid',
        bgColor: 'rgba(20, 20, 20, 0.85)',
        fontColor: '#ffffff',
        titleColor: '#ffffff',
        titleFontWeight: '700',
        fontFamily: 'Inter',
        textShadow: { enabled: false },
        containerPadding: 16
    },
    suave: {
        backgroundType: 'solid',
        bgColor: 'rgba(40, 40, 40, 0.75)',
        fontColor: '#ffffff',
        titleColor: '#ffffff',
        titleFontWeight: '500',
        fontFamily: 'Poppins',
        textShadow: { enabled: false },
        containerPadding: 18
    }
};

// 🎯 Aplicar presets
document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const presetName = btn.dataset.preset;
        const preset = presets[presetName];
        if (preset) {
            applyPreset(preset);
        }
    });
});

// 🔧 Función para aplicar un preset completo
function applyPreset(preset) {
    // Aplicar configuraciones del preset
    if (preset.backgroundType && backgroundTypeSelect) {
        backgroundTypeSelect.value = preset.backgroundType;
        toggleGradientControls();
        localStorage.setItem('backgroundType', preset.backgroundType);
        settingsChannel.postMessage({ backgroundType: preset.backgroundType });
    }
    
    if (preset.bgColor && bgColorInput) {
        bgColorInput.value = preset.bgColor;
        localStorage.setItem('bgColor', preset.bgColor);
        settingsChannel.postMessage({ selectedBgColor: preset.bgColor });
    }
    
    if (preset.gradientColor2 && gradientColor2) {
        gradientColor2.value = preset.gradientColor2;
        localStorage.setItem('gradientColor2', preset.gradientColor2);
        updateBackgroundGradient();
    }
    
    if (preset.fontColor && fontColorInput) {
        fontColorInput.value = preset.fontColor;
        localStorage.setItem('fontColor', preset.fontColor);
        settingsChannel.postMessage({ selectedFontColor: preset.fontColor });
    }
    
    if (preset.titleColor && titleColor) {
        titleColor.value = preset.titleColor;
        localStorage.setItem('titleColor', preset.titleColor);
        settingsChannel.postMessage({ selectedTitleColor: preset.titleColor });
    }
    
    if (preset.fontFamily && fontElement) {
        fontElement.value = preset.fontFamily;
        localStorage.setItem('fontFamily', preset.fontFamily);
        settingsChannel.postMessage({ selectedFont: preset.fontFamily });
    }
    
    if (preset.titleFontWeight && titleFontWeight) {
        titleFontWeight.value = preset.titleFontWeight;
        localStorage.setItem('titleFontWeight', preset.titleFontWeight);
        settingsChannel.postMessage({ titleFontWeight: preset.titleFontWeight });
    }
    
    // Aplicar efectos de texto
    if (preset.textShadow) {
        const shadowEnabled = document.getElementById('textShadowEnabled');
        if (shadowEnabled) {
            shadowEnabled.checked = preset.textShadow.enabled;
            if (preset.textShadow.enabled) {
                const shadowColor = document.getElementById('textShadowColor');
                const shadowX = document.getElementById('textShadowX');
                const shadowY = document.getElementById('textShadowY');
                const shadowBlur = document.getElementById('textShadowBlur');
                
                if (shadowColor) shadowColor.value = preset.textShadow.color;
                if (shadowX) shadowX.value = preset.textShadow.x;
                if (shadowY) shadowY.value = preset.textShadow.y;
                if (shadowBlur) shadowBlur.value = preset.textShadow.blur;
                
                updateTextShadow();
            }
            toggleTextShadowControls();
        }
    }
    
    if (preset.textGlow) {
        const glowEnabled = document.getElementById('textGlowEnabled');
        if (glowEnabled) {
            glowEnabled.checked = preset.textGlow.enabled;
            if (preset.textGlow.enabled) {
                const glowColor = document.getElementById('textGlowColor');
                const glowIntensity = document.getElementById('textGlowIntensity');
                
                if (glowColor) glowColor.value = preset.textGlow.color;
                if (glowIntensity) glowIntensity.value = preset.textGlow.intensity;
                
                updateTextGlow();
            }
            toggleTextGlowControls();
        }
    }
    
    if (preset.textStroke) {
        const strokeEnabled = document.getElementById('textStrokeEnabled');
        if (strokeEnabled) {
            strokeEnabled.checked = preset.textStroke.enabled;
            if (preset.textStroke.enabled) {
                const strokeColor = document.getElementById('textStrokeColor');
                const strokeWidth = document.getElementById('textStrokeWidth');
                
                if (strokeColor) strokeColor.value = preset.textStroke.color;
                if (strokeWidth) strokeWidth.value = preset.textStroke.width;
                
                updateTextStroke();
            }
            toggleTextStrokeControls();
        }
    }
    
    if (preset.containerPadding && containerPadding) {
        containerPadding.value = preset.containerPadding;
        const paddingDisplay = document.getElementById('paddingDisplay');
        if (paddingDisplay) {
            paddingDisplay.textContent = preset.containerPadding + 'px';
        }
        localStorage.setItem('containerPadding', preset.containerPadding);
        settingsChannel.postMessage({ containerPadding: preset.containerPadding });
    }
}

// 🔧 Función auxiliar para alternar controles de degradado
function toggleGradientControls() {
    if (!backgroundTypeSelect) return;
    
    const type = backgroundTypeSelect.value;
    const enabled = type !== 'solid';
    
    // Usar el gestor de estilos si está disponible
    if (window.panelStyleManager) {
        window.panelStyleManager.toggleGradientControls(enabled);
    } else {
        // Fallback al método tradicional
        const gradientControls = document.getElementById('gradientControls');
        const color2Container = document.getElementById('gradientColor2Container');
        const color3Container = document.getElementById('gradientColor3Container');
        
        if (type === 'solid') {
            if (gradientControls) gradientControls.style.display = 'none';
            if (color2Container) color2Container.style.display = 'none';
            if (color3Container) color3Container.style.display = 'none';
        } else {
            if (gradientControls) gradientControls.style.display = 'block';
            if (color2Container) color2Container.style.display = 'block';
            if (color3Container) color3Container.style.display = 'block';
        }
    }
    
    updateBackgroundGradient();
}

/* ------------------------------------------
   📦 EVENT LISTENERS DEL CONTENEDOR
   ------------------------------------------ */

// 📏 Padding del contenedor
if (containerPadding) {
    containerPadding.addEventListener('input', function() {
        const padding = containerPadding.value;
        const paddingDisplay = document.getElementById('paddingDisplay');
        if (paddingDisplay) {
            paddingDisplay.textContent = padding + 'px';
        }
        localStorage.setItem('containerPadding', padding);
        settingsChannel.postMessage({ containerPadding: padding });
    });
}

/* ------------------------------------------
   🕰️ FORMATO DE TEXTO (ESTILOS)
   ------------------------------------------ */

// 💪 Botón de texto en negrita
const boldButton = document.getElementById("bold");
if (boldButton) {
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
}

// 🕰️ Botón de texto en cursiva
const italicButton = document.getElementById("italic");
if (italicButton) {
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
}

// 📝 Botón de texto subrayado
const underlineButton = document.getElementById("underline");
if (underlineButton) {
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
}

// 📏 Alineación de texto
const textAlignElement = document.getElementById("textAlign");
if (textAlignElement) {
    textAlignElement.addEventListener("change", function() {
        let selectedValue = textAlignElement.options[textAlignElement.selectedIndex].value;
        settingsChannel.postMessage({ selectedTextAlignment: selectedValue });
    });
}

/* ------------------------------------------
   🌈 EVENT LISTENERS PARA DEGRADADOS
   ------------------------------------------ */

// 🎨 Tipo de fondo (sólido o degradado)
if (backgroundTypeSelect) {
    backgroundTypeSelect.addEventListener('change', function() {
        const type = backgroundTypeSelect.value;
        const gradientControls = document.getElementById('gradientControls');
        const color2Container = document.getElementById('gradientColor2Container');
        const color3Container = document.getElementById('gradientColor3Container');
        
        if (type === 'solid') {
            if (gradientControls) gradientControls.style.display = 'none';
            if (color2Container) color2Container.style.display = 'none';
            if (color3Container) color3Container.style.display = 'none';
        } else {
            if (gradientControls) gradientControls.style.display = 'block';
            if (color2Container) color2Container.style.display = 'block';
            if (color3Container) color3Container.style.display = 'block';
        }
        
        localStorage.setItem('backgroundType', type);
        settingsChannel.postMessage({ backgroundType: type });
        updateBackgroundGradient();
    });
}

// 🌈 Color 2 del degradado
if (gradientColor2) {
    gradientColor2.addEventListener('input', function() {
        localStorage.setItem('gradientColor2', gradientColor2.value);
        updateBackgroundGradient();
    });
}

// 🌈 Color 3 del degradado
if (gradientColor3) {
    gradientColor3.addEventListener('input', function() {
        localStorage.setItem('gradientColor3', gradientColor3.value);
        updateBackgroundGradient();
    });
}

// 🔄 Ángulo del degradado
if (gradientAngle) {
    gradientAngle.addEventListener('input', function() {
        const angleDisplay = document.getElementById('gradientAngleDisplay');
        if (angleDisplay) {
            angleDisplay.textContent = gradientAngle.value + '°';
        }
        localStorage.setItem('gradientAngle', gradientAngle.value);
        updateBackgroundGradient();
    });
}

/* ------------------------------------------
   🔧 FUNCIONES DE DEGRADADO
   ------------------------------------------ */

// 🌈 Función para actualizar el degradado de fondo
function updateBackgroundGradient() {
    if (!backgroundTypeSelect) return;
    
    const type = backgroundTypeSelect.value;
    const color1 = bgColorInput ? bgColorInput.value : '#000000';
    const color2 = gradientColor2 ? gradientColor2.value : '#ff6b6b';
    const color3 = gradientColor3 ? gradientColor3.value : '#4ecdc4';
    const angle = gradientAngle ? gradientAngle.value : '45';
    
    let gradient;
    if (type === 'linear') {
        gradient = `linear-gradient(${angle}deg, ${color1}, ${color2}, ${color3})`;
    } else if (type === 'radial') {
        gradient = `radial-gradient(circle, ${color1}, ${color2}, ${color3})`;
    } else {
        gradient = color1;
    }
    
    localStorage.setItem('backgroundGradient', gradient);
    settingsChannel.postMessage({ backgroundGradient: gradient });
}

// 🕰️ Tipo de degradado de texto
if (textColorType) {
    textColorType.addEventListener('change', function() {
        const isGradient = textColorType.value === 'gradient';
        const container = document.getElementById('textGradientColor2Container');
        
        // Usar el gestor de estilos si está disponible
        if (window.panelStyleManager) {
            window.panelStyleManager.toggleElement(container, isGradient);
        } else {
            // Fallback al método tradicional
            if (container) {
                container.style.display = isGradient ? 'block' : 'none';
            }
        }
        
        localStorage.setItem('textColorType', textColorType.value);
        updateTextGradient();
    });
}

// 🌈 Color 2 del degradado de texto
if (textGradientColor2) {
    textGradientColor2.addEventListener('input', function() {
        localStorage.setItem('textGradientColor2', textGradientColor2.value);
        updateTextGradient();
    });
}

// 🕰️ Función para actualizar el degradado de texto
function updateTextGradient() {
    if (!textColorType) return;
    
    const isGradient = textColorType.value === 'gradient';
    const color1 = fontColorInput ? fontColorInput.value : '#ffffff';
    const color2 = textGradientColor2 ? textGradientColor2.value : '#ff9a9a';
    
    if (isGradient) {
        const gradient = `linear-gradient(45deg, ${color1}, ${color2})`;
        localStorage.setItem('textGradient', gradient);
        settingsChannel.postMessage({ textGradient: gradient });
    } else {
        localStorage.setItem('textGradient', '');
        settingsChannel.postMessage({ textGradient: null });
    }
}

// ========================================
//   ✨ EFECTOS DE TEXTO AVANZADOS
// ========================================

// 🌑 SOMBRA DE TEXTO
const textShadowEnabled = document.getElementById('textShadowEnabled');
if (textShadowEnabled) {
    textShadowEnabled.addEventListener('change', toggleTextShadowControls);
}

function toggleTextShadowControls() {
    const enabled = document.getElementById('textShadowEnabled').checked;
    
    // Usar el gestor de estilos si está disponible
    if (window.panelStyleManager) {
        window.panelStyleManager.toggleTextShadowControls(enabled);
    } else {
        // Fallback al método tradicional
        const controls = document.getElementById('textShadowControls');
        if (controls) {
            controls.style.display = enabled ? 'block' : 'none';
        }
    }
    
    if (enabled) {
        updateTextShadow();
    } else {
        localStorage.setItem('textShadow', '');
        settingsChannel.postMessage({ textShadow: 'none' });
    }
}

function updateTextShadow() {
    const color = document.getElementById('textShadowColor')?.value || '#000000';
    const x = document.getElementById('textShadowX')?.value || '2';
    const y = document.getElementById('textShadowY')?.value || '2';
    const blur = document.getElementById('textShadowBlur')?.value || '4';
    
    const shadow = `${x}px ${y}px ${blur}px ${color}`;
    localStorage.setItem('textShadow', shadow);
    settingsChannel.postMessage({ textShadow: shadow });
    
    // Actualizar displays
    const shadowXDisplay = document.getElementById('shadowXDisplay');
    const shadowYDisplay = document.getElementById('shadowYDisplay');
    const shadowBlurDisplay = document.getElementById('shadowBlurDisplay');
    
    if (shadowXDisplay) shadowXDisplay.textContent = x + 'px';
    if (shadowYDisplay) shadowYDisplay.textContent = y + 'px';
    if (shadowBlurDisplay) shadowBlurDisplay.textContent = blur + 'px';
}

// Event listeners para controles de sombra
['textShadowColor', 'textShadowX', 'textShadowY', 'textShadowBlur'].forEach(id => {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener('input', updateTextShadow);
    }
});

// 🔳 BORDE DE TEXTO
const textStrokeEnabled = document.getElementById('textStrokeEnabled');
if (textStrokeEnabled) {
    textStrokeEnabled.addEventListener('change', toggleTextStrokeControls);
}

function toggleTextStrokeControls() {
    const enabled = document.getElementById('textStrokeEnabled').checked;
    
    // Usar el gestor de estilos si está disponible
    if (window.panelStyleManager) {
        window.panelStyleManager.toggleTextStrokeControls(enabled);
    } else {
        // Fallback al método tradicional
        const controls = document.getElementById('textStrokeControls');
        if (controls) {
            controls.style.display = enabled ? 'block' : 'none';
        }
    }
    
    if (enabled) {
        updateTextStroke();
    } else {
        // Limpiar completamente el localStorage y enviar mensaje para remover el borde
        localStorage.removeItem('textStroke');
        settingsChannel.postMessage({ textStroke: null });
    }
}

function updateTextStroke() {
    const color = document.getElementById('textStrokeColor')?.value || '#000000';
    const width = document.getElementById('textStrokeWidth')?.value || '1';
    
    const strokeData = { color: color, width: width + 'px' };
    localStorage.setItem('textStroke', JSON.stringify(strokeData));
    settingsChannel.postMessage({ textStroke: strokeData });
    
    const strokeWidthDisplay = document.getElementById('strokeWidthDisplay');
    if (strokeWidthDisplay) {
        strokeWidthDisplay.textContent = width + 'px';
    }
}

// Event listeners para controles de borde
['textStrokeColor', 'textStrokeWidth'].forEach(id => {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener('input', updateTextStroke);
    }
});

// 💡 RESPLANDOR DE TEXTO
const textGlowEnabled = document.getElementById('textGlowEnabled');
if (textGlowEnabled) {
    textGlowEnabled.addEventListener('change', toggleTextGlowControls);
}

function toggleTextGlowControls() {
    const enabled = document.getElementById('textGlowEnabled').checked;
    
    // Usar el gestor de estilos si está disponible
    if (window.panelStyleManager) {
        window.panelStyleManager.toggleTextGlowControls(enabled);
    } else {
        // Fallback al método tradicional
        const controls = document.getElementById('textGlowControls');
        if (controls) {
            controls.style.display = enabled ? 'block' : 'none';
        }
    }
    
    if (enabled) {
        updateTextGlow();
    } else {
        localStorage.setItem('textGlow', '');
        settingsChannel.postMessage({ textGlow: null });
    }
}

function updateTextGlow() {
    const color = document.getElementById('textGlowColor')?.value || '#ffffff';
    const intensity = document.getElementById('textGlowIntensity')?.value || '10';
    
    // Crear múltiples sombras para el efecto de resplandor
    const glow = `0 0 ${intensity}px ${color}, 0 0 ${intensity * 2}px ${color}`;
    localStorage.setItem('textGlow', glow);
    settingsChannel.postMessage({ textGlow: glow });
    
    const glowIntensityDisplay = document.getElementById('glowIntensityDisplay');
    if (glowIntensityDisplay) {
        glowIntensityDisplay.textContent = intensity + 'px';
    }
}

// Event listeners para controles de resplandor
['textGlowColor', 'textGlowIntensity'].forEach(id => {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener('input', updateTextGlow);
    }
});

// ========================================
//   🎭 ANIMACIONES DE TEXTO
// ========================================

// 🎬 Tipo de animación
if (textAnimation) {
    textAnimation.addEventListener('change', function() {
        const animation = textAnimation.value;
        const duration = animationDuration ? animationDuration.value + 's' : '1s';
        
        localStorage.setItem('textAnimation', animation);
        localStorage.setItem('animationDuration', animationDuration ? animationDuration.value : '1');
        
        settingsChannel.postMessage({ 
            textAnimation: animation,
            animationDuration: duration
        });
    });
}

// ⏱️ Duración de animación
if (animationDuration) {
    animationDuration.addEventListener('input', function() {
        const duration = animationDuration.value;
        const animation = textAnimation ? textAnimation.value : 'none';
        
        const durationDisplay = document.getElementById('animationDurationDisplay');
        if (durationDisplay) {
            durationDisplay.textContent = duration + 's';
        }
        
        localStorage.setItem('animationDuration', duration);
        
        settingsChannel.postMessage({ 
            textAnimation: animation,
            animationDuration: duration + 's'
        });
    });
}