# BS Meter Chrome Extension

A Chrome extension that analyzes web content for truthfulness, credibility, and potential misinformation using AI-powered analysis.

## Features

- **7-Category Analysis**: Comprehensive evaluation across multiple dimensions
- **Visual Gauge Display**: Easy-to-understand truthfulness scoring
- **Real-time Analysis**: Analyze any webpage with one click
- **Detailed Breakdown**: View reasoning for each analysis category
- **Smart Content Extraction**: Optimized for articles and social media posts

## Analysis Categories

1. **🎯 Factual Accuracy** (Highest Weight) - Verification of claims and data
2. **🏛️ Source Credibility** - Overall reputation and trustworthiness
3. **⚖️ Fact vs Opinion** - Clear separation analysis
4. **📝 Language Analysis** - Tone, bias, emotional manipulation
5. **🧠 Logical Consistency** - Reasoning quality and fallacy detection
6. **📰 Headline Accuracy** - Title vs content alignment
7. **📚 Historical Context** - Proper contextualization

## Installation

### For Development

1. **Clone/Navigate to this directory**:
   ```bash
   cd /Users/michelandreev/dev/bsmeter-ts/chrome-extension
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the extension**:
   ```bash
   npm run build
   ```

4. **Load in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (top right toggle)
   - Click "Load unpacked"
   - Select the `dist/` folder that was created after building

### For Production

1. **Build and package**:
   ```bash
   npm run package
   ```

2. This creates `bs-meter-extension.zip` ready for Chrome Web Store upload

## Development

### Available Scripts

- `npm run build` - Build production version
- `npm run dev` - Build and watch for changes
- `npm run clean` - Clean build directory
- `npm run package` - Build and create zip for distribution

### File Structure

```
chrome-extension/
├── manifest.json          # Extension manifest
├── popup.html             # Extension popup UI
├── popup.ts               # Popup logic and display
├── content.ts             # Content script for page analysis
├── background.ts          # Service worker
├── chrome-extension-service.ts # API integration
├── config.ts              # Configuration
├── types.ts               # TypeScript definitions
├── gauge-service.ts       # Gauge visualization
├── styles.css             # UI styles
├── content.css            # Content script styles
├── assets/                # Extension icons
├── dist/                  # Built extension files
└── webpack.config.js      # Build configuration
```

## Configuration

Update `config.ts` with your settings:

```typescript
export const CONFIG = {
    N8N_WEBHOOK_URL: 'your-webhook-url',
    MAX_TEXT_LENGTH: 10000,
    REQUEST_TIMEOUT: 30000,
    DEBUG_MODE: false
};
```

## Usage

1. **Click the extension icon** in Chrome toolbar
2. **Click "Analyze Page"** to analyze current webpage
3. **View the gauge** showing overall truthfulness score
4. **Click "View Details"** to see category breakdown
5. **Review reasoning** for each analysis category

## API Integration

The extension integrates with your n8n workflow:
- **Endpoint**: Configure in `config.ts`
- **Request Format**: JSON with page content, URL, and metadata
- **Response Format**: Overall score + 7 category scores with reasoning
- **Fallback**: Local analysis if API unavailable

## Browser Permissions

- `activeTab` - Access current webpage content
- `storage` - Store analysis results
- Host permissions for API calls

## Troubleshooting

### Extension not loading
- Check that all files are built in `dist/` folder
- Verify manifest.json syntax
- Check browser console for errors

### Analysis not working
- Verify API endpoint in config.ts
- Check network connectivity
- Review browser console for API errors

### Content not extracted
- Some websites block content scripts
- Try refreshing the page
- Check if page has finished loading

## Chrome Web Store Preparation

Required assets (included in `assets/`):
- `icon16.png` - 16x16 toolbar icon
- `icon32.png` - 32x32 extension management
- `icon48.png` - 48x48 extension management
- `icon128.png` - 128x128 Chrome Web Store

## Privacy & Security

- No personal data collection
- Content analyzed only when user clicks "Analyze"
- Analysis results stored locally in browser
- Network requests only to configured API endpoint

---

**Note**: This extension requires a backend API (n8n workflow) for analysis. The fallback local analysis provides basic functionality when the API is unavailable.