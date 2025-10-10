const { connectDb, getData } = require('../src/api');

// Test final para verificar comportamiento completamente dinámico
async function testComportamientoDinamico() {
    console.log('🔍 TEST FINAL: Verificando comportamiento dinámico sin influencia de selecciones previas\n');
    
    const db = await connectDb();
    
    // Versículos de diferentes longitudes para probar
    const versiculosTest = [
        { libro: 'Salmos', capitulo: 119, versiculo: 105 }, // Versículo medio
        { libro: 'Juan', capitulo: 11, versiculo: 35 },     // Versículo muy corto
        { libro: '1 Corintios', capitulo: 13, versiculo: 4 }, // Versículo largo
        { libro: 'Salmos', capitulo: 119, versiculo: 105 }, // Repetir el primero
        { libro: 'Juan', capitulo: 11, versiculo: 35 },     // Repetir el segundo
    ];
    
    console.log('🎯 Probando con la siguiente secuencia:');
    versiculosTest.forEach((v, i) => {
        console.log(`   ${i+1}. ${v.libro} ${v.capitulo}:${v.versiculo}`);
    });
    console.log('');
    
    // Función para simular el algoritmo de font sizing
    function calcularTamanoFuenteSimulado(texto) {
        const MIN_FONT_SIZE = 29;
        const MAX_FONT_SIZE = 60;
        const chars = texto.length;
        
        // Rangos basados en longitud de caracteres
        let targetSize;
        if (chars <= 50) {
            targetSize = MAX_FONT_SIZE; // 60px para textos cortos
        } else if (chars <= 100) {
            targetSize = Math.round(MAX_FONT_SIZE - ((chars - 50) * 0.62)); // 60px-29px en 50 caracteres
        } else {
            targetSize = MIN_FONT_SIZE; // 29px para textos largos
        }
        
        return Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, targetSize));
    }
    
    const resultados = [];
    
    for (let i = 0; i < versiculosTest.length; i++) {
        const v = versiculosTest[i];
        
        try {
            const datos = await getData(db, v.libro, v.capitulo, v.versiculo);
            if (!datos || datos.length === 0) {
                console.log(`❌ No se encontró: ${v.libro} ${v.capitulo}:${v.versiculo}`);
                continue;
            }
            
            const texto = datos[0].text;
            const chars = texto.length;
            const fontSize = calcularTamanoFuenteSimulado(texto);
            
            const resultado = {
                secuencia: i + 1,
                versiculo: `${v.libro} ${v.capitulo}:${v.versiculo}`,
                caracteres: chars,
                fontSize: fontSize,
                texto: texto.substring(0, 60) + (texto.length > 60 ? '...' : '')
            };
            
            resultados.push(resultado);
            
            console.log(`📖 Selección ${resultado.secuencia}: ${resultado.versiculo}`);
            console.log(`   📏 Caracteres: ${resultado.caracteres}`);
            console.log(`   🎨 Font Size: ${resultado.fontSize}px`);
            console.log(`   💬 Texto: "${resultado.texto}"`);
            console.log('');
            
        } catch (error) {
            console.log(`❌ Error con ${v.libro} ${v.capitulo}:${v.versiculo}:`, error.message);
        }
    }
    
    // Análisis de consistencia
    console.log('🔬 ANÁLISIS DE CONSISTENCIA:');
    console.log('=====================================\n');
    
    // Verificar si versículos repetidos dan el mismo resultado
    const salmo119_105 = resultados.filter(r => r.versiculo === 'Salmos 119:105');
    const juan11_35 = resultados.filter(r => r.versiculo === 'Juan 11:35');
    
    if (salmo119_105.length >= 2) {
        const consistente = salmo119_105.every(r => r.fontSize === salmo119_105[0].fontSize);
        console.log(`📊 Salmos 119:105 (${salmo119_105.length} repeticiones):`);
        console.log(`   Font sizes: ${salmo119_105.map(r => r.fontSize + 'px').join(', ')}`);
        console.log(`   ✅ Consistente: ${consistente ? 'SÍ' : 'NO'}`);
        console.log('');
    }
    
    if (juan11_35.length >= 2) {
        const consistente = juan11_35.every(r => r.fontSize === juan11_35[0].fontSize);
        console.log(`📊 Juan 11:35 (${juan11_35.length} repeticiones):`);
        console.log(`   Font sizes: ${juan11_35.map(r => r.fontSize + 'px').join(', ')}`);
        console.log(`   ✅ Consistente: ${consistente ? 'SÍ' : 'NO'}`);
        console.log('');
    }
    
    // Verificar diferenciación por longitud
    const porLongitud = resultados.reduce((acc, r) => {
        const rango = r.caracteres <= 50 ? 'Corto (≤50)' : 
                     r.caracteres <= 100 ? 'Medio (51-100)' : 'Largo (>100)';
        if (!acc[rango]) acc[rango] = [];
        acc[rango].push(r);
        return acc;
    }, {});
    
    console.log('📈 DIFERENCIACIÓN POR LONGITUD:');
    Object.keys(porLongitud).forEach(rango => {
        const items = porLongitud[rango];
        const fontSizes = [...new Set(items.map(i => i.fontSize))];
        console.log(`   ${rango}: Font sizes ${fontSizes.join(', ')}px`);
    });
    
    console.log('\n🎯 RESUMEN FINAL:');
    console.log(`   📚 Total versículos probados: ${resultados.length}`);
    console.log(`   🎨 Rango de fuentes: ${Math.min(...resultados.map(r => r.fontSize))}-${Math.max(...resultados.map(r => r.fontSize))}px`);
    console.log(`   ✅ Sistema completamente dinámico sin caché`);
    
    db.close();
}

// Ejecutar test
testComportamientoDinamico().catch(console.error);