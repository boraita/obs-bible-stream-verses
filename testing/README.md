# 🧪 Testing de Consistencia del Algoritmo

Esta carpeta contiene herramientas específicas para probar la consistencia del algoritmo de ajuste de fuentes con los versículos proporcionados por el usuario.

## 📁 Archivos

- **`index.html`** - Interfaz web para ejecutar los tests
- **`testVersiculos.js`** - Script con funciones de testing
- **`README.md`** - Este archivo de documentación

## 🚀 Cómo usar

### 1. Levantar el servidor
```bash
npm run dev
```

### 2. Abrir la página de testing
Navega a: `http://localhost:8080/testing/`

### 3. Ejecutar tests
- Abre las herramientas de desarrollador (F12)
- Ve a la pestaña Console
- Usa los botones de la interfaz o ejecuta comandos directamente

## 🧪 Funciones disponibles

### Testing automático
- `testRapido()` - Testing rápido (3 iteraciones por versículo)
- `testExhaustivo()` - Testing exhaustivo (10 iteraciones por versículo)
- `testTodosLosVersiculos(n)` - Testing personalizado con n iteraciones

### Testing individual
- `testVersiculoPorIndice(indice)` - Prueba un versículo específico por su índice (0-19)
- `testVersiculoConsistencia(texto, iteraciones)` - Prueba cualquier texto personalizado

### Utilidades
- `mostrarVersiculos()` - Muestra la lista numerada de versículos
- `ayudaTesting()` - Muestra todas las funciones disponibles

## 📋 Lista de Versículos

Los siguientes 20 versículos están configurados para testing:

1. Juan 3:16
2. Salmos 23:1
3. Romanos 8:28
4. Filipenses 4:13
5. Proverbios 3:5-6
6. Mateo 5:14
7. Salmos 119:105
8. Isaías 40:31
9. Efesios 2:8-9
10. 1 Corintios 13:4-7
11. Salmos 46:1
12. Gálatas 5:22-23
13. 2 Timoteo 1:7
14. Hebreos 11:1
15. Salmos 37:4
16. Mateo 6:33
17. 1 Pedro 5:7
18. Salmos 121:1-2
19. Romanos 12:2
20. Colosenses 3:2

## 🔍 Interpretación de Resultados

### ✅ Consistencia Perfecta
- Todos los cálculos devuelven el mismo tamaño de fuente
- Indica que el algoritmo es estable y confiable

### ❌ Inconsistencias
- Diferentes tamaños en múltiples ejecuciones del mismo texto
- Indica que el algoritmo necesita ajustes

## 🛠️ Correcciones del Algoritmo

Si se detectan inconsistencias, el algoritmo en `src/core/browser_app.js` debe ser ajustado para:

1. **Mejorar la determinística** - Eliminar factores aleatorios
2. **Optimizar la memoria contextual** - Asegurar que la memoria no cause variaciones
3. **Refinar la búsqueda bidireccional** - Garantizar que siempre encuentre el mismo resultado óptimo

## 📊 Ejemplo de Uso

```javascript
// Testing rápido de todos los versículos
testRapido();

// Testing de un versículo específico
testVersiculoPorIndice(0); // Juan 3:16

// Testing personalizado
testVersiculoConsistencia("Mi texto personalizado", 5);
```

## 🎯 Objetivo

El objetivo es alcanzar **100% de consistencia** en todos los versículos, donde cada versículo siempre produzca exactamente el mismo tamaño de fuente en múltiples ejecuciones.