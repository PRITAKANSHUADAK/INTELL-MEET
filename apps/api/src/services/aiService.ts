import { GoogleGenAI } from '@google/genai';

// Note: GEMINI_API_KEY must be in the environment
const ai = new GoogleGenAI();

export const generateMeetingInsights = async (transcript: string) => {
  const prompt = `
    Analyze the following meeting transcript and provide:
    1. A concise executive summary.
    2. A list of concrete action items with assignees if mentioned.
    3. Key decisions made.
    
    Format the output as a clean JSON object with keys: "summary" (string), "actionItems" (array of strings), "decisions" (array of strings). Do not use markdown wrappers like \`\`\`json.
    
    Transcript:
    ${transcript}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const jsonText = response.text;
    if (jsonText) {
       return JSON.parse(jsonText);
    }
    return null;
  } catch (error) {
    console.error('Error generating AI insights:', error);
    throw new Error('Failed to generate insights');
  }
};
