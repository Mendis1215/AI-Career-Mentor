/*
|--------------------------------------------------------------------------
| Token Utilities
|--------------------------------------------------------------------------
|
| Utility functions for estimating and controlling token usage
| within the AI service.
|
| NOTE:
| These functions provide approximate token calculations.
| The actual token usage returned by the AI provider should be
| treated as the authoritative usage information.
|
*/


/*
|--------------------------------------------------------------------------
| Default Configuration
|--------------------------------------------------------------------------
*/

const DEFAULT_CONFIG = {

    /*
    | Approximate characters per token.
    |
    | This is only an estimation.
    |
    */

    charactersPerToken: 4,

    /*
    | Default maximum input tokens.
    */

    maxInputTokens: 12000,

    /*
    | Default maximum output tokens.
    */

    maxOutputTokens: 2048,

    /*
    | Maximum conversation messages included in a prompt.
    */

    maxConversationMessages: 20,

    /*
    | Maximum characters allowed for an individual message.
    */

    maxMessageCharacters: 6000,

    /*
    | Maximum characters allowed for one RAG document/chunk.
    */

    maxRAGDocumentCharacters: 5000,

    /*
    | Maximum total RAG characters.
    */

    maxRAGCharacters: 30000

};


/*
|--------------------------------------------------------------------------
| Normalize Text
|--------------------------------------------------------------------------
*/

const normalizeText = (
    text
) => {

    if (
        text === null ||
        text === undefined
    ) {

        return "";

    }

    return String(text)
        .replace(/\s+/g, " ")
        .trim();

};


/*
|--------------------------------------------------------------------------
| Estimate Tokens
|--------------------------------------------------------------------------
|
| Rough estimation:
|
| tokens ≈ characters / charactersPerToken
|
|--------------------------------------------------------------------------
*/

const estimateTokens = (
    text,
    charactersPerToken =
        DEFAULT_CONFIG.charactersPerToken
) => {

    const normalized =
        normalizeText(text);


    if (!normalized) {

        return 0;

    }


    const divisor =
        Number(charactersPerToken) > 0
            ? Number(charactersPerToken)
            : 4;


    return Math.ceil(
        normalized.length / divisor
    );

};


/*
|--------------------------------------------------------------------------
| Estimate Multiple Texts
|--------------------------------------------------------------------------
*/

const estimateTokensForTexts = (
    texts = [],
    charactersPerToken =
        DEFAULT_CONFIG.charactersPerToken
) => {

    if (!Array.isArray(texts)) {

        return 0;

    }


    return texts.reduce(
        (
            total,
            text
        ) => {

            return total +
                estimateTokens(
                    text,
                    charactersPerToken
                );

        },
        0
    );

};


/*
|--------------------------------------------------------------------------
| Estimate Object Tokens
|--------------------------------------------------------------------------
*/

const estimateObjectTokens = (
    object,
    charactersPerToken =
        DEFAULT_CONFIG.charactersPerToken
) => {

    if (
        object === null ||
        object === undefined
    ) {

        return 0;

    }


    let text;


    try {

        text =
            JSON.stringify(
                object
            );

    } catch (error) {

        text =
            String(object);

    }


    return estimateTokens(
        text,
        charactersPerToken
    );

};


/*
|--------------------------------------------------------------------------
| Estimate Prompt Tokens
|--------------------------------------------------------------------------
*/

const estimatePromptTokens = (
    prompt
) => {

    return estimateTokens(
        prompt
    );

};


/*
|--------------------------------------------------------------------------
| Calculate Token Budget
|--------------------------------------------------------------------------
*/

const calculateTokenBudget = ({
    maxInputTokens =
        DEFAULT_CONFIG.maxInputTokens,

    maxOutputTokens =
        DEFAULT_CONFIG.maxOutputTokens,

    estimatedInputTokens = 0

} = {}) => {

    const inputLimit =
        Math.max(
            0,
            Number(maxInputTokens)
        );


    const outputLimit =
        Math.max(
            0,
            Number(maxOutputTokens)
        );


    const inputUsed =
        Math.max(
            0,
            Number(estimatedInputTokens)
        );


    const remainingInputTokens =
        Math.max(
            0,
            inputLimit - inputUsed
        );


    return {

        maxInputTokens:
            inputLimit,

        maxOutputTokens:
            outputLimit,

        estimatedInputTokens:
            inputUsed,

        remainingInputTokens,

        totalConfiguredTokens:
            inputLimit +
            outputLimit

    };

};


/*
|--------------------------------------------------------------------------
| Calculate Remaining Tokens
|--------------------------------------------------------------------------
*/

const calculateRemainingTokens = (
    maxTokens,
    usedTokens
) => {

    return Math.max(
        0,
        Number(maxTokens || 0) -
        Number(usedTokens || 0)
    );

};


/*
|--------------------------------------------------------------------------
| Truncate Text
|--------------------------------------------------------------------------
*/

const truncateText = (
    text,
    maxCharacters
) => {

    const normalized =
        normalizeText(text);


    if (!normalized) {

        return "";

    }


    const limit =
        Number(maxCharacters);


    if (
        !Number.isFinite(limit) ||
        limit <= 0
    ) {

        return "";

    }


    if (
        normalized.length <= limit
    ) {

        return normalized;

    }


    /*
    | Leave a small indication that the text
    | has been truncated.
    */

    const suffix =
        "... [truncated]";


    const available =
        Math.max(
            0,
            limit - suffix.length
        );


    return (
        normalized.substring(
            0,
            available
        ) +
        suffix
    );

};


/*
|--------------------------------------------------------------------------
| Truncate By Tokens
|--------------------------------------------------------------------------
*/

const truncateByTokens = (
    text,
    maxTokens,
    charactersPerToken =
        DEFAULT_CONFIG.charactersPerToken
) => {

    const normalized =
        normalizeText(text);


    if (!normalized) {

        return "";

    }


    const tokenLimit =
        Number(maxTokens);


    if (
        !Number.isFinite(tokenLimit) ||
        tokenLimit <= 0
    ) {

        return "";

    }


    const estimated =
        estimateTokens(
            normalized,
            charactersPerToken
        );


    if (
        estimated <= tokenLimit
    ) {

        return normalized;

    }


    const maxCharacters =
        Math.floor(
            tokenLimit *
            charactersPerToken
        );


    return truncateText(
        normalized,
        maxCharacters
    );

};


/*
|--------------------------------------------------------------------------
| Limit Conversation History
|--------------------------------------------------------------------------
*/

const limitConversationHistory = (
    messages = [],
    maxMessages =
        DEFAULT_CONFIG.maxConversationMessages
) => {

    if (!Array.isArray(messages)) {

        return [];

    }


    const limit =
        Math.max(
            0,
            Number(maxMessages)
        );


    if (messages.length <= limit) {

        return messages;

    }


    /*
    | Keep the most recent messages.
    */

    return messages.slice(
        -limit
    );

};


/*
|--------------------------------------------------------------------------
| Limit Message Length
|--------------------------------------------------------------------------
*/

const limitMessageLength = (
    message,
    maxCharacters =
        DEFAULT_CONFIG.maxMessageCharacters
) => {

    if (!message) {

        return message;

    }


    if (
        typeof message === "string"
    ) {

        return truncateText(
            message,
            maxCharacters
        );

    }


    return {

        ...message,

        content:
            truncateText(
                message.content,
                maxCharacters
            )

    };

};


/*
|--------------------------------------------------------------------------
| Limit Conversation Message Lengths
|--------------------------------------------------------------------------
*/

const limitConversationMessageLengths = (
    messages = [],
    maxCharacters =
        DEFAULT_CONFIG.maxMessageCharacters
) => {

    if (!Array.isArray(messages)) {

        return [];

    }


    return messages.map(
        (message) =>
            limitMessageLength(
                message,
                maxCharacters
            )
    );

};


/*
|--------------------------------------------------------------------------
| Limit RAG Document
|--------------------------------------------------------------------------
*/

const limitRAGDocument = (
    document,
    maxCharacters =
        DEFAULT_CONFIG.maxRAGDocumentCharacters
) => {

    if (!document) {

        return null;

    }


    return {

        ...document,

        content:
            truncateText(
                document.content ||
                document.text ||
                document.chunk ||
                "",
                maxCharacters
            )

    };

};


/*
|--------------------------------------------------------------------------
| Limit RAG Documents
|--------------------------------------------------------------------------
*/

const limitRAGDocuments = (
    documents = [],
    {
        maxDocuments = 8,

        maxDocumentCharacters =
            DEFAULT_CONFIG.maxRAGDocumentCharacters,

        maxTotalCharacters =
            DEFAULT_CONFIG.maxRAGCharacters

    } = {}
) => {

    if (!Array.isArray(documents)) {

        return [];

    }


    const result = [];

    let totalCharacters = 0;


    for (
        const document
        of documents
            .slice(0, maxDocuments)
    ) {

        const limited =
            limitRAGDocument(
                document,
                maxDocumentCharacters
            );


        if (!limited) {

            continue;

        }


        const content =
            limited.content || "";


        if (!content) {

            continue;

        }


        const remainingCharacters =
            maxTotalCharacters -
            totalCharacters;


        if (
            remainingCharacters <= 0
        ) {

            break;

        }


        if (
            content.length >
            remainingCharacters
        ) {

            limited.content =
                truncateText(
                    content,
                    remainingCharacters
                );

        }


        if (!limited.content) {

            continue;

        }


        totalCharacters +=
            limited.content.length;


        result.push(
            limited
        );

    }


    return result;

};


/*
|--------------------------------------------------------------------------
| Estimate Conversation Tokens
|--------------------------------------------------------------------------
*/

const estimateConversationTokens = (
    messages = []
) => {

    if (!Array.isArray(messages)) {

        return 0;

    }


    return messages.reduce(
        (
            total,
            message
        ) => {

            if (
                typeof message === "string"
            ) {

                return total +
                    estimateTokens(
                        message
                    );

            }


            return total +
                estimateTokens(
                    message?.content || ""
                );

        },
        0
    );

};


/*
|--------------------------------------------------------------------------
| Estimate RAG Tokens
|--------------------------------------------------------------------------
*/

const estimateRAGTokens = (
    documents = []
) => {

    if (!Array.isArray(documents)) {

        return 0;

    }


    return documents.reduce(
        (
            total,
            document
        ) => {

            return total +
                estimateTokens(
                    document?.content ||
                    document?.text ||
                    document?.chunk ||
                    ""
                );

        },
        0
    );

};


/*
|--------------------------------------------------------------------------
| Fit Texts Within Token Budget
|--------------------------------------------------------------------------
|
| Adds texts sequentially until the estimated token budget
| is reached.
|
|--------------------------------------------------------------------------
*/

const fitTextsWithinTokenBudget = (
    texts = [],
    maxTokens,
    charactersPerToken =
        DEFAULT_CONFIG.charactersPerToken
) => {

    if (!Array.isArray(texts)) {

        return [];

    }


    const limit =
        Number(maxTokens);


    if (
        !Number.isFinite(limit) ||
        limit <= 0
    ) {

        return [];

    }


    const result = [];

    let usedTokens = 0;


    for (
        const text
        of texts
    ) {

        const normalized =
            normalizeText(text);


        if (!normalized) {

            continue;

        }


        const tokens =
            estimateTokens(
                normalized,
                charactersPerToken
            );


        if (
            usedTokens +
            tokens <=
            limit
        ) {

            result.push(
                normalized
            );

            usedTokens +=
                tokens;

            continue;

        }


        const remaining =
            limit -
            usedTokens;


        if (remaining <= 0) {

            break;

        }


        const truncated =
            truncateByTokens(
                normalized,
                remaining,
                charactersPerToken
            );


        if (truncated) {

            result.push(
                truncated
            );

        }


        break;

    }


    return result;

};


/*
|--------------------------------------------------------------------------
| Check Token Limit
|--------------------------------------------------------------------------
*/

const exceedsTokenLimit = (
    text,
    maxTokens
) => {

    return (
        estimateTokens(text) >
        Number(maxTokens)
    );

};


/*
|--------------------------------------------------------------------------
| Validate Token Configuration
|--------------------------------------------------------------------------
*/

const validateTokenConfiguration = ({
    maxInputTokens =
        DEFAULT_CONFIG.maxInputTokens,

    maxOutputTokens =
        DEFAULT_CONFIG.maxOutputTokens,

    charactersPerToken =
        DEFAULT_CONFIG.charactersPerToken

} = {}) => {

    const errors = [];


    if (
        !Number.isFinite(
            Number(maxInputTokens)
        ) ||
        Number(maxInputTokens) <= 0
    ) {

        errors.push(
            "maxInputTokens must be a positive number."
        );

    }


    if (
        !Number.isFinite(
            Number(maxOutputTokens)
        ) ||
        Number(maxOutputTokens) <= 0
    ) {

        errors.push(
            "maxOutputTokens must be a positive number."
        );

    }


    if (
        !Number.isFinite(
            Number(charactersPerToken)
        ) ||
        Number(charactersPerToken) <= 0
    ) {

        errors.push(
            "charactersPerToken must be a positive number."
        );

    }


    return {

        valid:
            errors.length === 0,

        errors

    };

};


/*
|--------------------------------------------------------------------------
| Get Default Configuration
|--------------------------------------------------------------------------
*/

const getDefaultTokenConfig = () => {

    return {

        ...DEFAULT_CONFIG

    };

};


/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

module.exports = {

    DEFAULT_CONFIG,

    normalizeText,

    estimateTokens,

    estimateTokensForTexts,

    estimateObjectTokens,

    estimatePromptTokens,

    calculateTokenBudget,

    calculateRemainingTokens,

    truncateText,

    truncateByTokens,

    limitConversationHistory,

    limitMessageLength,

    limitConversationMessageLengths,

    limitRAGDocument,

    limitRAGDocuments,

    estimateConversationTokens,

    estimateRAGTokens,

    fitTextsWithinTokenBudget,

    exceedsTokenLimit,

    validateTokenConfiguration,

    getDefaultTokenConfig

};