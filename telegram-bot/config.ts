// Configuration for BS Meter Telegram Bot/WebApp
// Update these settings to connect to your n8n workflow

export const CONFIG = {
    // Production n8n webhook URL from your project context
    N8N_WEBHOOK_URL: 'https://agent.totalis.ai/webhook/53280650-2153-4a8e-beec-b77120ca0433',
    
    // Optional: Add authentication if your n8n webhook requires it
    N8N_AUTH_HEADER: '', // e.g., 'Bearer your-token-here'
    
    // Analysis settings
    MAX_TEXT_LENGTH: 10000, // Maximum characters to send for analysis
    REQUEST_TIMEOUT: 30000,  // 30 seconds timeout for n8n requests
    
    // Fallback settings
    USE_FALLBACK_ON_ERROR: true, // Use local analysis if n8n fails
    
    // Telegram-specific settings
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '', // Set via environment variable
    TELEGRAM_WEBHOOK_URL: process.env.TELEGRAM_WEBHOOK_URL || '', // For webhook mode
    
    // Debug settings
    DEBUG_MODE: true // Set to false in production
};

// Export for use in other modules
export default CONFIG;