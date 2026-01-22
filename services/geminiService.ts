import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const getAIClient = (customKey?: string) => {
  const apiKey = customKey || process.env.API_KEY;
  if (!apiKey) {
      throw new Error("API Key is missing. Please set it in the sidebar or environment.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateContent = async (
  model: string,
  prompt: string,
  systemInstruction?: string,
  inlineData?: { mimeType: string; data: string },
  apiKey?: string
): Promise<string> => {
  const ai = getAIClient(apiKey);
  
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

export const repairInvalidYaml = async (invalidYaml: string, apiKey?: string, standardize: boolean = false): Promise<string> => {
  const ai = getAIClient(apiKey);
  let systemInstruction = "You are a YAML syntax expert. Your job is to fix invalid YAML strings and return only the valid YAML text.";
  
  if (standardize) {
      systemInstruction += " The YAML MUST be an array of objects with keys: id, name, description, model, systemPrompt. Transform any input into this structure. Invent descriptions if missing.";
  }

  const prompt = `Please fix/standardize the following YAML content. Only return the raw YAML, no markdown fencing.\n\n${invalidYaml}`;
  
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction,
    }
  });

  let text = response.text || '';
  // Strip markdown code blocks if present
  text = text.replace(/^```yaml\n/, '').replace(/^```\n/, '').replace(/\n```$/, '');
  return text.trim();
};
