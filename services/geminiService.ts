import { GoogleGenAI, Type } from "@google/genai";
import { Item } from "../types";

// New function to detect multiple items in a single image.
export async function detectItemsInImage(
  capturedImage: string, // base64 string with data URI
  expectedItems: Item[]
): Promise<string[]> { // returns array of matched item IDs
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

  const model = 'gemini-2.5-flash';
  const prompt = `You are an inventory verification system. The user has submitted a single photo of returned items.
  Analyze the image and identify which of the following expected items for their order are present.
  
  Expected items:
  ${expectedItems.map(item => `- ID: ${item.id}, Name: ${item.name}`).join('\n')}
  
  Respond with a JSON object containing a single key "detectedItemIds" which is an array of strings. Each string should be the ID of an item you confidently identify in the image.
  If no items are found, return an empty array.
  Example response for a successful detection: {"detectedItemIds": ["item-001", "item-002"]}
  Example response for no detection: {"detectedItemIds": []}`;

  const capturedImageBase64 = capturedImage.split(',')[1];
  const imagePart = {
    inlineData: {
      data: capturedImageBase64,
      mimeType: "image/jpeg",
    },
  };

  const contents = { parts: [imagePart, { text: prompt }] };

  try {
    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedItemIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    if (result && Array.isArray(result.detectedItemIds)) {
      // Filter the results to ensure only valid IDs are returned
      const validIds = new Set(expectedItems.map(i => i.id));
      return result.detectedItemIds.filter((id: string) => validIds.has(id));
    }

    console.warn("Unexpected JSON structure from Gemini:", result);
    return [];

  } catch (error) {
    console.error("Error calling Gemini API for item detection:", error);
    throw new Error("Failed to analyze the image. Please try again.");
  }
}
