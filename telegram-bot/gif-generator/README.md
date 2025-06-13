# BS Meter GIF Generator

This utility generates 20 animated GIFs for the BS Meter Telegram bot, each representing different score ranges with 5% increments.

## Quick Start

```bash
# Install dependencies
cd gif-generator
npm install

# Generate all GIFs
npm run generate
```

## What it creates

- **20 animated GIFs** in `docs/gifs/` folder
- **Score ranges**: 0-5%, 5-10%, 10-15%, ..., 95-100%
- **Filename format**: `bs-meter-00-05.gif`, `bs-meter-05-10.gif`, etc.
- **Animation**: Needle moves from 0% to target score over 3 seconds
- **Dimensions**: 400x300px optimized for Telegram

## Usage in n8n workflow

Select GIF based on calculated score:
```javascript
const scorePercent = Math.round(overallScore * 100);
const rangeIndex = Math.floor(scorePercent / 5);
const gifFilename = `bs-meter-${(rangeIndex * 5).toString().padStart(2, '0')}-${Math.min((rangeIndex + 1) * 5, 100).toString().padStart(2, '0')}.gif`;
const gifUrl = `https://molotov1056.github.io/bsmeter-ts/gifs/${gifFilename}`;
```

## Generated Files

- `bs-meter-00-05.gif` - "COMPLETE BULLSHIT" (Red)
- `bs-meter-05-10.gif` - "COMPLETE BULLSHIT" (Red) 
- `bs-meter-10-15.gif` - "COMPLETE BULLSHIT" (Red)
- `bs-meter-15-20.gif` - "VERY FALSE" (Orange-Red)
- ...
- `bs-meter-85-90.gif` - "FACTUAL" (Green)
- `bs-meter-90-95.gif` - "FACTUAL" (Green)
- `bs-meter-95-100.gif` - "FACTUAL" (Green)

Each GIF shows the appropriate color, text label, and animated needle position for its score range.
