import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const getAIClient = () => {
  // Using the API key from environment variable as strictly instructed
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateContent = async (
  model: string,
  prompt: string,
  systemInstruction?: string,
  inlineData?: { mimeType: string; data: string }
): Promise<string> => {
  const ai = getAIClient();
  
  const parts: any[] = [];
  if (inlineData) {
    parts.push({ inlineData });
  }
  parts.push({ text: prompt });

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: model,
    contents: { parts },
    config: {
      systemInstruction,
    }
  });

  return response.text || '';
};

export const repairInvalidYaml = async (invalidYaml: string): Promise<string> => {
  const ai = getAIClient();
  const prompt = `Please fix the following YAML content. Ensure it is valid YAML. Only return the raw YAML, no markdown fencing.\n\n${invalidYaml}`;
  
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: "You are a YAML syntax expert. Your job is to fix invalid YAML strings and return only the valid YAML text.",
    }
  });

  let text = response.text || '';
  // Strip markdown code blocks if present
  text = text.replace(/^```yaml\n/, '').replace(/^```\n/, '').replace(/\n```$/, '');
  return text.trim();
};
