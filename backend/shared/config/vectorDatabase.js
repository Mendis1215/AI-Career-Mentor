const { Pinecone } = require("@pinecone-database/pinecone");
const env = require("./env");


//Vector Database Configuration

const VECTOR_DB_CONFIG = {

    provider:
        env.VECTOR_DB_PROVIDER ||
        "pinecone",

    apiKey:
        env.PINECONE_API_KEY,

    indexName:
        env.PINECONE_INDEX_NAME,

    namespace:
        env.PINECONE_NAMESPACE ||
        "career-mentor",

    dimension:
        Number(env.PINECONE_DIMENSION) ||
        768,

    metric:
        env.PINECONE_METRIC ||
        "cosine"

};


//Validate Vector Database Configuration

const validateVectorDatabaseConfig = () => {

    if (
        VECTOR_DB_CONFIG.provider !== "pinecone"
    ) {
        throw new Error(
            `Unsupported vector database provider: ${VECTOR_DB_CONFIG.provider}`
        );
    }

    if (!VECTOR_DB_CONFIG.apiKey) {
        throw new Error(
            "PINECONE_API_KEY is not configured."
        );
    }

    if (!VECTOR_DB_CONFIG.indexName) {
        throw new Error(
            "PINECONE_INDEX_NAME is not configured."
        );
    }

};


//Create Pinecone Client

const createPineconeClient = () => {

    validateVectorDatabaseConfig();

    return new Pinecone({
        apiKey:
            VECTOR_DB_CONFIG.apiKey
    });

};


//Get Pinecone Index

const getPineconeIndex = () => {

    const client =
        createPineconeClient();

    return client.index(
        VECTOR_DB_CONFIG.indexName
    );

};


//Get Pinecone Namespace

const getPineconeNamespace = () => {

    const index =
        getPineconeIndex();

    return index.namespace(
        VECTOR_DB_CONFIG.namespace
    );

};


//Get Vector Database Configuration

//Returns safe configuration information.
//The API key is never returned.


const getVectorDatabaseConfig = () => {

    return {

        provider:
            VECTOR_DB_CONFIG.provider,

        indexName:
            VECTOR_DB_CONFIG.indexName,

        namespace:
            VECTOR_DB_CONFIG.namespace,

        dimension:
            VECTOR_DB_CONFIG.dimension,

        metric:
            VECTOR_DB_CONFIG.metric,

        hasApiKey:
            Boolean(
                VECTOR_DB_CONFIG.apiKey
            )

    };

};


//Export

module.exports = {

    VECTOR_DB_CONFIG,

    validateVectorDatabaseConfig,

    createPineconeClient,

    getPineconeIndex,

    getPineconeNamespace,

    getVectorDatabaseConfig

};