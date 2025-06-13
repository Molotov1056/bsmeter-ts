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

// Chrome Extension types
declare global {
    interface Chrome {
        storage: {
            local: {
                set: (items: { [key: string]: any }) => Promise<void>;
                get: (keys?: string | string[] | { [key: string]: any } | null) => Promise<{ [key: string]: any }>;
                remove: (keys: string | string[]) => Promise<void>;
                clear: () => Promise<void>;
            };
        };
        tabs: {
            query: (queryInfo: any, callback: (tabs: any[]) => void) => void;
            sendMessage: (tabId: number, message: any, callback?: (response: any) => void) => void;
        };
        runtime: {
            onMessage: {
                addListener: (callback: (message: any, sender: any, sendResponse: (response?: any) => void) => boolean | void) => void;
            };
            onInstalled: {
                addListener: (callback: (details: any) => void) => void;
            };
        };
        action: {
            onClicked: {
                addListener: (callback: (tab: any) => void) => void;
            };
        };
        notifications: {
            create: (notificationId: string | undefined, options: any) => void;
        };
    }
}