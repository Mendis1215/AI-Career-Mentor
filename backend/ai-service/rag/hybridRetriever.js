/*
| Hybrid Retriever
|
| Combines:
|
| 1. Vector / semantic search
| 2. Metadata filtering
| 3. Keyword matching
| 4. Result scoring
| 5. Deduplication
| 6. Re-ranking
|
| RAG flow:
|
| User Question
|       ↓
| Query Embedding
|       ↓
| vectorSearchService.js
|       ↓
| Semantic Results
|       ↓
| hybridRetriever.js
|       ↓
| Filter + Keyword Boost + Re-ranking
|       ↓
| Best Knowledge Chunks
*/


const {
    searchSimilarVectors
} = require("./vectorSearchService");


const {
    generateQueryEmbedding
} = require("./embeddingService");


//Configuration

const DEFAULT_TOP_K =
    Number(
        process.env.RAG_TOP_K
    ) || 5;


const DEFAULT_CANDIDATE_K =
    Number(
        process.env.RAG_CANDIDATE_K
    ) || 15;


const DEFAULT_MIN_SCORE =
    Number(
        process.env.RAG_MIN_SCORE
    ) || 0.30;


//Hybrid Score Weights

//Semantic similarity has the highest importance.


const DEFAULT_VECTOR_WEIGHT =
    Number(
        process.env.RAG_VECTOR_WEIGHT
    ) || 0.75;


const DEFAULT_KEYWORD_WEIGHT =
    Number(
        process.env.RAG_KEYWORD_WEIGHT
    ) || 0.15;


const DEFAULT_METADATA_WEIGHT =
    Number(
        process.env.RAG_METADATA_WEIGHT
    ) || 0.10;


//Supported Knowledge Categories

const KNOWLEDGE_CATEGORIES = [

    "career",

    "skill",

    "roadmap",

    "project",

    "certification",

    "learning-resource",

    "degree",

    "github",

    "interview",

    "general"

];


//Normalize Text

const normalizeText = (
    text
) => {

    if (
        text === null ||
        text === undefined
    ) {

        return "";

    }


    return String(
        text
    )
        .toLowerCase()
        .trim();

};


//Tokenize Text

const tokenize = (
    text
) => {

    const normalized =
        normalizeText(
            text
        );


    if (
        !normalized
    ) {

        return [];

    }


    return normalized

        .replace(
            /[^\p{L}\p{N}\s-]/gu,
            " "
        )

        .split(
            /\s+/
        )

        .map(
            (word) =>
                word.trim()
        )

        .filter(
            (word) =>
                word.length > 1
        );

};


//Remove Duplicate Tokens

const uniqueTokens = (
    tokens
) => {

    return [
        ...new Set(
            tokens
        )
    ];

};


//Extract Query Keywords

const extractQueryKeywords = (
    query
) => {

    const stopWords = new Set([

        "the",
        "a",
        "an",
        "is",
        "are",
        "was",
        "were",
        "what",
        "which",
        "who",
        "where",
        "when",
        "how",
        "why",
        "can",
        "could",
        "should",
        "would",
        "do",
        "does",
        "did",
        "for",
        "from",
        "with",
        "and",
        "or",
        "to",
        "of",
        "in",
        "on",
        "at",
        "by",
        "as",
        "about",
        "i",
        "me",
        "my",
        "you",
        "your"

    ]);


    const tokens =
        tokenize(
            query
        );


    return uniqueTokens(
        tokens.filter(
            (token) =>
                !stopWords.has(
                    token
                )
        )
    );

};


//Get Metadata

const getMetadata = (
    result
) => {

    return {

        ...(result?.metadata || {}),

        documentId:
            result?.documentId ||
            result?.metadata?.documentId ||
            null,

        chunkIndex:
            result?.chunkIndex ??
            result?.metadata?.chunkIndex ??
            null,

        category:
            result?.category ||
            result?.metadata?.category ||
            result?.metadata?.type ||
            null,

        career:
            result?.career ||
            result?.metadata?.career ||
            null,

        careerId:
            result?.careerId ||
            result?.metadata?.careerId ||
            null,

        degree:
            result?.degree ||
            result?.metadata?.degree ||
            null,

        degreeId:
            result?.degreeId ||
            result?.metadata?.degreeId ||
            null,

        skill:
            result?.skill ||
            result?.metadata?.skill ||
            null,

        skillId:
            result?.skillId ||
            result?.metadata?.skillId ||
            null

    };

};


//Calculate Keyword Score

const calculateKeywordScore = (
    query,
    result
) => {

    const queryKeywords =
        extractQueryKeywords(
            query
        );


    if (
        queryKeywords.length === 0
    ) {

        return 0;

    }


    const text =
        normalizeText(
            [
                result?.text || "",
                result?.metadata?.title || "",
                result?.metadata?.description || "",
                result?.metadata?.keywords || ""
            ].join(" ")
        );


    if (
        !text
    ) {

        return 0;

    }


    let matched =
        0;


    for (
        const keyword of queryKeywords
    ) {

        if (
            text.includes(
                keyword
            )
        ) {

            matched++;

        }

    }


    return (
        matched /
        queryKeywords.length
    );

};


//Calculate Metadata Match Score

const calculateMetadataScore = (
    query,
    result,
    filters = {}
) => {

    const metadata =
        getMetadata(
            result
        );


    let score =
        0;


    let checks =
        0;


    //Category match

    if (
        filters.category
    ) {

        checks++;


        if (
            normalizeText(
                metadata.category
            ) ===
            normalizeText(
                filters.category
            )
        ) {

            score++;

        }

    }


    //Career match

    if (
        filters.careerId
    ) {

        checks++;


        if (
            String(
                metadata.careerId
            ) ===
            String(
                filters.careerId
            )
        ) {

            score++;

        }

    }


    //Degree match

    if (
        filters.degreeId
    ) {

        checks++;


        if (
            String(
                metadata.degreeId
            ) ===
            String(
                filters.degreeId
            )
        ) {

            score++;

        }

    }


    //Skill match

    if (
        filters.skillId
    ) {

        checks++;


        if (
            String(
                metadata.skillId
            ) ===
            String(
                filters.skillId
            )
        ) {

            score++;

        }

    }


    //Query/category semantic hints

    if (
        !checks
    ) {

        const queryText =
            normalizeText(
                query
            );


        const category =
            normalizeText(
                metadata.category
            );


        if (
            category
        ) {

            checks++;


            if (
                queryText.includes(
                    category
                )
            ) {

                score++;

            }

        }

    }


    if (
        checks === 0
    ) {

        return 0;

    }


    return (
        score /
        checks
    );

};


//Extract Similarity Score

const getSimilarityScore = (
    result
) => {

    const score =
        Number(
            result?.similarity ??
            result?.score ??
            0
        );


    if (
        !Number.isFinite(
            score
        )
    ) {

        return 0;

    }


    //Clamp score to [0,1]

    return Math.min(
        Math.max(
            score,
            0
        ),
        1
    );

};


//Calculate Hybrid Score

const calculateHybridScore = ({
    vectorScore = 0,
    keywordScore = 0,
    metadataScore = 0,
    vectorWeight = DEFAULT_VECTOR_WEIGHT,
    keywordWeight = DEFAULT_KEYWORD_WEIGHT,
    metadataWeight = DEFAULT_METADATA_WEIGHT
} = {}) => {

    const totalWeight =
        vectorWeight +
        keywordWeight +
        metadataWeight;


    if (
        totalWeight <= 0
    ) {

        throw new Error(
            "Hybrid retrieval weights must be greater than zero."
        );

    }


    const normalizedVectorWeight =
        vectorWeight /
        totalWeight;


    const normalizedKeywordWeight =
        keywordWeight /
        totalWeight;


    const normalizedMetadataWeight =
        metadataWeight /
        totalWeight;


    return (

        (
            vectorScore *
            normalizedVectorWeight
        )

        +

        (
            keywordScore *
            normalizedKeywordWeight
        )

        +

        (
            metadataScore *
            normalizedMetadataWeight
        )

    );

};


//Matches Metadata Filters

const matchesFilters = (
    result,
    filters = {}
) => {

    const metadata =
        getMetadata(
            result
        );


//Category

    if (
        filters.category
    ) {

        if (
            normalizeText(
                metadata.category
            ) !==
            normalizeText(
                filters.category
            )
        ) {

            return false;

        }

    }


//Career

    if (
        filters.careerId
    ) {

        if (
            String(
                metadata.careerId
            ) !==
            String(
                filters.careerId
            )
        ) {

            return false;

        }

    }


//Degree

    if (
        filters.degreeId
    ) {

        if (
            String(
                metadata.degreeId
            ) !==
            String(
                filters.degreeId
            )
        ) {

            return false;

        }

    }


//Skill

    if (
        filters.skillId
    ) {

        if (
            String(
                metadata.skillId
            ) !==
            String(
                filters.skillId
            )
        ) {

            return false;

        }

    }


//Document

    if (
        filters.documentId
    ) {

        if (
            String(
                metadata.documentId
            ) !==
            String(
                filters.documentId
            )
        ) {

            return false;

        }

    }


    return true;

};


//Deduplicate Results

const deduplicateResults = (
    results
) => {

    const seen =
        new Set();


    const unique =
        [];


    for (
        const result of results
    ) {

        const metadata =
            getMetadata(
                result
            );


        const key =
            result.id ||

            (
                metadata.documentId &&
                metadata.chunkIndex !== null

                    ? `${metadata.documentId}-${metadata.chunkIndex}`

                    : result.text
            );


        if (
            seen.has(
                key
            )
        ) {

            continue;

        }


        seen.add(
            key
        );


        unique.push(
            result
        );

    }


    return unique;

};


//Re-rank Results

const rerankResults = ({
    query,
    results = [],
    filters = {},
    vectorWeight = DEFAULT_VECTOR_WEIGHT,
    keywordWeight = DEFAULT_KEYWORD_WEIGHT,
    metadataWeight = DEFAULT_METADATA_WEIGHT
} = {}) => {

    const scoredResults =
        results.map(
            (result) => {

                const vectorScore =
                    getSimilarityScore(
                        result
                    );


                const keywordScore =
                    calculateKeywordScore(
                        query,
                        result
                    );


                const metadataScore =
                    calculateMetadataScore(
                        query,
                        result,
                        filters
                    );


                const hybridScore =
                    calculateHybridScore({

                        vectorScore,

                        keywordScore,

                        metadataScore,

                        vectorWeight,

                        keywordWeight,

                        metadataWeight

                    });


                return {

                    ...result,

                    retrievalScores: {

                        vectorScore,

                        keywordScore,

                        metadataScore,

                        hybridScore

                    },

                    hybridScore

                };

            }
        );


    return scoredResults.sort(
        (
            first,
            second
        ) =>
            second.hybridScore -
            first.hybridScore
    );

};


//Validate Query

const validateQuery = (
    query
) => {

    if (
        query === null ||
        query === undefined
    ) {

        throw new Error(
            "Query is required."
        );

    }


    if (
        typeof query !== "string"
    ) {

        throw new Error(
            "Query must be a string."
        );

    }


    if (
        !query.trim()
    ) {

        throw new Error(
            "Query cannot be empty."
        );

    }


    return true;

};


//Validate Category

const validateCategory = (
    category
) => {

    if (
        !category
    ) {

        return true;

    }


    if (
        !KNOWLEDGE_CATEGORIES.includes(
            normalizeText(
                category
            )
        )
    ) {

        throw new Error(
            `Unsupported knowledge category: ${category}`
        );

    }


    return true;

};


//Retrieve Hybrid Results

const hybridRetrieve = async ({
    query,
    queryEmbedding = null,
    topK = DEFAULT_TOP_K,
    candidateK = DEFAULT_CANDIDATE_K,
    minScore = DEFAULT_MIN_SCORE,
    filters = {},
    vectorWeight = DEFAULT_VECTOR_WEIGHT,
    keywordWeight = DEFAULT_KEYWORD_WEIGHT,
    metadataWeight = DEFAULT_METADATA_WEIGHT
} = {}) => {

    validateQuery(
        query
    );


    validateCategory(
        filters.category
    );


    //Generate query embedding when one isn't supplied.

    let embedding =
        queryEmbedding;


    if (
        !embedding
    ) {

        embedding =
            await generateQueryEmbedding(
                query
            );

    }


    //Retrieve more candidates than we finally return.

    const candidates =
        await searchSimilarVectors({

            embedding,

            topK:
                candidateK,

            minScore,

            filter:
                filters

        });


    //Apply metadata filtering.

    const filteredCandidates =
        candidates.filter(
            (result) =>
                matchesFilters(
                    result,
                    filters
                )
        );


    //Remove duplicates.

    const uniqueCandidates =
        deduplicateResults(
            filteredCandidates
        );


    //Re-rank

    const rerankedResults =
        rerankResults({

            query,

            results:
                uniqueCandidates,

            filters,

            vectorWeight,

            keywordWeight,

            metadataWeight

        });


    //Return top K

    return rerankedResults.slice(
        0,
        Math.max(
            1,
            Number(topK)
        )
    );

};


//Retrieve By Category

const retrieveByCategory = async ({
    query,
    category,
    topK = DEFAULT_TOP_K,
    candidateK = DEFAULT_CANDIDATE_K,
    minScore = DEFAULT_MIN_SCORE
} = {}) => {

    validateCategory(
        category
    );


    return await hybridRetrieve({

        query,

        topK,

        candidateK,

        minScore,

        filters: {

            category

        }

    });

};


//Retrieve By Career

const retrieveByCareer = async ({
    query,
    careerId,
    topK = DEFAULT_TOP_K,
    candidateK = DEFAULT_CANDIDATE_K,
    minScore = DEFAULT_MIN_SCORE
} = {}) => {

    if (
        !careerId
    ) {

        throw new Error(
            "Career ID is required."
        );

    }


    return await hybridRetrieve({

        query,

        topK,

        candidateK,

        minScore,

        filters: {

            careerId

        }

    });

};


//Retrieve By Degree

const retrieveByDegree = async ({
    query,
    degreeId,
    topK = DEFAULT_TOP_K,
    candidateK = DEFAULT_CANDIDATE_K,
    minScore = DEFAULT_MIN_SCORE
} = {}) => {

    if (
        !degreeId
    ) {

        throw new Error(
            "Degree ID is required."
        );

    }


    return await hybridRetrieve({

        query,

        topK,

        candidateK,

        minScore,

        filters: {

            degreeId

        }

    });

};


//Retrieve By Skill

const retrieveBySkill = async ({
    query,
    skillId,
    topK = DEFAULT_TOP_K,
    candidateK = DEFAULT_CANDIDATE_K,
    minScore = DEFAULT_MIN_SCORE
} = {}) => {

    if (
        !skillId
    ) {

        throw new Error(
            "Skill ID is required."
        );

    }


    return await hybridRetrieve({

        query,

        topK,

        candidateK,

        minScore,

        filters: {

            skillId

        }

    });

};


//Build Retrieval Context


//Converts retrieved chunks into clean context for Gemini.


const buildRetrievalContext = (
    results = []
) => {

    if (
        !Array.isArray(results)
    ) {

        throw new Error(
            "Retrieval results must be an array."
        );

    }


    return results

        .map(
            (
                result,
                index
            ) => {

                const metadata =
                    getMetadata(
                        result
                    );


                const source =
                    metadata.title ||
                    metadata.documentName ||
                    metadata.documentId ||
                    "Knowledge Document";


                return [

                    `[Source ${index + 1}]`,

                    `Title: ${source}`,

                    `Category: ${
                        metadata.category ||
                        "general"
                    }`,

                    `Content:`,

                    result.text || ""

                ].join("\n");

            }
        )

        .join(
            "\n\n-------------------------\n\n"
        );

};


//Get Retrieval Statistics

const getRetrievalStatistics = (
    results = []
) => {

    if (
        !Array.isArray(
            results
        )
    ) {

        return {

            count: 0

        };

    }


    const scores =
        results
            .map(
                (result) =>
                    Number(
                        result.hybridScore ??
                        result.score ??
                        0
                    )
            )
            .filter(
                (score) =>
                    Number.isFinite(
                        score
                    )
            );


    if (
        scores.length === 0
    ) {

        return {

            count:
                results.length,

            averageScore:
                0,

            highestScore:
                0,

            lowestScore:
                0

        };

    }


    const total =
        scores.reduce(
            (
                sum,
                score
            ) =>
                sum + score,
            0
        );


    return {

        count:
            results.length,

        averageScore:
            total /
            scores.length,

        highestScore:
            Math.max(
                ...scores
            ),

        lowestScore:
            Math.min(
                ...scores
            )

    };

};


//Get Configuration

const getHybridRetrievalConfiguration = () => {

    return {

        defaultTopK:
            DEFAULT_TOP_K,

        defaultCandidateK:
            DEFAULT_CANDIDATE_K,

        defaultMinScore:
            DEFAULT_MIN_SCORE,

        vectorWeight:
            DEFAULT_VECTOR_WEIGHT,

        keywordWeight:
            DEFAULT_KEYWORD_WEIGHT,

        metadataWeight:
            DEFAULT_METADATA_WEIGHT,

        supportedCategories:
            KNOWLEDGE_CATEGORIES

    };

};


//Export

module.exports = {

    DEFAULT_TOP_K,

    DEFAULT_CANDIDATE_K,

    DEFAULT_MIN_SCORE,

    DEFAULT_VECTOR_WEIGHT,

    DEFAULT_KEYWORD_WEIGHT,

    DEFAULT_METADATA_WEIGHT,

    KNOWLEDGE_CATEGORIES,

    normalizeText,

    tokenize,

    uniqueTokens,

    extractQueryKeywords,

    getMetadata,

    calculateKeywordScore,

    calculateMetadataScore,

    getSimilarityScore,

    calculateHybridScore,

    matchesFilters,

    deduplicateResults,

    rerankResults,

    validateQuery,

    validateCategory,

    hybridRetrieve,

    retrieveByCategory,

    retrieveByCareer,

    retrieveByDegree,

    retrieveBySkill,

    buildRetrievalContext,

    getRetrievalStatistics,

    getHybridRetrievalConfiguration

};