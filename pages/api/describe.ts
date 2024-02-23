import { NextApiRequest, NextApiResponse } from "next";
import { Perfume } from "types";
// node --version # Should be >= 18
// npm install @google/generative-ai

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const MODEL_NAME = "gemini-1.0-pro"
const API_KEY = process.env.GEMINIAPIKEY;

async function run(description: string, data: Perfume) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
        temperature: 0.7,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
    };

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ];

    const parts = [
        { text: "input: This input will be a personal description of the user's perfect perfume" },
        { text: "input 2: This input will be a JSON of information on a recommended perfume for the user" },
        { text: "output: Explain why the user would like this perfume, address the user as you." },
        { text: "output 2: Explain why the user would dislike this perfume, address the user as you." },
        { text: "input: " + description },
        { text: "input 2: " + JSON.stringify(data) },
        { text: "output: " },
    ];


    const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
        safetySettings,
    });

    const response = result.response;
    console.log(response.text());

    return response.text();
}


export default async function handler(req: NextApiRequest,
    res: NextApiResponse<Object>) {
    try {
        const { method } = req;
        let { userDescription, perfume } = req.body;

        switch (method) {

            case 'POST': {

                const data = await run(userDescription, perfume);

                res.status(200).json(data);
                break;
            }
            default:
                res.status(400);
                break;
        }
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: "error" });
    }
}