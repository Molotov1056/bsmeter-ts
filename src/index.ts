import './styles.css';
import { GaugeService } from './gauge-service';
import { TelegramService } from './telegram-service';
import { BSMeterData } from './types';

class BSMeter {
    private gaugeService: GaugeService;
    private telegramService: TelegramService;
    
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
    private bsMeterData: BSMeterData | null = null;

    constructor() {
        this.gaugeService = new GaugeService();
        this.telegramService = new TelegramService();

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
        console.log('=== BS METER INITIALIZATION ===');
        
        // Initialize Telegram Web App
        this.telegramService.initialize();
        
        // Try to get data from Telegram
        this.bsMeterData = this.telegramService.getBSMeterData();
        console.log('BS Meter Data received:', this.bsMeterData);
        
        // Create gauge segments
        this.createGaugeSegments();
        
        // Set initial value based on Telegram data or default
        const initialScore = this.telegramService.getOverallScore();
        console.log('Initial score from Telegram:', initialScore);
        
        if (initialScore !== null) {
            // Convert from 0-1 scale to 0-100 scale
            this.currentValue = Math.round(initialScore * 100);
            console.log(`✅ Setting gauge to Telegram score: ${this.currentValue}%`);
        } else {
            console.log(`⚠️ No Telegram score found, using default: ${this.currentValue}%`);
        }
        
        this.setGaugeValue(this.currentValue, true); // Use animation for initial setup
        
        // Add event listeners
        this.setupEventListeners();
        
        // Show category breakdown if available
        if (this.bsMeterData) {
            console.log('✅ Category data available, setting up category view');
            this.setupCategoryView();
        } else {
            console.log('⚠️ No category data available');
        }
        
        console.log('=== BS METER INITIALIZATION COMPLETE ===');
    }

    private setupEventListeners(): void {
        this.randomBtn?.addEventListener('click', () => this.generateRandomScore());
        this.animateBtn?.addEventListener('click', () => this.toggleAnimation());
        this.valueSlider?.addEventListener('input', (e) => {
            if (!this.isAnimating) {
                const inputElement = e.target as HTMLInputElement;
                this.setGaugeValue(parseInt(inputElement.value), false); // No animation for slider
            }
        });
    }

    private setupCategoryView(): void {
        if (!this.bsMeterData) return;
        
        // Add a button to show category breakdown
        this.telegramService.showMainButton('View Category Breakdown', () => {
            this.showCategoryBreakdown();
        });
    }

    private showCategoryBreakdown(): void {
        if (!this.bsMeterData) return;
        
        const categories = this.bsMeterData.categories;
        let breakdown = 'Category Breakdown:\n\n';
        
        Object.entries(categories).forEach(([key, data]) => {
            const formattedName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            const scorePercent = Math.round(data.score * 100);
            breakdown += `${formattedName}: ${scorePercent}%\n`;
        });
        
        alert(breakdown); // Simple alert for now - could be replaced with better UI
    }

    private createGaugeSegments(): void {
        if (!this.gaugeSegments) return;
        
        this.gaugeSegments.innerHTML = '';
        
        this.gaugeService.getSegments().forEach(segment => {
            const { startX, startY, endX, endY, largeArcFlag } = this.gaugeService.getSegmentPathData(segment);
            
            // Create a filled segment
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            
            // Build path for a filled sector (from center to arc)
            path.setAttribute("d", `M 200 200 L ${startX} ${startY} A ${160} ${160} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`);
            path.setAttribute("fill", segment.color);
            path.setAttribute("stroke", "white");
            path.setAttribute("stroke-width", "2");
            path.setAttribute("stroke-opacity", "0.9");
            
            this.gaugeSegments?.appendChild(path);
            
            // Add segment label
            const labelPos = this.gaugeService.getSegmentLabelPosition(segment);
            const labelText = this.gaugeService.getSegmentShortLabel(segment);
            
            if (labelText) {
                const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
                textElement.setAttribute("x", labelPos.x.toString());
                textElement.setAttribute("y", labelPos.y.toString());
                textElement.setAttribute("text-anchor", "middle");
                textElement.setAttribute("dominant-baseline", "middle");
                textElement.setAttribute("font-family", "Arial, sans-serif");
                textElement.setAttribute("font-size", "14");
                textElement.setAttribute("font-weight", "bold");
                textElement.setAttribute("fill", "white");
                textElement.setAttribute("stroke", "#333");
                textElement.setAttribute("stroke-width", "0.8");
                textElement.setAttribute("transform", `rotate(${labelPos.rotation} ${labelPos.x} ${labelPos.y})`);
                textElement.textContent = labelText;
                
                this.gaugeSegments?.appendChild(textElement);
            }
        });
    }

    private animateNeedleToValue(targetValue: number, duration: number = 1500): void {
        if (!this.needle) return;
        
        const startValue = 0;
        const startTime = performance.now();
        
        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease-out animation
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = startValue + (targetValue - startValue) * easedProgress;
            
            // Update needle position
            const rotation = this.gaugeService.getNeedleRotation(currentValue);
            this.needle?.setAttribute("transform", `rotate(${rotation} 200 200)`);
            
            // Update text and percentage during animation
            this.updateGaugeText(currentValue);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Ensure final value is exact
                this.currentValue = targetValue;
                this.updateGaugeText(this.currentValue);
                const finalRotation = this.gaugeService.getNeedleRotation(this.currentValue);
                this.needle?.setAttribute("transform", `rotate(${finalRotation} 200 200)`);
            }
        };
        
        requestAnimationFrame(animate);
    }

    private rotateNeedle(value: number): void {
        if (!this.needle) return;
        
        const rotation = this.gaugeService.getNeedleRotation(value);
        this.needle.setAttribute("transform", `rotate(${rotation} 200 200)`);
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

    private setGaugeValue(value: number, animate: boolean = true): void {
        this.currentValue = Math.max(0, Math.min(100, value));
        
        if (this.valueSlider) {
            this.valueSlider.value = this.currentValue.toString();
        }
        
        if (animate) {
            this.animateNeedleToValue(this.currentValue);
        } else {
            this.rotateNeedle(this.currentValue);
            this.updateGaugeText(this.currentValue);
        }
    }

    private generateRandomScore(): void {
        const randomValue = this.gaugeService.generateRandomScore();
        this.setGaugeValue(randomValue, true); // Use animation for random scores
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
                this.setGaugeValue(this.currentValue, false); // No animation during continuous sweep
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