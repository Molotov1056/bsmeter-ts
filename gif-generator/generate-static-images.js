const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

class BSMeterImageGenerator {
    constructor() {
        this.width = 400;
        this.height = 300;
        
        this.segments = [
            { start: 0, end: 14.28, color: "#D32F2F" },
            { start: 14.28, end: 28.57, color: "#E64A19" },
            { start: 28.57, end: 42.85, color: "#F57C00" },
            { start: 42.85, end: 57.14, color: "#FF9800" },
            { start: 57.14, end: 71.42, color: "#FFC107" },
            { start: 71.42, end: 85.71, color: "#CDDC39" },
            { start: 85.71, end: 100, color: "#4CAF50" }
        ];
        
        this.levels = [
            { min: 0, max: 14.28, text: "COMPLETE BULLSHIT", color: "#D32F2F" },
            { min: 14.28, max: 28.57, text: "VERY FALSE", color: "#E64A19" },
            { min: 28.57, max: 42.85, text: "MOSTLY FALSE", color: "#F57C00" },
            { min: 42.85, max: 57.14, text: "QUESTIONABLE", color: "#FF9800" },
            { min: 57.14, max: 71.42, text: "PARTIALLY TRUE", color: "#FFC107" },
            { min: 71.42, max: 85.71, text: "MOSTLY TRUE", color: "#CDDC39" },
            { min: 85.71, max: 100, text: "FACTUAL", color: "#4CAF50" }
        ];
    }
    
    generateHTML(currentScore) {
        const level = this.levels.find(l => currentScore >= l.min && currentScore < l.max) || this.levels[this.levels.length - 1];
        const needleAngle = 180 - (currentScore / 100) * 180 - 90;
        
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    margin: 0;
                    padding: 20px;
                    font-family: Arial, sans-serif;
                    background: white;
                    width: 360px;
                    height: 260px;
                    overflow: hidden;
                }
                
                .gauge-container {
                    position: relative;
                    width: 300px;
                    height: 200px;
                    margin: 0 auto;
                }
                
                .gauge-svg {
                    width: 300px;
                    height: 200px;
                }
                
                .needle {
                    transform-origin: 150px 150px;
                    transform: rotate(${needleAngle}deg);
                }
                
                .labels {
                    display: flex;
                    justify-content: space-between;
                    width: 270px;
                    margin: 10px auto;
                    font-weight: bold;
                    font-size: 14px;
                }
                
                .label-left { color: #D32F2F; }
                .label-right { color: #4CAF50; }
                
                .score-text {
                    text-align: center;
                    font-weight: bold;
                    font-size: 16px;
                    color: ${level.color};
                    margin: 5px 0;
                }
                
                .score-percent {
                    text-align: center;
                    font-weight: bold;
                    font-size: 28px;
                    color: ${level.color};
                }
            </style>
        </head>
        <body>
            <div class="gauge-container">
                <svg class="gauge-svg" viewBox="0 0 300 200">
                    ${this.segments.map(segment => {
                        const startAngle = (180 - (segment.start / 100) * 180) * Math.PI / 180;
                        const endAngle = (180 - (segment.end / 100) * 180) * Math.PI / 180;
                        const startX = 150 + 120 * Math.cos(startAngle);
                        const startY = 150 - 120 * Math.sin(startAngle);
                        const endX = 150 + 120 * Math.cos(endAngle);
                        const endY = 150 - 120 * Math.sin(endAngle);
                        const largeArcFlag = Math.abs(segment.end - segment.start) > 50 ? 1 : 0;
                        
                        return `<path d="M 150 150 L ${startX} ${startY} A 120 120 0 ${largeArcFlag} 1 ${endX} ${endY} Z" 
                                     fill="${segment.color}" stroke="white" stroke-width="1" stroke-opacity="0.7"/>`;
                    }).join('')}
                    
                    <g class="needle">
                        <path d="M 150,150 L 148,50 L 152,50 Z" fill="#333333"/>
                        <circle cx="150" cy="150" r="10" fill="#444444"/>
                    </g>
                </svg>
            </div>
            
            <div class="labels">
                <div class="label-left">BULLSHIT</div>
                <div class="label-right">TRUE</div>
            </div>
            
            <div class="score-text">${level.text}</div>
            <div class="score-percent">${Math.round(currentScore)}%</div>
        </body>
        </html>`;
    }
    
    async generateStaticImages() {
        console.log('🎬 Generating static BS Meter images...');
        
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setViewport({ width: this.width, height: this.height });
        
        // Ensure output directory exists
        await fs.mkdir(path.join(__dirname, '..', 'docs', 'gifs'), { recursive: true });
        
        // Generate 20 images for score ranges
        for (let i = 0; i < 20; i++) {
            const rangeStart = i * 5;
            const rangeEnd = rangeStart + 5;
            const middleScore = rangeStart + 2.5;
            
            const filename = `bs-meter-${rangeStart.toString().padStart(2, '0')}-${rangeEnd.toString().padStart(2, '0')}.png`;
            
            try {
                const html = this.generateHTML(middleScore);
                await page.setContent(html);
                await new Promise(resolve => setTimeout(resolve, 200)); // Wait for render
                
                const outputPath = path.join(__dirname, '..', 'docs', 'gifs', filename);
                await page.screenshot({ 
                    path: outputPath,
                    type: 'png',
                    omitBackground: false
                });
                
                console.log(`✅ Generated: ${filename}`);
            } catch (error) {
                console.error(`❌ Error generating ${filename}:`, error);
            }
        }
        
        await browser.close();
        
        console.log('🎉 Static images generated successfully!');
        console.log('📋 Next steps:');
        console.log('   1. Check docs/gifs/ folder for PNG images');
        console.log('   2. Use online tool to convert PNGs to GIFs (ezgif.com)');
        console.log('   3. Or install ImageMagick: brew install imagemagick');
        console.log('   4. Then run: convert -delay 50 -loop 0 *.png output.gif');
    }
}

// Run the generator
if (require.main === module) {
    const generator = new BSMeterImageGenerator();
    generator.generateStaticImages().catch(console.error);
}

module.exports = BSMeterImageGenerator;
