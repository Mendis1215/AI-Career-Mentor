/*
| Embedding Service
|
| Responsible for converting text into vector embeddings.
|
| RAG flow:
|
| Document
|    ↓
| Text Extraction
|    ↓
| Text Chunking
|    ↓
| Embedding Service
|    ↓
| Vector Embeddings
|    ↓
| Vector Database
*/

const {
    getGeminiEmbeddingModel
} = require("../../shared/config/gemini");


//Configuration

const DEFAULT_EMBEDDING_MODEL =
    process.env.GEMINI_EMBEDDING_MODEL ||
    "gemini-embedding-001";


const DEFAULT_OUTPUT_DIMENSION =
    Number(
        process.env.GEMINI_EMBEDDING_DIMENSION
    ) || 768;


const MAX_BATCH_SIZE = 100;


//Validate Text

const validateText = (
    text
) => {

    if (
        text === null ||
        text === undefined
    ) {

        throw new Error(
            "Text is required for embedding."
        );

    }


    if (
        typeof text !== "string"
    ) {

        throw new Error(
            "Embedding text must be a string."
        );

    }


    if (
        !text.trim()
    ) {

        throw new Error(
            "Embedding text cannot be empty."
        );

    }


    return true;

};


//Validate Text Array

const validateTexts = (
    texts
) => {

    if (
        !Array.isArray(texts)
    ) {

        throw new Error(
            "Texts must be an array."
        );

    }


    if (
        texts.length === 0
    ) {

        throw new Error(
            "At least one text is required."
        );

    }


    texts.forEach(
        (
            text,
            index
        ) => {

            try {

                validateText(
                    text
                );

            } catch (error) {

                throw new Error(
                    `Invalid text at index ${index}: ${error.message}`
                );

            }

        }
    );


    return true;

};


//Get Gemini Embedding Model

const getEmbeddingModel = () => {

    // Use shared Gemini configuration

    if (
        typeof getGeminiEmbeddingModel ===
        "function"
    ) {

        return getGeminiEmbeddingModel();

    }


    throw new Error(
        "Gemini embedding model is not configured."
    );

};


//Extract Embedding Values

const extractEmbeddingValues = (
    response
) => {

    if (!response) {

        throw new Error(
            "Empty embedding response received."
        );

    }


    // Gemini response format

    if (
        response.embedding &&
        Array.isArray(
            response.embedding.values
        )
    ) {

        return response.embedding.values;

    }


    if (
        response.embeddings &&
        response.embeddings[0] &&
        Array.isArray(
            response.embeddings[0].values
        )
    ) {

        return response
            .embeddings[0]
            .values;

    }


    if (
        response.values &&
        Array.isArray(
            response.values
        )
    ) {

        return response.values;

    }


    throw new Error(
        "Embedding values were not found in Gemini response."
    );

};


//Validate Embedding

const validateEmbedding = (
    embedding
) => {

    if (
        !Array.isArray(
            embedding
        )
    ) {

        throw new Error(
            "Invalid embedding returned by Gemini."
        );

    }


    if (
        embedding.length === 0
    ) {

        throw new Error(
            "Gemini returned an empty embedding."
        );

    }


    const containsInvalidValue =
        embedding.some(
            (value) =>
                typeof value !== "number" ||
                !Number.isFinite(value)
        );


    if (
        containsInvalidValue
    ) {

        throw new Error(
            "Embedding contains invalid numeric values."
        );

    }


    return true;

};


//Generate Single Embedding

const generateEmbedding = async (
    text,
    options = {}
) => {

    validateText(
        text
    );


    const model =
        getEmbeddingModel();


    const modelName =
        options.model ||
        DEFAULT_EMBEDDING_MODEL;


    try {

        // Gemini embedding API

        const result =
            await model.embedContent(
                text
            );


        const embedding =
            extractEmbeddingValues(
                result
            );


        validateEmbedding(
            embedding
        );


        return embedding;

    } catch (error) {

        throw new Error(
            `Failed to generate text embedding: ${error.message}`
        );

    }

};


//Generate Batch Embeddings

const generateEmbeddings = async (
    texts,
    options = {}
) => {

    validateTexts(
        texts
    );


    const model =
        getEmbeddingModel();


    const embeddings = [];


    //Process in batches

    for (
        let start = 0;
        start < texts.length;
        start += MAX_BATCH_SIZE
    ) {

        const batch =
            texts.slice(
                start,
                start + MAX_BATCH_SIZE
            );


        //Generate embeddings individually
        
        //This keeps the implementation compatible with the Gemini SDK configuration used by the project.
        

        for (
            const text of batch
        ) {

            const result =
                await model.embedContent(
                    text
                );


            const embedding =
                extractEmbeddingValues(
                    result
                );


            validateEmbedding(
                embedding
            );


            embeddings.push(
                embedding
            );

        }

    }


    return embeddings;

};


//Generate Embeddings With Metadata

const generateEmbeddingsWithMetadata = async (
    chunks = [],
    options = {}
) => {

    if (
        !Array.isArray(chunks)
    ) {

        throw new Error(
            "Chunks must be an array."
        );

    }


    if (
        chunks.length === 0
    ) {

        return [];

    }


    const texts =
        chunks.map(
            (chunk) => {

                if (
                    typeof chunk === "string"
                ) {

                    return chunk;

                }


                return chunk.text || "";

            }
        );


    const embeddings =
        await generateEmbeddings(
            texts,
            options
        );


    return chunks.map(
        (
            chunk,
            index
        ) => {

            const embedding =
                embeddings[index];


            if (
                typeof chunk === "string"
            ) {

                return {

                    text:
                        chunk,

                    embedding

                };

            }


            return {

                ...chunk,

                embedding

            };

        }
    );

};


//Generate Query Embedding


const generateQueryEmbedding = async (
    query,
    options = {}
) => {

    validateText(
        query
    );


    return await generateEmbedding(
        query,
        options
    );

};


//Calculate Vector Magnitude

const calculateMagnitude = (
    vector
) => {

    validateEmbedding(
        vector
    );


    const squaredSum =
        vector.reduce(
            (
                sum,
                value
            ) =>
                sum + value * value,
            0
        );


    return Math.sqrt(
        squaredSum
    );

};


//Normalize Vector

const normalizeEmbedding = (
    embedding
) => {

    validateEmbedding(
        embedding
    );


    const magnitude =
        calculateMagnitude(
            embedding
        );


    if (
        magnitude === 0
    ) {

        throw new Error(
            "Cannot normalize a zero-magnitude embedding."
        );

    }


    return embedding.map(
        (value) =>
            value / magnitude
    );

};


//Calculate Cosine Similarity

//This helper is useful for testing and local comparisons.

const cosineSimilarity = (
    vectorA,
    vectorB
) => {

    validateEmbedding(
        vectorA
    );

    validateEmbedding(
        vectorB
    );


    if (
        vectorA.length !==
        vectorB.length
    ) {

        throw new Error(
            "Vectors must have the same dimensions."
        );

    }


    let dotProduct = 0;

    let magnitudeA = 0;

    let magnitudeB = 0;


    for (
        let index = 0;
        index < vectorA.length;
        index++
    ) {

        dotProduct +=
            vectorA[index] *
            vectorB[index];


        magnitudeA +=
            vectorA[index] *
            vectorA[index];


        magnitudeB +=
            vectorB[index] *
            vectorB[index];

    }


    if (
        magnitudeA === 0 ||
        magnitudeB === 0
    ) {

        return 0;

    }


    return (
        dotProduct /
        (
            Math.sqrt(magnitudeA) *
            Math.sqrt(magnitudeB)
        )
    );

};


//Get Embedding Dimensions

const getEmbeddingDimensions = (
    embedding
) => {

    validateEmbedding(
        embedding
    );


    return embedding.length;

};


//Get Embedding Configuration

const getEmbeddingConfiguration = () => {

    return {

        model:
            DEFAULT_EMBEDDING_MODEL,

        outputDimension:
            DEFAULT_OUTPUT_DIMENSION,

        maxBatchSize:
            MAX_BATCH_SIZE

    };

};


//Test Embedding Service

const testEmbeddingService = async () => {

    const testText =
        "Data Science combines statistics, programming and machine learning.";


    const embedding =
        await generateEmbedding(
            testText
        );


    return {

        success: true,

        dimensions:
            getEmbeddingDimensions(
                embedding
            ),

        model:
            DEFAULT_EMBEDDING_MODEL

    };

};


//Export

module.exports = {

    DEFAULT_EMBEDDING_MODEL,

    DEFAULT_OUTPUT_DIMENSION,

    MAX_BATCH_SIZE,

    validateText,

    validateTexts,

    getEmbeddingModel,

    extractEmbeddingValues,

    validateEmbedding,

    generateEmbedding,

    generateEmbeddings,

    generateEmbeddingsWithMetadata,

    generateQueryEmbedding,

    calculateMagnitude,

    normalizeEmbedding,

    cosineSimilarity,

    getEmbeddingDimensions,

    getEmbeddingConfiguration,

    testEmbeddingService

};