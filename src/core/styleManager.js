/**
 * DYNAMIC STYLE MANAGEMENT MODULE
 * Centralizes all CSS style application from JavaScript
 */

class StyleManager {
    constructor() {
        this.messageDisplay = null;
        this.titleSpan = null;
    }

    /**
     * Initializes references to DOM elements
     */
    init() {
        this.messageDisplay = document.getElementById('messageDisplay');
        this.titleSpan = this.messageDisplay?.querySelector('span');
    }

    /**
     * Applies base styles to messageDisplay
     */
    applyBaseMessageStyles() {
        if (!this.messageDisplay) return;

        this.messageDisplay.classList.add('message-display-base');
        
        this.messageDisplay.style.visibility = 'visible';
        this.messageDisplay.style.opacity = '1';
    }

    /**
     * Applies specific styles for cached state
     */
    applyCachedStyles(fontSize) {
        if (!this.messageDisplay) return;

        this.messageDisplay.style.fontSize = fontSize + 'px';
        this.messageDisplay.classList.add('message-display-cached');
    }

    /**
     * Applies title styles in an organized way
     */
    applyTitleStyles() {
        if (!this.titleSpan) return;

        this.titleSpan.classList.add('title-span-base');

        const titleFontSize = localStorage.getItem('titleFontSize') || 24;
        const titleColor = localStorage.getItem('titleColor') || '#ffffff';
        
        this.titleSpan.style.fontSize = titleFontSize + 'px';
        this.titleSpan.style.color = titleColor;

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
     * Applies spacing depending on whether there is a title or not
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
     * Prevents title overlapping with text
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
     * Applies word-wrap styles when necessary
     */
    enableWordWrap() {
        if (!this.messageDisplay) return;

        this.messageDisplay.classList.add('message-word-wrap-enabled');
        console.log('   ⚠️ Word-wrap habilitado para texto muy largo');
    }

    /**
     * Removes all dynamic styles and applied classes
     */
    resetStyles() {
        if (!this.messageDisplay) return;

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
     * Applies a specific font size
     */
    setFontSize(fontSize) {
        if (!this.messageDisplay) return;
        this.messageDisplay.style.fontSize = fontSize + 'px';
    }

    /**
     * Forces a DOM reflow
     */
    forceReflow() {
        if (!this.messageDisplay) return;
        void this.messageDisplay.offsetHeight;
    }

    /**
     * Gets the current dimensions of the element
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

const styleManager = new StyleManager();

window.styleManager = styleManager;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = StyleManager;
}
