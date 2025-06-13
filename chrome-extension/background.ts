// Background script for BS Meter Chrome Extension
// Handles extension lifecycle and background tasks

console.log('BS Meter background script loaded');

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
    console.log('BS Meter extension installed:', details.reason);
    
    if (details.reason === 'install') {
        // Set default settings
        chrome.storage.local.set({
            'settings': {
                'autoAnalyze': false,
                'showNotifications': true
            }
        });
    }
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Background received message:', message);
    
    // Handle different message types here if needed
    if (message.type === 'BACKGROUND_TASK') {
        // Handle background tasks
        handleBackgroundTask(message.data)
            .then(result => sendResponse(result))
            .catch(error => sendResponse({ error: error.message }));
        return true; // Keep message channel open for async response
    }
});

// Handle browser action click (if not using popup)
chrome.action.onClicked.addListener((tab) => {
    console.log('Extension icon clicked for tab:', tab.id);
    // This won't fire if popup is defined in manifest
});

/**
 * Handle background processing tasks
 */
async function handleBackgroundTask(data: any): Promise<any> {
    // Implement any background processing here
    return { success: true, message: 'Background task completed' };
}

/**
 * Show notification to user
 */
function showNotification(title: string, message: string): void {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'assets/icon48.png',
        title: title,
        message: message
    });
}