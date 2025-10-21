function hasOverflow() {
  const container = document.getElementById('bg-container');
  const messageDisplay = document.getElementById('messageDisplay');
  
  if (!container || !messageDisplay) return false;
  
  
  const verticalMargin = 5; 
  const horizontalMargin = 10; 
  
  const hasVerticalOverflow = messageDisplay.scrollHeight > (container.clientHeight - verticalMargin);
  const hasHorizontalOverflow = messageDisplay.scrollWidth > (container.clientWidth - horizontalMargin);
  
  
  if (hasVerticalOverflow || hasHorizontalOverflow) {
    console.log(`Overflow detected - Container: ${container.clientWidth}x${container.clientHeight}, Message: ${messageDisplay.scrollWidth}x${messageDisplay.scrollHeight}`);
  }
  
  return hasVerticalOverflow || hasHorizontalOverflow;
}


let fontSizeMemory = {
  history: [], 
  maxHistorySize: 20,
  
  
  addSuccess: function(charCount, fontSize, containerArea) {
    this.history.push({
      chars: charCount,
      size: fontSize,
      area: containerArea,
      timestamp: Date.now(),
      success: true
    });
    
    
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }
  },
  
  
  predictSize: function(charCount, containerArea) {
    if (this.history.length === 0) return null;
    
    
    const tolerance = 0.2;
    const minChars = charCount * (1 - tolerance);
    const maxChars = charCount * (1 + tolerance);
    
    const similarEntries = this.history.filter(entry => 
      entry.chars >= minChars && entry.chars <= maxChars && entry.success
    );
    
    if (similarEntries.length === 0) {
      
      const areaTolerance = 0.3;
      const minArea = containerArea * (1 - areaTolerance);
      const maxArea = containerArea * (1 + areaTolerance);
      
      const areaMatches = this.history.filter(entry => 
        entry.area >= minArea && entry.area <= maxArea && entry.success
      );
      
      if (areaMatches.length > 0) {
        
        const avgSize = areaMatches.reduce((sum, entry) => sum + entry.size, 0) / areaMatches.length;
        return Math.round(avgSize);
      }
      
      return null;
    }
    
    
    let totalWeight = 0;
    let weightedSum = 0;
    
    similarEntries.forEach(entry => {
      const recencyWeight = 1 + (entry.timestamp - Date.now() + 300000) / 300000; 
      const similarityWeight = 1 - Math.abs(entry.chars - charCount) / charCount;
      const weight = Math.max(0.1, recencyWeight * similarityWeight);
      
      weightedSum += entry.size * weight;
      totalWeight += weight;
    });
    
    return Math.round(weightedSum / totalWeight);
  },
  
  
  cleanup: function() {
    const fiveMinutesAgo = Date.now() - 300000;
    this.history = this.history.filter(entry => entry.timestamp > fiveMinutesAgo);
  }
};


function calculateEstimatedLines(text, fontSize, containerWidth) {
  
  const cleanText = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  
  
  let charWidthRatio = 0.55; 
  
  
  if (fontSize < 16) {
    charWidthRatio = 0.62; 
  } else if (fontSize > 40) {
    charWidthRatio = 0.52; 
  }
  
  
  const hasNumbers = /\d/.test(cleanText);
  const hasPunctuation = /[.,:;!?]/.test(cleanText);
  const hasCapitals = /[A-Z]/.test(cleanText);
  
  if (hasNumbers) charWidthRatio += 0.02; 
  if (hasPunctuation) charWidthRatio -= 0.01; 
  if (hasCapitals) charWidthRatio += 0.01; 
  
  const charWidth = fontSize * charWidthRatio;
  
  
  const effectiveWidth = containerWidth * 0.82; 
  const charsPerLine = Math.floor(effectiveWidth / charWidth);
  
  
  if (cleanText.length <= charsPerLine) {
    return {
      estimatedLines: 1,
      charsPerLine: charsPerLine,
      charWidth: charWidth,
      effectiveWidth: effectiveWidth,
      maxWordLength: Math.max(...cleanText.split(' ').map(w => w.length)),
      totalWords: cleanText.split(' ').length,
      confidence: 0.95 
    };
  }
  
  
  const words = cleanText.split(' ');
  let lines = 1;
  let currentLineLength = 0;
  let longestLine = 0;
  
  for (const word of words) {
    const wordLength = word.length;
    const spaceNeeded = currentLineLength > 0 ? 1 : 0;
    const totalNeeded = currentLineLength + spaceNeeded + wordLength;
    
    if (totalNeeded > charsPerLine && currentLineLength > 0) {
      
      longestLine = Math.max(longestLine, currentLineLength);
      lines++;
      currentLineLength = wordLength;
    } else {
      currentLineLength = totalNeeded;
    }
  }
  
  longestLine = Math.max(longestLine, currentLineLength);
  
  
  const avgLineLength = cleanText.length / lines;
  const utilizationRatio = avgLineLength / charsPerLine;
  let confidence = 0.8;
  
  if (utilizationRatio > 0.7 && utilizationRatio < 0.9) {
    confidence = 0.9; 
  } else if (utilizationRatio < 0.5 || utilizationRatio > 0.95) {
    confidence = 0.6; 
  }
  
  
  const maxWordLength = Math.max(...words.map(w => w.length));
  if (maxWordLength > charsPerLine * 0.8) {
    const extraLines = Math.ceil(maxWordLength / charsPerLine) - 1;
    lines += extraLines;
    confidence *= 0.8; 
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

/**
 * Pre-calcula el tamaño de fuente óptimo ANTES de inyectar en el DOM
 * @param {string} text - Texto completo (puede incluir HTML)
 * @param {number} containerWidth - Ancho del contenedor (opcional, usa default si no hay)
 * @param {number} containerHeight - Alto del contenedor (opcional, usa default si no hay)
 * @param {boolean} hasTitle - Si el texto incluye título
 * @returns {Object} - Información del cálculo incluyendo fontSize
 */
function preCalculateFontSize(text, containerWidth = null, containerHeight = null, hasTitle = false) {
  
  if (!containerWidth || !containerHeight) {
    const container = document.getElementById('bg-container');
    if (container) {
      containerWidth = container.clientWidth || 1920;
      containerHeight = container.clientHeight || 1080;
    } else {
      
      containerWidth = containerWidth || 1920;
      containerHeight = containerHeight || 1080;
    }
  }
  
  console.log(`📐 Pre-cálculo: ${containerWidth}×${containerHeight}px, hasTitle: ${hasTitle}`);
  
  
  return calculateOptimalFontSize(text, containerWidth, containerHeight, hasTitle);
}


window.preCalculateFontSize = preCalculateFontSize;


function calculateOptimalFontSize(text, containerWidth, containerHeight, hasTitle = false) {
  
  const textOnly = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  const totalChars = textOnly.length;
  const containerArea = containerWidth * containerHeight;
  
  console.log(`🧠 ALGORITMO INTELIGENTE MEJORADO: "${textOnly.substring(0, 30)}..." (${totalChars} chars)`);
  console.log(`   📐 Contenedor: ${containerWidth}×${containerHeight}px (${containerArea} área), hasTitle: ${hasTitle}`);
  
  
  
  
  const predictedSize = null; 
  
  console.log(`   🎯 Modo dinámico: Sin predicción de memoria, basado solo en caracteres`);
  
  
  let minSize, maxSize, tramo, startingPoint;
  
  

  if (totalChars <= 9) {
    
    minSize = 29;  maxSize = 38;   tramo = "Referencias ultra cortas";
  } else if (totalChars <= 12) {
    
    minSize = 43;  maxSize = 49;   tramo = "Referencias muy cortas";
  } else if (totalChars <= 15) {
    
    minSize = 50;  maxSize = 60;   tramo = "Referencias cortas";
  } else if (totalChars <= 20) {
    
    minSize = 44;  maxSize = 48;   tramo = "Referencias medianas";
  } else if (totalChars <= 80) {
    
    minSize = 35;  maxSize = 45;   tramo = "Versículos cortos";
  } else if (totalChars <= 150) {
    
    minSize = 30;  maxSize = 40;   tramo = "Versículos medianos";
  } else if (totalChars <= 350) {
    
    minSize = 33;  maxSize = 39;   tramo = "Textos largos";
  } else {
    
    minSize = 27;  maxSize = 31;   tramo = "Textos extremadamente largos";
  }
  
  
  
  startingPoint = Math.round((minSize + maxSize) / 2);
  console.log(`   🎯 Iniciando desde centro del rango: ${startingPoint}px (modo dinámico)`);
  
  console.log(`   📊 ${tramo}: ${totalChars} chars → Rango ${minSize}-${maxSize}px`);
  
  
  const effectiveHeight = containerHeight * (hasTitle ? 0.68 : 0.87); 
  const lineHeightMultiplier = 1.25; 
  
  console.log(`   🎯 Altura disponible: ${effectiveHeight}px (de ${containerHeight}px total)`);
  console.log(`   🚧 Límites estrictos: ${minSize}-${maxSize}px para ${tramo}`);
  
  let bestFontSize = startingPoint;
  let bestScore = -1;
  const maxIterations = 30;
  let iterations = 0;
  
  
  function evaluateSize(fontSize) {
    
    if (fontSize < minSize || fontSize > maxSize) {
      console.log(`   ❌ ${fontSize}px fuera del rango ${minSize}-${maxSize}px`);
      return 0; 
    }
    
    const lineInfo = calculateEstimatedLines(textOnly, fontSize, containerWidth);
    const totalTextHeight = lineInfo.estimatedLines * fontSize * lineHeightMultiplier;
    
    if (totalTextHeight > effectiveHeight) {
      console.log(`   ❌ ${fontSize}px no cabe: ${totalTextHeight.toFixed(1)}px > ${effectiveHeight.toFixed(1)}px`);
      return 0; 
    }
    
    
    const heightUtilization = totalTextHeight / effectiveHeight;
    const sizeBonus = fontSize / maxSize; 
    const confidenceBonus = lineInfo.confidence || 0.8;
    
    
    let utilizationScore = 1;
    if (heightUtilization < 0.7) {
      utilizationScore = heightUtilization / 0.7; 
    } else if (heightUtilization > 0.9) {
      utilizationScore = (1 - heightUtilization) / 0.1; 
    }
    
    const finalScore = (utilizationScore * 0.4) + (sizeBonus * 0.4) + (confidenceBonus * 0.2);
    
    console.log(`   ✅ Evaluando ${fontSize}px: ${lineInfo.estimatedLines} líneas, ${totalTextHeight.toFixed(1)}px/${effectiveHeight.toFixed(1)}px (${(heightUtilization*100).toFixed(1)}%), score: ${finalScore.toFixed(3)}`);
    
    return finalScore;
  }
  
  
  let currentScore = evaluateSize(startingPoint);
  bestScore = currentScore;
  bestFontSize = startingPoint;
  
  
  for (let fontSize = startingPoint + 1; fontSize <= maxSize && iterations < maxIterations; fontSize++, iterations++) {
    const score = evaluateSize(fontSize);
    if (score > bestScore) {
      bestScore = score;
      bestFontSize = fontSize;
    } else if (score === 0) {
      break; 
    }
  }
  
  
  for (let fontSize = startingPoint - 1; fontSize >= minSize && iterations < maxIterations; fontSize--, iterations++) {
    const score = evaluateSize(fontSize);
    if (score > bestScore) {
      bestScore = score;
      bestFontSize = fontSize;
    }
  }
  
  
  
  
  
  
  console.log(`   🔄 Memoria contextual deshabilitada - comportamiento puramente dinámico`);
  
  
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
    method2: bestFontSize 
  };
}


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




let isAdjusting = false;
let adjustTimeout = null;
let cachedFontSize = null; 
let lastTextContent = ''; 
let lastContainerDimensions = null; 
let lastAdjustmentTime = 0; 
const MIN_ADJUSTMENT_INTERVAL = 500; 


function initializeStyleManager() {
  if (window.styleManager) {
    window.styleManager.init();
    console.log('✅ Gestor de estilos inicializado');
  } else {
    console.warn('⚠️ Gestor de estilos no disponible');
  }
}

function adjustFontSizeBasedOnContent() {
  const currentTime = Date.now();
  
  
  if (currentTime - lastAdjustmentTime < MIN_ADJUSTMENT_INTERVAL) {
    console.log(`⏸️ Ajuste ignorado (muy reciente, ${currentTime - lastAdjustmentTime}ms desde el último)`);
    return;
  }
  
  
  if (isAdjusting) {
    console.log('⏸️ Ajuste ya en progreso, saltando...');
    return;
  }
  
  const messageDisplay = document.getElementById('messageDisplay');
  const container = document.getElementById('bg-container');
  
  
  if (!messageDisplay || !messageDisplay.textContent.trim()) {
    console.log('⚠️ No hay texto para ajustar');
    return;
  }

  const currentTextContent = messageDisplay.textContent || messageDisplay.innerText || '';
  const currentContainerDimensions = `${container.clientWidth}x${container.clientHeight}`;
  
  console.log(`🔄 Recalculando dinámicamente: "${currentTextContent.substring(0, 30)}..."`);

  console.log('🚀 Iniciando cálculo inteligente de fuente...');
  isAdjusting = true;
  lastAdjustmentTime = currentTime;
  
  
  messageDisplay.style.fontSize = '';
  messageDisplay.style.removeProperty('font-size');
  
  
  cachedFontSize = null;
  lastTextContent = '';
  lastContainerDimensions = null;
  
  console.log('🔄 RESET TOTAL: fontSize y variables de caché completamente limpiados');
  
  
  const titleSpan = messageDisplay.querySelector('span');
  const hasTitle = !!titleSpan;
  
  
  console.log(`📐 Contenedor: ${container.clientWidth}×${container.clientHeight}px, hasTitle: ${hasTitle}`);
  
  
  let containerWidth = container.clientWidth;
  let containerHeight = container.clientHeight;
  
  if (containerWidth < 300 || containerHeight < 200) {
    console.log(`⚠️ Contenedor pequeño: ${containerWidth}×${containerHeight}px, usando mínimos`);
    containerWidth = Math.max(containerWidth, 800);
    containerHeight = Math.max(containerHeight, 400);
  }
  
  
  const analysis = calculateOptimalFontSize(
    currentTextContent,
    containerWidth,
    containerHeight,
    hasTitle
  );
  
  
  let fontSize = analysis.fontSize;
  
  
  const maxChangePerAdjustment = 5; 
  if (cachedFontSize && Math.abs(fontSize - cachedFontSize) > maxChangePerAdjustment) {
    const direction = fontSize > cachedFontSize ? 1 : -1;
    fontSize = cachedFontSize + (maxChangePerAdjustment * direction);
    console.log(`🎚️ Cambio suavizado: ${cachedFontSize}px → ${fontSize}px (objetivo: ${analysis.fontSize}px)`);
  }
  
  
  cachedFontSize = fontSize;
  lastTextContent = currentTextContent;
  lastContainerDimensions = currentContainerDimensions;
  
  console.log(`✅ Tamaño calculado: ${fontSize}px`);
  
  
  if (window.styleManager) {
    
    window.styleManager.init();
    window.styleManager.applyBaseMessageStyles();
    window.styleManager.applyTitleStyles();
    window.styleManager.applySpacing(hasTitle);
    window.styleManager.preventTitleOverlap();
  } else {
    
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
  
  
  console.log(`🎯 Aplicando tamaño FIJO: ${fontSize}px (basado solo en caracteres, SIN redimensionamiento)`);
  
  if (window.styleManager) {
    window.styleManager.setFontSize(fontSize);
    window.styleManager.forceReflow();
  } else {
    messageDisplay.style.fontSize = fontSize + 'px';
    messageDisplay.offsetHeight;
  }
  
  
  
  
  
  
  if (hasTitle) {
    if (window.styleManager) {
      
      window.styleManager.init();
      window.styleManager.applyTitleStyles();
      window.styleManager.applySpacing(hasTitle);
      window.styleManager.preventTitleOverlap();
    } else {
      
      messageDisplay.style.flexDirection = 'column';
      messageDisplay.style.alignItems = 'flex-start';
      messageDisplay.style.justifyContent = 'flex-start';
      messageDisplay.style.wordWrap = 'break-word';
      messageDisplay.style.overflowWrap = 'break-word';
      messageDisplay.offsetHeight;
    }
  }
  
  
  messageDisplay.style.visibility = 'visible';
  messageDisplay.style.opacity = '1';
  
  console.log(`✅ FINAL: ${fontSize}px aplicado DIRECTAMENTE (sin ajustes iterativos)`);
  
  
  isAdjusting = false;
}



function handleMutation(mutationsList, observer) {
  
  if (adjustTimeout) {
    clearTimeout(adjustTimeout);
  }
  
  
  adjustTimeout = setTimeout(() => {
    adjustFontSizeBasedOnContent();
  }, 300); 
}


function handleTextChange() {
  if (adjustTimeout) {
    clearTimeout(adjustTimeout);
  }
  
  adjustTimeout = setTimeout(() => {
    adjustFontSizeBasedOnContent();
  }, 400);
}


let resizeTimeout = null;
const resizeObserver = new ResizeObserver(() => {
  
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }
  resizeTimeout = setTimeout(() => {
    adjustFontSizeBasedOnContent();
  }, 300); 
});


const container = document.getElementById('bg-container');
if (container) {
  resizeObserver.observe(container);
}


window.adjustFontSize = adjustFontSizeBasedOnContent;
window.handleTextChange = handleTextChange;


window.manualAdjustFontSize = () => {
  console.log('Ajuste manual solicitado');
  if (adjustTimeout) {
    clearTimeout(adjustTimeout);
  }
  
  
  adjustFontSizeBasedOnContent();
};


window.forceAdjustFontSize = () => {
  if (adjustTimeout) {
    clearTimeout(adjustTimeout);
  }
  
  
  
  
  
  console.log('🔄 Forzando recálculo dinámico (sin caché)');
  
  adjustTimeout = setTimeout(() => {
    adjustFontSizeBasedOnContent();
  }, 300);
};


document.addEventListener('DOMContentLoaded', () => {
  initializeStyleManager();
});


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeStyleManager);
} else {
  initializeStyleManager();
}