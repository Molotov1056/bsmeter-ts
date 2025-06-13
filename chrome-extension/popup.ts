import './styles.css';
import { GaugeService } from './gauge-service';
import { ChromeExtensionService } from './chrome-extension-service';
import { BSMeterData } from './types';

class BSMeterPopup {
    private gaugeService: GaugeService;
    private chromeService: ChromeExtensionService;
    
    // Elements
    private gaugeSegments: HTMLElement | null;
    private needle: HTMLElement | null;
    private gaugeText: HTMLElement | null;
    private gaugePercentage: HTMLElement | null;
    private analyzePageBtn: HTMLButtonElement | null;
    private randomBtn: HTMLButtonElement | null;
    private valueSlider: HTMLInputElement | null;
    
    // State
    private currentValue: number = 50;
    private bsMeterData: BSMeterData | null = null;

    constructor() {
        this.gaugeService = new GaugeService();
        this.chromeService = new ChromeExtensionService();

        // Get DOM elements
        this.gaugeSegments = document.getElementById('segments');
        this.needle = document.getElementById('needle');
        this.gaugeText = document.getElementById('gauge-text');
        this.gaugePercentage = document.getElementById('gauge-percentage');
        this.analyzePageBtn = document.getElementById('analyze-page-btn') as HTMLButtonElement;
        this.randomBtn = document.getElementById('random-btn') as HTMLButtonElement;
        this.valueSlider = document.getElementById('value-slider') as HTMLInputElement;

        // Check if all elements exist
        if (!this.gaugeSegments || !this.needle || !this.gaugeText || 
            !this.gaugePercentage || !this.analyzePageBtn || !this.randomBtn || !this.valueSlider) {
            console.error('One or more elements not found');
            return;
        }

        // Initialize
        this.init();
    }

    private async init(): Promise<void> {
        console.log('=== BS METER POPUP INITIALIZATION ===');
        
        // Initialize Chrome extension service
        this.chromeService.initialize();
        
        // Create gauge segments
        this.createGaugeSegments();
        
        // Try to load previous analysis result
        try {
            this.bsMeterData = await this.chromeService.getStoredAnalysisResult();
            if (this.bsMeterData) {
                this.currentValue = Math.round(this.bsMeterData.overall_score * 100);
                console.log(`✅ Loading stored analysis: ${this.currentValue}%`);
            }
        } catch (error) {
            console.log('⚠️ No stored analysis found, using default');
        }
        
        this.setGaugeValue(this.currentValue, true);
        
        // Add event listeners
        this.setupEventListeners();
        
        console.log('=== BS METER POPUP INITIALIZATION COMPLETE ===');
    }

    private setupEventListeners(): void {
        this.analyzePageBtn?.addEventListener('click', () => this.analyzeCurrentPage());
        this.randomBtn?.addEventListener('click', () => this.generateRandomScore());
        this.valueSlider?.addEventListener('input', (e) => {
            const inputElement = e.target as HTMLInputElement;
            this.setGaugeValue(parseInt(inputElement.value), false);
        });
    }

    private async analyzeCurrentPage(): Promise<void> {
        if (!this.analyzePageBtn) return;
        
        // Update button state
        this.analyzePageBtn.disabled = true;
        this.analyzePageBtn.textContent = 'Analyzing...';
        this.updateGaugeText(50, 'ANALYZING...');
        
        try {
            // Analyze current page
            const analysisResult = await this.chromeService.analyzeCurrentPage();
            
            if (analysisResult) {
                this.bsMeterData = analysisResult;
                const scorePercent = Math.round(analysisResult.overall_score * 100);
                
                // Store the result
                await this.chromeService.storeAnalysisResult(analysisResult);
                
                // Update gauge
                this.setGaugeValue(scorePercent, true);
                
                console.log('✅ Page analysis complete:', scorePercent + '%');
            } else {
                console.log('⚠️ Analysis failed or no content found');
                this.updateGaugeText(50, 'ANALYSIS FAILED');
            }
        } catch (error) {
            console.error('Analysis error:', error);
            this.updateGaugeText(50, 'ERROR');
        } finally {
            // Reset button state
            this.analyzePageBtn.disabled = false;
            this.analyzePageBtn.textContent = 'Analyze Page';
        }
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
                textElement.setAttribute("font-size", "12");
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
        
        const startValue = this.currentValue;
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
            this.updateGaugeTextOnly(currentValue);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Ensure final value is exact
                this.currentValue = targetValue;
                this.updateGaugeTextOnly(this.currentValue);
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

    private updateGaugeText(value: number, customText?: string): void {
        if (!this.gaugeText || !this.gaugePercentage) return;
        
        if (customText) {
            this.gaugeText.textContent = customText;
            this.gaugeText.style.color = '#666';
            this.gaugePercentage.textContent = `${Math.round(value)}%`;
            this.gaugePercentage.style.color = '#666';
            return;
        }
        
        const level = this.gaugeService.getLevelForValue(value);
        
        if (level) {
            this.gaugeText.textContent = level.text;
            this.gaugeText.style.color = level.color;
            this.gaugePercentage.textContent = `${Math.round(value)}%`;
            this.gaugePercentage.style.color = level.color;
        }
    }

    private updateGaugeTextOnly(value: number): void {
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
            this.updateGaugeTextOnly(this.currentValue);
        }
    }

    private generateRandomScore(): void {
        const randomValue = this.gaugeService.generateRandomScore();
        this.setGaugeValue(randomValue, true);
    }
}

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    new BSMeterPopup();
});