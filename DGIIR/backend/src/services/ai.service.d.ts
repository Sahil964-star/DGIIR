export interface AIClassificationInput {
    title: string;
    description: string;
    address: string;
    district: string;
    imagePath?: string;
}
export interface AIClassificationResult {
    predictedCategory: string;
    confidence: number;
    keywords: string[];
    reasoning: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    severityScore: number;
    departmentSuggestion: string;
    districtSuggestion: string;
    aiSummary: string;
    detectedObjects: string[];
    imageConfidence: number | null;
    requiresEscalation: boolean;
}
export declare class AIService {
    /**
     * Main entry point: classifies a complaint using Gemini (text + optional image).
     * Fetches categories and departments dynamically from the DB — no hardcoding.
     */
    static analyzeComplaint(input: AIClassificationInput): Promise<AIClassificationResult>;
    private static analyzeTextOnly;
    private static analyzeWithImage;
    private static parseGeminiResponse;
    private static buildFallbackResult;
    private static getMimeType;
}
//# sourceMappingURL=ai.service.d.ts.map