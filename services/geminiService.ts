
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development and should be handled by the environment.
  // In a real app, you might want to show a more user-friendly error.
  console.error("API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

// Utility to parse base64 string
const parseBase64 = (base64String: string): { mimeType: string, data: string } | null => {
  const match = base64String.match(/^data:(image\/\w+);base64,(.*)$/);
  if (!match || match.length !== 3) {
    return null;
  }
  return { mimeType: match[1], data: match[2] };
};

interface EditImageResult {
  image: string | null;
  text: string | null;
}

export const editImage = async (base64ImageData: string, prompt: string): Promise<EditImageResult> => {
  const parsedImage = parseBase64(base64ImageData);

  if (!parsedImage) {
    throw new Error("Invalid image format. Expected a base64 encoded image.");
  }
  
  if (!prompt) {
      throw new Error("Prompt cannot be empty.");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: parsedImage.data,
              mimeType: parsedImage.mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    let resultImage: string | null = null;
    let resultText: string | null = null;

    if (response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                resultImage = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
            } else if (part.text) {
                resultText = part.text;
            }
        }
    }
    
    if(!resultImage) {
        throw new Error("API did not return an image. The model may not have been able to fulfill the request.");
    }

    return { image: resultImage, text: resultText };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while contacting the Gemini API.");
  }
};
