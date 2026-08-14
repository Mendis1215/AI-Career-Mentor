const { GoogleGenerativeAI } = require("@google/generative-ai");
const env = require("./env");


//Gemini Configuration

const GEMINI_CONFIG = {
    apiKey: env.GEMINI_API_KEY,

    model:
        env.GEMINI_MODEL ||
        "gemini-2.5-flash",

    embeddingModel:
        env.GEMINI_EMBEDDING_MODEL ||
        "text-embedding-004"
};


//Validate Gemini Configuration

const validateGeminiConfig = () => {

    if (!GEMINI_CONFIG.apiKey) {
        throw new Error(
            "GEMINI_API_KEY is not configured."
        );
    }
};


//Create Gemini Client

const createGeminiClient = () => {

    validateGeminiConfig();

    return new GoogleGenerativeAI(
        GEMINI_CONFIG.apiKey
    );
};


//Get Generative Model


const getGenerativeModel = (
    modelName = GEMINI_CONFIG.model
) => {

    const client = createGeminiClient();

    return client.getGenerativeModel({
        model: modelName
    });
};


//Get Embedding Model

const getEmbeddingModel = () => {

    const client = createGeminiClient();

    return client.getGenerativeModel({
        model: GEMINI_CONFIG.embeddingModel
    });
};


//Generate Content
//Simple helper for generating Gemini responses.

const generateContent = async (
    prompt,
    options = {}
) => {

    if (!prompt || typeof prompt !== "string") {
        throw new Error(
            "A valid prompt is required."
        );
    }

    const model = getGenerativeModel(
        options.model || GEMINI_CONFIG.model
    );

    const result =
        await model.generateContent(prompt);

    return result.response;
};


//Generate Text
//Returns only the generated text.

const generateText = async (
    prompt,
    options = {}
) => {

    const response =
        await generateContent(
            prompt,
            options
        );

    return response.text();
};


//Export

module.exports = {

    GEMINI_CONFIG,

    validateGeminiConfig,

    createGeminiClient,

    getGenerativeModel,

    getEmbeddingModel,

    generateContent,

    generateText

};