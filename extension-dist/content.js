/******/ (() => { // webpackBootstrap
// Content script that runs on all web pages
// This script extracts page content for BS analysis
var ContentExtractor = /** @class */ (function () {
    function ContentExtractor() {
    }
    /**
     * Extract relevant content from the current page
     */
    ContentExtractor.prototype.extractPageContent = function () {
        var title = document.title || '';
        var url = window.location.href;
        // Extract text content, excluding script and style elements
        var textElements = document.querySelectorAll('p, article, main, div, span');
        var text = '';
        textElements.forEach(function (element) {
            // Skip if element is not visible or is a script/style element
            if (element.textContent &&
                !element.closest('script, style, nav, header, footer, aside')) {
                text += element.textContent + ' ';
            }
        });
        // Extract headings
        var headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        var headings = Array.from(headingElements).map(function (h) { return h.textContent || ''; }).filter(function (h) { return h.trim(); });
        // Count links and images
        var links = document.querySelectorAll('a[href]').length;
        var images = document.querySelectorAll('img[src]').length;
        return {
            title: title.trim(),
            text: text.trim().substring(0, 10000), // Limit text length
            url: url,
            headings: headings,
            links: links,
            images: images
        };
    };
    /**
     * Get a simplified text version for analysis
     */
    ContentExtractor.prototype.getAnalysisText = function () {
        var content = this.extractPageContent();
        // Combine title, headings, and main text for analysis
        var analysisText = content.title + ' ';
        analysisText += content.headings.join(' ') + ' ';
        analysisText += content.text;
        return analysisText.trim();
    };
    return ContentExtractor;
}());
// Initialize content extractor
var contentExtractor = new ContentExtractor();
// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log('Content script received message:', message);
    if (message.type === 'GET_PAGE_CONTENT') {
        try {
            var analysisText = contentExtractor.getAnalysisText();
            sendResponse({
                success: true,
                content: analysisText,
                url: window.location.href
            });
        }
        catch (error) {
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

/******/ })()
;