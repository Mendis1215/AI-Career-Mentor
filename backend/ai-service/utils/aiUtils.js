// AI Utilities
// Common helper functions used throughout the AI service.


// Safe String

const safeString = (
    value,
    fallback = ""
) => {

    if (
        value === null ||
        value === undefined
    ) {

        return fallback;

    }

    return String(value).trim();

};


// Check Empty Response

const isEmptyResponse = (
    response
) => {

    if (
        response === null ||
        response === undefined
    ) {

        return true;

    }


    if (
        typeof response === "string"
    ) {

        return response.trim().length === 0;

    }


    if (
        typeof response === "object"
    ) {

        return Object.keys(response).length === 0;

    }


    return false;

};


// Validate AI Response

const validateAIResponse = (
    response
) => {

    const errors = [];


    if (
        response === null ||
        response === undefined
    ) {

        errors.push(
            "AI response is missing."
        );

        return {

            valid: false,

            errors

        };

    }


    if (
        typeof response === "string" &&
        response.trim().length === 0
    ) {

        errors.push(
            "AI response is empty."
        );

    }


    if (
        typeof response === "object" &&
        Object.keys(response).length === 0
    ) {

        errors.push(
            "AI response object is empty."
        );

    }


    return {

        valid:
            errors.length === 0,

        errors

    };

};


// Clean AI Text
// Removes unnecessary formatting while keeping the actual response.

const cleanAIText = (
    text
) => {

    if (
        text === null ||
        text === undefined
    ) {

        return "";

    }


    return String(text)

        // Remove leading/trailing whitespace.

        .trim()

        // Normalize excessive blank lines.

        .replace(/\n{3,}/g, "\n\n")

        // Remove accidental null characters.

        .replace(/\0/g, "");

};


/*
 Remove Markdown Code Fence

 Gemini may return:

 ```json
 {...}
 ```

 This function extracts the actual content.
*/

const removeCodeFence = (
    text
) => {

    const cleaned =
        safeString(text);


    if (!cleaned) {

        return "";

    }


    return cleaned

        .replace(
            /^```(?:json|javascript|js|text)?\s*/i,
            ""
        )

        .replace(
            /\s*```$/i,
            ""
        )

        .trim();

};


// Extract JSON From AI Response
// Attempts to extract a JSON object or JSON array from
// an AI-generated response.

const extractJSON = (
    response
) => {

    if (
        response === null ||
        response === undefined
    ) {

        return null;

    }


    // Already a JavaScript object.

    if (
        typeof response === "object"
    ) {

        return response;

    }


    let text =
        safeString(response);


    if (!text) {

        return null;

    }


    // Remove Markdown code fences.

    text =
        removeCodeFence(
            text
        );


    // First attempt:
    // Parse the complete response.

    try {

        return JSON.parse(
            text
        );

    } catch (error) {

        // Continue to extraction.
    }


    // Find JSON object.

    const objectStart =
        text.indexOf("{");

    const objectEnd =
        text.lastIndexOf("}");


    if (
        objectStart !== -1 &&
        objectEnd !== -1 &&
        objectEnd > objectStart
    ) {

        const objectText =
            text.substring(
                objectStart,
                objectEnd + 1
            );


        try {

            return JSON.parse(
                objectText
            );

        } catch (error) {

            // Continue to array extraction.
        }

    }


    // Find JSON array.

    const arrayStart =
        text.indexOf("[");

    const arrayEnd =
        text.lastIndexOf("]");


    if (
        arrayStart !== -1 &&
        arrayEnd !== -1 &&
        arrayEnd > arrayStart
    ) {

        const arrayText =
            text.substring(
                arrayStart,
                arrayEnd + 1
            );


        try {

            return JSON.parse(
                arrayText
            );

        } catch (error) {

            return null;

        }

    }


    return null;

};


// Parse AI JSON
// Same as extractJSON, but throws a useful error when
// valid JSON cannot be obtained.

const parseAIJSON = (
    response
) => {

    const parsed =
        extractJSON(
            response
        );


    if (
        parsed === null
    ) {

        const error =
            new Error(
                "The AI response does not contain valid JSON."
            );


        error.code =
            "AI_INVALID_JSON";


        throw error;

    }


    return parsed;

};


// Get AI Response Text
// Supports several common Gemini/API response structures.

const getAIResponseText = (
    response
) => {

    if (
        response === null ||
        response === undefined
    ) {

        return "";

    }


    // Direct string.

    if (
        typeof response === "string"
    ) {

        return cleanAIText(
            response
        );

    }


    // Common:
    // response.text

    if (
        typeof response.text === "string"
    ) {

        return cleanAIText(
            response.text
        );

    }


    // Gemini SDK style:
    // response.text()

    if (
        typeof response.text === "function"
    ) {

        try {

            return cleanAIText(
                response.text()
            );

        } catch (error) {

            // Continue.
        }

    }


    // Common nested structure:
    // response.candidates[0].content.parts

    if (
        Array.isArray(
            response.candidates
        ) &&
        response.candidates.length > 0
    ) {

        const candidate =
            response.candidates[0];


        const parts =
            candidate?.content?.parts;


        if (
            Array.isArray(parts)
        ) {

            const text =
                parts
                    .map(
                        (part) =>
                            part?.text || ""
                    )
                    .join("");


            if (text) {

                return cleanAIText(
                    text
                );

            }

        }

    }


    // Generic content field.

    if (
        typeof response.content === "string"
    ) {

        return cleanAIText(
            response.content
        );

    }


    return "";

};


// Extract Usage Metadata

const extractUsageMetadata = (
    response
) => {

    if (!response) {

        return {

            promptTokens: 0,

            completionTokens: 0,

            totalTokens: 0

        };

    }


    const usage =
        response.usageMetadata ||
        response.usage ||
        {};


    const promptTokens =
        Number(
            usage.promptTokenCount ||
            usage.promptTokens ||
            usage.inputTokens ||
            0
        );


    const completionTokens =
        Number(
            usage.candidatesTokenCount ||
            usage.completionTokens ||
            usage.outputTokens ||
            0
        );


    const totalTokens =
        Number(
            usage.totalTokenCount ||
            usage.totalTokens ||
            (
                promptTokens +
                completionTokens
            )
        );


    return {

        promptTokens,

        completionTokens,

        totalTokens

    };

};


// Build AI Error

const buildAIError = (
    message,
    {
        code = "AI_ERROR",
        statusCode = 500,
        originalError = null
    } = {}
) => {

    const error =
        new Error(
            safeString(
                message,
                "AI service error."
            )
        );


    error.code =
        code;


    error.statusCode =
        statusCode;


    if (originalError) {

        error.originalError =
            originalError;

    }


    return error;

};


// Format AI Error

const formatAIError = (
    error
) => {

    if (!error) {

        return {

            code:
                "AI_ERROR",

            message:
                "Unknown AI service error."

        };

    }


    return {

        code:
            error.code ||
            "AI_ERROR",

        message:
            error.message ||
            "AI service error.",

        statusCode:
            error.statusCode ||
            500

    };

};


// Detect Safety / Blocked Response
// Checks common provider response structures.

const isBlockedResponse = (
    response
) => {

    if (!response) {

        return false;

    }


    /*
    | Explicit blocked flag.
    */

    if (
        response.blocked === true
    ) {

        return true;

    }


    /*
    | Gemini finish reason.
    */

    if (
        Array.isArray(
            response.candidates
        )
    ) {

        return response.candidates.some(
            (candidate) => {

                const reason =
                    candidate?.finishReason ||
                    candidate?.finish_reason;


                return [

                    "SAFETY",

                    "BLOCKED",

                    "PROHIBITED_CONTENT"

                ].includes(
                    String(reason)
                        .toUpperCase()
                );

            }
        );

    }


    return false;

};


// Validate AI Text Response

const validateAITextResponse = (
    response
) => {

    const text =
        getAIResponseText(
            response
        );


    if (!text) {

        return {

            valid: false,

            text: "",

            error:
                "AI returned an empty response."

        };

    }


    if (
        isBlockedResponse(
            response
        )
    ) {

        return {

            valid: false,

            text: "",

            error:
                "AI response was blocked."

        };

    }


    return {

        valid: true,

        text,

        error: null

    };

};


// Build Conversation Message

const buildAIMessage = ({
    role,
    content,
    type = "text",
    model = null,
    tokenUsage = null,
    sources = [],
    metadata = {}
} = {}) => {

    return {

        role:
            role || "assistant",

        content:
            cleanAIText(
                content
            ),

        type,

        model,

        tokenUsage: {

            promptTokens:
                Number(
                    tokenUsage?.promptTokens ||
                    0
                ),

            completionTokens:
                Number(
                    tokenUsage?.completionTokens ||
                    0
                ),

            totalTokens:
                Number(
                    tokenUsage?.totalTokens ||
                    0
                )

        },

        sources:
            Array.isArray(
                sources
            )
                ? sources
                : [],

        metadata:
            metadata || {}

    };

};


// Check Response Length

const isResponseTooShort = (
    response,
    minimumCharacters = 10
) => {

    const text =
        getAIResponseText(
            response
        );


    return (
        text.length <
        Number(
            minimumCharacters
        )
    );

};


// Check Response Length

const isResponseTooLong = (
    response,
    maximumCharacters = 20000
) => {

    const text =
        getAIResponseText(
            response
        );


    return (
        text.length >
        Number(
            maximumCharacters
        )
    );

};


// Normalize AI Response

const normalizeAIResponse = (
    response
) => {

    const text =
        getAIResponseText(
            response
        );


    const usage =
        extractUsageMetadata(
            response
        );


    return {

        text,

        usage,

        blocked:
            isBlockedResponse(
                response
            ),

        valid:
            Boolean(
                text &&
                !isBlockedResponse(
                    response
                )
            )

    };

};


// Generate Request ID
// Useful for logging and tracing AI requests.

const generateRequestId = () => {

    return (

        "ai_" +

        Date.now().toString(
            36
        ) +

        "_" +

        Math.random()
            .toString(36)
            .substring(2, 10)

    );

};


//Export

module.exports = {

    safeString,

    isEmptyResponse,

    validateAIResponse,

    cleanAIText,

    removeCodeFence,

    extractJSON,

    parseAIJSON,

    getAIResponseText,

    extractUsageMetadata,

    buildAIError,

    formatAIError,

    isBlockedResponse,

    validateAITextResponse,

    buildAIMessage,

    isResponseTooShort,

    isResponseTooLong,

    normalizeAIResponse,

    generateRequestId

};