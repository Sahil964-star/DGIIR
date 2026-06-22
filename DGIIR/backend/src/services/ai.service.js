import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { prisma } from '../db/prisma.js';
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
export class AIService {
    /**
     * Main entry point: classifies a complaint using Gemini (text + optional image).
     * Fetches categories and departments dynamically from the DB — no hardcoding.
     */
    static async analyzeComplaint(input) {
        const [categories, departments, districts] = await Promise.all([
            prisma.category.findMany({ include: { department: true } }),
            prisma.department.findMany(),
            prisma.district.findMany(),
        ]);
        const categoryList = categories.map((c) => `  - "${c.name}" (Department: "${c.department.name}")`).join('\n');
        const districtList = districts.map((d) => `  - "${d.name}"`).join('\n');
        const textPrompt = `
You are an AI assistant for the Delhi Government Integrated Incident & Reporting (DGIIR) system.
Your task is to analyze a citizen complaint and return a structured JSON routing decision.

## Available Categories (and their departments):
${categoryList}

## Available Delhi Districts:
${districtList}

## Priority Rules (follow these strictly):
- Water outage > 24 hours mentioned → HIGH
- Electrical hazard / sparks / exposed wires → CRITICAL  
- Flooding / sewage overflow → HIGH
- Garbage accumulation > 7 days → HIGH
- Pothole → MEDIUM
- Streetlight not working → LOW
- Any immediate safety risk to life → CRITICAL
- Stray animal attack → HIGH
- Otherwise, infer from severity of description.

## Severity Score Rules (0-100):
- CRITICAL priority: 85-100
- HIGH priority: 65-84
- MEDIUM priority: 35-64
- LOW priority: 0-34

## Citizen Complaint to Analyze:
Title: "${input.title}"
Description: "${input.description}"
Address: "${input.address}"
Citizen-Selected District: "${input.district}"

## Your Task:
1. Classify the complaint into the most appropriate category from the list above.
2. Determine the correct responsible department.
3. Predict the priority level based on the rules.
4. Compute a severity score (0-100).
5. Extract 3-6 key keywords from the complaint.
6. Suggest which district this complaint belongs to based on the address (must be from the Available Districts list).
7. Write a 1-2 sentence AI summary suitable for field officers.
8. Determine if escalation is required (true if CRITICAL or if water/power outage > 48 hours).
9. Provide a confidence score (0-100) for your category prediction.

## IMPORTANT:
- Return ONLY valid JSON, no markdown, no explanation outside JSON.
- predictedCategory must exactly match one of the available category names.
- departmentSuggestion must exactly match one of the available department names.
- districtSuggestion must exactly match one of the available district names.

## Response Format:
{
  "predictedCategory": "<exact category name>",
  "confidence": <0-100>,
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "reasoning": "<brief explanation of category choice>",
  "priority": "LOW|MEDIUM|HIGH|CRITICAL",
  "severityScore": <0-100>,
  "departmentSuggestion": "<exact department name>",
  "districtSuggestion": "<exact district name>",
  "aiSummary": "<1-2 sentence summary for field officer>",
  "detectedObjects": [],
  "imageConfidence": null,
  "requiresEscalation": true|false
}`;
        let result;
        try {
            if (input.imagePath && fs.existsSync(input.imagePath)) {
                // Multimodal: text + image
                result = await AIService.analyzeWithImage(textPrompt, input.imagePath);
            }
            else {
                // Text-only
                result = await AIService.analyzeTextOnly(textPrompt);
            }
        }
        catch (err) {
            console.error('[AIService] Gemini API error:', err);
            // Fallback: return a low-confidence result so it goes to Operations Review
            return AIService.buildFallbackResult(input);
        }
        return result;
    }
    static async analyzeTextOnly(prompt) {
        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                temperature: 0.1,
                thinkingConfig: { thinkingBudget: 0 },
            },
        });
        const text = response.text ?? '';
        return AIService.parseGeminiResponse(text);
    }
    static async analyzeWithImage(textPrompt, imagePath) {
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        const mimeType = AIService.getMimeType(imagePath);
        const imagePrompt = `\n\nAn image has also been uploaded by the citizen. Please analyze it and:
- List any detected objects relevant to the complaint (e.g., garbage, pothole, broken pipe, flooded road, damaged streetlight).
- Set "detectedObjects" to the list of detected issues.
- Set "imageConfidence" to a 0-100 score reflecting how clearly the image supports the complaint category.
- If the image contradicts or is unrelated to the text, lower your overall confidence accordingly.`;
        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: textPrompt + imagePrompt },
                        {
                            inlineData: {
                                mimeType,
                                data: base64Image,
                            },
                        },
                    ],
                },
            ],
            config: {
                responseMimeType: 'application/json',
                temperature: 0.1,
                thinkingConfig: { thinkingBudget: 0 },
            },
        });
        const text = response.text ?? '';
        return AIService.parseGeminiResponse(text);
    }
    static parseGeminiResponse(text) {
        // Strip markdown code fences if model returned them despite JSON mode
        const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
        const parsed = JSON.parse(cleaned);
        return {
            predictedCategory: parsed.predictedCategory ?? 'Other',
            confidence: Number(parsed.confidence ?? 50),
            keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
            reasoning: parsed.reasoning ?? '',
            priority: parsed.priority ?? 'MEDIUM',
            severityScore: Number(parsed.severityScore ?? 50),
            departmentSuggestion: parsed.departmentSuggestion ?? '',
            districtSuggestion: parsed.districtSuggestion ?? '',
            aiSummary: parsed.aiSummary ?? '',
            detectedObjects: Array.isArray(parsed.detectedObjects) ? parsed.detectedObjects : [],
            imageConfidence: parsed.imageConfidence !== undefined ? Number(parsed.imageConfidence) : null,
            requiresEscalation: Boolean(parsed.requiresEscalation),
        };
    }
    static buildFallbackResult(input) {
        return {
            predictedCategory: 'Other',
            confidence: 40, // below 60 — will route to Operations Review
            keywords: [],
            reasoning: 'AI classification unavailable. Routed to Operations Review.',
            priority: 'MEDIUM',
            severityScore: 40,
            departmentSuggestion: '',
            districtSuggestion: input.district,
            aiSummary: 'AI classification failed. Manual review required.',
            detectedObjects: [],
            imageConfidence: null,
            requiresEscalation: false,
        };
    }
    static getMimeType(filePath) {
        const ext = path.extname(filePath).toLowerCase();
        const mimeMap = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.heic': 'image/heic',
        };
        return mimeMap[ext] ?? 'image/jpeg';
    }
}
//# sourceMappingURL=ai.service.js.map