/**
 * PANEL STYLE MANAGEMENT MODULE
 * Centralizes all panel CSS style application from JavaScript
 */

class PanelStyleManager {
    constructor() {
        this.initialized = false;
    }

    /**
     * Initializes the panel style manager
     */
    init() {
        this.initialized = true;
        console.log('✅ Gestor de estilos del panel inicializado');
    }

    /**
     * Shows or hides an element using CSS classes
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
     * Handles tab visibility
     */
    showTab(tabElement) {
        if (!tabElement) return;
        
    
        tabElement.style.display = '';
        
        tabElement.classList.remove('tab-area-inactive');
        tabElement.classList.add('tab-area-active');
        
        console.log(`👁️ Tab shown: ${tabElement.id}`);
    }

    hideTab(tabElement) {
        if (!tabElement) return;
        
    
        tabElement.style.display = '';
        
        tabElement.classList.remove('tab-area-active');
        tabElement.classList.add('tab-area-inactive');
        
        console.log(`🙈 Tab hidden: ${tabElement.id}`);
    }

    /**
     * Switches tabs in an organized way
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
     * Handles title shadow control groups
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
     * Handles title box custom size controls
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
     * Handles gradient controls
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
     * Handles text effect controls
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
     * Specific methods for text effects
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
     * Resets all panel element states and classes
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
     * Applies smooth transitions to elements
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
     * Activates or deactivates a setting control
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
     * Toggles visibility of the text gradient color2 container
     */
    toggleTextGradientColor2Container(show) {
        const container = document.getElementById('textGradientColor2Container');
        this.toggleElement(container, show);
    }

    /**
     * Utilities for responsive design
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

const panelStyleManager = new PanelStyleManager();

window.panelStyleManager = panelStyleManager;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PanelStyleManager;
}