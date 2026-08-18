/*
| Vector Search Service
|
| Responsible for:
|
| 1. Storing document chunks and embeddings
| 2. Searching vectors by similarity
| 3. Deleting document vectors
| 4. Updating document vectors
| 5. Managing vector metadata
|
| RAG flow:
|
| Knowledge Document
|       ↓
| documentProcessor.js
|       ↓
| textChunker.js
|       ↓
| embeddingService.js
|       ↓
| vectorSearchService.js
|       ↓
| Vector Database
*/


const {
    getVectorDatabase
} = require("../../shared/config/vectorDatabase");


//Configuration

const DEFAULT_TOP_K =
    Number(
        process.env.VECTOR_SEARCH_TOP_K
    ) || 5;


const MAX_TOP_K =
    Number(
        process.env.VECTOR_SEARCH_MAX_TOP_K
    ) || 50;


const DEFAULT_MIN_SCORE =
    Number(
        process.env.VECTOR_SEARCH_MIN_SCORE
    ) || 0.30;


//Get Vector Database

const getDatabase = () => {

    if (
        typeof getVectorDatabase ===
        "function"
    ) {

        return getVectorDatabase();

    }


    throw new Error(
        "Vector database is not configured."
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
            "Embedding must be an array."
        );

    }


    if (
        embedding.length === 0
    ) {

        throw new Error(
            "Embedding cannot be empty."
        );

    }


    const invalid =
        embedding.some(
            (value) =>
                typeof value !== "number" ||
                !Number.isFinite(value)
        );


    if (
        invalid
    ) {

        throw new Error(
            "Embedding contains invalid values."
        );

    }


    return true;

};


//Validate Document ID

const validateDocumentId = (
    documentId
) => {

    if (
        documentId === null ||
        documentId === undefined ||
        String(documentId).trim() === ""
    ) {

        throw new Error(
            "Document ID is required."
        );

    }


    return true;

};


//Validate Chunk

const validateChunk = (
    chunk
) => {

    if (
        !chunk
    ) {

        throw new Error(
            "Chunk is required."
        );

    }


    if (
        !chunk.text ||
        !String(chunk.text).trim()
    ) {

        throw new Error(
            "Chunk text is required."
        );

    }


    if (
        !chunk.embedding
    ) {

        throw new Error(
            "Chunk embedding is required."
        );

    }


    validateEmbedding(
        chunk.embedding
    );


    return true;

};


//Validate Vector Records

const validateVectorRecords = (
    records
) => {

    if (
        !Array.isArray(records)
    ) {

        throw new Error(
            "Vector records must be an array."
        );

    }


    if (
        records.length === 0
    ) {

        throw new Error(
            "At least one vector record is required."
        );

    }


    records.forEach(
        (record, index) => {

            try {

                validateChunk(
                    record
                );

            } catch (error) {

                throw new Error(
                    `Invalid vector record at index ${index}: ${error.message}`
                );

            }

        }
    );


    return true;

};


//Normalize Vector Record

const normalizeVectorRecord = (
    record
) => {

    validateChunk(
        record
    );


    return {

        id:
            record.id ||
            `${record.documentId || "document"}-${record.chunkIndex ?? 0}`,

        documentId:
            record.documentId ||
            null,

        chunkIndex:
            record.chunkIndex ?? 0,

        text:
            String(
                record.text
            ).trim(),

        embedding:
            record.embedding,

        metadata:
            record.metadata || {}

    };

};


//Normalize Search Result

const normalizeSearchResult = (
    result
) => {

    if (!result) {
        return null;
    }


    //Different vector databases use different property names.

    const score =
        result.score ??
        result.similarity ??
        result.distance ??
        null;


    return {

        id:
            result.id ||
            result._id ||
            null,

        score,

        similarity:
            result.similarity ??
            score,

        distance:
            result.distance ??
            null,

        documentId:
            result.documentId ||
            result.metadata?.documentId ||
            null,

        chunkIndex:
            result.chunkIndex ??
            result.metadata?.chunkIndex ??
            null,

        text:
            result.text ||
            result.metadata?.text ||
            "",

        metadata:
            result.metadata ||
            {}

    };

};


//Insert Single Vector

const insertVector = async (
    record
) => {

    const normalizedRecord =
        normalizeVectorRecord(
            record
        );


    const vectorDatabase =
        getDatabase();


    //Supported adapter methods

    if (
        typeof vectorDatabase.insert ===
        "function"
    ) {

        return await vectorDatabase.insert(
            normalizedRecord
        );

    }


    if (
        typeof vectorDatabase.upsert ===
        "function"
    ) {

        return await vectorDatabase.upsert(
            [normalizedRecord]
        );

    }


    if (
        typeof vectorDatabase.add ===
        "function"
    ) {

        return await vectorDatabase.add(
            normalizedRecord
        );

    }


    throw new Error(
        "Vector database does not support insert/upsert operations."
    );

};


//Insert Multiple Vectors

const insertVectors = async (
    records
) => {

    validateVectorRecords(
        records
    );


    const normalizedRecords =
        records.map(
            normalizeVectorRecord
        );


    const vectorDatabase =
        getDatabase();


    //Preferred: bulk upsert

    if (
        typeof vectorDatabase.upsert ===
        "function"
    ) {

        return await vectorDatabase.upsert(
            normalizedRecords
        );

    }


    //Bulk insert

    if (
        typeof vectorDatabase.insertMany ===
        "function"
    ) {

        return await vectorDatabase.insertMany(
            normalizedRecords
        );

    }


    //Bulk add

    if (
        typeof vectorDatabase.addMany ===
        "function"
    ) {

        return await vectorDatabase.addMany(
            normalizedRecords
        );

    }


    //Fallback: insert one by one

    if (
        typeof vectorDatabase.insert ===
        "function"
    ) {

        const results = [];


        for (
            const record of normalizedRecords
        ) {

            const result =
                await vectorDatabase.insert(
                    record
                );


            results.push(
                result
            );

        }


        return results;

    }


    throw new Error(
        "Vector database does not support bulk insert/upsert operations."
    );

};


//Store Document Chunks

const storeDocumentChunks = async ({
    documentId,
    chunks = [],
    metadata = {}
} = {}) => {

    validateDocumentId(
        documentId
    );


    if (
        !Array.isArray(chunks) ||
        chunks.length === 0
    ) {

        throw new Error(
            "Document chunks are required."
        );

    }


    const records =
        chunks.map(
            (
                chunk,
                index
            ) => {

                const embedding =
                    chunk.embedding;


                validateEmbedding(
                    embedding
                );


                return {

                    id:
                        chunk.id ||
                        `${documentId}-${chunk.chunkIndex ?? index}`,

                    documentId,

                    chunkIndex:
                        chunk.chunkIndex ??
                        index,

                    text:
                        chunk.text,

                    embedding,

                    metadata: {

                        ...metadata,

                        ...(chunk.metadata || {}),

                        documentId,

                        chunkIndex:
                            chunk.chunkIndex ??
                            index

                    }

                };

            }
        );


    return await insertVectors(
        records
    );

};


//Search Similar Vectors

const searchSimilarVectors = async ({
    embedding,
    topK = DEFAULT_TOP_K,
    minScore = DEFAULT_MIN_SCORE,
    filter = {},
    includeMetadata = true
} = {}) => {

    validateEmbedding(
        embedding
    );


    const validatedTopK =
        Math.min(
            Math.max(
                Number(topK) || DEFAULT_TOP_K,
                1
            ),
            MAX_TOP_K
        );


    const vectorDatabase =
        getDatabase();


    let results;


    //Generic search method

    if (
        typeof vectorDatabase.search ===
        "function"
    ) {

        results =
            await vectorDatabase.search({

                vector:
                    embedding,

                embedding,

                topK:
                    validatedTopK,

                limit:
                    validatedTopK,

                minScore,

                filter,

                includeMetadata

            });

    }


    //Query method

    else if (
        typeof vectorDatabase.query ===
        "function"
    ) {

        results =
            await vectorDatabase.query({

                vector:
                    embedding,

                topK:
                    validatedTopK,

                limit:
                    validatedTopK,

                filter,

                includeMetadata

            });

    }


    else {

        throw new Error(
            "Vector database does not support search/query operations."
        );

    }


    //Normalize result structure

    const rawResults =
        Array.isArray(results)
            ? results
            : (
                results?.matches ||
                results?.results ||
                results?.data ||
                []
            );


    return rawResults

        .map(
            normalizeSearchResult
        )

        .filter(
            (result) => {

                if (
                    result === null
                ) {

                    return false;

                }


                if (
                    result.score === null ||
                    result.score === undefined
                ) {

                    return true;

                }


                return (
                    Number(
                        result.score
                    ) >= minScore
                );

            }
        )

        .slice(
            0,
            validatedTopK
        );

};


//Search By Document

const searchDocumentVectors = async ({
    embedding,
    documentId,
    topK = DEFAULT_TOP_K,
    minScore = DEFAULT_MIN_SCORE
} = {}) => {

    validateDocumentId(
        documentId
    );


    return await searchSimilarVectors({

        embedding,

        topK,

        minScore,

        filter: {
            documentId
        }

    });

};


//Delete Vector

const deleteVector = async (
    vectorId
) => {

    if (
        !vectorId
    ) {

        throw new Error(
            "Vector ID is required."
        );

    }


    const vectorDatabase =
        getDatabase();


    if (
        typeof vectorDatabase.delete ===
        "function"
    ) {

        return await vectorDatabase.delete(
            vectorId
        );

    }


    if (
        typeof vectorDatabase.remove ===
        "function"
    ) {

        return await vectorDatabase.remove(
            vectorId
        );

    }


    throw new Error(
        "Vector database does not support delete operations."
    );

};


//Delete Document Vectors

const deleteDocumentVectors = async (
    documentId
) => {

    validateDocumentId(
        documentId
    );


    const vectorDatabase =
        getDatabase();


    //Preferred delete-by-filter operation

    if (
        typeof vectorDatabase.deleteByFilter ===
        "function"
    ) {

        return await vectorDatabase.deleteByFilter({

            documentId

        });

    }


    //Generic delete operation

    if (
        typeof vectorDatabase.delete ===
        "function"
    ) {

        return await vectorDatabase.delete({

            filter: {
                documentId
            }

        });

    }


    if (
        typeof vectorDatabase.remove ===
        "function"
    ) {

        return await vectorDatabase.remove({

            filter: {
                documentId
            }

        });

    }


    throw new Error(
        "Vector database does not support document deletion."
    );

};


//Update Document Vectors

const updateDocumentVectors = async ({
    documentId,
    chunks = [],
    metadata = {}
} = {}) => {

    validateDocumentId(
        documentId
    );


    //Remove old vectors

    await deleteDocumentVectors(
        documentId
    );


    //Insert new vectors

    return await storeDocumentChunks({

        documentId,

        chunks,

        metadata

    });

};


//Get Document Vector Count

const getDocumentVectorCount = async (
    documentId
) => {

    validateDocumentId(
        documentId
    );


    const vectorDatabase =
        getDatabase();


    if (
        typeof vectorDatabase.count ===
        "function"
    ) {

        return await vectorDatabase.count({

            filter: {
                documentId
            }

        });

    }


    if (
        typeof vectorDatabase.countByFilter ===
        "function"
    ) {

        return await vectorDatabase.countByFilter({

            documentId

        });

    }


    //If the database doesn't support counting, return null rather than
    //pretending that the count is zero.

    return null;

};


//Check Vector Database Health

const checkVectorDatabaseHealth = async () => {

    try {

        const vectorDatabase =
            getDatabase();


        if (
            typeof vectorDatabase.healthCheck ===
            "function"
        ) {

            const result =
                await vectorDatabase.healthCheck();


            return {

                healthy: true,

                details:
                    result

            };

        }


        if (
            typeof vectorDatabase.ping ===
            "function"
        ) {

            await vectorDatabase.ping();


            return {

                healthy: true

            };

        }


        return {

            healthy: true,

            message:
                "Vector database adapter is available."

        };

    } catch (error) {

        return {

            healthy: false,

            error:
                error.message

        };

    }

};


//Get Search Configuration

const getSearchConfiguration = () => {

    return {

        defaultTopK:
            DEFAULT_TOP_K,

        maxTopK:
            MAX_TOP_K,

        defaultMinScore:
            DEFAULT_MIN_SCORE

    };

};


//Export

module.exports = {

    DEFAULT_TOP_K,

    MAX_TOP_K,

    DEFAULT_MIN_SCORE,

    getDatabase,

    validateEmbedding,

    validateDocumentId,

    validateChunk,

    validateVectorRecords,

    normalizeVectorRecord,

    normalizeSearchResult,

    insertVector,

    insertVectors,

    storeDocumentChunks,

    searchSimilarVectors,

    searchDocumentVectors,

    deleteVector,

    deleteDocumentVectors,

    updateDocumentVectors,

    getDocumentVectorCount,

    checkVectorDatabaseHealth,

    getSearchConfiguration

};