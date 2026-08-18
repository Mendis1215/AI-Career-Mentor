/*
| Text Chunker
|
| Responsible for splitting extracted knowledge-base text into
| manageable overlapping chunks for the RAG pipeline.
|
| Flow:
|
| Document
|    ↓
| textExtractor.js
|    ↓
| Clean Text
|    ↓
| textChunker.js
|    ↓
| Text Chunks
|    ↓
| embeddingService.js
*/

const DEFAULT_CHUNK_SIZE = 1000;

const DEFAULT_CHUNK_OVERLAP = 150;

const MIN_CHUNK_SIZE = 100;

const MAX_CHUNK_SIZE = 10000;


//Validate Chunk Configuration

const validateChunkConfiguration = ({
    chunkSize = DEFAULT_CHUNK_SIZE,
    chunkOverlap = DEFAULT_CHUNK_OVERLAP
} = {}) => {

    if (
        !Number.isInteger(chunkSize) ||
        chunkSize <= 0
    ) {

        throw new Error(
            "chunkSize must be a positive integer."
        );

    }


    if (
        chunkSize < MIN_CHUNK_SIZE
    ) {

        throw new Error(
            `chunkSize must be at least ${MIN_CHUNK_SIZE} characters.`
        );

    }


    if (
        chunkSize > MAX_CHUNK_SIZE
    ) {

        throw new Error(
            `chunkSize cannot exceed ${MAX_CHUNK_SIZE} characters.`
        );

    }


    if (
        !Number.isInteger(chunkOverlap) ||
        chunkOverlap < 0
    ) {

        throw new Error(
            "chunkOverlap must be a non-negative integer."
        );

    }


    if (
        chunkOverlap >= chunkSize
    ) {

        throw new Error(
            "chunkOverlap must be smaller than chunkSize."
        );

    }


    return true;

};


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


    return String(text)

        // Normalize line endings
        .replace(/\r\n/g, "\n")

        .replace(/\r/g, "\n")

        // Normalize non-breaking spaces
        .replace(/\u00A0/g, " ")

        // Remove excessive spaces
        .replace(/[ \t]+/g, " ")

        // Remove excessive empty lines
        .replace(/\n{3,}/g, "\n\n")

        .trim();

};


//Validate Text

const validateText = (
    text
) => {

    if (
        !text ||
        !String(text).trim()
    ) {

        throw new Error(
            "Text is required for chunking."
        );

    }


    return true;

};


//Split Into Paragraphs

const splitIntoParagraphs = (
    text
) => {

    return text
        .split(/\n\s*\n/)
        .map(
            (paragraph) =>
                paragraph.trim()
        )
        .filter(
            (paragraph) =>
                paragraph.length > 0
        );

};


//Split Long Paragraph

const splitLongParagraph = (
    paragraph,
    chunkSize
) => {

    const words =
        paragraph.split(/\s+/);


    const chunks = [];

    let currentChunk = "";


    for (
        const word of words
    ) {

        //Handle extremely long individual words

        if (
            word.length > chunkSize
        ) {

            if (currentChunk) {

                chunks.push(
                    currentChunk.trim()
                );

                currentChunk = "";

            }


            let start = 0;


            while (
                start < word.length
            ) {

                chunks.push(
                    word.substring(
                        start,
                        start + chunkSize
                    )
                );

                start += chunkSize;

            }


            continue;

        }


        const candidate =
            currentChunk
                ? `${currentChunk} ${word}`
                : word;


        if (
            candidate.length <= chunkSize
        ) {

            currentChunk =
                candidate;

        } else {

            if (currentChunk) {

                chunks.push(
                    currentChunk.trim()
                );

            }


            currentChunk =
                word;

        }

    }


    if (currentChunk) {

        chunks.push(
            currentChunk.trim()
        );

    }


    return chunks;

};


//Split Text By Natural Boundaries

const splitIntoBaseChunks = (
    text,
    chunkSize
) => {

    const paragraphs =
        splitIntoParagraphs(
            text
        );


    const chunks = [];

    let currentChunk = "";


    for (
        const paragraph of paragraphs
    ) {

        //Paragraph itself is larger than the chunk size

        if (
            paragraph.length > chunkSize
        ) {

            if (currentChunk) {

                chunks.push(
                    currentChunk.trim()
                );

                currentChunk = "";

            }


            const paragraphChunks =
                splitLongParagraph(
                    paragraph,
                    chunkSize
                );


            chunks.push(
                ...paragraphChunks
            );


            continue;

        }


        const candidate =
            currentChunk
                ? `${currentChunk}\n\n${paragraph}`
                : paragraph;


        if (
            candidate.length <= chunkSize
        ) {

            currentChunk =
                candidate;

        } else {

            if (currentChunk) {

                chunks.push(
                    currentChunk.trim()
                );

            }


            currentChunk =
                paragraph;

        }

    }


    if (currentChunk) {

        chunks.push(
            currentChunk.trim()
        );

    }


    return chunks;

};


//Get Overlap Text

//Takes the end of the previous chunk and uses it as context for
//the next chunk.

const getOverlapText = (
    text,
    overlap
) => {

    if (
        !text ||
        overlap <= 0
    ) {

        return "";

    }


    if (
        text.length <= overlap
    ) {

        return text;

    }


    const candidate =
        text.substring(
            text.length - overlap
        );


    //Prefer starting at a word boundary.

    const firstSpace =
        candidate.indexOf(" ");


    if (
        firstSpace >= 0 &&
        firstSpace < candidate.length - 1
    ) {

        return candidate
            .substring(
                firstSpace + 1
            )
            .trim();

    }


    return candidate.trim();

};


//Create Overlapping Chunks

const createOverlappingChunks = (
    baseChunks,
    chunkSize,
    chunkOverlap
) => {

    if (
        baseChunks.length <= 1 ||
        chunkOverlap === 0
    ) {

        return baseChunks;

    }


    const chunks = [];


    for (
        let index = 0;
        index < baseChunks.length;
        index++
    ) {

        const currentChunk =
            baseChunks[index];


        //First chunk

        if (
            index === 0
        ) {

            chunks.push(
                currentChunk
            );

            continue;

        }


        const previousChunk =
            baseChunks[index - 1];


        const overlapText =
            getOverlapText(
                previousChunk,
                chunkOverlap
            );


        let combinedChunk =
            overlapText
                ? `${overlapText}\n\n${currentChunk}`
                : currentChunk;


        /*
         Safety check
        
         Adding overlap should not normally exceed chunkSize.
         If it does, keep the current chunk intact.
        */

        if (
            combinedChunk.length > chunkSize
        ) {

            combinedChunk =
                currentChunk;

        }


        chunks.push(
            combinedChunk.trim()
        );

    }


    return chunks;

};


//Create Chunks

const chunkText = (
    text,
    {
        chunkSize = DEFAULT_CHUNK_SIZE,
        chunkOverlap = DEFAULT_CHUNK_OVERLAP,
        metadata = {}
    } = {}
) => {

    validateText(
        text
    );


    validateChunkConfiguration({

        chunkSize,

        chunkOverlap

    });


    const normalizedText =
        normalizeText(
            text
        );


    if (
        normalizedText.length === 0
    ) {

        return [];

    }


    //Small document

    if (
        normalizedText.length <= chunkSize
    ) {

        return [

            {

                chunkIndex: 0,

                text:
                    normalizedText,

                metadata: {
                    ...metadata
                }

            }

        ];

    }


    //Create natural base chunks

    const baseChunks =
        splitIntoBaseChunks(
            normalizedText,
            chunkSize
        );


    //Add overlap

    const chunks =
        createOverlappingChunks(
            baseChunks,
            chunkSize,
            chunkOverlap
        );


    //Return normalized chunk objects

    return chunks.map(
        (
            chunk,
            index
        ) => ({

            chunkIndex:
                index,

            text:
                chunk.trim(),

            metadata: {
                ...metadata
            }

        })
    );

};


//Create Chunks Alias

const createChunks = (
    text,
    options = {}
) => {

    return chunkText(
        text,
        options
    );

};


//Chunk With Metadata

const chunkDocument = ({
    text,
    documentId = null,
    metadata = {},
    chunkSize = DEFAULT_CHUNK_SIZE,
    chunkOverlap = DEFAULT_CHUNK_OVERLAP
} = {}) => {

    const documentMetadata = {

        ...metadata,

        documentId

    };


    return chunkText(
        text,
        {

            chunkSize,

            chunkOverlap,

            metadata:
                documentMetadata

        }
    );

};


//Calculate Chunk Statistics

const getChunkStatistics = (
    chunks = []
) => {

    if (
        !Array.isArray(chunks) ||
        chunks.length === 0
    ) {

        return {

            count: 0,

            totalCharacters: 0,

            averageCharacters: 0,

            minimumCharacters: 0,

            maximumCharacters: 0

        };

    }


    const lengths =
        chunks.map(
            (chunk) => {

                const text =
                    typeof chunk === "string"
                        ? chunk
                        : chunk.text || "";

                return text.length;

            }
        );


    const totalCharacters =
        lengths.reduce(
            (
                total,
                length
            ) =>
                total + length,
            0
        );


    const minimumCharacters =
        Math.min(
            ...lengths
        );


    const maximumCharacters =
        Math.max(
            ...lengths
        );


    return {

        count:
            chunks.length,

        totalCharacters,

        averageCharacters:
            Math.round(
                totalCharacters /
                chunks.length
            ),

        minimumCharacters,

        maximumCharacters

    };

};


//Add Chunk Positions

const addChunkPositions = (
    chunks = []
) => {

    return chunks.map(
        (
            chunk,
            index
        ) => {

            const text =
                typeof chunk === "string"
                    ? chunk
                    : chunk.text || "";


            return {

                ...(typeof chunk === "object"
                    ? chunk
                    : {}),

                chunkIndex:
                    index,

                startPosition:
                    null,

                endPosition:
                    null,

                text

            };

        }
    );

};


//Export

module.exports = {

    DEFAULT_CHUNK_SIZE,

    DEFAULT_CHUNK_OVERLAP,

    MIN_CHUNK_SIZE,

    MAX_CHUNK_SIZE,

    validateChunkConfiguration,

    normalizeText,

    validateText,

    splitIntoParagraphs,

    splitLongParagraph,

    splitIntoBaseChunks,

    getOverlapText,

    createOverlappingChunks,

    chunkText,

    createChunks,

    chunkDocument,

    getChunkStatistics,

    addChunkPositions

};