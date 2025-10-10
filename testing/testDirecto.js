#!/usr/bin/env node

// 🧪 SCRIPT DE TESTING DIRECTO DEL ALGORITMO
// Ejecuta las pruebas directamente en Node.js sin necesidad del navegador

console.log('🚀 INICIANDO TESTING DIRECTO DEL ALGORITMO');
console.log('═'.repeat(60));

// Lista de versículos para probar
const versiculosParaTesting = [
  "Juan 3:16", // should be 38px
  "Salmos 23:1", // should be 60px
  "Romanos 8:28", // should be 46px
  "Filipenses 4:13", // should be 60px
  "Proverbios 3:5-6", // should be 60px
  "Mateo 5:14", // should be 55px
  "Salmos 119:105", // should be 55px
  "Isaías 40:31", // should be 45px
  "Efesios 2:8-9", // should be 44px
  "1 Corintios 13:4-7", // should be 45px
  "Salmos 46:1", // should be 43px
  "Gálatas 5:22-23", // should be 45px
  "2 Timoteo 1:7", // should be 45px
  "Hebreos 11:1", // should be 55px
  "Salmos 37:4", // should be 49px
  "Mateo 6:33", // should be 45px
  "1 Pedro 5:7", // should be 60px
  "Salmos 121:1-2", // should be 55px
  "Romanos 12:2", // should be 45px
  "Colosenses 3:2", // should be 47px
  "Ester 8:9" // should be 29px
];

// =====================================================
// COPIA DEL ALGORITMO PARA TESTING DIRECTO
// =====================================================

// Sistema de memoria contextual
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
    
    const similares = this.history.filter(entry => 
      entry.chars >= minChars && entry.chars <= maxChars
    );
    
    if (similares.length === 0) return null;
    
    similares.sort((a, b) => Math.abs(a.chars - charCount) - Math.abs(b.chars - charCount));
    
    const mejorCoincidencia = similares[0];
    const factor = charCount / mejorCoincidencia.chars;
    const tamaño = Math.round(mejorCoincidencia.size * factor);
    
    return Math.max(12, Math.min(100, tamaño));
  }
};

// Función para calcular líneas estimadas
function calculateEstimatedLines(text, fontSize, containerWidth) {
  const avgCharWidth = fontSize * 0.6;
  const effectiveWidth = containerWidth * 0.9;
  const maxCharsPerLine = Math.floor(effectiveWidth / avgCharWidth);
  
  const words = text.trim().split(/\s+/);
  let lines = 1;
  let currentLineLength = 0;
  
  words.forEach(word => {
    if (currentLineLength + word.length + 1 > maxCharsPerLine) {
      lines++;
      currentLineLength = word.length;
    } else {
      currentLineLength += word.length + (currentLineLength > 0 ? 1 : 0);
    }
  });
  
  return {
    estimatedLines: lines,
    charsPerLine: Math.round(text.length / lines),
    confidence: 0.8
  };
}

// Algoritmo de cálculo de tamaño óptimo
function calculateOptimalFontSize(text, containerWidth, containerHeight, hasTitle = false) {
  const textOnly = text.replace(/<[^>]*>/g, '').trim();
  const totalChars = textOnly.length;
  
  if (totalChars === 0) {
    return { fontSize: 48, method: 'empty-text' };
  }
  
  // Configuración de rangos dinámicos basados únicamente en el número de caracteres
  let minSize, maxSize, tramo;
  
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
  } else {
    // TRAMO 7: Textos largos (40-45px) - Ajustado para Génesis
    minSize = 40;  maxSize = 45;   tramo = "Textos largos";
  }
  
  const lineHeightMultiplier = 1.25;
  const effectiveHeight = containerHeight * (hasTitle ? 0.68 : 0.87);
  const containerArea = containerWidth * containerHeight;
  
  // Sistema completamente dinámico - SIN memoria contextual para testing
  // let startingPoint = fontSizeMemory.predictSize(totalChars, containerArea); // DESHABILITADO
  // Punto de partida siempre en el centro del rango para comportamiento consistente
  const startingPoint = Math.round((minSize + maxSize) / 2);
  
  // Función de evaluación con límites estrictos
  function evaluateSize(fontSize) {
    // VERIFICACIÓN ESTRICTA: El tamaño debe estar dentro del rango definido
    if (fontSize < minSize || fontSize > maxSize) {
      return 0; // Puntuación 0 si está fuera del rango
    }
    
    const lineInfo = calculateEstimatedLines(textOnly, fontSize, containerWidth);
    const textHeight = lineInfo.estimatedLines * fontSize * lineHeightMultiplier;
    
    if (textHeight > effectiveHeight) return 0;
    
    const heightUsage = textHeight / effectiveHeight;
    const sizeScore = fontSize / maxSize;
    const lineScore = Math.max(0, 1 - (lineInfo.estimatedLines - 3) * 0.1);
    
    return (heightUsage * 0.4 + sizeScore * 0.4 + lineScore * 0.2) * lineInfo.confidence;
  }
  
  // Búsqueda bidireccional
  let bestFontSize = startingPoint;
  let bestScore = evaluateSize(startingPoint);
  let iterations = 1;
  const maxIterations = 20;
  
  // Búsqueda hacia arriba
  for (let fontSize = startingPoint + 1; fontSize <= maxSize && iterations < maxIterations; fontSize++, iterations++) {
    const score = evaluateSize(fontSize);
    if (score > bestScore) {
      bestScore = score;
      bestFontSize = fontSize;
    } else if (score === 0) {
      break;
    }
  }
  
  // Búsqueda hacia abajo
  for (let fontSize = startingPoint - 1; fontSize >= minSize && iterations < maxIterations; fontSize--, iterations++) {
    const score = evaluateSize(fontSize);
    if (score > bestScore) {
      bestScore = score;
      bestFontSize = fontSize;
    }
  }
  
  // Memoria deshabilitada para comportamiento completamente dinámico en testing
  // if (bestScore > 0) {
  //   fontSizeMemory.addSuccess(totalChars, bestFontSize, containerArea); // DESHABILITADO
  // }
  
  const finalLineInfo = calculateEstimatedLines(textOnly, bestFontSize, containerWidth);
  const finalTextHeight = finalLineInfo.estimatedLines * bestFontSize * lineHeightMultiplier;
  const heightUsagePercent = ((finalTextHeight / effectiveHeight) * 100).toFixed(1);
  
  return {
    fontSize: bestFontSize,
    totalCharacters: totalChars,
    estimatedLines: finalLineInfo.estimatedLines,
    heightUsagePercent: parseFloat(heightUsagePercent),
    score: bestScore,
    iterations: iterations,
    method: 'testing-algorithm'
  };
}

// =====================================================
// FUNCIONES DE TESTING
// =====================================================

function testVersiculoConsistencia(versiculo, iteraciones = 10) {
  console.log(`\n🧪 TESTING: "${versiculo}" (${iteraciones} iter.)`);
  console.log('─'.repeat(50));
  
  const resultados = [];
  const tiempos = [];
  
  // Limpiar memoria para empezar fresh
  const memoriaOriginal = [...fontSizeMemory.history];
  
  for (let i = 0; i < iteraciones; i++) {
    fontSizeMemory.history = [];
    
    const inicio = Date.now();
    const resultado = calculateOptimalFontSize(versiculo, 800, 600, false);
    const tiempo = Date.now() - inicio;
    
    resultados.push(resultado.fontSize);
    tiempos.push(tiempo);
    
    process.stdout.write(`   ${String(i + 1).padStart(2)}: ${resultado.fontSize}px (${tiempo}ms) `);
    if ((i + 1) % 5 === 0) console.log(''); // Nueva línea cada 5 resultados
  }
  
  if (iteraciones % 5 !== 0) console.log(''); // Nueva línea final si es necesario
  
  // Restaurar memoria original
  fontSizeMemory.history = memoriaOriginal;
  
  // Análisis de resultados
  const tamañosUnicos = [...new Set(resultados)];
  const esConsistente = tamañosUnicos.length === 1;
  const promedio = resultados.reduce((a, b) => a + b, 0) / resultados.length;
  const tiempoPromedio = tiempos.reduce((a, b) => a + b, 0) / tiempos.length;
  
  console.log('─'.repeat(50));
  console.log(`📊 ANÁLISIS:`);
  console.log(`   ├─ Tamaños únicos: ${tamañosUnicos.join(', ')}px`);
  console.log(`   ├─ Consistencia: ${esConsistente ? '✅ PERFECTA' : '❌ INCONSISTENTE'}`);
  console.log(`   ├─ Promedio: ${promedio.toFixed(1)}px`);
  console.log(`   ├─ Tiempo promedio: ${tiempoPromedio.toFixed(1)}ms`);
  console.log(`   └─ Variaciones: ${tamañosUnicos.length > 1 ? tamañosUnicos.length + ' diferentes' : 'Ninguna'}`);
  
  return {
    versiculo: versiculo,
    esConsistente: esConsistente,
    tamañosUnicos: tamañosUnicos,
    promedio: promedio,
    tiempoPromedio: tiempoPromedio,
    resultados: resultados
  };
}

function testTodosLosVersiculos(iteracionesPorVersiculo = 5) {
  console.log(`\n🚀 TESTING COMPLETO - ${versiculosParaTesting.length} versículos × ${iteracionesPorVersiculo} iteraciones`);
  console.log('═'.repeat(80));
  
  const resultadosCompletos = [];
  let versiculosInconsistentes = 0;
  let tiempoInicio = Date.now();
  
  versiculosParaTesting.forEach((versiculo, index) => {
    console.log(`\n[${index + 1}/${versiculosParaTesting.length}] "${versiculo}"`);
    
    const resultado = testVersiculoConsistencia(versiculo, iteracionesPorVersiculo);
    resultadosCompletos.push(resultado);
    
    if (!resultado.esConsistente) {
      versiculosInconsistentes++;
      console.log(`⚠️  INCONSISTENCIA DETECTADA`);
    }
  });
  
  const tiempoTotal = Date.now() - tiempoInicio;
  
  // Resumen final
  console.log('\n' + '═'.repeat(80));
  console.log('📊 RESUMEN FINAL DEL TESTING');
  console.log('═'.repeat(80));
  console.log(`Total de versículos probados: ${versiculosParaTesting.length}`);
  console.log(`Versículos consistentes: ${versiculosParaTesting.length - versiculosInconsistentes}`);
  console.log(`Versículos inconsistentes: ${versiculosInconsistentes}`);
  console.log(`Tasa de éxito: ${((versiculosParaTesting.length - versiculosInconsistentes) / versiculosParaTesting.length * 100).toFixed(1)}%`);
  console.log(`Tiempo total: ${tiempoTotal}ms`);
  
  if (versiculosInconsistentes > 0) {
    console.log('\n❌ VERSÍCULOS CON PROBLEMAS:');
    resultadosCompletos.forEach(resultado => {
      if (!resultado.esConsistente) {
        console.log(`   • "${resultado.versiculo}": ${resultado.tamañosUnicos.join(', ')}px`);
      }
    });
    console.log('\n🔧 RECOMENDACIÓN: El algoritmo necesita ajustes para mejorar consistencia');
  } else {
    console.log('\n✅ PERFECTO: Todos los versículos son consistentes');
  }
  
  console.log('═'.repeat(80));
  
  return {
    totalVersiculos: versiculosParaTesting.length,
    consistentes: versiculosParaTesting.length - versiculosInconsistentes,
    inconsistentes: versiculosInconsistentes,
    tasaExito: (versiculosParaTesting.length - versiculosInconsistentes) / versiculosParaTesting.length,
    tiempoTotal: tiempoTotal,
    detalles: resultadosCompletos
  };
}

// =====================================================
// EJECUCIÓN PRINCIPAL
// =====================================================

async function main() {
  console.log('🎯 Iniciando testing con 10 iteraciones por versículo...\n');
  
  const resultado = testTodosLosVersiculos(10);
  
  if (resultado.inconsistentes > 0) {
    console.log('\n🔧 DIAGNÓSTICO DE PROBLEMAS:');
    console.log('═'.repeat(50));
    console.log('El algoritmo presenta inconsistencias. Posibles causas:');
    console.log('1. 🎲 Factores aleatorios o no determinísticos');
    console.log('2. 🧠 Sistema de memoria contextual afectando resultados');
    console.log('3. 🔄 Búsqueda bidireccional con condiciones variables');
    console.log('4. ⏱️  Cálculos dependientes del tiempo o estado');
    console.log('\n💡 SOLUCIONES RECOMENDADAS:');
    console.log('1. Limpiar memoria al inicio de cada cálculo');
    console.log('2. Hacer el algoritmo más determinístico');
    console.log('3. Revisar condiciones de parada en la búsqueda');
    console.log('4. Eliminar dependencias temporales');
  }
  
  process.exit(resultado.inconsistentes > 0 ? 1 : 0);
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  testVersiculoConsistencia,
  testTodosLosVersiculos,
  calculateOptimalFontSize,
  versiculosParaTesting
};