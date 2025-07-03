const fs = require('fs');
const path = require('path');

// Create a simple 16x16 ICO file with a burgundy dot
// ICO file format: Header + Directory Entry + Image Data

// ICO Header (6 bytes)
const header = Buffer.from([
    0x00, 0x00, // Reserved, must be 0
    0x01, 0x00, // Image type, 1 for ICO
    0x01, 0x00  // Number of images
]);

// Directory Entry (16 bytes)
const dirEntry = Buffer.from([
    0x10,       // Width (16 pixels)
    0x10,       // Height (16 pixels)
    0x00,       // Colors in palette (0 for true color)
    0x00,       // Reserved
    0x01, 0x00, // Color planes
    0x20, 0x00, // Bits per pixel (32 bits)
    0x00, 0x04, 0x00, 0x00, // Image size (1024 bytes)
    0x16, 0x00, 0x00, 0x00  // Offset to image data
]);

// Create 16x16 RGBA image data
const imageData = Buffer.alloc(1024); // 16x16x4 bytes (RGBA)

// Fill with burgundy color where we want the dot
const burgundy = { r: 128, g: 0, b: 32, a: 255 };
const transparent = { r: 0, g: 0, b: 0, a: 0 };

for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
        const distance = Math.sqrt((x - 8) ** 2 + (y - 8) ** 2);
        const offset = (y * 16 + x) * 4;
        
        if (distance <= 6) {
            // Inside the circle - burgundy
            imageData[offset] = burgundy.b;     // B
            imageData[offset + 1] = burgundy.g; // G
            imageData[offset + 2] = burgundy.r; // R
            imageData[offset + 3] = burgundy.a; // A
        } else {
            // Outside the circle - transparent
            imageData[offset] = transparent.b;
            imageData[offset + 1] = transparent.g;
            imageData[offset + 2] = transparent.r;
            imageData[offset + 3] = transparent.a;
        }
    }
}

// Combine all parts
const icoData = Buffer.concat([header, dirEntry, imageData]);

// Write the ICO file
fs.writeFileSync(path.join(__dirname, 'public', 'favicon.ico'), icoData);
console.log('Burgundy dot favicon created successfully!');
