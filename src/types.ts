export interface Level {
    min: number;
    max: number;
    text: string;
    color: string;
}

export interface Segment {
    start: number;
    end: number;
    color: string;
}

export interface CategoryScore {
    score: number;
    reasoning: string;
}

export interface BSMeterData {
    overall_score: number;
    categories: {
        overall_credibility_and_reputation: CategoryScore;
        factual_accuracy: CategoryScore;
        distinction_between_fact_and_opinion: CategoryScore;
        language_analysis: CategoryScore;
        logical_consistency_and_absence_of_fallacies: CategoryScore;
        headline_accuracy: CategoryScore;
        historical_context_of_the_topic: CategoryScore;
    };
}

// Telegram Web App types
declare global {
    interface Window {
        Telegram: {
            WebApp: {
                initData: string;
                initDataUnsafe: any;
                ready: () => void;
                expand: () => void;
                close: () => void;
                MainButton: {
                    text: string;
                    show: () => void;
                    hide: () => void;
                    onClick: (callback: () => void) => void;
                };
                themeParams: {
                    bg_color?: string;
                    text_color?: string;
                    hint_color?: string;
                    link_color?: string;
                    button_color?: string;
                    button_text_color?: string;
                };
            };
        };
    }
}