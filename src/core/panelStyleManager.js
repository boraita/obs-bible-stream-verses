/**
 * MÓDULO DE GESTIÓN DE ESTILOS PARA PANEL DE CONTROL
 * Centraliza toda la aplicación de estilos CSS del panel desde JavaScript
 */

class PanelStyleManager {
    constructor() {
        this.initialized = false;
    }

    /**
     * Inicializa el gestor de estilos del panel
     */
    init() {
        this.initialized = true;
        console.log('✅ Gestor de estilos del panel inicializado');
    }

    /**
     * Muestra u oculta un elemento usando clases CSS
     */
    toggleElement(element, visible) {
        if (!element) return;

        if (visible) {
            element.classList.remove('element-hidden');
            element.classList.add('element-visible');
        } else {
            element.classList.remove('element-visible');
            element.classList.add('element-hidden');
        }
    }

    /**
     * Maneja la visibilidad de tabs
     */
    showTab(tabElement) {
        if (!tabElement) return;
        
        // Remover estilo inline que bloquea las clases CSS
        tabElement.style.display = '';
        
        tabElement.classList.remove('tab-area-inactive');
        tabElement.classList.add('tab-area-active');
        
        console.log(`👁️ Tab shown: ${tabElement.id}`);
    }

    hideTab(tabElement) {
        if (!tabElement) return;
        
        // Remover estilo inline que bloquea las clases CSS
        tabElement.style.display = '';
        
        tabElement.classList.remove('tab-area-active');
        tabElement.classList.add('tab-area-inactive');
        
        console.log(`🙈 Tab hidden: ${tabElement.id}`);
    }

    /**
     * Alterna tabs de manera organizada
     */
    switchTabs(tabs, selectedIndex) {
        if (!tabs) return;

        for (let i = 0; i < tabs.length; i++) {
            if (i === selectedIndex) {
                this.showTab(tabs[i]);
            } else {
                this.hideTab(tabs[i]);
            }
        }
    }

    /**
     * Maneja grupos de configuración de título
     */
    toggleTitleShadowControls(enabled) {
        const titleShadowColorGroup = document.getElementById('titleShadowColorGroup');
        const titleShadowSizeGroup = document.getElementById('titleShadowSizeGroup');

        this.toggleElement(titleShadowColorGroup, enabled);
        this.toggleElement(titleShadowSizeGroup, enabled);

        if (titleShadowColorGroup) {
            titleShadowColorGroup.classList.toggle('title-shadow-controls', true);
            titleShadowColorGroup.classList.toggle('visible', enabled);
            titleShadowColorGroup.classList.toggle('hidden', !enabled);
        }

        if (titleShadowSizeGroup) {
            titleShadowSizeGroup.classList.toggle('title-shadow-controls', true);
            titleShadowSizeGroup.classList.toggle('visible', enabled);
            titleShadowSizeGroup.classList.toggle('hidden', !enabled);
        }
    }

    /**
     * Maneja controles del recuadro del título
     */
    toggleTitleBoxCustomSize(isCustom) {
        const customBoxSize = document.getElementById('customBoxSize');
        this.toggleElement(customBoxSize, isCustom);
        
        if (customBoxSize) {
            customBoxSize.classList.toggle('title-box-controls', true);
            customBoxSize.classList.toggle('visible', isCustom);
            customBoxSize.classList.toggle('hidden', !isCustom);
        }
    }

    toggleTitleBoxFullWidthControls(fullWidth) {
        const titleBoxWidthGroup = document.getElementById('titleBoxWidthGroup');
        const titleAlignmentGroup = document.getElementById('titleAlignmentGroup');

        this.toggleElement(titleBoxWidthGroup, fullWidth);
        this.toggleElement(titleAlignmentGroup, fullWidth);

        [titleBoxWidthGroup, titleAlignmentGroup].forEach(element => {
            if (element) {
                element.classList.toggle('title-box-controls', true);
                element.classList.toggle('visible', fullWidth);
                element.classList.toggle('hidden', !fullWidth);
            }
        });
    }

    /**
     * Maneja controles de gradiente
     */
    toggleGradientControls(enabled) {
        const gradientControls = document.getElementById('gradientControls');
        const color2Container = document.getElementById('color2Container');
        const color3Container = document.getElementById('color3Container');

        [gradientControls, color2Container, color3Container].forEach(element => {
            this.toggleElement(element, enabled);
            
            if (element) {
                element.classList.toggle('gradient-controls', true);
                element.classList.toggle('enabled', enabled);
                element.classList.toggle('disabled', !enabled);
            }
        });
    }

    /**
     * Maneja controles de efectos de texto
     */
    toggleTextEffectControls(elementId, enabled) {
        const element = document.getElementById(elementId);
        this.toggleElement(element, enabled);

        if (element) {
            element.classList.toggle('text-effect-controls', true);
            element.classList.toggle('enabled', enabled);
            element.classList.toggle('disabled', !enabled);
        }
    }

    /**
     * Métodos específicos para efectos de texto
     */
    toggleTextShadowControls(enabled) {
        this.toggleTextEffectControls('textShadowControls', enabled);
    }

    toggleTextStrokeControls(enabled) {
        this.toggleTextEffectControls('textStrokeControls', enabled);
    }

    toggleTextGlowControls(enabled) {
        this.toggleTextEffectControls('textGlowControls', enabled);
    }

    /**
     * Resetea todos los estados de elementos
     */
    resetAllStyles() {
        const elements = document.querySelectorAll('.element-visible, .element-hidden, .tab-area-active, .tab-area-inactive');
        
        elements.forEach(element => {
            element.classList.remove(
                'element-visible', 'element-hidden',
                'tab-area-active', 'tab-area-inactive',
                'title-shadow-controls', 'title-box-controls',
                'gradient-controls', 'text-effect-controls',
                'visible', 'hidden', 'enabled', 'disabled'
            );
        });

        console.log('🔄 Estilos del panel reseteados');
    }

    /**
     * Aplica transiciones suaves a elementos
     */
    addSmoothTransitions(elements) {
        if (!elements) return;

        const elementList = Array.isArray(elements) ? elements : [elements];
        
        elementList.forEach(element => {
            if (element) {
                element.style.transition = 'all 0.3s ease-in-out';
            }
        });
    }

    /**
     * Activa/desactiva un control de configuración
     */
    toggleSettingControl(element, active) {
        if (!element) return;

        if (active) {
            element.classList.remove('setting-control', 'inactive');
            element.classList.add('setting-control', 'active');
        } else {
            element.classList.remove('setting-control', 'active');
            element.classList.add('setting-control', 'inactive');
        }
    }

    /**
     * Alterna la visibilidad del contenedor de color de degradado de texto
     */
    toggleTextGradientColor2Container(show) {
        const container = document.getElementById('textGradientColor2Container');
        this.toggleElement(container, show);
    }

    /**
     * Utilidades para responsive design
     */
    handleResponsiveVisibility(element, condition) {
        if (!element) return;

        if (condition) {
            element.classList.remove('element-responsive-hidden');
            element.classList.add('element-responsive-visible');
        } else {
            element.classList.remove('element-responsive-visible');
            element.classList.add('element-responsive-hidden');
        }
    }
}

// Crear instancia global del gestor de estilos del panel
const panelStyleManager = new PanelStyleManager();

// Expose for global use
window.panelStyleManager = panelStyleManager;

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PanelStyleManager;
}