/*
| Document Processor
|
| Main coordinator for processing knowledge-base documents.
|
| Responsibilities:
|
| 1. Validate document information
| 2. Extract text from the document
| 3. Clean the extracted text
| 4. Split text into chunks
| 5. Generate embeddings
| 6. Prepare vector records
| 7. Store processing metadata
|
| This module does NOT directly implement:
|
| - Text extraction
| - Text chunking
| - Embedding generation
| - Vector searching
|
| Those responsibilities belong to:
|
| - textExtractor.js
| - textChunker.js
| - embeddingService.js
| - vectorSearchService.js
*/


const path = require("path");

const textExtractor = require("./textExtractor");
const textChunker = require("./textChunker");
const embeddingService = require("./embeddingService");


//Constants

const SUPPORTED_DOCUMENT_TYPES = [
    "pdf",
    "doc",
    "docx",
    "txt",
    "md",
    "markdown"
];

const DEFAULT_CHUNK_SIZE = 1000;

const DEFAULT_CHUNK_OVERLAP = 150;


//Validate Document

const validateDocument = (document) => {

    if (!document) {
        throw new Error(
            "Document information is required."
        );
    }


    if (!document.filePath && !document.path) {
        throw new Error(
            "Document file path is required."
        );
    }


    return true;
};


//Get File Path

const getFilePath = (document) => {

    return document.filePath || document.path;

};


//Get File Extension

const getFileExtension = (filePath) => {

    const extension = path
        .extname(filePath)
        .toLowerCase()
        .replace(".", "");

    return extension;

};


//Validate File Type

const validateFileType = (filePath) => {

    const extension =
        getFileExtension(filePath);


    if (
        !SUPPORTED_DOCUMENT_TYPES.includes(
            extension
        )
    ) {

        throw new Error(
            `Unsupported document type: ${extension || "unknown"}`
        );

    }


    return extension;

};


//Clean Extracted Text

const cleanText = (text) => {

    if (!text) {
        return "";
    }


    return String(text)

        // Normalize line endings
        .replace(/\r\n/g, "\n")

        .replace(/\r/g, "\n")

        // Remove excessive spaces
        .replace(/[ \t]+/g, " ")

        // Remove excessive blank lines
        .replace(/\n{3,}/g, "\n\n")

        // Remove spaces around line breaks
        .replace(/ *\n */g, "\n")

        .trim();

};


//Validate Extracted Text

const validateExtractedText = (text) => {

    if (!text || !text.trim()) {

        throw new Error(
            "No readable text could be extracted from the document."
        );

    }


    return true;

};


//Extract Document Text

const extractDocumentText = async (document) => {

    validateDocument(document);


    const filePath =
        getFilePath(document);


    const fileType =
        validateFileType(filePath);


    let extractedText;


    //Use Text Extractor

    if (
        typeof textExtractor.extractText ===
        "function"
    ) {

        extractedText =
            await textExtractor.extractText(
                filePath,
                fileType
            );

    }

    else if (
        typeof textExtractor.extractTextFromFile ===
        "function"
    ) {

        extractedText =
            await textExtractor.extractTextFromFile(
                filePath,
                fileType
            );

    }

    else {

        throw new Error(
            "Text extractor does not expose a supported extraction function."
        );

    }


    const cleanedText =
        cleanText(
            extractedText
        );


    validateExtractedText(
        cleanedText
    );


    return {
        text: cleanedText,
        filePath,
        fileType,
        characterCount: cleanedText.length
    };

};


//Create Text Chunks

const createChunks = async ({
    text,
    chunkSize = DEFAULT_CHUNK_SIZE,
    chunkOverlap = DEFAULT_CHUNK_OVERLAP,
    metadata = {}
} = {}) => {

    if (!text) {

        throw new Error(
            "Text is required for chunking."
        );

    }


    if (
        typeof textChunker.chunkText ===
        "function"
    ) {

        return await textChunker.chunkText(
            text,
            {
                chunkSize,
                chunkOverlap,
                metadata
            }
        );

    }


    if (
        typeof textChunker.createChunks ===
        "function"
    ) {

        return await textChunker.createChunks(
            text,
            {
                chunkSize,
                chunkOverlap,
                metadata
            }
        );

    }


    throw new Error(
        "Text chunker does not expose a supported chunking function."
    );

};


//Normalize Chunks

const normalizeChunks = (
    chunks,
    documentMetadata = {}
) => {

    if (!Array.isArray(chunks)) {
        return [];
    }


    return chunks
        .map((chunk, index) => {

            //Support both:
            //"text"
            //and:
            //{ text: "...", metadata: {...} }

            if (
                typeof chunk === "string"
            ) {

                return {

                    chunkIndex: index,

                    text: chunk.trim(),

                    metadata: {
                        ...documentMetadata
                    }

                };

            }


            return {

                chunkIndex:
                    chunk.chunkIndex ??
                    index,

                text:
                    String(
                        chunk.text || ""
                    ).trim(),

                metadata: {

                    ...documentMetadata,

                    ...(chunk.metadata || {})

                }

            };

        })

        .filter(
            (chunk) =>
                chunk.text.length > 0
        );

};


//Generate Chunk Embeddings

const generateEmbeddings = async (
    chunks
) => {

    if (
        !Array.isArray(chunks) ||
        chunks.length === 0
    ) {

        return [];

    }


    //Batch embedding function

    if (
        typeof embeddingService.generateEmbeddings ===
        "function"
    ) {

        return await embeddingService.generateEmbeddings(
            chunks.map(
                (chunk) =>
                    chunk.text
            )
        );

    }


    //Single embedding function

    if (
        typeof embeddingService.generateEmbedding ===
        "function"
    ) {

        const embeddings = [];


        for (
            const chunk of chunks
        ) {

            const embedding =
                await embeddingService.generateEmbedding(
                    chunk.text
                );


            embeddings.push(
                embedding
            );

        }


        return embeddings;

    }


    throw new Error(
        "Embedding service does not expose a supported embedding function."
    );

};


//Attach Embeddings

const attachEmbeddings = (
    chunks,
    embeddings
) => {

    return chunks.map(
        (chunk, index) => ({

            ...chunk,

            embedding:
                embeddings[index] || null

        })
    );

};


//Create Vector Records

const createVectorRecords = ({
    chunks,
    documentId,
    documentMetadata = {}
} = {}) => {

    return chunks.map(
        (chunk, index) => ({

            documentId,

            chunkIndex:
                chunk.chunkIndex ?? index,

            text:
                chunk.text,

            embedding:
                chunk.embedding,

            metadata: {

                ...documentMetadata,

                ...(chunk.metadata || {}),

                documentId,

                chunkIndex:
                    chunk.chunkIndex ?? index

            }

        })
    );

};


//Process Document

const processDocument = async ({
    document,
    documentId = null,
    metadata = {},
    chunkSize = DEFAULT_CHUNK_SIZE,
    chunkOverlap = DEFAULT_CHUNK_OVERLAP,
    generateEmbedding = true
} = {}) => {

    //Step 1: Validate

    validateDocument(
        document
    );


    //Step 2: Extract text

    const extraction =
        await extractDocumentText(
            document
        );


    //Step 3: Prepare metadata

    const documentMetadata = {

        ...metadata,

        fileName:
            document.fileName ||
            path.basename(
                extraction.filePath
            ),

        fileType:
            extraction.fileType,

        source:
            document.source ||
            metadata.source ||
            "knowledge-base"

    };


    //Step 4: Chunk text

    const rawChunks =
        await createChunks({

            text:
                extraction.text,

            chunkSize,

            chunkOverlap,

            metadata:
                documentMetadata

        });


    //Step 5: Normalize chunks

    const chunks =
        normalizeChunks(
            rawChunks,
            documentMetadata
        );


    if (chunks.length === 0) {

        throw new Error(
            "Document produced no usable text chunks."
        );

    }


    //Step 6: Generate embeddings

    let processedChunks =
        chunks;


    if (generateEmbedding) {

        const embeddings =
            await generateEmbeddings(
                chunks
            );


        processedChunks =
            attachEmbeddings(
                chunks,
                embeddings
            );

    }


    //Step 7: Create vector records

    const vectorRecords =
        createVectorRecords({

            chunks:
                processedChunks,

            documentId,

            documentMetadata

        });


    //Return processed document

    return {

        documentId,

        filePath:
            extraction.filePath,

        fileType:
            extraction.fileType,

        text:
            extraction.text,

        characterCount:
            extraction.characterCount,

        chunkCount:
            processedChunks.length,

        chunks:
            processedChunks,

        vectorRecords,

        metadata:
            documentMetadata

    };

};


/*
| Process Text Directly
|
| Useful when the knowledge document text is already available,
| for example:
|
| - CMS text
| - Database content
| - Admin-entered knowledge
| - Existing extracted text
*/

const processText = async ({
    text,
    documentId = null,
    metadata = {},
    chunkSize = DEFAULT_CHUNK_SIZE,
    chunkOverlap = DEFAULT_CHUNK_OVERLAP,
    generateEmbedding = true
} = {}) => {

    const cleanedText =
        cleanText(
            text
        );


    validateExtractedText(
        cleanedText
    );


    //Create chunks

    const rawChunks =
        await createChunks({

            text:
                cleanedText,

            chunkSize,

            chunkOverlap,

            metadata

        });


    //Normalize chunks

    const chunks =
        normalizeChunks(
            rawChunks,
            metadata
        );


    if (chunks.length === 0) {

        throw new Error(
            "Text produced no usable chunks."
        );

    }


    //Generate embeddings

    let processedChunks =
        chunks;


    if (generateEmbedding) {

        const embeddings =
            await generateEmbeddings(
                chunks
            );


        processedChunks =
            attachEmbeddings(
                chunks,
                embeddings
            );

    }


    //Create vector records

    const vectorRecords =
        createVectorRecords({

            chunks:
                processedChunks,

            documentId,

            documentMetadata:
                metadata

        });


    return {

        documentId,

        text:
            cleanedText,

        characterCount:
            cleanedText.length,

        chunkCount:
            processedChunks.length,

        chunks:
            processedChunks,

        vectorRecords,

        metadata

    };

};


//Get Processing Statistics

const getProcessingStatistics = (
    processedDocument
) => {

    if (!processedDocument) {

        return {

            characterCount: 0,

            chunkCount: 0,

            embeddedChunkCount: 0

        };

    }


    const chunks =
        processedDocument.chunks || [];


    const embeddedChunkCount =
        chunks.filter(
            (chunk) =>
                Array.isArray(
                    chunk.embedding
                ) &&
                chunk.embedding.length > 0
        ).length;


    return {

        characterCount:
            processedDocument.characterCount ||
            0,

        chunkCount:
            chunks.length,

        embeddedChunkCount

    };

};


//Export

module.exports = {

    SUPPORTED_DOCUMENT_TYPES,

    DEFAULT_CHUNK_SIZE,

    DEFAULT_CHUNK_OVERLAP,

    validateDocument,

    getFilePath,

    getFileExtension,

    validateFileType,

    cleanText,

    validateExtractedText,

    extractDocumentText,

    createChunks,

    normalizeChunks,

    generateEmbeddings,

    attachEmbeddings,

    createVectorRecords,

    processDocument,

    processText,

    getProcessingStatistics

};