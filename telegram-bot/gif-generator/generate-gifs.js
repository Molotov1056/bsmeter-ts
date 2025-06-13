const { createCanvas } = require('canvas');
const GIFEncoder = require('gifencoder');
const fs = require('fs');
const path = require('path');

class BSMeterGIFGenerator {
    constructor() {
        this.width = 400;
        this.height = 300;
        this.centerX = 200;
        this.centerY = 200;
        this.radius = 120;
        
        // Color segments matching your web app
        this.segments = [
            { start: 0, end: 14.28, color: "#D32F2F" },    // Dark Red
            { start: 14.28, end: 28.57, color: "#E64A19" }, // Red-Orange
            { start: 28.57, end: 42.85, color: "#F57C00" }, // Orange
            { start: 42.85, end: 57.14, color: "#FF9800" }, // Orange
            { start: 57.14, end: 71.42, color: "#FFC107" }, // Yellow
            { start: 71.42, end: 85.71, color: "#CDDC39" }, // Lime
            { start: 85.71, end: 100, color: "#4CAF50" }    // Green
        ];
        
        // Text labels matching your web app
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
    
    valueToAngle(value) {
        // Convert 0-100 value to angle (180° to 0°)
        return 180 - (value / 100) * 180;
    }
    
    toRadians(angle) {
        return angle * Math.PI / 180;
    }
    
    drawGaugeBase(ctx) {
        // Clear canvas
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw gauge segments
        this.segments.forEach(segment => {
            const startAngle = this.toRadians(this.valueToAngle(segment.start));
            const endAngle = this.toRadians(this.valueToAngle(segment.end));
            
            ctx.beginPath();
            ctx.moveTo(this.centerX, this.centerY);
            ctx.arc(this.centerX, this.centerY, this.radius, startAngle, endAngle, false);
            ctx.closePath();
            ctx.fillStyle = segment.color;
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
        });
        
        // Draw center circle
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, 15, 0, 2 * Math.PI);
        ctx.fillStyle = '#333';
        ctx.fill();
    }
    
    drawNeedle(ctx, value) {
        const angle = this.toRadians(this.valueToAngle(value) - 90);
        const needleLength = this.radius - 20;
        
        ctx.save();
        ctx.translate(this.centerX, this.centerY);
        ctx.rotate(angle);
        
        // Draw needle
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(needleLength, 0);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        // Draw needle tip
        ctx.beginPath();
        ctx.arc(needleLength, 0, 6, 0, 2 * Math.PI);
        ctx.fillStyle = '#333';
        ctx.fill();
        
        ctx.restore();
    }
    
    drawLabels(ctx, value) {
        // Draw main labels
        ctx.fillStyle = '#333';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('BULLSHIT', 50, 240);
        
        ctx.textAlign = 'right';
        ctx.fillText('TRUE', 350, 240);
        
        // Draw score text
        const level = this.levels.find(l => value >= l.min && value < l.max) || this.levels[this.levels.length - 1];
        
        ctx.fillStyle = level.color;
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(level.text, this.centerX, 50);
        
        // Draw percentage
        ctx.font = 'bold 36px Arial';
        ctx.fillText(`${Math.round(value)}%`, this.centerX, 280);
    }
    
    async generateGIF(targetScore, filename) {
        console.log(`Generating GIF for ${targetScore}%: ${filename}`);
        
        const canvas = createCanvas(this.width, this.height);
        const ctx = canvas.getContext('2d');
        
        const encoder = new GIFEncoder(this.width, this.height);
        const outputPath = path.join(__dirname, '..', 'docs', 'gifs', filename);
        
        encoder.createReadStream().pipe(fs.createWriteStream(outputPath));
        encoder.start();
        encoder.setRepeat(0); // Loop forever
        encoder.setDelay(50); // 50ms per frame = 20 FPS
        encoder.setQuality(10);
        
        // Animation: needle moves from 0 to target score
        const frames = 60; // 3 seconds at 20 FPS
        const startScore = 0;
        
        for (let frame = 0; frame <= frames; frame++) {
            // Ease-out animation
            const progress = frame / frames;
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentScore = startScore + (targetScore - startScore) * easedProgress;
            
            // Draw frame
            this.drawGaugeBase(ctx);
            this.drawNeedle(ctx, currentScore);
            this.drawLabels(ctx, currentScore);
            
            encoder.addFrame(ctx);
        }
        
        // Hold final position for 1 second (20 frames)
        for (let i = 0; i < 20; i++) {
            encoder.addFrame(ctx);
        }
        
        encoder.finish();
        console.log(`✅ Generated: ${filename}`);
    }
    
    async generateAllGIFs() {
        console.log('🎬 Starting BS Meter GIF generation...');
        console.log('📁 Output directory: docs/gifs/');
        
        // Generate 20 GIFs for score ranges 0-5%, 5-10%, ..., 95-100%
        for (let i = 0; i < 20; i++) {
            const rangeStart = i * 5;
            const rangeEnd = rangeStart + 5;
            const middleScore = rangeStart + 2.5; // Use middle of range for animation
            
            const filename = `bs-meter-${rangeStart.toString().padStart(2, '0')}-${rangeEnd.toString().padStart(2, '0')}.gif`;
            
            try {
                await this.generateGIF(middleScore, filename);
            } catch (error) {
                console.error(`❌ Error generating ${filename}:`, error);
            }
        }
        
        console.log('🎉 All GIFs generated successfully!');
        console.log('📋 Files created:');
        
        // List generated files
        const gifsDir = path.join(__dirname, '..', 'docs', 'gifs');
        const files = fs.readdirSync(gifsDir).filter(f => f.endsWith('.gif'));
        files.forEach(file => console.log(`   - ${file}`));
        
        console.log(`\n✨ Total: ${files.length} animated GIFs ready for Telegram!`);
    }
}

// Run the generator
if (require.main === module) {
    const generator = new BSMeterGIFGenerator();
    generator.generateAllGIFs().catch(console.error);
}

module.exports = BSMeterGIFGenerator;
