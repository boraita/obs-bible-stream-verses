/**
 * MÓDULO DE GESTIÓN DE ESTILOS DINÁMICOS
 * Centraliza toda la aplicación de estilos CSS desde JavaScript
 */

class StyleManager {
    constructor() {
        this.messageDisplay = null;
        this.titleSpan = null;
    }

    /**
     * Inicializa las referencias a los elementos DOM
     */
    init() {
        this.messageDisplay = document.getElementById('messageDisplay');
        this.titleSpan = this.messageDisplay?.querySelector('span');
    }

    /**
     * Aplica estilos base al messageDisplay
     */
    applyBaseMessageStyles() {
        if (!this.messageDisplay) return;

        // Aplicar clase CSS base
        this.messageDisplay.classList.add('message-display-base');
        
        // Estilos que necesitan ser dinámicos
        this.messageDisplay.style.visibility = 'visible';
        this.messageDisplay.style.opacity = '1';
    }

    /**
     * Aplica estilos específicos para el estado de cache
     */
    applyCachedStyles(fontSize) {
        if (!this.messageDisplay) return;

        this.messageDisplay.style.fontSize = fontSize + 'px';
        this.messageDisplay.classList.add('message-display-cached');
    }

    /**
     * Aplica estilos del título de manera organizada
     */
    applyTitleStyles() {
        if (!this.titleSpan) return;

        // Aplicar clase CSS base
        this.titleSpan.classList.add('title-span-base');

        // Estilos dinámicos desde localStorage
        const titleFontSize = localStorage.getItem('titleFontSize') || 24;
        const titleColor = localStorage.getItem('titleColor') || '#ffffff';
        
        this.titleSpan.style.fontSize = titleFontSize + 'px';
        this.titleSpan.style.color = titleColor;

        // Manejar fondo del título si está habilitado
        const titleBoxEnabled = localStorage.getItem('titleBoxEnabled');
        if (titleBoxEnabled === 'true') {
            this.titleSpan.classList.add('title-with-box', 'title-span-with-background');
            if (window.applyTitleBoxStyles) {
                window.applyTitleBoxStyles(this.titleSpan);
            }
        }

        console.log(`   📝 Título estático: ${titleFontSize}px (estilos aplicados de manera organizada)`);
    }

    /**
     * Aplica espaciado según si hay título o no
     */
    applySpacing(hasTitle) {
        if (!this.messageDisplay) return;

        if (hasTitle) {
            this.messageDisplay.classList.add('message-with-title');
            this.messageDisplay.classList.remove('message-without-title');
        } else {
            this.messageDisplay.classList.add('message-without-title');
            this.messageDisplay.classList.remove('message-with-title');
        }

        if (window.updateMessagePadding) {
            window.updateMessagePadding();
        }
    }

    /**
     * Previene el solapamiento del título con el texto
     */
    preventTitleOverlap() {
        if (this.titleSpan) {
            this.titleSpan.classList.add('title-no-overlap');
        }
        
        if (this.messageDisplay) {
            this.messageDisplay.classList.add('message-display-no-overlap');
        }

        console.log('   🛡️ Clases de prevención de solapamiento aplicadas');
    }

    /**
     * Aplica estilos de word-wrap cuando es necesario
     */
    enableWordWrap() {
        if (!this.messageDisplay) return;

        this.messageDisplay.classList.add('message-word-wrap-enabled');
        console.log('   ⚠️ Word-wrap habilitado para texto muy largo');
    }

    /**
     * Remueve todos los estilos dinámicos y clases aplicadas
     */
    resetStyles() {
        if (!this.messageDisplay) return;

        // Remover todas las clases dinámicas
        const classesToRemove = [
            'message-display-cached',
            'message-display-calculating', 
            'message-with-title',
            'message-without-title',
            'message-display-no-overlap',
            'message-word-wrap-enabled'
        ];
        
        this.messageDisplay.classList.remove(...classesToRemove);

        if (this.titleSpan) {
            this.titleSpan.classList.remove('title-no-overlap', 'title-span-with-background');
        }
    }

    /**
     * Aplica un tamaño de fuente específico
     */
    setFontSize(fontSize) {
        if (!this.messageDisplay) return;
        this.messageDisplay.style.fontSize = fontSize + 'px';
    }

    /**
     * Fuerza un reflow del DOM
     */
    forceReflow() {
        if (!this.messageDisplay) return;
        void this.messageDisplay.offsetHeight;
    }

    /**
     * Obtiene las dimensiones actuales del elemento
     */
    getDimensions() {
        if (!this.messageDisplay) return null;
        
        return {
            scrollWidth: this.messageDisplay.scrollWidth,
            scrollHeight: this.messageDisplay.scrollHeight,
            clientWidth: this.messageDisplay.clientWidth,
            clientHeight: this.messageDisplay.clientHeight
        };
    }
}

// Crear instancia global del gestor de estilos
const styleManager = new StyleManager();

// Exponer para uso global
window.styleManager = styleManager;

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StyleManager;
}
