import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const generateMeetingInsights = async (transcript: string) => {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });

  const prompt = `
    Analyze the following meeting transcript and provide:
    1. A concise executive summary.
    2. A list of concrete action items with assignees if mentioned.
    3. Key decisions made.

    Format the output as a clean JSON object with keys:
    - "summary" (string)
    - "actionItems" (array of strings)
    - "decisions" (array of strings)

    Do not include any markdown or code fences, just raw JSON.

    Transcript:
    ${transcript}
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating AI insights:', error);
    throw new Error('Failed to generate insights');
  }
};
