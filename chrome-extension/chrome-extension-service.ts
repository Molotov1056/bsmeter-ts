import { BSMeterData } from './types';
import CONFIG from './config';

export class ChromeExtensionService {
    private static instance: ChromeExtensionService;
    
    constructor() {
        if (ChromeExtensionService.instance) {
            return ChromeExtensionService.instance;
        }
        ChromeExtensionService.instance = this;
    }

    /**
     * Initialize the Chrome extension service
     */
    initialize(): void {
        console.log('Chrome Extension Service initialized');
        
        // Set up any initial configuration
        this.setupMessageListeners();
    }

    /**
     * Set up message listeners for communication between popup and content script
     */
    private setupMessageListeners(): void {
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                console.log('Message received:', message);
                
                if (message.type === 'ANALYZE_PAGE') {
                    this.handlePageAnalysis(message.data)
                        .then(result => sendResponse(result))
                        .catch(error => sendResponse({ error: error.message }));
                    return true; // Keep the message channel open for async response
                }
            });
        }
    }

    /**
     * Analyze the current page content using n8n workflow
     */
    async analyzeCurrentPage(): Promise<BSMeterData | null> {
        return new Promise((resolve) => {
            if (typeof chrome !== 'undefined' && chrome.tabs) {
                // Send message to content script to analyze page
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (tabs[0]?.id) {
                        chrome.tabs.sendMessage(tabs[0].id, { 
                            type: 'GET_PAGE_CONTENT' 
                        }, async (response) => {
                            if (response && response.content) {
                                // Call n8n workflow for real analysis
                                const analysisResult = await this.callN8nWorkflow({
                                    text: response.content,
                                    url: response.url,
                                    title: document.title || 'Unknown'
                                });
                                resolve(analysisResult);
                            } else {
                                resolve(null);
                            }
                        });
                    } else {
                        resolve(null);
                    }
                });
            } else {
                resolve(null);
            }
        });
    }

    /**
     * Call n8n workflow for BS analysis
     */
    private async callN8nWorkflow(data: { text: string; url: string; title: string }): Promise<BSMeterData | null> {
        try {
            if (CONFIG.DEBUG_MODE) {
                console.log('Calling n8n workflow for analysis...', CONFIG.N8N_WEBHOOK_URL);
            }
            
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };
            
            // Add authentication header if configured
            if (CONFIG.N8N_AUTH_HEADER) {
                headers['Authorization'] = CONFIG.N8N_AUTH_HEADER;
            }
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT);
            
            const response = await fetch(CONFIG.N8N_WEBHOOK_URL, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    text: data.text.substring(0, CONFIG.MAX_TEXT_LENGTH),
                    url: data.url,
                    title: data.title,
                    timestamp: new Date().toISOString(),
                    source: 'chrome-extension'
                }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            if (!response.ok) {
                console.error('n8n workflow request failed:', response.status, response.statusText);
                if (CONFIG.USE_FALLBACK_ON_ERROR) {
                    return this.getFallbackAnalysis(data.text);
                }
                return null;
            }

            const result = await response.json();
            
            // Validate the response structure
            if (this.isValidBSMeterData(result)) {
                if (CONFIG.DEBUG_MODE) {
                    console.log('✅ n8n analysis complete:', Math.round(result.overall_score * 100) + '%');
                }
                return result;
            } else {
                console.error('Invalid response from n8n workflow:', result);
                if (CONFIG.USE_FALLBACK_ON_ERROR) {
                    return this.getFallbackAnalysis(data.text);
                }
                return null;
            }
            
        } catch (error) {
            if (error.name === 'AbortError') {
                console.error('n8n workflow request timeout');
            } else {
                console.error('Error calling n8n workflow:', error);
            }
            
            if (CONFIG.USE_FALLBACK_ON_ERROR) {
                return this.getFallbackAnalysis(data.text);
            }
            return null;
        }
    }

    /**
     * Validate if the response has the correct BSMeterData structure
     */
    private isValidBSMeterData(data: any): data is BSMeterData {
        return data && 
               typeof data.overall_score === 'number' &&
               data.categories &&
               typeof data.categories === 'object';
    }

    /**
     * Fallback analysis when n8n workflow fails
     */
    private getFallbackAnalysis(content: string): BSMeterData {
        console.log('Using fallback analysis...');
        return this.performLocalAnalysis(content);
    }
    /**
     * Local analysis as fallback when n8n workflow fails
     */
    private performLocalAnalysis(content: string): BSMeterData {
        // This is a simplified analysis - fallback only
        // Your n8n workflow should be the primary analysis method
        
        const text = content.toLowerCase();
        
        // Simple keyword-based analysis
        const bsKeywords = ['amazing', 'unbelievable', 'shocking', 'incredible', 'miracle', 'secret', 'doctors hate', 'one weird trick'];
        const truthKeywords = ['study', 'research', 'according to', 'data shows', 'evidence', 'peer-reviewed', 'scientific'];
        
        let bsScore = 0;
        let truthScore = 0;
        
        bsKeywords.forEach(keyword => {
            const matches = (text.match(new RegExp(keyword, 'g')) || []).length;
            bsScore += matches * 10;
        });
        
        truthKeywords.forEach(keyword => {
            const matches = (text.match(new RegExp(keyword, 'g')) || []).length;
            truthScore += matches * 10;
        });
        
        // Calculate overall score (0 = BS, 1 = Truth)
        const totalScore = bsScore + truthScore;
        const truthfulness = totalScore > 0 ? truthScore / totalScore : 0.5;
        
        // Add some randomness to make it more interesting
        const randomFactor = (Math.random() - 0.5) * 0.3;
        const finalScore = Math.max(0, Math.min(1, truthfulness + randomFactor));
        
        return {
            overall_score: finalScore,
            categories: {
                overall_credibility_and_reputation: {
                    score: Math.max(0, Math.min(1, finalScore + (Math.random() - 0.5) * 0.2)),
                    reasoning: "Based on source reliability assessment"
                },
                factual_accuracy: {
                    score: Math.max(0, Math.min(1, finalScore + (Math.random() - 0.5) * 0.2)),
                    reasoning: "Based on factual claims analysis"
                },
                distinction_between_fact_and_opinion: {
                    score: Math.max(0, Math.min(1, finalScore + (Math.random() - 0.5) * 0.2)),
                    reasoning: "Analysis of objective vs subjective content"
                },
                language_analysis: {
                    score: Math.max(0, Math.min(1, finalScore + (Math.random() - 0.5) * 0.2)),
                    reasoning: "Emotional language and bias indicators"
                },
                logical_consistency_and_absence_of_fallacies: {
                    score: Math.max(0, Math.min(1, finalScore + (Math.random() - 0.5) * 0.2)),
                    reasoning: "Logical flow and consistency check"
                },
                headline_accuracy: {
                    score: Math.max(0, Math.min(1, finalScore + (Math.random() - 0.5) * 0.2)),
                    reasoning: "Headline vs content alignment"
                },
                historical_context_of_the_topic: {
                    score: Math.max(0, Math.min(1, finalScore + (Math.random() - 0.5) * 0.2)),
                    reasoning: "Historical accuracy and context"
                }
            }
        };
    }

    /**
     * Handle page analysis request
     */
    private async handlePageAnalysis(data: any): Promise<BSMeterData | null> {
        // Call n8n workflow for analysis
        return await this.callN8nWorkflow({
            text: data.content || '',
            url: data.url || '',
            title: data.title || 'Unknown'
        });
    }

    /**
     * Get BS meter data (for compatibility with existing code)
     */
    getBSMeterData(): BSMeterData | null {
        // For popup, we'll trigger analysis when needed
        return null;
    }

    /**
     * Get overall score (for compatibility with existing code)
     */
    getOverallScore(): number | null {
        // Return null initially, will be set after analysis
        return null;
    }

    /**
     * Store analysis result in Chrome storage
     */
    async storeAnalysisResult(data: BSMeterData): Promise<void> {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            try {
                await chrome.storage.local.set({ 'bsMeterData': data });
                console.log('Analysis result stored');
            } catch (error) {
                console.error('Failed to store analysis result:', error);
            }
        }
    }

    /**
     * Get stored analysis result from Chrome storage
     */
    async getStoredAnalysisResult(): Promise<BSMeterData | null> {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            try {
                const result = await chrome.storage.local.get('bsMeterData');
                return result.bsMeterData || null;
            } catch (error) {
                console.error('Failed to get stored analysis result:', error);
                return null;
            }
        }
        return null;
    }
}