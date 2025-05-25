import { BSMeterData } from './types';

export class TelegramService {
    private webApp: any;
    
    constructor() {
        this.webApp = window.Telegram?.WebApp;
        this.debugTelegramData();
    }

    public isAvailable(): boolean {
        return !!(window.Telegram?.WebApp);
    }

    public initialize(): void {
        console.log('Initializing Telegram Service...');
        
        if (!this.isAvailable()) {
            console.warn('Telegram Web App not available - running in standalone mode');
            return;
        }

        // Tell Telegram that the Web App is ready
        this.webApp.ready();
        
        // Expand the Web App to full height
        this.webApp.expand();
        
        // Apply Telegram theme
        this.applyTelegramTheme();
        
        console.log('Telegram Web App initialized successfully');
    }

    private debugTelegramData(): void {
        console.log('=== TELEGRAM DEBUG INFO ===');
        console.log('window.Telegram:', window.Telegram);
        console.log('WebApp available:', !!window.Telegram?.WebApp);
        
        if (window.Telegram?.WebApp) {
            console.log('initData:', window.Telegram.WebApp.initData);
            console.log('initDataUnsafe:', window.Telegram.WebApp.initDataUnsafe);
        }
        
        // Check URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        console.log('URL search params:', window.location.search);
        console.log('startapp param:', urlParams.get('startapp'));
        
        console.log('=== END DEBUG INFO ===');
    }

    public getBSMeterData(): BSMeterData | null {
        console.log('Getting BS Meter data...');
        
        // Method 1: Try Telegram Web App data
        if (this.webApp && this.webApp.initDataUnsafe) {
            try {
                const startParam = this.webApp.initDataUnsafe.start_param;
                console.log('Found start_param in initDataUnsafe:', startParam);
                
                if (startParam) {
                    // Decode URL encoding first, then base64
                    const urlDecodedParam = decodeURIComponent(startParam);
                    const decodedData = atob(urlDecodedParam);
                    const bsMeterData: BSMeterData = JSON.parse(decodedData);
                    console.log('Successfully parsed BS Meter data from Telegram:', bsMeterData);
                    return bsMeterData;
                }
            } catch (error) {
                console.error('Error parsing Telegram initDataUnsafe:', error);
                // Try without URL decoding as fallback
                try {
                    const startParam = this.webApp.initDataUnsafe.start_param;
                    if (startParam) {
                        const decodedData = atob(startParam);
                        const bsMeterData: BSMeterData = JSON.parse(decodedData);
                        console.log('Successfully parsed BS Meter data from Telegram (fallback):', bsMeterData);
                        return bsMeterData;
                    }
                } catch (fallbackError) {
                    console.error('Fallback parsing also failed:', fallbackError);
                }
            }
        }
        
        // Method 2: Try URL parameters as fallback
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const startParam = urlParams.get('startapp');
            console.log('Found startapp in URL:', startParam);
            
            if (startParam) {
                // Decode URL encoding first, then base64
                const urlDecodedParam = decodeURIComponent(startParam);
                const decodedData = atob(urlDecodedParam);
                const bsMeterData: BSMeterData = JSON.parse(decodedData);
                console.log('Successfully parsed BS Meter data from URL:', bsMeterData);
                return bsMeterData;
            }
        } catch (error) {
            console.error('Error parsing URL parameters:', error);
            // Try without URL decoding as fallback
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const startParam = urlParams.get('startapp');
                if (startParam) {
                    const decodedData = atob(startParam);
                    const bsMeterData: BSMeterData = JSON.parse(decodedData);
                    console.log('Successfully parsed BS Meter data from URL (fallback):', bsMeterData);
                    return bsMeterData;
                }
            } catch (fallbackError) {
                console.error('URL fallback parsing also failed:', fallbackError);
            }
        }
        
        // Method 3: Try different Telegram data sources
        if (this.webApp && this.webApp.initData) {
            try {
                console.log('Trying to parse raw initData:', this.webApp.initData);
                // Parse initData manually - it's URL encoded
                const params = new URLSearchParams(this.webApp.initData);
                const startParam = params.get('start_param');
                console.log('Found start_param in raw initData:', startParam);
                
                if (startParam) {
                    // Decode URL encoding first, then base64
                    const urlDecodedParam = decodeURIComponent(startParam);
                    const decodedData = atob(urlDecodedParam);
                    const bsMeterData: BSMeterData = JSON.parse(decodedData);
                    console.log('Successfully parsed BS Meter data from raw initData:', bsMeterData);
                    return bsMeterData;
                }
            } catch (error) {
                console.error('Error parsing raw initData:', error);
                // Try without URL decoding as fallback
                try {
                    const params = new URLSearchParams(this.webApp.initData);
                    const startParam = params.get('start_param');
                    if (startParam) {
                        const decodedData = atob(startParam);
                        const bsMeterData: BSMeterData = JSON.parse(decodedData);
                        console.log('Successfully parsed BS Meter data from raw initData (fallback):', bsMeterData);
                        return bsMeterData;
                    }
                } catch (fallbackError) {
                    console.error('Raw initData fallback parsing also failed:', fallbackError);
                }
            }
        }
        
        console.warn('No BS Meter data found in any source');
        return null;
    }

    public getOverallScore(): number | null {
        const data = this.getBSMeterData();
        if (data && typeof data.overall_score === 'number') {
            console.log(`Found overall score: ${data.overall_score}`);
            return data.overall_score;
        }
        console.warn('No overall score found');
        return null;
    }

    private applyTelegramTheme(): void {
        if (!this.webApp?.themeParams) return;

        const root = document.documentElement;
        const theme = this.webApp.themeParams;

        // Apply Telegram theme colors to CSS variables
        if (theme.bg_color) {
            root.style.setProperty('--tg-bg-color', theme.bg_color);
            document.body.style.backgroundColor = theme.bg_color;
        }
        
        if (theme.text_color) {
            root.style.setProperty('--tg-text-color', theme.text_color);
            document.body.style.color = theme.text_color;
        }
        
        if (theme.button_color) {
            root.style.setProperty('--tg-button-color', theme.button_color);
        }
        
        if (theme.button_text_color) {
            root.style.setProperty('--tg-button-text-color', theme.button_text_color);
        }
    }

    public showMainButton(text: string, callback: () => void): void {
        if (!this.isAvailable()) return;
        
        this.webApp.MainButton.text = text;
        this.webApp.MainButton.onClick(callback);
        this.webApp.MainButton.show();
    }

    public hideMainButton(): void {
        if (!this.isAvailable()) return;
        this.webApp.MainButton.hide();
    }

    public close(): void {
        if (!this.isAvailable()) return;
        this.webApp.close();
    }
}
