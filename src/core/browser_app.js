function hasOverflow() {
  const container = document.getElementById('bg-container');
  const messageDisplay = document.getElementById('messageDisplay');
  
  if (!container || !messageDisplay) return false;
  
  // Márgenes de seguridad más precisos
  const verticalMargin = 5; // Margen mínimo vertical
  const horizontalMargin = 10; // Margen mínimo horizontal
  
  const hasVerticalOverflow = messageDisplay.scrollHeight > (container.clientHeight - verticalMargin);
  const hasHorizontalOverflow = messageDisplay.scrollWidth > (container.clientWidth - horizontalMargin);
  
  // Log solo en casos de debug
  if (hasVerticalOverflow || hasHorizontalOverflow) {
    console.log(`Overflow detected - Container: ${container.clientWidth}x${container.clientHeight}, Message: ${messageDisplay.scrollWidth}x${messageDisplay.scrollHeight}`);
  }
  
  return hasVerticalOverflow || hasHorizontalOverflow;
}

// SISTEMA DE MEMORIA CONTEXTUAL PARA RECORDAR TAMAÑOS EXITOSOS
let fontSizeMemory = {
  history: [], // Historial de [caracteres, tamaño, éxito]
  maxHistorySize: 20,
  
  // Agregar un resultado exitoso al historial
  addSuccess: function(charCount, fontSize, containerArea) {
    this.history.push({
      chars: charCount,
      size: fontSize,
      area: containerArea,
      timestamp: Date.now(),
      success: true
    });
    
    // Mantener solo los últimos registros
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }
  },
  
  // Predecir un buen tamaño inicial basado en historial
  predictSize: function(charCount, containerArea) {
    if (this.history.length === 0) return null;
    
    // Buscar entradas similares en número de caracteres (±20%)
    const tolerance = 0.2;
    const minChars = charCount * (1 - tolerance);
    const maxChars = charCount * (1 + tolerance);
    
    const similarEntries = this.history.filter(entry => 
      entry.chars >= minChars && entry.chars <= maxChars && entry.success
    );
    
    if (similarEntries.length === 0) {
      // Si no hay similares por caracteres, buscar por área del contenedor
      const areaTolerance = 0.3;
      const minArea = containerArea * (1 - areaTolerance);
      const maxArea = containerArea * (1 + areaTolerance);
      
      const areaMatches = this.history.filter(entry => 
        entry.area >= minArea && entry.area <= maxArea && entry.success
      );
      
      if (areaMatches.length > 0) {
        // Usar el promedio de tamaños exitosos en áreas similares
        const avgSize = areaMatches.reduce((sum, entry) => sum + entry.size, 0) / areaMatches.length;
        return Math.round(avgSize);
      }
      
      return null;
    }
    
    // Usar el promedio ponderado de entradas similares (más recientes tienen más peso)
    let totalWeight = 0;
    let weightedSum = 0;
    
    similarEntries.forEach(entry => {
      const recencyWeight = 1 + (entry.timestamp - Date.now() + 300000) / 300000; // 5 min window
      const similarityWeight = 1 - Math.abs(entry.chars - charCount) / charCount;
      const weight = Math.max(0.1, recencyWeight * similarityWeight);
      
      weightedSum += entry.size * weight;
      totalWeight += weight;
    });
    
    return Math.round(weightedSum / totalWeight);
  },
  
  // Limpiar entradas muy antiguas
  cleanup: function() {
    const fiveMinutesAgo = Date.now() - 300000;
    this.history = this.history.filter(entry => entry.timestamp > fiveMinutesAgo);
  }
};

// FUNCIÓN MEJORADA PARA CALCULAR LÍNEAS CON MAYOR PRECISIÓN
function calculateEstimatedLines(text, fontSize, containerWidth) {
  // Limpiar texto de HTML y normalizar espacios
  const cleanText = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  
  // Caracteres promedio por píxel mejorado con diferentes factores
  let charWidthRatio = 0.55; // Base para fuentes regulares
  
  // Ajustar según el tamaño de fuente (fuentes pequeñas son proporcionalmente más anchas)
  if (fontSize < 16) {
    charWidthRatio = 0.62; // Fuentes pequeñas
  } else if (fontSize > 40) {
    charWidthRatio = 0.52; // Fuentes grandes son más estrechas proporcionalmente
  }
  
  // Ajustar según el tipo de contenido
  const hasNumbers = /\d/.test(cleanText);
  const hasPunctuation = /[.,:;!?]/.test(cleanText);
  const hasCapitals = /[A-Z]/.test(cleanText);
  
  if (hasNumbers) charWidthRatio += 0.02; // Números son más anchos
  if (hasPunctuation) charWidthRatio -= 0.01; // Puntuación es más estrecha
  if (hasCapitals) charWidthRatio += 0.01; // Mayúsculas son más anchas
  
  const charWidth = fontSize * charWidthRatio;
  
  // Área efectiva considerando márgenes y padding más realistas
  const effectiveWidth = containerWidth * 0.82; // 82% más conservador
  const charsPerLine = Math.floor(effectiveWidth / charWidth);
  
  // Si el texto es muy corto para wrap, retornar 1 línea
  if (cleanText.length <= charsPerLine) {
    return {
      estimatedLines: 1,
      charsPerLine: charsPerLine,
      charWidth: charWidth,
      effectiveWidth: effectiveWidth,
      maxWordLength: Math.max(...cleanText.split(' ').map(w => w.length)),
      totalWords: cleanText.split(' ').length,
      confidence: 0.95 // Alta confianza para textos cortos
    };
  }
  
  // Simulación mejorada de word-wrap
  const words = cleanText.split(' ');
  let lines = 1;
  let currentLineLength = 0;
  let longestLine = 0;
  
  for (const word of words) {
    const wordLength = word.length;
    const spaceNeeded = currentLineLength > 0 ? 1 : 0;
    const totalNeeded = currentLineLength + spaceNeeded + wordLength;
    
    if (totalNeeded > charsPerLine && currentLineLength > 0) {
      // Nueva línea
      longestLine = Math.max(longestLine, currentLineLength);
      lines++;
      currentLineLength = wordLength;
    } else {
      currentLineLength = totalNeeded;
    }
  }
  
  longestLine = Math.max(longestLine, currentLineLength);
  
  // Calcular confianza basada en qué tan cerca estamos del límite
  const avgLineLength = cleanText.length / lines;
  const utilizationRatio = avgLineLength / charsPerLine;
  let confidence = 0.8;
  
  if (utilizationRatio > 0.7 && utilizationRatio < 0.9) {
    confidence = 0.9; // Alta confianza en utilización óptima
  } else if (utilizationRatio < 0.5 || utilizationRatio > 0.95) {
    confidence = 0.6; // Baja confianza en extremos
  }
  
  // Ajuste por palabras excepcionalmente largas
  const maxWordLength = Math.max(...words.map(w => w.length));
  if (maxWordLength > charsPerLine * 0.8) {
    const extraLines = Math.ceil(maxWordLength / charsPerLine) - 1;
    lines += extraLines;
    confidence *= 0.8; // Reducir confianza cuando hay palabras muy largas
  }
  
  return {
    estimatedLines: lines,
    charsPerLine: charsPerLine,
    charWidth: charWidth,
    effectiveWidth: effectiveWidth,
    maxWordLength: maxWordLength,
    totalWords: words.length,
    confidence: confidence,
    longestLine: longestLine,
    avgLineLength: avgLineLength,
    utilizationRatio: utilizationRatio
  };
}

// ALGORITMO INTELIGENTE MEJORADO CON MEMORIA CONTEXTUAL Y TRANSICIONES SUAVES
function calculateOptimalFontSize(text, containerWidth, containerHeight, hasTitle = false) {
  // Limpiar texto y contar caracteres
  const textOnly = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  const totalChars = textOnly.length;
  const containerArea = containerWidth * containerHeight;
  
  console.log(`🧠 ALGORITMO INTELIGENTE MEJORADO: "${textOnly.substring(0, 30)}..." (${totalChars} chars)`);
  console.log(`   📐 Contenedor: ${containerWidth}×${containerHeight}px (${containerArea} área), hasTitle: ${hasTitle}`);
  
  // PASO 1: Sistema completamente dinámico - SIN memoria contextual
  // fontSizeMemory.cleanup(); // DESHABILITADO para comportamiento puramente dinámico
  // const predictedSize = fontSizeMemory.predictSize(totalChars, containerArea); // DESHABILITADO
  const predictedSize = null; // Forzar a null para usar solo rangos dinámicos
  
  console.log(`   🎯 Modo dinámico: Sin predicción de memoria, basado solo en caracteres`);
  
  // PASO 2: Definir rangos ajustados según especificaciones del usuario
  let minSize, maxSize, tramo, startingPoint;
  
  // Rangos específicos basados en los tamaños exactos solicitados por el usuario

  if (totalChars <= 9) {
    // TRAMO 1: Referencias ultra cortas (29-38px)
    minSize = 29;  maxSize = 38;   tramo = "Referencias ultra cortas";
  } else if (totalChars <= 12) {
    // TRAMO 2: Referencias muy cortas (43-49px)
    minSize = 43;  maxSize = 49;   tramo = "Referencias muy cortas";
  } else if (totalChars <= 15) {
    // TRAMO 3: Referencias cortas (50-60px)
    minSize = 50;  maxSize = 60;   tramo = "Referencias cortas";
  } else if (totalChars <= 20) {
    // TRAMO 4: Referencias medianas (44-48px)
    minSize = 44;  maxSize = 48;   tramo = "Referencias medianas";
  } else if (totalChars <= 80) {
    // TRAMO 5: Versículos cortos (35-45px)
    minSize = 35;  maxSize = 45;   tramo = "Versículos cortos";
  } else if (totalChars <= 150) {
    // TRAMO 6: Versículos medianos (30-40px)
    minSize = 30;  maxSize = 40;   tramo = "Versículos medianos";
  } else if (totalChars <= 350) {
    // TRAMO 7: Textos largos (33-39px) - Para textos como Génesis 1:26
    minSize = 33;  maxSize = 39;   tramo = "Textos largos";
  } else {
    // TRAMO 8: Textos extremadamente largos (27-31px) - Para textos como Ester 8:9
    minSize = 27;  maxSize = 31;   tramo = "Textos extremadamente largos";
  }
  
  // PASO 3: Punto de partida completamente dinámico (siempre centro del rango)
  // Punto de partida siempre en el centro del rango para comportamiento consistente
  startingPoint = Math.round((minSize + maxSize) / 2);
  console.log(`   🎯 Iniciando desde centro del rango: ${startingPoint}px (modo dinámico)`);
  
  console.log(`   📊 ${tramo}: ${totalChars} chars → Rango ${minSize}-${maxSize}px`);
  
  // PASO 4: Búsqueda bidireccional inteligente CON LÍMITES ESTRICTOS
  const effectiveHeight = containerHeight * (hasTitle ? 0.68 : 0.87); // Algo más generoso
  const lineHeightMultiplier = 1.25; // Slightly más compacto
  
  console.log(`   🎯 Altura disponible: ${effectiveHeight}px (de ${containerHeight}px total)`);
  console.log(`   🚧 Límites estrictos: ${minSize}-${maxSize}px para ${tramo}`);
  
  let bestFontSize = startingPoint;
  let bestScore = -1;
  const maxIterations = 30;
  let iterations = 0;
  
  // Función para evaluar qué tan bueno es un tamaño (CON LÍMITES ESTRICTOS)
  function evaluateSize(fontSize) {
    // VERIFICACIÓN ESTRICTA: El tamaño debe estar dentro del rango definido
    if (fontSize < minSize || fontSize > maxSize) {
      console.log(`   ❌ ${fontSize}px fuera del rango ${minSize}-${maxSize}px`);
      return 0; // Puntuación 0 si está fuera del rango
    }
    
    const lineInfo = calculateEstimatedLines(textOnly, fontSize, containerWidth);
    const totalTextHeight = lineInfo.estimatedLines * fontSize * lineHeightMultiplier;
    
    if (totalTextHeight > effectiveHeight) {
      console.log(`   ❌ ${fontSize}px no cabe: ${totalTextHeight.toFixed(1)}px > ${effectiveHeight.toFixed(1)}px`);
      return 0; // No cabe, puntuación 0
    }
    
    // Calcular puntuación basada en uso del espacio disponible
    const heightUtilization = totalTextHeight / effectiveHeight;
    const sizeBonus = fontSize / maxSize; // Mayor bonificación para tamaños más grandes
    const confidenceBonus = lineInfo.confidence || 0.8;
    
    // La puntuación ideal está entre 70-90% de utilización del espacio
    let utilizationScore = 1;
    if (heightUtilization < 0.7) {
      utilizationScore = heightUtilization / 0.7; // Penalizar poco uso del espacio
    } else if (heightUtilization > 0.9) {
      utilizationScore = (1 - heightUtilization) / 0.1; // Penalizar uso excesivo
    }
    
    const finalScore = (utilizationScore * 0.4) + (sizeBonus * 0.4) + (confidenceBonus * 0.2);
    
    console.log(`   ✅ Evaluando ${fontSize}px: ${lineInfo.estimatedLines} líneas, ${totalTextHeight.toFixed(1)}px/${effectiveHeight.toFixed(1)}px (${(heightUtilization*100).toFixed(1)}%), score: ${finalScore.toFixed(3)}`);
    
    return finalScore;
  }
  
  // Evaluar el punto de partida
  let currentScore = evaluateSize(startingPoint);
  bestScore = currentScore;
  bestFontSize = startingPoint;
  
  // Búsqueda hacia arriba (tamaños mayores)
  for (let fontSize = startingPoint + 1; fontSize <= maxSize && iterations < maxIterations; fontSize++, iterations++) {
    const score = evaluateSize(fontSize);
    if (score > bestScore) {
      bestScore = score;
      bestFontSize = fontSize;
    } else if (score === 0) {
      break; // Ya no cabe, no probar tamaños mayores
    }
  }
  
  // Búsqueda hacia abajo (tamaños menores)
  for (let fontSize = startingPoint - 1; fontSize >= minSize && iterations < maxIterations; fontSize--, iterations++) {
    const score = evaluateSize(fontSize);
    if (score > bestScore) {
      bestScore = score;
      bestFontSize = fontSize;
    }
  }
  
  // PASO 5: Memoria contextual deshabilitada para comportamiento dinámico
  // if (bestScore > 0) {
  //   fontSizeMemory.addSuccess(totalChars, bestFontSize, containerArea); // DESHABILITADO
  //   console.log(`   💾 Resultado guardado en memoria contextual`); // DESHABILITADO
  // }
  console.log(`   🔄 Memoria contextual deshabilitada - comportamiento puramente dinámico`);
  
  // PASO 6: Información final detallada
  const finalLineInfo = calculateEstimatedLines(textOnly, bestFontSize, containerWidth);
  const finalTextHeight = finalLineInfo.estimatedLines * bestFontSize * lineHeightMultiplier;
  const heightUsagePercent = ((finalTextHeight / effectiveHeight) * 100).toFixed(1);
  
  console.log(`   🎯 RESULTADO FINAL INTELIGENTE:`);
  console.log(`      ├─ Tamaño: ${bestFontSize}px (rango ${minSize}-${maxSize}px, score: ${bestScore.toFixed(3)})`);
  console.log(`      ├─ Líneas: ${finalLineInfo.estimatedLines} (${finalLineInfo.charsPerLine} chars/línea, confianza: ${(finalLineInfo.confidence*100).toFixed(1)}%)`);
  console.log(`      ├─ Altura: ${finalTextHeight.toFixed(1)}px de ${effectiveHeight.toFixed(1)}px (${heightUsagePercent}%)`);
  console.log(`      ├─ Iteraciones: ${iterations}/${maxIterations}`);
  console.log(`      └─ Memoria: DESHABILITADA (modo completamente dinámico)`);
  
  const wordCount = textOnly.split(/\s+/).length;
  const spaceCount = (textOnly.match(/\s/g) || []).length;
  
  return {
    fontSize: bestFontSize,
    totalCharacters: totalChars,
    letterCount: totalChars - spaceCount,
    spaceCount: spaceCount,
    wordCount: wordCount,
    estimatedLines: finalLineInfo.estimatedLines,
    charsPerLine: finalLineInfo.charsPerLine,
    totalTextHeight: finalTextHeight,
    heightUsagePercent: parseFloat(heightUsagePercent),
    effectiveHeight: effectiveHeight,
    estimatedDensity: totalChars / (bestFontSize * bestFontSize),
    confidence: finalLineInfo.confidence,
    score: bestScore,
    iterations: iterations,
    predictedSize: predictedSize,
    method: 'intelligent-contextual-adaptive',
    method2: bestFontSize // Para mantener compatibilidad
  };
}

// Función para analizar estructura del texto (simplificada)
function analyzeTextStructure(text) {
  const hasNaturalLineBreaks = text.includes('\n');
  const wordCount = text.trim().split(/\s+/).length;
  const averageWordLength = text.replace(/\s+/g, '').length / wordCount;
  const spaceCount = (text.match(/\s/g) || []).length;
  const spaceToCharRatio = spaceCount / text.length;
  
  return {
    hasNaturalLineBreaks,
    wordCount,
    averageWordLength,
    isLongText: wordCount > 12,
    hasLongWords: averageWordLength > 8,
    hasExcessiveSpacing: spaceToCharRatio > 0.2,
    spaceToCharRatio
  };
}



// Variables para evitar múltiples ejecuciones y mantener consistencia
let isAdjusting = false;
let adjustTimeout = null;
let cachedFontSize = null; // Cache del tamaño calculado
let lastTextContent = ''; // Para detectar si el contenido cambió realmente
let lastContainerDimensions = null; // Para detectar cambios de tamaño del contenedor

// Inicializar el gestor de estilos cuando el DOM esté listo
function initializeStyleManager() {
  if (window.styleManager) {
    window.styleManager.init();
    console.log('✅ Gestor de estilos inicializado');
  } else {
    console.warn('⚠️ Gestor de estilos no disponible');
  }
}

function adjustFontSizeBasedOnContent() {
  // Evitar múltiples ejecuciones simultáneas
  if (isAdjusting) {
    console.log('Ajuste ya en progreso, saltando...');
    return;
  }
  
  const messageDisplay = document.getElementById('messageDisplay');
  const container = document.getElementById('bg-container');
  
  // Si no hay texto, no hacer nada
  if (!messageDisplay || !messageDisplay.textContent.trim()) {
    console.log('No hay texto para ajustar');
    // cachedFontSize = null; // DESHABILITADO
    // lastTextContent = ''; // DESHABILITADO
    return;
  }

  const currentTextContent = messageDisplay.textContent || messageDisplay.innerText || '';
  const currentContainerDimensions = `${container.clientWidth}x${container.clientHeight}`;
  
  // SISTEMA DE CACHÉ DESHABILITADO PARA COMPORTAMIENTO COMPLETAMENTE DINÁMICO
  // El caché puede causar que textos diferentes mantengan tamaños anteriores
  console.log(`🔄 Recalculando dinámicamente (caché deshabilitado): "${currentTextContent.substring(0, 30)}..."`);
  
  // Forzar recálculo siempre para comportamiento completamente dinámico
  // El código de caché ha sido completamente deshabilitado

  console.log('🚀 Iniciando cálculo inteligente de fuente...');
  isAdjusting = true;
  
  // 🔧 RESET TOTAL: Asegurar que no hay fontSize previo que interfiera
  messageDisplay.style.fontSize = '';
  messageDisplay.style.removeProperty('font-size');
  
  // Resetear variables de caché para comportamiento completamente limpio
  cachedFontSize = null;
  lastTextContent = '';
  lastContainerDimensions = null;
  
  console.log('🔄 RESET TOTAL: fontSize y variables de caché completamente limpiados');
  
  // Obtener referencia al título si existe
  const titleSpan = messageDisplay.querySelector('span');
  const hasTitle = !!titleSpan;
  
  // Obtener dimensiones del contenedor
  console.log(`📐 Contenedor: ${container.clientWidth}×${container.clientHeight}px, hasTitle: ${hasTitle}`);
  
  // Verificar dimensiones mínimas del contenedor
  let containerWidth = container.clientWidth;
  let containerHeight = container.clientHeight;
  
  if (containerWidth < 300 || containerHeight < 200) {
    console.log(`⚠️ Contenedor pequeño: ${containerWidth}×${containerHeight}px, usando mínimos`);
    containerWidth = Math.max(containerWidth, 800);
    containerHeight = Math.max(containerHeight, 400);
  }
  
  // Calcular tamaño óptimo usando el nuevo algoritmo inteligente
  const analysis = calculateOptimalFontSize(
    currentTextContent,
    containerWidth,
    containerHeight,
    hasTitle
  );
  
  // Usar el tamaño calculado como punto de partida
  let fontSize = analysis.fontSize;
  
  console.log(`✅ Tamaño calculado: ${fontSize}px`);
  
  // Configurar estilos usando el gestor organizado
  if (window.styleManager) {
    // Asegurar que está inicializado
    window.styleManager.init();
    window.styleManager.applyBaseMessageStyles();
    window.styleManager.applyTitleStyles();
    window.styleManager.applySpacing(hasTitle);
    window.styleManager.preventTitleOverlap();
  } else {
    // Fallback: aplicar estilos de manera tradicional
    messageDisplay.style.visibility = 'visible';
    messageDisplay.style.opacity = '1';
    messageDisplay.style.display = 'flex';
    messageDisplay.style.whiteSpace = 'pre-wrap';
    messageDisplay.style.wordWrap = 'normal';
    messageDisplay.style.overflowWrap = 'normal';
    messageDisplay.style.hyphens = 'none';
    messageDisplay.style.wordBreak = 'normal';
    messageDisplay.style.wordSpacing = 'normal';
    messageDisplay.style.letterSpacing = 'normal';
    messageDisplay.style.lineHeight = '1.1';
    messageDisplay.style.textAlign = 'center';
    
    // Manejar el título (span) con tamaño ESTÁTICO de configuración
    if (titleSpan) {
      const titleFontSize = localStorage.getItem('titleFontSize') || 24;
      titleSpan.style.fontSize = titleFontSize + 'px';
      const titleColor = localStorage.getItem('titleColor') || '#ffffff';
      titleSpan.style.color = titleColor;
      const titleBoxEnabled = localStorage.getItem('titleBoxEnabled');
      if (titleBoxEnabled === 'true') {
        titleSpan.classList.add('title-with-box');
        if (window.applyTitleBoxStyles) {
          window.applyTitleBoxStyles(titleSpan);
        }
      }
      messageDisplay.style.paddingTop = '60px';
      console.log(`   📝 Título estático: ${titleFontSize}px (con todos los estilos mantenidos)`);
    } else {
      messageDisplay.style.paddingTop = '15px';
    }
  }
  
  // 🎯 APLICACIÓN DIRECTA: Solo aplicar el tamaño calculado, SIN ajustes iterativos
  console.log(`🎯 Aplicando tamaño FIJO: ${fontSize}px (basado solo en caracteres, SIN redimensionamiento)`);
  
  if (window.styleManager) {
    window.styleManager.setFontSize(fontSize);
    window.styleManager.forceReflow();
  } else {
    messageDisplay.style.fontSize = fontSize + 'px';
    messageDisplay.offsetHeight;
  }
  
  // ❌ ELIMINADO: Todo el sistema de ajuste iterativo (while loops) que causaba redimensionamiento
  // ❌ ELIMINADO: hasOverflow() checks que modificaban el tamaño después del cálculo
  // ✅ RESULTADO: Tamaño fijo basado únicamente en número de caracteres
  
  // Aplicar configuraciones específicas de texto
  if (hasTitle) {
    if (window.styleManager) {
      // Asegurar que está inicializado y usar funciones que realmente existen
      window.styleManager.init();
      window.styleManager.applyTitleStyles();
      window.styleManager.applySpacing(hasTitle);
      window.styleManager.preventTitleOverlap();
    } else {
      // Fallback para títulos
      messageDisplay.style.flexDirection = 'column';
      messageDisplay.style.alignItems = 'flex-start';
      messageDisplay.style.justifyContent = 'flex-start';
      messageDisplay.style.wordWrap = 'break-word';
      messageDisplay.style.overflowWrap = 'break-word';
      messageDisplay.offsetHeight;
    }
  }
  
  // Asegurar visibilidad final
  messageDisplay.style.visibility = 'visible';
  messageDisplay.style.opacity = '1';
  
  console.log(`✅ FINAL: ${fontSize}px aplicado DIRECTAMENTE (sin ajustes iterativos)`);
  
  // Liberar el bloqueo
  setTimeout(() => {
    isAdjusting = false;
  }, 200);
}


// Callback function for the MutationObserver
function handleMutation(mutationsList, observer) {
  // Cancelar timeout anterior si existe
  if (adjustTimeout) {
    clearTimeout(adjustTimeout);
  }
  
  // Programar ajuste con debounce
  adjustTimeout = setTimeout(() => {
    adjustFontSizeBasedOnContent();
  }, 300); // Aumentar delay para evitar múltiples ejecuciones
}

// También manejar cambios en el texto directamente
function handleTextChange() {
  if (adjustTimeout) {
    clearTimeout(adjustTimeout);
  }
  
  adjustTimeout = setTimeout(() => {
    adjustFontSizeBasedOnContent();
  }, 400);
}

// Manejar cambios en las propiedades de estilo que puedan afectar el tamaño
const resizeObserver = new ResizeObserver(() => {
  setTimeout(() => {
    adjustFontSizeBasedOnContent();
  }, 100);
});

// Observar cambios en el contenedor
const container = document.getElementById('bg-container');
if (container) {
  resizeObserver.observe(container);
}

// Exponer funciones globalmente para poder llamarlas desde otros scripts
window.adjustFontSize = adjustFontSizeBasedOnContent;
window.handleTextChange = handleTextChange;

// Función para ajuste manual (solo cuando se hace clic)
window.manualAdjustFontSize = () => {
  console.log('Ajuste manual solicitado');
  if (adjustTimeout) {
    clearTimeout(adjustTimeout);
  }
  
  // Ajustar inmediatamente sin delay
  adjustFontSizeBasedOnContent();
};

// Función para forzar el ajuste después de cambios de estilo (caché deshabilitado)
window.forceAdjustFontSize = () => {
  if (adjustTimeout) {
    clearTimeout(adjustTimeout);
  }
  
  // Caché deshabilitado - siempre recalcular dinámicamente
  // cachedFontSize = null; // DESHABILITADO
  // lastTextContent = ''; // DESHABILITADO  
  // lastContainerDimensions = null; // DESHABILITADO
  console.log('🔄 Forzando recálculo dinámico (sin caché)');
  
  adjustTimeout = setTimeout(() => {
    adjustFontSizeBasedOnContent();
  }, 300);
};

// Inicializar el gestor de estilos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  initializeStyleManager();
});

// Si el DOM ya está listo, inicializar inmediatamente
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeStyleManager);
} else {
  initializeStyleManager();
}