#!/usr/bin/env node

// 🧪 TESTING AVANZADO - Probar con textos de diferentes longitudes

const { testVersiculoConsistencia, calculateOptimalFontSize } = require('./testDirecto.js');

console.log('🔍 TESTING AVANZADO - Diferentes longitudes de texto');
console.log('═'.repeat(60));

// Textos de diferentes longitudes para probar diferenciación
const textosVariados = [
  { texto: "Juan 3:16", chars: 9, esperado: "muy grande (70-90px)" },
  { texto: "Porque de tal manera amó Dios al mundo", chars: 39, esperado: "mediano (40-60px)" },
  { texto: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.", chars: 144, esperado: "pequeño (20-35px)" },
  { texto: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna. Este es el versículo más conocido de la Biblia y habla del gran amor de Dios por la humanidad, mostrando cómo Dios envió a su hijo Jesús para salvarnos de nuestros pecados y darnos vida eterna a través de la fe en Él.", chars: 367, esperado: "muy pequeño (12-20px)" }
];

async function testDiferenciacion() {
  console.log('🎯 Probando diferenciación del algoritmo:\n');
  
  textosVariados.forEach((item, index) => {
    console.log(`[${index + 1}] Texto: "${item.texto.substring(0, 40)}..." (${item.chars} chars)`);
    console.log(`    Esperado: ${item.esperado}`);
    
    // Probar 3 veces para verificar consistencia
    const resultados = [];
    for (let i = 0; i < 3; i++) {
      const resultado = calculateOptimalFontSize(item.texto, 800, 600, false);
      resultados.push(resultado.fontSize);
    }
    
    const esConsistente = new Set(resultados).size === 1;
    const tamaño = resultados[0];
    
    console.log(`    Resultado: ${tamaño}px (${esConsistente ? 'consistente' : 'inconsistente'})`);
    
    // Evaluar si el tamaño es apropiado para la longitud
    let evaluacion = '';
    if (item.chars <= 20 && tamaño >= 70) evaluacion = '✅ Correcto';
    else if (item.chars <= 50 && tamaño >= 40 && tamaño < 70) evaluacion = '✅ Correcto';
    else if (item.chars <= 150 && tamaño >= 20 && tamaño < 40) evaluacion = '✅ Correcto';
    else if (item.chars > 150 && tamaño >= 12 && tamaño < 20) evaluacion = '✅ Correcto';
    else evaluacion = '❌ Problemático';
    
    console.log(`    Evaluación: ${evaluacion}`);
    console.log('');
  });
}

async function testConsistenciaAlgoritmo() {
  console.log('\n🔬 Probando consistencia con diferentes textos...\n');
  
  for (const item of textosVariados) {
    console.log(`Testing: "${item.texto.substring(0, 30)}..." (${item.chars} chars)`);
    const resultado = testVersiculoConsistencia(item.texto, 5);
    
    if (!resultado.esConsistente) {
      console.log(`⚠️  PROBLEMA: Inconsistencia en texto de ${item.chars} caracteres`);
    }
  }
}

async function main() {
  await testDiferenciacion();
  await testConsistenciaAlgoritmo();
  
  console.log('\n🧪 DIAGNÓSTICO:');
  console.log('═'.repeat(50));
  console.log('Si todos los textos dan el mismo tamaño:');
  console.log('  - El algoritmo no está diferenciando por longitud correctamente');
  console.log('  - Posible problema en la lógica de predicción inicial');
  console.log('  - La búsqueda bidireccional puede estar limitada');
  console.log('\nSi hay inconsistencias:');
  console.log('  - El algoritmo no es determinístico');
  console.log('  - Hay factores variables afectando el cálculo');
}

main().catch(console.error);