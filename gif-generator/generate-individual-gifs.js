const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

class BSMeterGIFGeneratorIndividual {
    constructor() {
        this.width = 400;
        this.height = 300;
        
        // Color segments matching your web app
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
        const needleAngle = 180 - (currentScore / 100) * 180 - 90; // -90 for rotation offset
        
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
    
    async generateGIF(targetScore, filename) {
        console.log(`🎬 Generating GIF for ${targetScore}%: ${filename}`);
        
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setViewport({ width: this.width, height: this.height });
        
        // Use unique temp directory for each GIF to avoid conflicts
        const tempDir = path.join(__dirname, `temp_frames_${targetScore}`);
        await fs.mkdir(tempDir, { recursive: true });
        
        // Generate frames - animate from 0 to targetScore
        const frames = 40; // Shorter animation for individual percentages
        const startScore = 0;
        
        for (let frame = 0; frame <= frames; frame++) {
            const progress = frame / frames;
            const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease-out
            const currentScore = startScore + (targetScore - startScore) * easedProgress;
            
            const html = this.generateHTML(currentScore);
            await page.setContent(html);
            await new Promise(resolve => setTimeout(resolve, 50)); // Shorter wait for individual GIFs
            
            const frameFile = path.join(tempDir, `frame_${frame.toString().padStart(3, '0')}.png`);
            await page.screenshot({ 
                path: frameFile,
                type: 'png',
                omitBackground: false
            });
        }
        
        // Hold final frame for 1 second (15 additional frames)
        const finalHtml = this.generateHTML(targetScore);
        await page.setContent(finalHtml);
        for (let i = 0; i < 15; i++) {
            const frameFile = path.join(tempDir, `frame_${(frames + 1 + i).toString().padStart(3, '0')}.png`);
            await page.screenshot({ 
                path: frameFile,
                type: 'png',
                omitBackground: false
            });
        }
        
        await browser.close();
        
        // Convert frames to GIF using ImageMagick (if available) or ffmpeg
        const outputPath = path.join(__dirname, '..', 'docs', 'gifs', filename);
        
        try {
            // Try ImageMagick first - faster animation for individual percentages
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
    
    async generateIndividualGIFs(startPercent = 0, endPercent = 100, batchSize = 10) {
        console.log(`🎬 Starting individual BS Meter GIF generation: ${startPercent}% to ${endPercent}%`);
        console.log('📁 Output directory: docs/gifs/');
        
        // Ensure output directory exists
        await fs.mkdir(path.join(__dirname, '..', 'docs', 'gifs'), { recursive: true });
        
        const totalGifs = endPercent - startPercent + 1;
        let generatedCount = 0;
        
        // Generate in batches to avoid memory issues
        for (let batchStart = startPercent; batchStart <= endPercent; batchStart += batchSize) {
            const batchEnd = Math.min(batchStart + batchSize - 1, endPercent);
            console.log(`\n📦 Processing batch: ${batchStart}% to ${batchEnd}%`);
            
            const batchPromises = [];
            for (let percentage = batchStart; percentage <= batchEnd; percentage++) {
                const filename = `bs-meter-${percentage.toString().padStart(3, '0')}.gif`;
                batchPromises.push(
                    this.generateGIF(percentage, filename)
                        .then(() => {
                            generatedCount++;
                            const progress = ((generatedCount / totalGifs) * 100).toFixed(1);
                            console.log(`   ✅ ${filename} (${progress}% complete)`);
                        })
                        .catch(error => {
                            console.error(`   ❌ Error generating ${filename}:`, error.message);
                        })
                );
            }
            
            // Wait for current batch to complete before starting next
            await Promise.all(batchPromises);
            
            // Small delay between batches
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        console.log(`\n🎉 Individual GIF generation complete!`);
        console.log(`📊 Generated: ${generatedCount}/${totalGifs} GIFs`);
        
        // List generated files
        try {
            const gifsDir = path.join(__dirname, '..', 'docs', 'gifs');
            const files = (await fs.readdir(gifsDir))
                .filter(f => f.endsWith('.gif') && f.match(/bs-meter-\d{3}\.gif/))
                .sort();
            
            console.log('📋 Individual GIF files created:');
            files.slice(0, 10).forEach(file => console.log(`   - ${file}`));
            if (files.length > 10) {
                console.log(`   ... and ${files.length - 10} more`);
            }
            console.log(`✨ Total: ${files.length} individual animated GIFs ready for Telegram!`);
        } catch (error) {
            console.log('📋 Check docs/gifs/ directory for generated files');
        }
    }
    
    async generateSampleGIFs() {
        console.log('🎬 Generating sample individual GIFs (0%, 25%, 50%, 75%, 100%)...');
        
        const samplePercentages = [0, 25, 50, 75, 100];
        
        for (const percentage of samplePercentages) {
            const filename = `bs-meter-${percentage.toString().padStart(3, '0')}.gif`;
            try {
                await this.generateGIF(percentage, filename);
                console.log(`✅ Sample generated: ${filename}`);
            } catch (error) {
                console.error(`❌ Error generating sample ${filename}:`, error.message);
            }
        }
        
        console.log('🎉 Sample individual GIFs generated!');
    }
}

// CLI interface
if (require.main === module) {
    const generator = new BSMeterGIFGeneratorIndividual();
    
    const args = process.argv.slice(2);
    const command = args[0];
    
    switch (command) {
        case 'sample':
            generator.generateSampleGIFs().catch(console.error);
            break;
        case 'range':
            const start = parseInt(args[1]) || 0;
            const end = parseInt(args[2]) || 100;
            const batch = parseInt(args[3]) || 10;
            generator.generateIndividualGIFs(start, end, batch).catch(console.error);
            break;
        case 'all':
            generator.generateIndividualGIFs(0, 100, 5).catch(console.error);
            break;
        default:
            console.log('🎬 BS Meter Individual GIF Generator');
            console.log('');
            console.log('Usage:');
            console.log('  npm run generate:sample    - Generate 5 sample GIFs (0%, 25%, 50%, 75%, 100%)');
            console.log('  npm run generate:all       - Generate all 101 individual GIFs (0% to 100%)');
            console.log('  npm run generate:range 0 50 10 - Generate range with batch size');
            console.log('');
            console.log('Examples:');
            console.log('  node generate-individual-gifs.js sample');
            console.log('  node generate-individual-gifs.js all');
            console.log('  node generate-individual-gifs.js range 0 50 10');
            break;
    }
}

module.exports = BSMeterGIFGeneratorIndividual;
