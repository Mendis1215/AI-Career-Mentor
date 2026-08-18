/*
| Knowledge Retriever
|
| Final retrieval layer of the RAG pipeline.
|
| Responsibilities:
|
| 1. Retrieve relevant knowledge
| 2. Retrieve knowledge by category
| 3. Retrieve knowledge for specific careers
| 4. Retrieve knowledge for specific skills
| 5. Retrieve knowledge for specific degrees
| 6. Build context for Gemini
| 7. Remove weak/duplicate results
| 8. Provide retrieval statistics
|
| RAG pipeline:
|
| User Question
|       ↓
| Query Embedding
|       ↓
| Vector Search
|       ↓
| Hybrid Retriever
|       ↓
| Knowledge Retriever
|       ↓
| Context
|       ↓
| Gemini
*/


const {
    hybridRetrieve,

    retrieveByCategory,

    retrieveByCareer,

    retrieveByDegree,

    retrieveBySkill,

    buildRetrievalContext,

    getRetrievalStatistics,

    KNOWLEDGE_CATEGORIES
} = require("./hybridRetriever");


//Configuration

const DEFAULT_TOP_K =
    Number(
        process.env.KNOWLEDGE_TOP_K
    ) || 5;


const DEFAULT_MIN_SCORE =
    Number(
        process.env.KNOWLEDGE_MIN_SCORE
    ) || 0.30;


const DEFAULT_MAX_CONTEXT_CHUNKS =
    Number(
        process.env.KNOWLEDGE_MAX_CONTEXT_CHUNKS
    ) || 8;


//Validate Query

const validateQuery = (
    query
) => {

    if (
        query === null ||
        query === undefined
    ) {

        throw new Error(
            "Knowledge retrieval query is required."
        );

    }


    if (
        typeof query !== "string"
    ) {

        throw new Error(
            "Knowledge retrieval query must be a string."
        );

    }


    if (
        !query.trim()
    ) {

        throw new Error(
            "Knowledge retrieval query cannot be empty."
        );

    }


    return true;

};


//Validate Options

const validateRetrievalOptions = (
    options = {}
) => {

    if (
        options.topK !== undefined
    ) {

        if (
            !Number.isInteger(
                Number(
                    options.topK
                )
            ) ||
            Number(
                options.topK
            ) <= 0
        ) {

            throw new Error(
                "topK must be a positive integer."
            );

        }

    }


    if (
        options.minScore !== undefined
    ) {

        const minScore =
            Number(
                options.minScore
            );


        if (
            !Number.isFinite(
                minScore
            ) ||
            minScore < 0 ||
            minScore > 1
        ) {

            throw new Error(
                "minScore must be between 0 and 1."
            );

        }

    }


    return true;

};


/*
| Normalize Student Context
|
| Student context can contain information such as:
|
| - degree
| - skills
| - interests
| - target career
| - certifications
*/

const normalizeStudentContext = (
    studentContext = {}
) => {

    if (
        !studentContext ||
        typeof studentContext !== "object"
    ) {

        return {};

    }


    return {

        studentId:
            studentContext.studentId ||
            null,

        degree:
            studentContext.degree ||
            null,

        degreeId:
            studentContext.degreeId ||
            null,

        targetCareer:
            studentContext.targetCareer ||
            null,

        careerId:
            studentContext.careerId ||
            null,

        skills:
            Array.isArray(
                studentContext.skills
            )
                ? studentContext.skills
                : [],

        interests:
            Array.isArray(
                studentContext.interests
            )
                ? studentContext.interests
                : [],

        certifications:
            Array.isArray(
                studentContext.certifications
            )
                ? studentContext.certifications
                : []

    };

};


//Build Student Context Filters

const buildStudentContextFilters = (
    studentContext = {}
) => {

    const context =
        normalizeStudentContext(
            studentContext
        );


    const filters = {};


    if (
        context.degreeId
    ) {

        filters.degreeId =
            context.degreeId;

    }


    if (
        context.careerId
    ) {

        filters.careerId =
            context.careerId;

    }


    return filters;

};


//Remove Weak Results

const removeWeakResults = (
    results = [],
    minScore = DEFAULT_MIN_SCORE
) => {

    if (
        !Array.isArray(
            results
        )
    ) {

        return [];

    }


    return results.filter(
        (result) => {

            const score =
                Number(
                    result.hybridScore ??
                    result.retrievalScores?.hybridScore ??
                    result.score ??
                    0
                );


            return (
                score >= minScore
            );

        }
    );

};


//Remove Duplicate Knowledge

const removeDuplicateKnowledge = (
    results = []
) => {

    const seen =
        new Set();


    return results.filter(
        (result) => {

            const documentId =
                result.documentId ||
                result.metadata?.documentId ||
                "";


            const chunkIndex =
                result.chunkIndex ??
                result.metadata?.chunkIndex ??
                "";


            const text =
                result.text ||
                "";


            const key =
                documentId && chunkIndex !== ""
                    ? `${documentId}-${chunkIndex}`
                    : text.trim().toLowerCase();


            if (
                seen.has(
                    key
                )
            ) {

                return false;

            }


            seen.add(
                key
            );


            return true;

        }
    );

};


//Limit Context

const limitContextResults = (
    results = [],
    limit = DEFAULT_MAX_CONTEXT_CHUNKS
) => {

    const validatedLimit =
        Math.max(
            1,
            Number(
                limit
            ) || DEFAULT_MAX_CONTEXT_CHUNKS
        );


    return results.slice(
        0,
        validatedLimit
    );

};


//Retrieve Knowledge

const retrieveKnowledge = async ({
    query,
    queryEmbedding = null,
    topK = DEFAULT_TOP_K,
    candidateK,
    minScore = DEFAULT_MIN_SCORE,
    filters = {},
    studentContext = {},
    vectorWeight,
    keywordWeight,
    metadataWeight,
    maxContextChunks = DEFAULT_MAX_CONTEXT_CHUNKS
} = {}) => {

    validateQuery(
        query
    );


    validateRetrievalOptions({

        topK,

        minScore

    });


    //Add filters derived from student context

    const studentFilters =
        buildStudentContextFilters(
            studentContext
        );


    const combinedFilters = {

        ...studentFilters,

        ...filters

    };


    //Retrieve and rank knowledge

    let results =
        await hybridRetrieve({

            query,

            queryEmbedding,

            topK,

            candidateK,

            minScore,

            filters:
                combinedFilters,

            vectorWeight,

            keywordWeight,

            metadataWeight

        });


    //Remove weak results

    results =
        removeWeakResults(
            results,
            minScore
        );


    //Remove duplicates

    results =
        removeDuplicateKnowledge(
            results
        );


    //Limit context

    results =
        limitContextResults(
            results,
            maxContextChunks
        );


    //Build Gemini-ready context

    const context =
        buildRetrievalContext(
            results
        );


    //Statistics

    const statistics =
        getRetrievalStatistics(
            results
        );


    return {

        query,

        results,

        context,

        statistics,

        resultCount:
            results.length

    };

};


//Retrieve Career Knowledge

const retrieveCareerKnowledge = async ({
    query,
    careerId,
    topK = DEFAULT_TOP_K,
    candidateK,
    minScore = DEFAULT_MIN_SCORE,
    maxContextChunks = DEFAULT_MAX_CONTEXT_CHUNKS
} = {}) => {

    validateQuery(
        query
    );


    if (
        !careerId
    ) {

        throw new Error(
            "careerId is required for career knowledge retrieval."
        );

    }


    let results =
        await retrieveByCareer({

            query,

            careerId,

            topK,

            candidateK,

            minScore

        });


    results =
        removeWeakResults(
            results,
            minScore
        );


    results =
        removeDuplicateKnowledge(
            results
        );


    results =
        limitContextResults(
            results,
            maxContextChunks
        );


    return {

        query,

        careerId,

        results,

        context:
            buildRetrievalContext(
                results
            ),

        statistics:
            getRetrievalStatistics(
                results
            ),

        resultCount:
            results.length

    };

};


//Retrieve Skill Knowledge

const retrieveSkillKnowledge = async ({
    query,
    skillId,
    topK = DEFAULT_TOP_K,
    candidateK,
    minScore = DEFAULT_MIN_SCORE,
    maxContextChunks = DEFAULT_MAX_CONTEXT_CHUNKS
} = {}) => {

    validateQuery(
        query
    );


    if (
        !skillId
    ) {

        throw new Error(
            "skillId is required for skill knowledge retrieval."
        );

    }


    let results =
        await retrieveBySkill({

            query,

            skillId,

            topK,

            candidateK,

            minScore

        });


    results =
        removeWeakResults(
            results,
            minScore
        );


    results =
        removeDuplicateKnowledge(
            results
        );


    results =
        limitContextResults(
            results,
            maxContextChunks
        );


    return {

        query,

        skillId,

        results,

        context:
            buildRetrievalContext(
                results
            ),

        statistics:
            getRetrievalStatistics(
                results
            ),

        resultCount:
            results.length

    };

};


//Retrieve Degree Knowledge

const retrieveDegreeKnowledge = async ({
    query,
    degreeId,
    topK = DEFAULT_TOP_K,
    candidateK,
    minScore = DEFAULT_MIN_SCORE,
    maxContextChunks = DEFAULT_MAX_CONTEXT_CHUNKS
} = {}) => {

    validateQuery(
        query
    );


    if (
        !degreeId
    ) {

        throw new Error(
            "degreeId is required for degree knowledge retrieval."
        );

    }


    let results =
        await retrieveByDegree({

            query,

            degreeId,

            topK,

            candidateK,

            minScore

        });


    results =
        removeWeakResults(
            results,
            minScore
        );


    results =
        removeDuplicateKnowledge(
            results
        );


    results =
        limitContextResults(
            results,
            maxContextChunks
        );


    return {

        query,

        degreeId,

        results,

        context:
            buildRetrievalContext(
                results
            ),

        statistics:
            getRetrievalStatistics(
                results
            ),

        resultCount:
            results.length

    };

};


//Retrieve Category Knowledge

const retrieveCategoryKnowledge = async ({
    query,
    category,
    topK = DEFAULT_TOP_K,
    candidateK,
    minScore = DEFAULT_MIN_SCORE,
    maxContextChunks = DEFAULT_MAX_CONTEXT_CHUNKS
} = {}) => {

    validateQuery(
        query
    );


    if (
        !category
    ) {

        throw new Error(
            "category is required for category knowledge retrieval."
        );

    }


    if (
        !KNOWLEDGE_CATEGORIES.includes(
            String(
                category
            ).toLowerCase()
        )
    ) {

        throw new Error(
            `Unsupported knowledge category: ${category}`
        );

    }


    let results =
        await retrieveByCategory({

            query,

            category,

            topK,

            candidateK,

            minScore

        });


    results =
        removeWeakResults(
            results,
            minScore
        );


    results =
        removeDuplicateKnowledge(
            results
        );


    results =
        limitContextResults(
            results,
            maxContextChunks
        );


    return {

        query,

        category,

        results,

        context:
            buildRetrievalContext(
                results
            ),

        statistics:
            getRetrievalStatistics(
                results
            ),

        resultCount:
            results.length

    };

};


//Retrieve Career + Student Context

//Used for personalized career recommendations.

const retrievePersonalizedCareerKnowledge = async ({
    query,
    studentContext = {},
    topK = DEFAULT_TOP_K,
    candidateK,
    minScore = DEFAULT_MIN_SCORE,
    maxContextChunks = DEFAULT_MAX_CONTEXT_CHUNKS
} = {}) => {

    validateQuery(
        query
    );


    const context =
        normalizeStudentContext(
            studentContext
        );


    const filters =
        buildStudentContextFilters(
            context
        );


    let results =
        await hybridRetrieve({

            query,

            topK,

            candidateK,

            minScore,

            filters

        });


    results =
        removeWeakResults(
            results,
            minScore
        );


    results =
        removeDuplicateKnowledge(
            results
        );


    results =
        limitContextResults(
            results,
            maxContextChunks
        );


    return {

        query,

        studentContext:
            context,

        results,

        context:
            buildRetrievalContext(
                results
            ),

        statistics:
            getRetrievalStatistics(
                results
            ),

        resultCount:
            results.length

    };

};


//Retrieve Knowledge For Chat

//General-purpose retrieval function for the chatbot.

const retrieveChatKnowledge = async ({
    query,
    studentContext = {},
    topK = DEFAULT_TOP_K,
    candidateK,
    minScore = DEFAULT_MIN_SCORE,
    maxContextChunks = DEFAULT_MAX_CONTEXT_CHUNKS
} = {}) => {

    validateQuery(
        query
    );


    return await retrieveKnowledge({

        query,

        topK,

        candidateK,

        minScore,

        studentContext,

        maxContextChunks

    });

};


//Retrieve Knowledge For Roadmap

const retrieveRoadmapKnowledge = async ({
    query,
    careerId,
    degreeId,
    topK = DEFAULT_TOP_K,
    candidateK,
    minScore = DEFAULT_MIN_SCORE,
    maxContextChunks = DEFAULT_MAX_CONTEXT_CHUNKS
} = {}) => {

    validateQuery(
        query
    );


    const filters = {

        category:
            "roadmap"

    };


    if (
        careerId
    ) {

        filters.careerId =
            careerId;

    }


    if (
        degreeId
    ) {

        filters.degreeId =
            degreeId;

    }


    let results =
        await hybridRetrieve({

            query,

            topK,

            candidateK,

            minScore,

            filters

        });


    results =
        removeWeakResults(
            results,
            minScore
        );


    results =
        removeDuplicateKnowledge(
            results
        );


    results =
        limitContextResults(
            results,
            maxContextChunks
        );


    return {

        query,

        careerId:
            careerId || null,

        degreeId:
            degreeId || null,

        results,

        context:
            buildRetrievalContext(
                results
            ),

        statistics:
            getRetrievalStatistics(
                results
            ),

        resultCount:
            results.length

    };

};


//Retrieve Knowledge For Skill Gap

const retrieveSkillGapKnowledge = async ({
    query,
    careerId,
    skillId,
    topK = DEFAULT_TOP_K,
    candidateK,
    minScore = DEFAULT_MIN_SCORE,
    maxContextChunks = DEFAULT_MAX_CONTEXT_CHUNKS
} = {}) => {

    validateQuery(
        query
    );


    const filters = {

        category:
            "skill"

    };


    if (
        careerId
    ) {

        filters.careerId =
            careerId;

    }


    if (
        skillId
    ) {

        filters.skillId =
            skillId;

    }


    let results =
        await hybridRetrieve({

            query,

            topK,

            candidateK,

            minScore,

            filters

        });


    results =
        removeWeakResults(
            results,
            minScore
        );


    results =
        removeDuplicateKnowledge(
            results
        );


    results =
        limitContextResults(
            results,
            maxContextChunks
        );


    return {

        query,

        careerId:
            careerId || null,

        skillId:
            skillId || null,

        results,

        context:
            buildRetrievalContext(
                results
            ),

        statistics:
            getRetrievalStatistics(
                results
            ),

        resultCount:
            results.length

    };

};


//Retrieve Project Knowledge

const retrieveProjectKnowledge = async ({
    query,
    careerId,
    topK = DEFAULT_TOP_K,
    candidateK,
    minScore = DEFAULT_MIN_SCORE,
    maxContextChunks = DEFAULT_MAX_CONTEXT_CHUNKS
} = {}) => {

    validateQuery(
        query
    );


    const filters = {

        category:
            "project"

    };


    if (
        careerId
    ) {

        filters.careerId =
            careerId;

    }


    let results =
        await hybridRetrieve({

            query,

            topK,

            candidateK,

            minScore,

            filters

        });


    results =
        removeWeakResults(
            results,
            minScore
        );


    results =
        removeDuplicateKnowledge(
            results
        );


    results =
        limitContextResults(
            results,
            maxContextChunks
        );


    return {

        query,

        careerId:
            careerId || null,

        results,

        context:
            buildRetrievalContext(
                results
            ),

        statistics:
            getRetrievalStatistics(
                results
            ),

        resultCount:
            results.length

    };

};


//Retrieve Certification Knowledge

const retrieveCertificationKnowledge = async ({
    query,
    careerId,
    topK = DEFAULT_TOP_K,
    candidateK,
    minScore = DEFAULT_MIN_SCORE,
    maxContextChunks = DEFAULT_MAX_CONTEXT_CHUNKS
} = {}) => {

    validateQuery(
        query
    );


    const filters = {

        category:
            "certification"

    };


    if (
        careerId
    ) {

        filters.careerId =
            careerId;

    }


    let results =
        await hybridRetrieve({

            query,

            topK,

            candidateK,

            minScore,

            filters

        });


    results =
        removeWeakResults(
            results,
            minScore
        );


    results =
        removeDuplicateKnowledge(
            results
        );


    results =
        limitContextResults(
            results,
            maxContextChunks
        );


    return {

        query,

        careerId:
            careerId || null,

        results,

        context:
            buildRetrievalContext(
                results
            ),

        statistics:
            getRetrievalStatistics(
                results
            ),

        resultCount:
            results.length

    };

};


//Create Compact Context

//Useful when Gemini prompt token usage needs to be minimized.

const createCompactContext = (
    results = []
) => {

    return results

        .map(
            (
                result,
                index
            ) => {

                const text =
                    result.text ||
                    "";


                return `[${index + 1}] ${text}`;

            }
        )

        .join(
            "\n\n"
        );

};


//Get Retrieval Summary

const getRetrievalSummary = (
    retrievalResult
) => {

    if (
        !retrievalResult
    ) {

        return {

            resultCount: 0,

            hasKnowledge: false,

            averageScore: 0

        };

    }


    const results =
        retrievalResult.results || [];


    const statistics =
        retrievalResult.statistics ||
        getRetrievalStatistics(
            results
        );


    return {

        resultCount:
            results.length,

        hasKnowledge:
            results.length > 0,

        averageScore:
            statistics.averageScore || 0,

        highestScore:
            statistics.highestScore || 0,

        lowestScore:
            statistics.lowestScore || 0

    };

};


//Check Retrieval Quality

const hasSufficientKnowledge = (
    retrievalResult,
    {
        minimumResults = 1,
        minimumAverageScore = DEFAULT_MIN_SCORE
    } = {}
) => {

    if (
        !retrievalResult
    ) {

        return false;

    }


    const results =
        retrievalResult.results || [];


    if (
        results.length <
        minimumResults
    ) {

        return false;

    }


    const statistics =
        retrievalResult.statistics ||
        getRetrievalStatistics(
            results
        );


    return (
        statistics.averageScore >=
        minimumAverageScore
    );

};


//Get Configuration

const getKnowledgeRetrieverConfiguration = () => {

    return {

        defaultTopK:
            DEFAULT_TOP_K,

        defaultMinScore:
            DEFAULT_MIN_SCORE,

        defaultMaxContextChunks:
            DEFAULT_MAX_CONTEXT_CHUNKS,

        supportedCategories:
            KNOWLEDGE_CATEGORIES

    };

};


//Export


module.exports = {

    DEFAULT_TOP_K,

    DEFAULT_MIN_SCORE,

    DEFAULT_MAX_CONTEXT_CHUNKS,

    KNOWLEDGE_CATEGORIES,

    validateQuery,

    validateRetrievalOptions,

    normalizeStudentContext,

    buildStudentContextFilters,

    removeWeakResults,

    removeDuplicateKnowledge,

    limitContextResults,

    retrieveKnowledge,

    retrieveCareerKnowledge,

    retrieveSkillKnowledge,

    retrieveDegreeKnowledge,

    retrieveCategoryKnowledge,

    retrievePersonalizedCareerKnowledge,

    retrieveChatKnowledge,

    retrieveRoadmapKnowledge,

    retrieveSkillGapKnowledge,

    retrieveProjectKnowledge,

    retrieveCertificationKnowledge,

    createCompactContext,

    getRetrievalSummary,

    hasSufficientKnowledge,

    getKnowledgeRetrieverConfiguration

};