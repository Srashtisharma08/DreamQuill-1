import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

export async function generateStory(prompt: string, genre: string, tone: string) {
    if (!apiKey) {
        console.warn("No GEMINI_API_KEY found, using mock generation.");
        return mockGenerateStory(prompt, genre, tone);
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const fullPrompt = `
      You are an expert creative writer. Write a ${genre} story with a ${tone} tone based on the following prompt: "${prompt}".
      
      Requirements:
      - Title: Create a catchy title.
      - Structure: Beginning, Middle (Conflict), End (Resolution).
      - Style: Engaging, descriptive, and emotionally resonant.
      - Format: Return the response in JSON format with fields: "title" and "content".
    `;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        // Parse JSON from text (handling potential markdown code blocks)
        const jsonStr = text.replace(/```json\n?|\n?```/g, "").trim();

        try {
            return JSON.parse(jsonStr);
        } catch (e) {
            // Fallback if not valid JSON, treat entire text as content
            return {
                title: "Untitled Story",
                content: text
            }
        }

    } catch (error) {
        console.error("AI Generation Error (falling back to mock):", error);
        // Fallback to mock generation if API fails (e.g. invalid key, quota exceeded, or model not found)
        return mockGenerateStory(prompt, genre, tone);
    }
}

async function mockGenerateStory(prompt: string, genre: string, tone: string) {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay

    return {
        title: `The Echo of ${genre}`,
        content: `This is a mock story generated because no API Key was provided.\n\nPrompt: ${prompt}\nGenre: ${genre}\nTone: ${tone}\n\nOnce upon a time, in a world defined by its ${tone} atmosphere, a character embarked on a journey typical of a ${genre} tale. They faced challenges, overcame obstacles, and in the end, discovered something profound about themselves. \n\n(To get real AI generation, please add a GEMINI_API_KEY to your .env file)`
    };
}
