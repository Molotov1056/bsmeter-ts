const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

class BSMeterZoneGIFGenerator {
    constructor() {
        this.width = 400;
        this.height = 300;
        
        // 5 Color zones - simplified from 7 segments
        this.segments = [
            { start: 0, end: 20, color: "#D32F2F" },      // BULLSHIT
            { start: 20, end: 40, color: "#FF5722" },     // MOSTLY FALSE  
            { start: 40, end: 60, color: "#FF9800" },     // QUESTIONABLE
            { start: 60, end: 80, color: "#8BC34A" },     // MOSTLY TRUE
            { start: 80, end: 100, color: "#4CAF50" }     // FACTUAL
        ];
        
        // 5 Zone definitions
        this.zones = [
            { min: 0, max: 20, text: "BULLSHIT", color: "#D32F2F", pointerPosition: 10 },
            { min: 20, max: 40, text: "MOSTLY FALSE", color: "#FF5722", pointerPosition: 30 },
            { min: 40, max: 60, text: "QUESTIONABLE", color: "#FF9800", pointerPosition: 50 },
            { min: 60, max: 80, text: "MOSTLY TRUE", color: "#8BC34A", pointerPosition: 70 },
            { min: 80, max: 100, text: "FACTUAL", color: "#4CAF50", pointerPosition: 90 }
        ];
    }
    
    getZoneForScore(score) {
        return this.zones.find(zone => score >= zone.min && score < zone.max) || this.zones[this.zones.length - 1];
    }
    
    generateHTML(actualScore, pointerPosition) {
        const zone = this.getZoneForScore(actualScore);
        const needleAngle = 180 - (pointerPosition / 100) * 180 - 90; // -90 for rotation offset
        
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
                    transition: transform 0.5s ease-out;
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
                    color: ${zone.color};
                    margin: 5px 0;
                }
                
                .score-percent {
                    text-align: center;
                    font-weight: bold;
                    font-size: 28px;
                    color: ${zone.color};
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
                        const largeArcFlag = Math.abs(segment.end - segment.start) >= 20 ? 1 : 0;
                        
                        return `<path d="M 150 150 L ${startX} ${startY} A 120 120 0 ${largeArcFlag} 1 ${endX} ${endY} Z" 
                                     fill="${segment.color}" stroke="white" stroke-width="2" stroke-opacity="0.8"/>`;
                    }).join('')}
                    
                    <g class="needle">
                        <path d="M 150,150 L 148,50 L 152,50 Z" fill="#333333"/>
                        <circle cx="150" cy="150" r="10" fill="#444444"/>
                    </g>
                </svg>
            </div>
            
            <div class="labels">
                <div class="label-left">BULLSHIT</div>
                <div class="label-right">FACTUAL</div>
            </div>
            
            <div class="score-text">${zone.text}</div>
            <div class="score-percent">${Math.round(actualScore)}%</div>
        </body>
        </html>`;
    }
    
    async generateZoneGIF(zone, filename) {
        console.log(`🎬 Generating Zone GIF: ${zone.text} (${zone.min}-${zone.max}%) - ${filename}`);
        
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setViewport({ width: this.width, height: this.height });
        
        const tempDir = path.join(__dirname, `temp_zone_${zone.text.toLowerCase().replace(/\\s+/g, '_').replace(/[^a-z0-9_]/g, '')}`);
        await fs.mkdir(tempDir, { recursive: true });
        
        // Generate animation frames
        const frames = 50;
        const startPosition = 0;
        const targetPosition = zone.pointerPosition;
        
        // Use the middle score of the zone for display
        const displayScore = (zone.min + zone.max) / 2;
        
        for (let frame = 0; frame <= frames; frame++) {
            const progress = frame / frames;
            const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease-out
            const currentPosition = startPosition + (targetPosition - startPosition) * easedProgress;
            
            const html = this.generateHTML(displayScore, currentPosition);
            await page.setContent(html);
            await new Promise(resolve => setTimeout(resolve, 50));
            
            const frameFile = path.join(tempDir, `frame_${frame.toString().padStart(3, '0')}.png`);
            await page.screenshot({ 
                path: frameFile,
                type: 'png',
                omitBackground: false
            });
        }
        
        // Hold final frame for 1 second (20 additional frames)
        const finalHtml = this.generateHTML(displayScore, targetPosition);
        await page.setContent(finalHtml);
        for (let i = 0; i < 20; i++) {
            const frameFile = path.join(tempDir, `frame_${(frames + 1 + i).toString().padStart(3, '0')}.png`);
            await page.screenshot({ 
                path: frameFile,
                type: 'png',
                omitBackground: false
            });
        }
        
        await browser.close();
        
        // Convert frames to GIF
        const outputPath = path.join(__dirname, '..', 'docs', 'gifs', filename);
        
        try {
            // Try ImageMagick first
            execSync(`convert -delay 6 -loop 0 ${tempDir}/frame_*.png "${outputPath}"`, { stdio: 'pipe' });
            console.log(`✅ Generated with ImageMagick: ${filename}`);
        } catch (error) {
            try {
                // Fallback to ffmpeg
                execSync(`ffmpeg -y -framerate 18 -pattern_type glob -i '${tempDir}/frame_*.png' -vf "fps=18,scale=${this.width}:${this.height}:flags=lanczos,palettegen" "${tempDir}/palette.png"`, { stdio: 'pipe' });
                execSync(`ffmpeg -y -framerate 18 -pattern_type glob -i '${tempDir}/frame_*.png' -i "${tempDir}/palette.png" -filter_complex "fps=18,scale=${this.width}:${this.height}:flags=lanczos[x];[x][1:v]paletteuse" "${outputPath}"`, { stdio: 'pipe' });
                console.log(`✅ Generated with ffmpeg: ${filename}`);
            } catch (ffmpegError) {
                console.error(`❌ Failed to create GIF ${filename}:`, ffmpegError.message);
                console.log('💡 Install ImageMagick: brew install imagemagick');
                console.log('💡 Or install ffmpeg: brew install ffmpeg');
            }
        }
        
        // Clean up temp frames
        try {
            const frameFiles = await fs.readdir(tempDir);
            for (const file of frameFiles) {
                await fs.unlink(path.join(tempDir, file));
            }
            await fs.rmdir(tempDir);
        } catch (cleanupError) {
            // Ignore cleanup errors
        }
    }
    
    async generateAllZoneGIFs() {
        console.log('🎬 Starting 5-Zone BS Meter GIF generation...');
        console.log('📁 Output directory: docs/gifs/');
        
        // Ensure output directory exists
        await fs.mkdir(path.join(__dirname, '..', 'docs', 'gifs'), { recursive: true });
        
        const generatedFiles = [];
        
        for (let i = 0; i < this.zones.length; i++) {
            const zone = this.zones[i];
            const filename = `bs-meter-zone-${i + 1}.gif`;
            
            try {
                await this.generateZoneGIF(zone, filename);
                generatedFiles.push(filename);
            } catch (error) {
                console.error(`❌ Error generating ${filename}:`, error.message);
            }
        }
        
        console.log('\\n🎉 5-Zone GIF generation complete!');
        console.log('📋 Files created:');
        generatedFiles.forEach((file, index) => {
            const zone = this.zones[index];
            console.log(`   ✅ ${file} - ${zone.text} (${zone.min}-${zone.max}%)`);
        });
        
        console.log('\\n📝 Zone mapping:');
        this.zones.forEach((zone, index) => {
            console.log(`   Zone ${index + 1}: ${zone.min}-${zone.max}% → ${zone.text} → bs-meter-zone-${index + 1}.gif`);
        });
        
        console.log('\\n✨ Total: 5 zone-based animated GIFs ready for Telegram!');
    }
}

// CLI interface
if (require.main === module) {
    const generator = new BSMeterZoneGIFGenerator();
    
    const args = process.argv.slice(2);
    const command = args[0];
    
    switch (command) {
        case 'zones':
        case 'all':
        default:
            generator.generateAllZoneGIFs().catch(console.error);
            break;
    }
}

module.exports = BSMeterZoneGIFGenerator;
