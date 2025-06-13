// Content script that runs on all web pages
// This script extracts page content for BS analysis

interface PageContent {
    title: string;
    text: string;
    url: string;
    headings: string[];
    links: number;
    images: number;
}

class ContentExtractor {
    /**
     * Extract relevant content from the current page
     */
    extractPageContent(): PageContent {
        const title = document.title || '';
        const url = window.location.href;
        
        // Extract text content, excluding script and style elements
        const textElements = document.querySelectorAll('p, article, main, div, span');
        let text = '';
        
        textElements.forEach(element => {
            // Skip if element is not visible or is a script/style element
            if (element.textContent && 
                !element.closest('script, style, nav, header, footer, aside')) {
                text += element.textContent + ' ';
            }
        });
        
        // Extract headings
        const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const headings = Array.from(headingElements).map(h => h.textContent || '').filter(h => h.trim());
        
        // Count links and images
        const links = document.querySelectorAll('a[href]').length;
        const images = document.querySelectorAll('img[src]').length;
        
        return {
            title: title.trim(),
            text: text.trim().substring(0, 10000), // Limit text length
            url,
            headings,
            links,
            images
        };
    }

    /**
     * Get a simplified text version for analysis
     */
    getAnalysisText(): string {
        const content = this.extractPageContent();
        
        // Combine title, headings, and main text for analysis
        let analysisText = content.title + ' ';
        analysisText += content.headings.join(' ') + ' ';
        analysisText += content.text;
        
        return analysisText.trim();
    }
}

// Initialize content extractor
const contentExtractor = new ContentExtractor();

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Content script received message:', message);
    
    if (message.type === 'GET_PAGE_CONTENT') {
        try {
            const analysisText = contentExtractor.getAnalysisText();
            sendResponse({
                success: true,
                content: analysisText,
                url: window.location.href
            });
        } catch (error) {
            console.error('Error extracting page content:', error);
            sendResponse({
                success: false,
                error: error.message
            });
        }
    }
    
    return true; // Keep the message channel open
});

// Notify that content script is loaded
console.log('BS Meter content script loaded on:', window.location.href);