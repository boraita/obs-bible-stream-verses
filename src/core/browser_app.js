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

// FUNCIÓN PARA CALCULAR LÍNEAS ESTIMADAS SEGÚN TAMAÑO DE FUENTE
function calculateEstimatedLines(text, fontSize, containerWidth) {
  // Caracteres promedio por píxel (aproximación empírica mejorada)
  const avgCharWidthRatio = 0.55; // Ajuste más preciso: caracteres ~55% del fontSize
  const charWidth = fontSize * avgCharWidthRatio;
  
  // Caracteres que caben por línea (considerando padding y márgenes)
  const effectiveWidth = containerWidth * 0.85; // 85% para considerar padding/márgenes
  const charsPerLine = Math.floor(effectiveWidth / charWidth);
  
  // Limpiar y dividir texto en palabras (manejar espacios múltiples)
  const cleanText = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  const words = cleanText.split(' ');
  let lines = 1;
  let currentLineLength = 0;
  
  // Simular word-wrap más realista
  for (const word of words) {
    const wordLength = word.length;
    const spaceNeeded = currentLineLength > 0 ? 1 : 0; // Espacio antes de la palabra
    
    // Si agregar esta palabra (+ espacio) excede el límite, nueva línea
    if (currentLineLength + spaceNeeded + wordLength > charsPerLine && currentLineLength > 0) {
      lines++;
      currentLineLength = wordLength;
    } else {
      currentLineLength += spaceNeeded + wordLength;
    }
  }
  
  // Ajuste por palabras muy largas (URLs, nombres largos, etc.)
  const maxWordLength = Math.max(...words.map(w => w.length));
  if (maxWordLength > charsPerLine * 0.8) {
    lines += Math.ceil(maxWordLength / charsPerLine) - 1;
  }
  
  return {
    estimatedLines: lines,
    charsPerLine: charsPerLine,
    charWidth: charWidth,
    effectiveWidth: effectiveWidth,
    maxWordLength: maxWordLength,
    totalWords: words.length
  };
}

// ALGORITMO 5 TRAMOS MEJORADO: CONSIDERAR LÍNEAS Y ALTURA
function calculateOptimalFontSize(text, containerWidth, containerHeight, hasTitle = false) {
  // Limpiar texto y contar caracteres (normalizar espacios múltiples)
  const textOnly = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  const totalChars = textOnly.length;
  
  console.log(`🎯 ALGORITMO 5 TRAMOS MEJORADO: "${textOnly.substring(0, 30)}..." (${totalChars} chars)`);
  console.log(`   📐 Contenedor: ${containerWidth}×${containerHeight}px, hasTitle: ${hasTitle}`);
  
  // 5 TRAMOS ÚNICOS - Empezar siempre con el tamaño MÁS BAJO del tramo
  let minSize, maxSize, tramo;
  
  if (totalChars <= 20) {
    // TRAMO 1: Referencias muy cortas
    minSize = 60;  maxSize = 90;   tramo = "Referencias cortas";
  } else if (totalChars <= 50) {
    // TRAMO 2: Versículos cortos
    minSize = 40;  maxSize = 65;   tramo = "Versículos cortos";
  } else if (totalChars <= 120) {
    // TRAMO 3: Versículos medianos
    minSize = 25;  maxSize = 45;   tramo = "Versículos medianos";
  } else if (totalChars <= 300) {
    // TRAMO 4: Textos largos
    minSize = 16;  maxSize = 30;   tramo = "Textos largos";
  } else {
    // TRAMO 5: Textos muy largos (Ester 8:9)
    minSize = 12;  maxSize = 20;   tramo = "Textos muy largos";
  }
  
  console.log(`   📊 ${tramo}: ${totalChars} chars → Rango ${minSize}-${maxSize}px`);
  
  // 🚨 DEBUGGING ESPECIAL PARA GÉNESIS 1:26
  if (textOnly.includes("GÉNESIS 1:26")) {
    console.log(`   🔍 DEBUGGING ESPECIAL - GÉNESIS 1:26:`);
    console.log(`      - Debería estar en TRAMO 4 (16-30px) con 279 caracteres`);
    console.log(`      - Contenedor: ${containerWidth}×${containerHeight}px`);
    console.log(`      - hasTitle: ${hasTitle}`);
  }
  
  // BUSCAR EL TAMAÑO ÓPTIMO CONSIDERANDO LÍNEAS Y ALTURA
  let bestFontSize = minSize;
  const effectiveHeight = containerHeight * (hasTitle ? 0.65 : 0.85); // Más conservador con espacios
  const lineHeightMultiplier = 1.3; // Line-height más realista
  
  console.log(`   🎯 Altura disponible: ${effectiveHeight}px (de ${containerHeight}px total)`);
  
  // Probar tamaños desde mínimo hasta máximo, buscando el MÁS GRANDE que quepa
  let debugSpecial = textOnly.includes("GÉNESIS 1:26");
  
  for (let fontSize = minSize; fontSize <= maxSize; fontSize += 1) { // Incrementos más finos
    const lineInfo = calculateEstimatedLines(textOnly, fontSize, containerWidth);
    const totalTextHeight = lineInfo.estimatedLines * fontSize * lineHeightMultiplier;
    
    if (debugSpecial) {
      console.log(`   🔍 GÉNESIS DEBUG ${fontSize}px:`);
      console.log(`      - Líneas estimadas: ${lineInfo.estimatedLines}`);
      console.log(`      - Chars por línea: ${lineInfo.charsPerLine}`);
      console.log(`      - Altura total: ${lineInfo.estimatedLines} × ${fontSize} × ${lineHeightMultiplier} = ${totalTextHeight}px`);
      console.log(`      - Altura disponible: ${effectiveHeight}px`);
      console.log(`      - ¿Cabe?: ${totalTextHeight <= effectiveHeight ? 'SÍ' : 'NO'}`);
    } else {
      console.log(`   🔍 Probando ${fontSize}px: ${lineInfo.estimatedLines} líneas × ${fontSize}px × ${lineHeightMultiplier} = ${totalTextHeight}px`);
    }
    
    // Si el texto cabe en la altura disponible, actualizar mejor tamaño
    if (totalTextHeight <= effectiveHeight) {
      bestFontSize = fontSize;
      if (debugSpecial) {
        console.log(`   ✅ GÉNESIS ${fontSize}px CABE: ${lineInfo.estimatedLines} líneas → ${totalTextHeight}px ≤ ${effectiveHeight}px`);
      } else {
        console.log(`   ✅ ${fontSize}px CABE: ${lineInfo.estimatedLines} líneas → ${totalTextHeight}px ≤ ${effectiveHeight}px`);
      }
    } else {
      if (debugSpecial) {
        console.log(`   ❌ GÉNESIS ${fontSize}px NO CABE: ${totalTextHeight}px > ${effectiveHeight}px disponibles`);
      } else {
        console.log(`   ❌ ${fontSize}px NO CABE: ${totalTextHeight}px > ${effectiveHeight}px disponibles`);
      }
      break; // No probar tamaños más grandes
    }
  }
  
  // Verificación final para asegurar que tenemos al menos el tamaño mínimo
  if (bestFontSize < minSize) {
    bestFontSize = minSize;
    console.log(`   ⚠️ Forzando tamaño mínimo: ${bestFontSize}px`);
  }
  
  // Información final para debugging
  const finalLineInfo = calculateEstimatedLines(textOnly, bestFontSize, containerWidth);
  const finalTextHeight = finalLineInfo.estimatedLines * bestFontSize * lineHeightMultiplier;
  const heightUsagePercent = ((finalTextHeight / effectiveHeight) * 100).toFixed(1);
  
  console.log(`   🎯 RESULTADO FINAL:`);
  console.log(`      ├─ Tamaño: ${bestFontSize}px (rango ${minSize}-${maxSize}px)`);
  console.log(`      ├─ Líneas: ${finalLineInfo.estimatedLines} (${finalLineInfo.charsPerLine} chars/línea)`);
  console.log(`      ├─ Altura: ${finalTextHeight}px de ${effectiveHeight}px (${heightUsagePercent}%)`);
  console.log(`      └─ Palabras: ${finalLineInfo.totalWords} (max palabra: ${finalLineInfo.maxWordLength} chars)`);
  
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
    method: 'line-aware-5-tramos-optimized'
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

// FUNCIÓN DE TESTING PARA EJEMPLOS ESPECÍFICOS DE LÍNEAS
function testLineWrappingExamples() {
  console.log('🧪 TESTING ALGORITMO CON EJEMPLOS DE LÍNEAS');
  console.log('===========================================');
  
  const examples = [
    {
      text: "GÉNESIS 1:19 - KDSH Así que fue la noche, y fue la mañana, un cuarto día.",
      expectedLines: 1,
      expectedFontSize: 30,
      description: "Texto corto - debería ser 1 línea"
    },
    {
      text: "GÉNESIS 1:22 - KDSH Entonces Elohim los bendijo, diciendo: \"Sean fructíferos, multiplíquense y llenen el agua de los mares, y multiplíquense en la tierra.\"",
      expectedLines: 2,
      expectedFontSize: 25,
      description: "Texto largo - debería ser 2 líneas"
    },
    {
      text: "GÉNESIS 1:26 - KDSH Entonces Elohim dijo: \"Hagamos  a la humanidad a nuestra imagen, conforme a nuestra semejanza; y reinen sobre los peces en el mar, las criaturas que vuelan en el cielo, los animales, y sobre toda la tierra, y sobre toda criatura que se arrastra en la tierra.\"",
      expectedLines: 3,
      expectedFontSize: 30,
      description: "⚠️ TEXTO PROBLEMÁTICO - 279 chars, debería dar 30px máximo"
    },
    {
      text: "SALMOS 23:1 - NVI El Señor es mi pastor, nada me falta.",
      expectedLines: 1,
      expectedFontSize: 40,
      description: "Versículo conocido - 1 línea"
    },
    {
      text: "1 CORINTIOS 13:4-5 - NVI El amor es paciente y bondadoso. El amor no es celoso ni fanfarrón ni orgulloso ni ofensivo. No exige que las cosas se hagan a su manera.",
      expectedLines: 3,
      expectedFontSize: 25,
      description: "Texto muy largo - debería ser 3 líneas"
    }
  ];
  
  // Probar con diferentes dimensiones de contenedor
  const testDimensions = [
    { width: 800, height: 600, desc: "Dimensiones estándar" },
    { width: 400, height: 300, desc: "Contenedor pequeño" },
    { width: 1200, height: 800, desc: "Contenedor grande" },
    { width: 300, height: 200, desc: "Contenedor muy pequeño" }
  ];
  
  console.log('\n🧪 TESTING CON DIFERENTES DIMENSIONES:');
  
  const problemText = "GÉNESIS 1:26 - KDSH Entonces Elohim dijo: \"Hagamos  a la humanidad a nuestra imagen, conforme a nuestra semejanza; y reinen sobre los peces en el mar, las criaturas que vuelan en el cielo, los animales, y sobre toda la tierra, y sobre toda criatura que se arrastra en la tierra.\"";
  
  testDimensions.forEach(dims => {
    console.log(`\n🔍 PROBANDO ${dims.desc} (${dims.width}×${dims.height}px):`);
    const result = calculateOptimalFontSize(problemText, dims.width, dims.height, false);
    console.log(`   → Resultado: ${result.fontSize}px (${result.estimatedLines} líneas, ${result.heightUsagePercent}% uso)`);
  });
  
  // Usar dimensiones estándar para los ejemplos regulares
  const containerWidth = 800;
  const containerHeight = 600;
  
  examples.forEach((example, index) => {
    console.log(`\n📝 EJEMPLO ${index + 1}: ${example.description}`);
    console.log(`   Texto: "${example.text.substring(0, 50)}..."`);
    console.log(`   Caracteres: ${example.text.length}`);
    console.log(`   Líneas esperadas: ${example.expectedLines}`);
    console.log(`   Tamaño esperado: ${example.expectedFontSize}px`);
    
    const result = calculateOptimalFontSize(example.text, containerWidth, containerHeight, false);
    
    console.log(`   ✅ RESULTADO:`);
    console.log(`      - Tamaño fuente: ${result.fontSize}px (esperado: ${example.expectedFontSize}px)`);
    console.log(`      - Líneas estimadas: ${result.estimatedLines} (esperado: ${example.expectedLines})`);
    console.log(`      - Caracteres por línea: ${result.charsPerLine}`);
    console.log(`      - Altura total: ${result.totalTextHeight}px de ${result.effectiveHeight}px (${result.heightUsagePercent}%)`);
    console.log(`      - Precisión líneas: ${result.estimatedLines === example.expectedLines ? '✅ CORRECTO' : '⚠️ DIFERENTE'}`);
    console.log(`      - Precisión tamaño: ${result.fontSize >= example.expectedFontSize ? '✅ CORRECTO' : '❌ MUY PEQUEÑO'}`);
  });
}

// FUNCIÓN DE TESTING PARA VERIFICAR CONSISTENCIA
function testFontSizeConsistency() {
  console.log('🧪 INICIANDO TEST DE CONSISTENCIA DE ALGORITMO');
  console.log('================================================');
  
  // 20 textos de diferentes tamaños para probar
  const testTexts = [
    "Juan 3:16",           // 9 chars - muy corto
    "Génesis 1:5",         // 12 chars - corto
    "Salmo 23:1",          // 11 chars - corto
    "Mateo 5:3-4",         // 12 chars - corto
    "Proverbios 31:10",    // 17 chars - mediano
    "1 Corintios 13:4",    // 17 chars - mediano
    "Deuteronomio 6:4",    // 17 chars - mediano
    "Efesios 2:8-9",       // 14 chars - mediano
    "Filipenses 4:13",     // 16 chars - mediano
    "Apocalipsis 21:4",    // 17 chars - mediano
    "Jeremías 29:11",      // 15 chars - mediano
    "2 Timoteo 3:16-17",   // 18 chars - largo
    "Romanos 8:28",        // 13 chars - corto
    "Isaías 40:31",        // 13 chars - corto
    "1 Juan 4:7-8",        // 13 chars - corto
    "Gálatas 5:22-23",     // 16 chars - mediano
    "Hebreos 11:1",        // 13 chars - corto
    "Santiago 1:2-3",      // 15 chars - mediano
    "1 Pedro 5:7",         // 12 chars - corto
    "Colosenses 3:23"      // 16 chars - mediano
  ];
  
  const containerWidth = 800;  // Dimensiones fijas para testing
  const containerHeight = 600;
  const hasTitle = false;
  
  let inconsistencyFound = false;
  
  testTexts.forEach((text, index) => {
    console.log(`\n📝 Texto ${index + 1}: "${text}" (${text.length} chars)`);
    
    const results = [];
    
    // Ejecutar 5 veces el mismo texto
    for (let i = 0; i < 5; i++) {
      const result = calculateOptimalFontSize(text, containerWidth, containerHeight, hasTitle);
      results.push(result.fontSize);
    }
    
    // Verificar consistencia
    const unique = [...new Set(results)];
    const isConsistent = unique.length === 1;
    
    if (isConsistent) {
      console.log(`✅ CONSISTENTE - Tamaño: ${results[0]}px (5/5 veces iguales)`);
    } else {
      console.log(`❌ INCONSISTENTE - Tamaños: ${results.join(', ')}px`);
      inconsistencyFound = true;
    }
  });
  
  console.log('\n================================================');
  if (inconsistencyFound) {
    console.log('❌ RESULTADO: Se encontraron inconsistencias en el algoritmo');
  } else {
    console.log('✅ RESULTADO: El algoritmo es consistente en todas las pruebas');
  }
  console.log('================================================');
  
  return !inconsistencyFound;
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
    cachedFontSize = null;
    lastTextContent = '';
    return;
  }

  const currentTextContent = messageDisplay.textContent || messageDisplay.innerText || '';
  const currentContainerDimensions = `${container.clientWidth}x${container.clientHeight}`;
  
  // Si el contenido y dimensiones no cambiaron, usar cache
  if (currentTextContent === lastTextContent && 
      currentContainerDimensions === lastContainerDimensions && 
      cachedFontSize !== null) {
    console.log(`Usando tamaño cacheado: ${cachedFontSize}px`);
    
    // Usar el gestor de estilos para aplicar de manera organizada
    if (window.styleManager) {
      window.styleManager.applyCachedStyles(cachedFontSize);
      window.styleManager.applyTitleStyles();
      window.styleManager.applySpacing(!!messageDisplay.querySelector('span'));
      window.styleManager.preventTitleOverlap();
    } else {
      // Fallback al método anterior si el gestor no está disponible
      messageDisplay.style.fontSize = cachedFontSize + 'px';
      const titleSpan = messageDisplay.querySelector('span');
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
      } else {
        messageDisplay.style.paddingTop = '15px';
      }
      messageDisplay.style.visibility = 'visible';
      messageDisplay.style.opacity = '1';
    }
    return;
  }

  console.log('🚀 Iniciando cálculo inteligente de fuente...');
  isAdjusting = true;
  
  // Obtener referencia al título si existe
  const titleSpan = messageDisplay.querySelector('span');
  const hasTitle = !!titleSpan;
  
  // 🔍 DEBUGGING - Mostrar dimensiones reales del contenedor
  console.log(`📐 DIMENSIONES REALES DEL CONTENEDOR:`);
  console.log(`   - clientWidth: ${container.clientWidth}px`);
  console.log(`   - clientHeight: ${container.clientHeight}px`);
  console.log(`   - offsetWidth: ${container.offsetWidth}px`);
  console.log(`   - offsetHeight: ${container.offsetHeight}px`);
  console.log(`   - scrollWidth: ${container.scrollWidth}px`);
  console.log(`   - scrollHeight: ${container.scrollHeight}px`);
  console.log(`   - hasTitle: ${hasTitle}`);
  
  // 🚨 VERIFICACIÓN DE EMERGENCIA PARA CONTENEDORES MUY PEQUEÑOS
  let containerWidth = container.clientWidth;
  let containerHeight = container.clientHeight;
  
  if (containerWidth < 300 || containerHeight < 200) {
    console.log(`⚠️ CONTENEDOR MUY PEQUEÑO: ${containerWidth}×${containerHeight}px`);
    console.log(`   Usando dimensiones mínimas de emergencia: 800×400px`);
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
  
  console.log(`📐 Usando tamaño calculado como base: ${fontSize}px`);
  
  // Configurar estilos usando el gestor organizado
  if (window.styleManager) {
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
  
  // Aplicar el tamaño calculado usando el gestor de estilos
  if (window.styleManager) {
    window.styleManager.setFontSize(fontSize);
    window.styleManager.forceReflow();
  } else {
    messageDisplay.style.fontSize = fontSize + 'px';
    messageDisplay.offsetHeight;
  }
  
  console.log(`🔍 Verificando si el tamaño calculado ${fontSize}px es correcto...`);
  
  // Verificación y ajuste fino del tamaño calculado
  let adjustmentsMade = 0;
  const maxAdjustments = 10;
  
  // Si hay overflow, reducir gradualmente
  while (hasOverflow() && fontSize > 12 && adjustmentsMade < maxAdjustments) {
    fontSize -= 1;
    if (window.styleManager) {
      window.styleManager.setFontSize(fontSize);
      window.styleManager.forceReflow();
    } else {
      messageDisplay.style.fontSize = fontSize + 'px';
      messageDisplay.offsetHeight;
    }
    adjustmentsMade++;
    console.log(`⬇️ Reduciendo: ${fontSize}px (ajuste ${adjustmentsMade})`);
  }
  
  // Si no hay overflow, intentar aumentar ligeramente para maximizar
  while (!hasOverflow() && fontSize < 100 && adjustmentsMade < maxAdjustments) {
    const testSize = fontSize + 1;
    if (window.styleManager) {
      window.styleManager.setFontSize(testSize);
      window.styleManager.forceReflow();
    } else {
      messageDisplay.style.fontSize = testSize + 'px';
      messageDisplay.offsetHeight;
    }
    
    if (hasOverflow()) {
      // Si se desborda con +1, mantener el tamaño actual
      if (window.styleManager) {
        window.styleManager.setFontSize(fontSize);
      } else {
        messageDisplay.style.fontSize = fontSize + 'px';
      }
      console.log(`✅ Tamaño optimizado: ${fontSize}px`);
      break;
    } else {
      fontSize = testSize;
      adjustmentsMade++;
      console.log(`⬆️ Aumentando: ${fontSize}px (ajuste ${adjustmentsMade})`);
    }
  }
  
  // Aplicar estrategias adicionales solo si es absolutamente necesario
  if (hasOverflow() && fontSize <= 12) {
    console.log(`⚠️ Texto muy largo, aplicando word-wrap...`);
    const textAnalysis = analyzeTextStructure(currentTextContent);
    if (textAnalysis.isLongText) {
      if (window.styleManager) {
        window.styleManager.enableWordWrap();
        window.styleManager.forceReflow();
      } else {
        messageDisplay.style.wordWrap = 'break-word';
        messageDisplay.style.overflowWrap = 'break-word';
        messageDisplay.offsetHeight;
      }
    }
  }
  
  // TÍTULO ESTÁTICO - NO se ajusta dinámicamente
  // El título mantiene siempre el tamaño de configuración
  console.log(`📝 Título mantiene tamaño estático de configuración`);
  
  // Mostrar estadísticas finales
  console.log(`📊 Resultado final:`);
  console.log(`   • Tamaño aplicado: ${fontSize}px`);
  console.log(`   • Método principal: ${analysis.method2}px`);
  console.log(`   • Diferencia: ${fontSize - analysis.method2}px`);
  console.log(`   • Ajustes realizados: ${adjustmentsMade}`);
  
  // Asegurar visibilidad final
  messageDisplay.style.visibility = 'visible';
  messageDisplay.style.opacity = '1';
  
  // Guardar en cache para futuros usos
  cachedFontSize = fontSize;
  lastTextContent = currentTextContent;
  lastContainerDimensions = currentContainerDimensions;
  
  console.log(`✅ Tamaño final: ${fontSize}px (cached for future use)`);
  
  // Liberar el bloqueo
  setTimeout(() => {
    isAdjusting = false;
  }, 200);
}

// FUNCIONES GLOBALES PARA TESTING (disponibles en consola del navegador)
window.testFontConsistency = testFontSizeConsistency;
window.testSingleText = function(text, iterations = 5) {
  console.log(`🧪 Testing: "${text}" (${iterations} iteraciones)`);
  const results = [];
  for (let i = 0; i < iterations; i++) {
    const result = calculateOptimalFontSize(text, 800, 600, false);
    results.push(result.fontSize);
  }
  const unique = [...new Set(results)];
  console.log(`Resultados: ${results.join(', ')}px`);
  console.log(`${unique.length === 1 ? '✅ CONSISTENTE' : '❌ INCONSISTENTE'}`);
  return unique.length === 1;
};
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

// Función para forzar el ajuste después de cambios de estilo
window.forceAdjustFontSize = () => {
  if (adjustTimeout) {
    clearTimeout(adjustTimeout);
  }
  
  // Limpiar cache para forzar recálculo completo
  cachedFontSize = null;
  lastTextContent = '';
  lastContainerDimensions = null;
  
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

// 🧪 EJECUTAR TESTING AUTOMÁTICO DEL ALGORITMO MEJORADO
setTimeout(() => {
  console.log('\n🚀 INICIANDO TESTING AUTOMÁTICO DEL ALGORITMO DE LÍNEAS...\n');
  testLineWrappingExamples();
  console.log('\n' + '='.repeat(60) + '\n');
  testFontSizeConsistency();
}, 1000);
