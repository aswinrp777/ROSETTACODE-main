import express from "express";
import path from "path";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "ROSETTACODE-main")));

// Define a route for the home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "ROSETTACODE-main", "index.html"));
});

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Define an API endpoint for code conversion
app.post("/api", async (req, res) => {
    const { input, fromLang, toLang } = req.body;

    try {
        // Log API key status (not the actual key)
        console.log("API Key available:", !!process.env.GOOGLE_API_KEY);
        
        // Create a prompt for code conversion
        const prompt = `Convert the following ${fromLang} code to ${toLang}. 
        Return ONLY the converted code without any explanations or markdown formatting:

        ${input}`;
        
        // Use the gemini-1.5-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        
        console.log(`Converting from ${fromLang} to ${toLang}`);

        // Generate content using the Gemini API
        const result = await model.generateContent(prompt);
        
        // Debug the structure of the response
        console.log("Response structure:", JSON.stringify(result, null, 2));
        
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
        res.json({ convertedCode: convertedCode.trim() });
        
    } catch (error) {
        console.error("Error in /api route:", error.message);
        res.status(500).json({ 
            error: "Failed to convert code.", 
            details: error.message 
        });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Using API Key (masked): ${process.env.GOOGLE_API_KEY ? "****" + process.env.GOOGLE_API_KEY.substring(process.env.GOOGLE_API_KEY.length - 4) : "Not found"}`);
});