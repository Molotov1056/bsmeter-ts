import './styles.css';
import { GaugeService } from './gauge-service';

class BSMeter {
    private gaugeService: GaugeService;
    
    // Elements
    private gaugeSegments: HTMLElement | null;
    private needle: HTMLElement | null;
    private gaugeText: HTMLElement | null;
    private gaugePercentage: HTMLElement | null;
    private randomBtn: HTMLButtonElement | null;
    private animateBtn: HTMLButtonElement | null;
    private valueSlider: HTMLInputElement | null;
    
    // State
    private currentValue: number = 30;
    private animationInterval: number | null = null;
    private isAnimating: boolean = false;

    constructor() {
        this.gaugeService = new GaugeService();

        // Get DOM elements
        this.gaugeSegments = document.getElementById('segments');
        this.needle = document.getElementById('needle');
        this.gaugeText = document.getElementById('gauge-text');
        this.gaugePercentage = document.getElementById('gauge-percentage');
        this.randomBtn = document.getElementById('random-btn') as HTMLButtonElement;
        this.animateBtn = document.getElementById('animate-btn') as HTMLButtonElement;
        this.valueSlider = document.getElementById('value-slider') as HTMLInputElement;

        // Check if all elements exist
        if (!this.gaugeSegments || !this.needle || !this.gaugeText || 
            !this.gaugePercentage || !this.randomBtn || !this.animateBtn || !this.valueSlider) {
            console.error('One or more elements not found');
            return;
        }

        // Initialize
        this.init();
    }

    private init(): void {
        // Create gauge segments
        this.createGaugeSegments();
        
        // Set initial value
        this.setGaugeValue(this.currentValue);
        
        // Add event listeners
        this.randomBtn?.addEventListener('click', () => this.generateRandomScore());
        this.animateBtn?.addEventListener('click', () => this.toggleAnimation());
        this.valueSlider?.addEventListener('input', (e) => {
            if (!this.isAnimating) {
                const inputElement = e.target as HTMLInputElement;
                this.setGaugeValue(parseInt(inputElement.value));
            }
        });
    }

    private createGaugeSegments(): void {
        if (!this.gaugeSegments) return;
        
        this.gaugeSegments.innerHTML = '';
        
        this.gaugeService.getSegments().forEach(segment => {
            const { startX, startY, endX, endY, largeArcFlag } = this.gaugeService.getSegmentPathData(segment);
            
            // Create path for segment
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", `M ${startX} ${startY} A ${120} ${120} 0 ${largeArcFlag} 1 ${endX} ${endY}`);
            path.setAttribute("fill", "none");
            path.setAttribute("stroke", segment.color);
            path.setAttribute("stroke-width", "28");  // Slightly thinner to see gaps
            path.setAttribute("stroke-linecap", "butt"); // Changed to butt to see clear segments
            
            // Add a small gap between segments
            this.gaugeSegments?.appendChild(path);
            
            // Add segment border
            const border = document.createElementNS("http://www.w3.org/2000/svg", "path");
            border.setAttribute("d", `M ${startX} ${startY} A ${120} ${120} 0 ${largeArcFlag} 1 ${endX} ${endY}`);
            border.setAttribute("fill", "none");
            border.setAttribute("stroke", "white");
            border.setAttribute("stroke-width", "1");
            border.setAttribute("stroke-opacity", "0.7");
            
            this.gaugeSegments?.appendChild(border);
        });
    }

    private rotateNeedle(value: number): void {
        if (!this.needle) return;
        
        const rotation = this.gaugeService.getNeedleRotation(value);
        this.needle.setAttribute("transform", `rotate(${rotation} 150 150)`);
    }

    private updateGaugeText(value: number): void {
        if (!this.gaugeText || !this.gaugePercentage) return;
        
        const level = this.gaugeService.getLevelForValue(value);
        
        if (level) {
            this.gaugeText.textContent = level.text;
            this.gaugeText.style.color = level.color;
            this.gaugePercentage.textContent = `${Math.round(value)}%`;
            this.gaugePercentage.style.color = level.color;
        }
    }

    private setGaugeValue(value: number): void {
        this.currentValue = Math.max(0, Math.min(100, value));
        
        if (this.valueSlider) {
            this.valueSlider.value = this.currentValue.toString();
        }
        
        this.rotateNeedle(this.currentValue);
        this.updateGaugeText(this.currentValue);
    }

    private generateRandomScore(): void {
        const randomValue = this.gaugeService.generateRandomScore();
        this.setGaugeValue(randomValue);
    }

    private toggleAnimation(): void {
        if (!this.animateBtn) return;
        
        if (this.isAnimating) {
            if (this.animationInterval !== null) {
                window.clearInterval(this.animationInterval);
                this.animationInterval = null;
            }
            this.animateBtn.textContent = "Illustrate";
            this.isAnimating = false;
        } else {
            this.animationInterval = window.setInterval(() => {
                this.currentValue = (this.currentValue >= 100) ? 0 : this.currentValue + 1;
                this.setGaugeValue(this.currentValue);
            }, 50);
            this.animateBtn.textContent = "Stop";
            this.isAnimating = true;
        }
    }
}

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    new BSMeter();
});