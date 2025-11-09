
import { GoogleGenAI, Type } from "@google/genai";
import type { KnobSettings, GeneratedTone } from '../types';

// It's assumed that process.env.API_KEY is available in the execution environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export async function generateTone(settings: KnobSettings): Promise<GeneratedTone> {
  const model = "gemini-2.5-pro";
  
  const prompt = `
You are a guitar tone expert and sound engineer. A user has set the controls on a virtual high-gain tube amplifier. 
Based on these settings (0-100 scale), generate a catchy, creative name for the tone preset and a detailed, evocative description of the sound.
The description should cover the character of the distortion, the EQ shape, and suggest musical styles it would be best for.

Settings:
- Gain: ${settings.gain}
- Bass: ${settings.bass}
- Mid: ${settings.mid}
- Treble: ${settings.treb}
- Volume: ${settings.vol}
`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: {
              type: Type.STRING,
              description: "A unique, catchy name for the amplifier tone."
            },
            description: {
              type: Type.STRING,
              description: "A compelling description of the guitar tone, written in a passionate and engaging tone for a musician."
            }
          },
          required: ["name", "description"]
        }
      }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error generating tone:", error);
    throw new Error("Failed to generate tone. The tone gnomes are on a break. Please check your settings and try again.");
  }
}