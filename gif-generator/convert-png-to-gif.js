const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class PNGToGIFConverter {
    async convertPNGsToGIFs() {
        console.log('🎬 Converting PNG files to animated GIFs...');
        
        const pngsDir = path.join(__dirname, '..', 'docs', 'gifs');
        const pngFiles = fs.readdirSync(pngsDir).filter(f => f.endsWith('.png'));
        
        console.log(`📁 Found ${pngFiles.length} PNG files to convert`);
        
        for (const pngFile of pngFiles) {
            const gifFile = pngFile.replace('.png', '.gif');
            const pngPath = path.join(pngsDir, pngFile);
            const gifPath = path.join(pngsDir, gifFile);
            
            try {
                console.log(`🔄 Converting ${pngFile} → ${gifFile}`);
                
                // Create a simple animated GIF that shows the static image with a subtle pulse effect
                // This creates a 3-frame animation: original → slightly dimmed → original
                const tempDir = path.join(__dirname, 'temp_png_frames');
                if (!fs.existsSync(tempDir)) {
                    fs.mkdirSync(tempDir);
                }
                
                // Copy original PNG 3 times for frames
                const frame1 = path.join(tempDir, 'frame1.png');
                const frame2 = path.join(tempDir, 'frame2.png'); 
                const frame3 = path.join(tempDir, 'frame3.png');
                
                // Frame 1: Original
                execSync(`cp "${pngPath}" "${frame1}"`);
                
                // Frame 2: Slightly dimmed (95% brightness)
                execSync(`convert "${pngPath}" -modulate 95 "${frame2}"`);
                
                // Frame 3: Original again
                execSync(`cp "${pngPath}" "${frame3}"`);
                
                // Create animated GIF with 1 second delay per frame (slow pulse)
                execSync(`convert -delay 100 -loop 0 "${frame1}" "${frame2}" "${frame3}" "${gifPath}"`);
                
                // Clean up temp frames
                fs.unlinkSync(frame1);
                fs.unlinkSync(frame2);
                fs.unlinkSync(frame3);
                
                console.log(`✅ Created: ${gifFile}`);
                
            } catch (error) {
                console.error(`❌ Error converting ${pngFile}:`, error.message);
            }
        }
        
        // Clean up temp directory
        const tempDir = path.join(__dirname, 'temp_png_frames');
        if (fs.existsSync(tempDir)) {
            fs.rmdirSync(tempDir);
        }
        
        console.log('🎉 PNG to GIF conversion complete!');
        
        // List all files in the gifs directory
        const allFiles = fs.readdirSync(pngsDir);
        const gifFiles = allFiles.filter(f => f.endsWith('.gif'));
        const pngFilesAfter = allFiles.filter(f => f.endsWith('.png'));
        
        console.log('📋 Files in docs/gifs/:');
        console.log(`   📸 PNG files: ${pngFilesAfter.length}`);
        console.log(`   🎬 GIF files: ${gifFiles.length}`);
        
        if (gifFiles.length > 0) {
            console.log('✨ GIF files created:');
            gifFiles.forEach(file => console.log(`   - ${file}`));
        }
    }
}

const converter = new PNGToGIFConverter();
converter.convertPNGsToGIFs().catch(console.error);
