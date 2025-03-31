import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load from .env.local explicitly
dotenv.config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function convertCode(input, fromLang, toLang) {
    try {
        // Log API key availability (not the actual key)
        console.log("API Key available:", !!process.env.GOOGLE_API_KEY);

        // Use gemini-1.5-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const prompt = `Convert the following ${fromLang} code to ${toLang}. 
        Return ONLY the converted code without any explanations or markdown formatting:

        ${input}`;
        
        console.log("Converting code...");

        // Generate content using the Gemini API
        const result = await model.generateContent(prompt);
        
        // Extract text based on the actual structure
        let convertedCode = "";
        
        // Based on the actual response structure we received
        if (result && result.response && result.response.candidates && 
            result.response.candidates[0] && result.response.candidates[0].content && 
            result.response.candidates[0].content.parts && 
            result.response.candidates[0].content.parts[0] && 
            result.response.candidates[0].content.parts[0].text) {
            
            convertedCode = result.response.candidates[0].content.parts[0].text;
        } else {
            // Fallback - try to extract any useful information from the response
            convertedCode = "// Could not parse the response from the API";
            console.error("Unexpected response structure:", result);
        }
        
        // Return the converted code
        return convertedCode.trim();
        
    } catch (error) {
        console.error("Error during code conversion:", error.message);
        return `// Conversion failed due to an error: ${error.message}`;
    }
}

export default convertCode;