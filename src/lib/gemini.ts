import { GoogleGenAI, Type } from "@google/genai";
import { EmailCampaign, CampaignTone } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const CAMPAIGN_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "A catchy identifier for this campaign" },
    subjectLines: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "3-5 varied subject line options"
    },
    bodyCopy: { 
      type: Type.STRING, 
      description: "The full email body copy in Markdown format. Professional, persuasive, and engaging." 
    },
    visualPrompt: { 
      type: Type.STRING, 
      description: "A highly detailed image generation prompt (16:9) that perfectly matches the campaign's theme (e.g. 'A photorealistic lifestyle shot of a futuristic coffee machine in a minimalist kitchen at dawn')." 
    },
    socialPosts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          platform: { type: Type.STRING, enum: ["twitter", "facebook", "linkedin", "instagram"] },
          content: { type: Type.STRING }
        },
        required: ["platform", "content"]
      },
      description: "4 platform-specific social media posts (Twitter, Facebook, LinkedIn, Instagram) teasing the campaign content."
    }
  },
  required: ["name", "subjectLines", "bodyCopy", "visualPrompt", "socialPosts"]
};

export async function generateCampaign(prompt: string, tone: CampaignTone, audience: string): Promise<Partial<EmailCampaign>> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a high-converting email marketing campaign and supporting social media content for the following description: "${prompt}".
      
      Audience: ${audience}
      Tone: ${tone}
      
      Provide:
      1. A short name for the campaign.
      2. 3 powerful subject lines.
      3. A full email body in Markdown.
      4. A perfect image generation prompt for a hero banner (16:9 aspect ratio).
      5. 4 platform-specific social media posts (Twitter, Facebook, LinkedIn, Instagram) that tease the email content, include relevant hashtags, and have strong calls-to-action.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: CAMPAIGN_SCHEMA,
        temperature: 0.8,
      }
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    const data = JSON.parse(response.text);
    return {
      ...data,
      tone,
      targetAudience: audience,
      createdAt: Date.now(),
      id: crypto.randomUUID()
    };
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
}
