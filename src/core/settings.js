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
const containerMargin = document.getElementById("containerMargin");

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
const titleAlignment = document.getElementById("titleAlignment");
const titleAlignmentNoBoxGroup = document.getElementById("titleAlignmentNoBoxGroup");

// ✏️ CONTORNO DEL TÍTULO
const titleStroke = document.getElementById("titleStroke");
const titleStrokeColor = document.getElementById("titleStrokeColor");
const titleStrokeWidth = document.getElementById("titleStrokeWidth");
const titleStrokeAdvanced = document.getElementById("titleStrokeAdvanced");

// 📦 RECUADRO DEL TÍTULO
const titleBoxEnabled = document.getElementById("titleBoxEnabled");
const titleBoxControls = document.getElementById("titleBoxControls");
const titleBoxSize = document.getElementById("titleBoxSize");
const titleBoxPadding = document.getElementById("titleBoxPadding");
const titleBoxFullWidth = document.getElementById("titleBoxFullWidth");
const titleBoxWidth = document.getElementById("titleBoxWidth");
const titleBoxWidthGroup = document.getElementById("titleBoxWidthGroup");
const titleBoxColor = document.getElementById("titleBoxColor");
const titleBoxOpacity = document.getElementById("titleBoxOpacity");
const titleBoxBorder = document.getElementById("titleBoxBorder");
const titleBoxBorderColor = document.getElementById("titleBoxBorderColor");
const titleBoxRadius = document.getElementById("titleBoxRadius");
const titleBoxBlur = document.getElementById("titleBoxBlur");
const titleBoxStroke = document.getElementById("titleBoxStroke");
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
        // Verificar si el recuadro del título está activo
        const titleBoxEnabled = localStorage.getItem('titleBoxEnabled') === 'true';
        let referenceColor;
        
        if (titleBoxEnabled) {
            // Si hay recuadro, usar el color del recuadro
            referenceColor = localStorage.getItem('titleBoxColor') || '#ffffff';
        } else {
            // Si no hay recuadro, usar el color del fondo del contenedor
            referenceColor = localStorage.getItem('bgColor') || '#000000';
        }
        
        const oppositeColor = getOppositeColor(referenceColor);
        
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
   ✏️ CONTORNO DEL TÍTULO
   ------------------------------------------ */

// ✅ Activar contorno del título
if (titleStroke) {
    titleStroke.addEventListener('change', function() {
        const enabled = titleStroke.checked;
        
        if (titleStrokeAdvanced) {
            titleStrokeAdvanced.style.display = enabled ? 'grid' : 'none';
        }
        
        localStorage.setItem('titleStroke', enabled);
        settingsChannel.postMessage({ titleStroke: enabled });
    });
}

// 🎨 Color del contorno del título
if (titleStrokeColor) {
    titleStrokeColor.addEventListener('input', function() {
        const color = titleStrokeColor.value;
        localStorage.setItem('titleStrokeColor', color);
        settingsChannel.postMessage({ titleStrokeColor: color });
    });
}

// 📏 Grosor del contorno del título
if (titleStrokeWidth) {
    titleStrokeWidth.addEventListener('input', function() {
        const width = titleStrokeWidth.value;
        document.getElementById('titleStrokeWidthDisplay').textContent = width + 'px';
        localStorage.setItem('titleStrokeWidth', width);
        settingsChannel.postMessage({ titleStrokeWidth: width });
    });
}

/* ------------------------------------------
   📦 RECUADRO DEL TÍTULO
   ------------------------------------------ */

// 📐 Alineación del título sin recuadro
if (titleAlignment) {
    titleAlignment.addEventListener("change", function () {
        const alignment = titleAlignment.value;
        localStorage.setItem('titleAlignment', alignment);
        settingsChannel.postMessage({ titleAlignment: alignment });
    });
}

// ✅ Activar recuadro del título
if (titleBoxEnabled) {
    titleBoxEnabled.addEventListener("change", function () {
        const isEnabled = titleBoxEnabled.checked;
        localStorage.setItem('titleBoxEnabled', isEnabled);
        settingsChannel.postMessage({ titleBoxEnabled: isEnabled });
        
        // Mostrar/ocultar los controles del recuadro
        if (titleBoxControls) {
            titleBoxControls.style.display = isEnabled ? 'grid' : 'none';
        }
        
        // Mostrar/ocultar el control de alineación según el estado del recuadro
        if (titleAlignmentNoBoxGroup) {
            titleAlignmentNoBoxGroup.style.display = isEnabled ? 'none' : 'block';
        }
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

// ✏️ Contorno del título
if (titleBoxStroke) {
    titleBoxStroke.addEventListener('change', function() {
        const enabled = titleBoxStroke.checked;
        localStorage.setItem('titleBoxStroke', enabled);
        settingsChannel.postMessage({ titleBoxStroke: enabled });
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

// 🎨 Color del borde del recuadro
if (titleBoxBorderColor) {
    titleBoxBorderColor.addEventListener('input', function() {
        const borderColor = titleBoxBorderColor.value;
        localStorage.setItem('titleBoxBorderColor', borderColor);
        settingsChannel.postMessage({ titleBoxBorderColor: borderColor });
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
if (bgColorInput) {
    bgColorInput.value = savedBgColor || '#ffffff'; // Blanco por defecto
    if (!savedBgColor) {
        localStorage.setItem('bgColor', 'rgba(255, 255, 255, 1)');
    }
}

const savedFontColor = localStorage.getItem('fontColor');
if (fontColorInput) {
    fontColorInput.value = savedFontColor || '#000000'; // Negro por defecto
    if (!savedFontColor) {
        localStorage.setItem('fontColor', '#000000');
    }
}

// Cargar color del título
const savedTitleColor = localStorage.getItem('titleColor');
if (titleColor) {
    titleColor.value = savedTitleColor || '#000000'; // Negro por defecto
    if (!savedTitleColor) {
        localStorage.setItem('titleColor', '#000000');
    }
}

// Cargar fuente
const savedFontFamily = localStorage.getItem('fontFamily');
if (fontElement) {
    if (savedFontFamily) {
        fontElement.value = savedFontFamily;
    } else {
        fontElement.value = 'Poppins'; // Poppins por defecto
        localStorage.setItem('fontFamily', 'Poppins');
    }
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
const savedTitleStroke = localStorage.getItem('titleStroke') === 'true';
const savedTitleStrokeColor = localStorage.getItem('titleStrokeColor') || '#000000';
const savedTitleStrokeWidth = localStorage.getItem('titleStrokeWidth') || '1';

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

// Aplicar contorno del título
if (titleStroke) {
    titleStroke.checked = savedTitleStroke;
    
    if (titleStrokeAdvanced) {
        titleStrokeAdvanced.style.display = savedTitleStroke ? 'grid' : 'none';
    }
}

if (titleStrokeColor) {
    titleStrokeColor.value = savedTitleStrokeColor;
}

if (titleStrokeWidth) {
    titleStrokeWidth.value = savedTitleStrokeWidth;
    document.getElementById('titleStrokeWidthDisplay').textContent = savedTitleStrokeWidth + 'px';
}

/* ------------------------------------------
   📦 ALINEACIÓN DEL TÍTULO SIN RECUADRO
   ------------------------------------------ */

const savedTitleAlignment = localStorage.getItem('titleAlignment') || 'left';

if (titleAlignment) {
    titleAlignment.value = savedTitleAlignment;
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
const savedTitleBoxStroke = localStorage.getItem('titleBoxStroke') === 'true';
const savedTitleBoxOpacity = localStorage.getItem('titleBoxOpacity') || '80';
const savedTitleBoxBorder = localStorage.getItem('titleBoxBorder') || '1';
const savedTitleBoxBorderColor = localStorage.getItem('titleBoxBorderColor') || '#ffffff';
const savedTitleBoxRadius = localStorage.getItem('titleBoxRadius') || '6';
const savedTitleBoxBlur = localStorage.getItem('titleBoxBlur') === 'true';

// Aplicar configuraciones del recuadro
if (titleBoxEnabled) {
    titleBoxEnabled.checked = savedTitleBoxEnabled;
    
    // Mostrar/ocultar los controles del recuadro según el estado inicial
    if (titleBoxControls) {
        titleBoxControls.style.display = savedTitleBoxEnabled ? 'grid' : 'none';
    }
    
    // Mostrar/ocultar el control de alineación según el estado inicial del recuadro
    if (titleAlignmentNoBoxGroup) {
        titleAlignmentNoBoxGroup.style.display = savedTitleBoxEnabled ? 'none' : 'block';
    }
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

if (titleBoxStroke) {
    titleBoxStroke.checked = savedTitleBoxStroke;
}

if (titleBoxOpacity) {
    titleBoxOpacity.value = savedTitleBoxOpacity;
    document.getElementById('titleBoxOpacityDisplay').textContent = savedTitleBoxOpacity + '%';
}

if (titleBoxBorder) {
    titleBoxBorder.value = savedTitleBoxBorder;
    document.getElementById('titleBoxBorderDisplay').textContent = savedTitleBoxBorder + 'px';
}

if (titleBoxBorderColor) {
    titleBoxBorderColor.value = savedTitleBoxBorderColor;
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
    localStorage.setItem('containerPadding', '20'); // 20px padding por defecto
    if (containerPadding) {
        containerPadding.value = '20';
        document.getElementById('paddingDisplay').textContent = '20px';
    }
}

if (!localStorage.getItem('containerMargin')) {
    localStorage.setItem('containerMargin', '0'); // 0px margin por defecto
    if (containerMargin) {
        containerMargin.value = '0';
        document.getElementById('marginDisplay').textContent = '0px';
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
        background: {
            type: 'linear',
            color: '#0f172a',
            color2: '#1e293b',
            color3: '#020617',
            angle: 130
        },
        container: {
            padding: 18,
            radius: 24
        },
        text: {
            fontFamily: 'Poppins',
            color: '#f8fafc',
            align: 'Left',
            colorType: 'solid',
            shadow: { enabled: true, color: 'rgba(8, 13, 26, 0.55)', x: 0, y: 6, blur: 18 },
            glow: { enabled: false },
            stroke: { enabled: false }
        },
        title: {
            color: '#e2e8f0',
            weight: '600',
            fontSize: 24,
            spacing: 0.5,
            alignment: 'left',
            positionX: 18,
            positionY: 20,
            shadow: { enabled: false },
            stroke: true,
            box: {
                enabled: true,
                size: 'medium',
                padding: 12,
                fullWidth: true,
                width: 100,
                color: '#1e293b',
                opacity: 78,
                border: 0,
                radius: 12,
                blur: true,
                alignment: 'left'
            }
        }
    },
    claro: {
        background: {
            type: 'solid',
            color: '#f6f7fb'
        },
        container: {
            padding: 22,
            radius: 20,
            opacity: 0.92
        },
        text: {
            fontFamily: 'Inter',
            color: '#1f2933',
            align: 'Center',
            colorType: 'solid',
            shadow: { enabled: false },
            glow: { enabled: false },
            stroke: { enabled: false }
        },
        title: {
            color: '#1f2937',
            weight: '500',
            fontSize: 20,
            spacing: 0,
            alignment: 'center',
            positionX: 12,
            positionY: 18,
            shadow: { enabled: false },
            stroke: false,
            box: {
                enabled: false
            }
        }
    },
    blanco: {
        background: {
            type: 'solid',
            color: '#ffffff'
        },
        container: {
            padding: 18,
            radius: 16,
            opacity: 0.88
        },
        text: {
            fontFamily: 'Poppins',
            color: '#111827',
            align: 'Left',
            colorType: 'solid',
            shadow: { enabled: false },
            glow: { enabled: false },
            stroke: { enabled: true, color: '#111827', width: 1 }
        },
        title: {
            color: '#0f172a',
            weight: '600',
            fontSize: 21,
            spacing: 0.5,
            alignment: 'left',
            positionX: 18,
            positionY: 18,
            shadow: { enabled: false },
            stroke: true,
            box: {
                enabled: true,
                size: 'small',
                padding: 8,
                fullWidth: false,
                color: '#0f172a',
                opacity: 18,
                border: 1,
                borderColor: '#0f172a',
                radius: 10,
                blur: false
            }
        }
    },
    grueso: {
        background: {
            type: 'solid',
            color: '#101827'
        },
        container: {
            padding: 16,
            radius: 18,
            opacity: 0.82
        },
        text: {
            fontFamily: 'Inter',
            color: '#f8fafc',
            align: 'Left',
            colorType: 'solid',
            shadow: { enabled: true, color: 'rgba(0, 0, 0, 0.45)', x: 0, y: 4, blur: 14 },
            glow: { enabled: false },
            stroke: { enabled: false }
        },
        title: {
            color: '#f9fafb',
            weight: '700',
            fontSize: 22,
            spacing: 0,
            alignment: 'left',
            positionX: 18,
            positionY: 18,
            shadow: { enabled: false },
            stroke: true,
            box: {
                enabled: true,
                size: 'medium',
                padding: 10,
                fullWidth: false,
                color: '#2563eb',
                opacity: 80,
                border: 0,
                radius: 10,
                blur: false
            }
        }
    },
    suave: {
        background: {
            type: 'linear',
            color: '#1e293b',
            color2: '#334155',
            color3: '#0f172a',
            angle: 160
        },
        container: {
            padding: 20,
            radius: 28
        },
        text: {
            fontFamily: 'Georgia',
            color: '#f8fafc',
            align: 'Center',
            colorType: 'solid',
            shadow: { enabled: false },
            glow: { enabled: true, color: '#a5b4fc', intensity: 7 },
            stroke: { enabled: false }
        },
        title: {
            color: '#f1f5f9',
            weight: '500',
            fontSize: 23,
            spacing: 0.5,
            alignment: 'center',
            positionX: 12,
            positionY: 18,
            shadow: { enabled: false },
            stroke: false,
            box: {
                enabled: true,
                size: 'large',
                padding: 14,
                fullWidth: true,
                width: 100,
                color: '#0f172a',
                opacity: 60,
                border: 0,
                radius: 0,
                blur: true,
                alignment: 'center'
            }
        }
    }
};

// 🎯 Aplicar presets
document.querySelectorAll('.preset-btn[data-preset]').forEach(btn => {
    btn.addEventListener('click', () => {
        const presetName = btn.dataset.preset;
        const preset = presets[presetName];
        if (preset) {
            console.log(`🎨 Aplicando preset: ${presetName}`);
            applyPreset(preset);
        }
    });
});

// 🔄 Botón Reset Todo
const resetAllSettingsBtn = document.getElementById('resetAllSettings');
if (resetAllSettingsBtn) {
    resetAllSettingsBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres resetear TODAS las configuraciones? Esta acción no se puede deshacer.')) {
            // Limpiar todo el localStorage
            localStorage.clear();
            
            // ⚙️ VALORES POR DEFECTO DESPUÉS DEL RESET
            
            // Visibilidad
            localStorage.setItem('titleShow', 'true');
            
            // Colores - Texto y título en negro
            localStorage.setItem('fontColor', '#000000');
            localStorage.setItem('titleColor', '#000000');
            
            // Fondo blanco
            localStorage.setItem('bgColor', 'rgba(255, 255, 255, 1)');
            
            // Fuente Poppins
            localStorage.setItem('fontFamily', 'Poppins');
            
            // Enviar configuraciones al browser source
            settingsChannel.postMessage({ titleShow: true });
            settingsChannel.postMessage({ selectedFontColor: '#000000' });
            settingsChannel.postMessage({ selectedTitleColor: '#000000' });
            settingsChannel.postMessage({ selectedBgColor: 'rgba(255, 255, 255, 1)' });
            settingsChannel.postMessage({ selectedFont: 'Poppins' });
            
            // Recargar la página para aplicar valores por defecto
            window.location.reload();
        }
    });
}

// 🔧 Función para aplicar un preset completo
function applyPreset(preset) {
    if (!preset) return;

    const dispatchInputEvent = (element) => {
        if (element) {
            element.dispatchEvent(new Event('input', { bubbles: true }));
        }
    };

    const dispatchChangeEvent = (element) => {
        if (element) {
            element.dispatchEvent(new Event('change', { bubbles: true }));
        }
    };

    // ===============================
    // 🎨 Fondo y contenedor
    // ===============================
    if (preset.background) {
        const { type, color, color2, color3, angle } = preset.background;

        if (type && backgroundTypeSelect) {
            backgroundTypeSelect.value = type;
            dispatchChangeEvent(backgroundTypeSelect);
        }

        if (color && bgColorInput) {
            bgColorInput.value = color;
            dispatchInputEvent(bgColorInput);
        }

        if (type === 'linear' || type === 'radial') {
            if (color2 && gradientColor2) {
                gradientColor2.value = color2;
                dispatchInputEvent(gradientColor2);
            }
            if (color3 && gradientColor3) {
                gradientColor3.value = color3;
                dispatchInputEvent(gradientColor3);
            }
            if (typeof angle !== 'undefined' && gradientAngle) {
                gradientAngle.value = angle;
                dispatchInputEvent(gradientAngle);
            }

            if (opacityRange) {
                opacityRange.value = '10';
                const opacityDisplay = document.getElementById('opacityDisplay');
                if (opacityDisplay) {
                    opacityDisplay.textContent = '100%';
                }
                localStorage.removeItem('containerOpacity');
            }
        }
    }

    if (preset.container) {
        const { padding, radius, opacity } = preset.container;

        if (typeof padding === 'number' && containerPadding) {
            containerPadding.value = String(padding);
            dispatchInputEvent(containerPadding);
        }

        if (typeof radius === 'number' && roundedCorner) {
            roundedCorner.value = String(radius);
            dispatchInputEvent(roundedCorner);
        }

        if (
            typeof opacity === 'number' &&
            opacityRange &&
            backgroundTypeSelect &&
            backgroundTypeSelect.value === 'solid'
        ) {
            const sliderValue = Math.round(Math.max(0, Math.min(1, opacity)) * 10);
            opacityRange.value = String(sliderValue);
            dispatchInputEvent(opacityRange);
        }
    }

    // ===============================
    // 📝 Texto principal
    // ===============================
    if (preset.text) {
        const {
            fontFamily,
            color,
            align,
            colorType,
            gradientColor2: textGradientColor,
            shadow,
            glow,
            stroke
        } = preset.text;

        if (fontFamily && fontElement) {
            fontElement.value = fontFamily;
            dispatchChangeEvent(fontElement);
        }

        if (color && fontColorInput) {
            fontColorInput.value = color;
            dispatchInputEvent(fontColorInput);
        }

        if (colorType && textColorType) {
            textColorType.value = colorType;
            dispatchChangeEvent(textColorType);
        }

        if (textGradientColor && textGradientColor2) {
            textGradientColor2.value = textGradientColor;
            dispatchInputEvent(textGradientColor2);
        }

        if (align && textAlignElement) {
            textAlignElement.value = align;
            dispatchChangeEvent(textAlignElement);
        }

        if (shadow) {
            const shadowEnabled = document.getElementById('textShadowEnabled');
            const shadowColor = document.getElementById('textShadowColor');
            const shadowX = document.getElementById('textShadowX');
            const shadowY = document.getElementById('textShadowY');
            const shadowBlur = document.getElementById('textShadowBlur');

            if (shadowColor && shadow.color) shadowColor.value = shadow.color;
            if (shadowX && typeof shadow.x !== 'undefined') shadowX.value = String(shadow.x);
            if (shadowY && typeof shadow.y !== 'undefined') shadowY.value = String(shadow.y);
            if (shadowBlur && typeof shadow.blur !== 'undefined') shadowBlur.value = String(shadow.blur);

            if (shadowEnabled) {
                shadowEnabled.checked = !!shadow.enabled;
                toggleTextShadowControls();
                if (shadow.enabled) {
                    updateTextShadow();
                }
            }
        }

        if (glow) {
            const glowEnabled = document.getElementById('textGlowEnabled');
            const glowColor = document.getElementById('textGlowColor');
            const glowIntensity = document.getElementById('textGlowIntensity');

            if (glowColor && glow.color) glowColor.value = glow.color;
            if (glowIntensity && typeof glow.intensity !== 'undefined') {
                glowIntensity.value = String(glow.intensity);
            }

            if (glowEnabled) {
                glowEnabled.checked = !!glow.enabled;
                toggleTextGlowControls();
                if (glow.enabled) {
                    updateTextGlow();
                }
            }
        }

        if (stroke) {
            const strokeEnabled = document.getElementById('textStrokeEnabled');
            const strokeColor = document.getElementById('textStrokeColor');
            const strokeWidth = document.getElementById('textStrokeWidth');

            if (strokeColor && stroke.color) strokeColor.value = stroke.color;
            if (strokeWidth && typeof stroke.width !== 'undefined') {
                strokeWidth.value = String(stroke.width);
            }

            if (strokeEnabled) {
                strokeEnabled.checked = !!stroke.enabled;
                toggleTextStrokeControls();
                if (stroke.enabled) {
                    updateTextStroke();
                }
            }
        }
    }

    // ===============================
    // 🏷️ Configuración del título
    // ===============================
    if (preset.title) {
        const {
            color,
            weight,
            fontSize,
            spacing,
            alignment,
            positionX,
            positionY,
            shadow: titleShadowConfig,
            box
        } = preset.title;

        if (color && titleColor) {
            titleColor.value = color;
            dispatchInputEvent(titleColor);
        }

        if (weight && titleFontWeight) {
            titleFontWeight.value = weight;
            dispatchChangeEvent(titleFontWeight);
        }

        if (typeof fontSize === 'number' && titleFontSize) {
            titleFontSize.value = String(fontSize);
            dispatchInputEvent(titleFontSize);
        }

        if (typeof spacing === 'number' && titleSpacing) {
            titleSpacing.value = String(spacing);
            dispatchInputEvent(titleSpacing);
        }

        if (typeof positionX === 'number' && titlePositionX) {
            titlePositionX.value = String(positionX);
            dispatchInputEvent(titlePositionX);
        }

        if (typeof positionY === 'number' && titlePositionY) {
            titlePositionY.value = String(positionY);
            dispatchInputEvent(titlePositionY);
        }

        if (alignment && titleAlignment) {
            titleAlignment.value = alignment;
            dispatchChangeEvent(titleAlignment);
        }

        if (titleShadowConfig) {
            if (titleShadowColor && titleShadowConfig.color) {
                titleShadowColor.value = titleShadowConfig.color;
            }

            if (titleShadowSize && typeof titleShadowConfig.size !== 'undefined') {
                titleShadowSize.value = String(titleShadowConfig.size);
            }

            if (titleShadow) {
                titleShadow.checked = !!titleShadowConfig.enabled;
                titleShadow.dispatchEvent(new Event('change', { bubbles: true }));
                if (titleShadowConfig.enabled) {
                    if (titleShadowColor) titleShadowColor.dispatchEvent(new Event('input', { bubbles: true }));
                    if (titleShadowSize) titleShadowSize.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
        }

        if (box) {
            if (typeof box.enabled === 'boolean' && titleBoxEnabled) {
                titleBoxEnabled.checked = box.enabled;
                titleBoxEnabled.dispatchEvent(new Event('change', { bubbles: true }));
            }

            if (box.size && titleBoxSize) {
                titleBoxSize.value = box.size;
                titleBoxSize.dispatchEvent(new Event('change', { bubbles: true }));
            }

            if (typeof box.padding === 'number' && titleBoxPadding) {
                titleBoxPadding.value = String(box.padding);
                titleBoxPadding.dispatchEvent(new Event('input', { bubbles: true }));
            }

            if (typeof box.fullWidth === 'boolean' && titleBoxFullWidth) {
                titleBoxFullWidth.checked = box.fullWidth;
                titleBoxFullWidth.dispatchEvent(new Event('change', { bubbles: true }));
            }

            if (typeof box.width === 'number' && titleBoxWidth) {
                titleBoxWidth.value = String(box.width);
                titleBoxWidth.dispatchEvent(new Event('input', { bubbles: true }));
            }

            if (box.color && titleBoxColor) {
                titleBoxColor.value = box.color;
                titleBoxColor.dispatchEvent(new Event('input', { bubbles: true }));
            }

            if (typeof box.stroke !== 'undefined' && titleBoxStroke) {
                titleBoxStroke.checked = box.stroke;
                titleBoxStroke.dispatchEvent(new Event('change', { bubbles: true }));
            }

            if (typeof box.opacity === 'number' && titleBoxOpacity) {
                titleBoxOpacity.value = String(box.opacity);
                titleBoxOpacity.dispatchEvent(new Event('input', { bubbles: true }));
            }

            if (typeof box.border === 'number' && titleBoxBorder) {
                titleBoxBorder.value = String(box.border);
                titleBoxBorder.dispatchEvent(new Event('input', { bubbles: true }));
            }

            if (box.borderColor && titleBoxBorderColor) {
                titleBoxBorderColor.value = box.borderColor;
                titleBoxBorderColor.dispatchEvent(new Event('input', { bubbles: true }));
            }

            if (typeof box.radius === 'number' && titleBoxRadius) {
                titleBoxRadius.value = String(box.radius);
                titleBoxRadius.dispatchEvent(new Event('input', { bubbles: true }));
            }

            if (typeof box.blur === 'boolean' && titleBoxBlur) {
                titleBoxBlur.checked = box.blur;
                titleBoxBlur.dispatchEvent(new Event('change', { bubbles: true }));
            }

            if (box.alignment && titleFullWidthAlignment) {
                titleFullWidthAlignment.value = box.alignment;
                titleFullWidthAlignment.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
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

if (containerMargin) {
    containerMargin.addEventListener('input', function() {
        const margin = containerMargin.value;
        const marginDisplay = document.getElementById('marginDisplay');
        if (marginDisplay) {
            marginDisplay.textContent = margin + 'px';
        }
        localStorage.setItem('containerMargin', margin);
        settingsChannel.postMessage({ containerMargin: margin });
    });
}

/* ------------------------------------------
   🕰️ FORMATO DE TEXTO (ESTILOS)
   ------------------------------------------ */

// 💪 Botón de texto en negrita
const boldButton = document.getElementById("bold");
if (boldButton) {
    // Inicializar estado visual del botón
    const initialBoldState = localStorage.getItem('boldState') || 'normal';
    boldButton.style.fontWeight = initialBoldState;
    boldButton.style.backgroundColor = (initialBoldState === 'bold') ? '#55a' : '#555';
    
    boldButton.addEventListener("click", function () {
        let currentBoldState = localStorage.getItem('boldState') || 'normal';
        const newBoldState = (currentBoldState === 'bold') ? 'normal' : 'bold';
        
        // Actualizar estilo del botón
        boldButton.style.fontWeight = newBoldState;
        if (newBoldState === 'bold'){
            boldButton.style.backgroundColor = '#55a';
        } else {
            boldButton.style.backgroundColor = '#555';
        }
        
        // Guardar y enviar el nuevo estado
        localStorage.setItem('boldState', newBoldState);
        settingsChannel.postMessage({ currentBoldState: newBoldState });
    });
}

// 🕰️ Botón de texto en cursiva
const italicButton = document.getElementById("italic");
if (italicButton) {
    // Inicializar estado visual del botón
    const initialItalicState = localStorage.getItem('italicState') || 'normal';
    italicButton.style.fontStyle = initialItalicState;
    italicButton.style.backgroundColor = (initialItalicState === 'italic') ? '#55a' : '#555';
    
    italicButton.addEventListener("click", function () {
        let currentItalicState = localStorage.getItem('italicState') || 'normal';
        const newItalicState = (currentItalicState === 'italic') ? 'normal' : 'italic';
        
        // Actualizar estilo del botón
        if (newItalicState === 'italic'){
            italicButton.style.backgroundColor = '#55a';
            italicButton.style.fontStyle = 'italic';
        } else {
            italicButton.style.backgroundColor = '#555';
            italicButton.style.fontStyle = 'normal';
        }
        
        // Guardar y enviar el nuevo estado
        localStorage.setItem('italicState', newItalicState);
        settingsChannel.postMessage({ currentItalicState: newItalicState });
    });
}

// 📝 Botón de texto subrayado
const underlineButton = document.getElementById("underline");
if (underlineButton) {
    // Inicializar estado visual del botón
    const initialUnderlineState = localStorage.getItem('underlineState') || 'none';
    underlineButton.style.textDecoration = initialUnderlineState;
    underlineButton.style.backgroundColor = (initialUnderlineState === 'underline') ? '#55a' : '#555';
    
    underlineButton.addEventListener("click", function () {
        let currentUnderlineState = localStorage.getItem('underlineState') || 'none';
        const newUnderlineState = (currentUnderlineState === 'underline') ? 'none' : 'underline';
        
        // Actualizar estilo del botón
        if (newUnderlineState === 'underline'){
            underlineButton.style.backgroundColor = '#55a';
            underlineButton.style.textDecoration = 'underline';
        } else {
            underlineButton.style.backgroundColor = '#555';
            underlineButton.style.textDecoration = 'none';
        }
        
        // Guardar y enviar el nuevo estado
        localStorage.setItem('underlineState', newUnderlineState);
        settingsChannel.postMessage({ currentUnderlineState: newUnderlineState });
    });
}

// 📏 Alineación de texto
const textAlignElement = document.getElementById("textAlign");
if (textAlignElement) {
    // Inicializar valor del selector desde localStorage
    const savedTextAlign = localStorage.getItem('textAlign');
    if (savedTextAlign) {
        textAlignElement.value = savedTextAlign;
    }
    
    textAlignElement.addEventListener("change", function() {
        let selectedValue = textAlignElement.options[textAlignElement.selectedIndex].value;
        localStorage.setItem('textAlign', selectedValue);
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
