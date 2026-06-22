import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { prisma } from '../db/prisma.js';
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
const KEYWORD_RULES = [
    {
        keywords: ['no water', 'water supply', 'dry tap', 'no drinking water', 'taps are dry', 'water shortage'],
        categoryName: 'No Water Supply',
        departmentName: 'Delhi Jal Board',
        priority: 'HIGH',
        severityScore: 75,
        confidence: 91,
    },
    {
        keywords: ['water leakage', 'water leak', 'pipe burst', 'broken pipe', 'flooded road', 'sewage overflow', 'drain overflowing'],
        categoryName: 'Water Leakage',
        departmentName: 'Delhi Jal Board',
        priority: 'HIGH',
        severityScore: 80,
        confidence: 93,
    },
    {
        keywords: ['pothole', 'potholes', 'road broken', 'cracked road', 'road damage', 'crater'],
        categoryName: 'Potholes on Main Roads',
        departmentName: 'Public Works Department',
        priority: 'MEDIUM',
        severityScore: 50,
        confidence: 95,
    },
    {
        keywords: ['streetlight', 'street light', 'dark street', 'lights not working', 'bulb broken', 'street lamp'],
        categoryName: 'Streetlight Malfunction',
        departmentName: 'Public Works Department',
        priority: 'LOW',
        severityScore: 30,
        confidence: 92,
    },
    {
        keywords: ['garbage', 'trash', 'dump', 'overflowing bin', 'waste accumulation', 'rubbish'],
        categoryName: 'Garbage Dump Clearance',
        departmentName: 'Municipal Corporation of Delhi',
        priority: 'HIGH',
        severityScore: 70,
        confidence: 94,
    },
    {
        keywords: ['stray animal', 'stray dog', 'monkey menace', 'cattle', 'cow attack', 'stray cow', 'animal attack'],
        categoryName: 'Stray Animal Menace',
        departmentName: 'Municipal Corporation of Delhi',
        priority: 'HIGH',
        severityScore: 68,
        confidence: 90,
    }
];
export class AIService {
    /**
     * Main entry point: classifies a complaint using rule-based keywords or LLM fallback.
     */
    static async analyzeComplaint(input) {
        const [categories, departments, districts] = await Promise.all([
            prisma.category.findMany({ include: { department: true } }),
            prisma.department.findMany(),
            prisma.district.findMany(),
        ]);
        // 1. Try Rule-based keyword matching first
        const normalizedTitle = input.title.toLowerCase();
        const normalizedDesc = input.description.toLowerCase();
        let matchedRule = null;
        let matchedKeyword = '';
        for (const rule of KEYWORD_RULES) {
            for (const kw of rule.keywords) {
                if (normalizedTitle.includes(kw) || normalizedDesc.includes(kw)) {
                    matchedRule = rule;
                    matchedKeyword = kw;
                    break;
                }
            }
            if (matchedRule)
                break;
        }
        if (matchedRule) {
            const matchedCat = categories.find((c) => c.name.toLowerCase() === matchedRule.categoryName.toLowerCase());
            const matchedDept = departments.find((d) => d.name.toLowerCase() === matchedRule.departmentName.toLowerCase());
            if (matchedCat && matchedDept) {
                console.log(`[AIService] Keyword matched: "${matchedKeyword}" -> ${matchedCat.name}`);
                return {
                    predictedCategory: matchedCat.name,
                    confidence: matchedRule.confidence,
                    keywords: [matchedKeyword],
                    reasoning: `Rule-based keyword match for "${matchedKeyword}"`,
                    priority: matchedRule.priority,
                    severityScore: matchedRule.severityScore,
                    departmentSuggestion: matchedDept.name,
                    districtSuggestion: input.district,
                    aiSummary: input.title,
                    detectedObjects: [],
                    imageConfidence: null,
                    requiresEscalation: matchedRule.priority === 'CRITICAL',
                };
            }
        }
        // 2. Fall back to LLMs (Groq, OpenAI, or Gemini)
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
        try {
            let responseText = '';
            // A. Try Groq if configured
            if (process.env.GROQ_API_KEY) {
                try {
                    console.log('[AIService] Attempting Groq fallback...');
                    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
                        },
                        body: JSON.stringify({
                            model: 'llama3-8b-8192',
                            messages: [{ role: 'user', content: textPrompt }],
                            temperature: 0.1,
                            response_format: { type: 'json_object' }
                        })
                    });
                    if (response.ok) {
                        const data = await response.json();
                        responseText = data.choices?.[0]?.message?.content || '';
                    }
                }
                catch (err) {
                    console.error('[AIService] Groq API call failed:', err);
                }
            }
            // B. Try OpenAI if configured and Groq didn't succeed
            if (!responseText && process.env.OPENAI_API_KEY) {
                try {
                    console.log('[AIService] Attempting OpenAI fallback...');
                    const response = await fetch('https://api.openai.com/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                        },
                        body: JSON.stringify({
                            model: 'gpt-4o-mini',
                            messages: [{ role: 'user', content: textPrompt }],
                            temperature: 0.1,
                            response_format: { type: 'json_object' }
                        })
                    });
                    if (response.ok) {
                        const data = await response.json();
                        responseText = data.choices?.[0]?.message?.content || '';
                    }
                }
                catch (err) {
                    console.error('[AIService] OpenAI API call failed:', err);
                }
            }
            // C. Try Gemini as final option or standard flow
            if (!responseText) {
                if (input.imagePath && fs.existsSync(input.imagePath)) {
                    return await AIService.analyzeWithImage(textPrompt, input.imagePath);
                }
                else {
                    return await AIService.analyzeTextOnly(textPrompt);
                }
            }
            if (responseText) {
                return AIService.parseGeminiResponse(responseText);
            }
        }
        catch (err) {
            console.error('[AIService] Fallback LLM error:', err);
        }
        return AIService.buildFallbackResult(input);
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
            confidence: 40, // below 80 — will route to Operations Review
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