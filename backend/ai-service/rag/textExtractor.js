/*
| Text Extractor
|
| Responsible for extracting readable text from knowledge documents.
|
| Supported formats:
|
| - PDF
| - DOCX
| - DOC
| - TXT
| - MD
| - Markdown
|
| This module is intentionally independent from:
|
| - textChunker.js
| - embeddingService.js
| - vectorSearchService.js
|
| The documentProcessor.js module coordinates these components.
*/

const fs = require("fs");
const path = require("path");


//Supported File Types

const SUPPORTED_FILE_TYPES = [
    "pdf",
    "doc",
    "docx",
    "txt",
    "md",
    "markdown"
];


//Normalize File Type

const normalizeFileType = (fileType) => {

    if (!fileType) {
        return "";
    }

    return String(fileType)
        .toLowerCase()
        .replace(".", "")
        .trim();

};


//Get File Extension

const getFileExtension = (filePath) => {

    if (!filePath) {
        return "";
    }

    return path
        .extname(filePath)
        .toLowerCase()
        .replace(".", "");

};


//Resolve File Type

const resolveFileType = (
    filePath,
    fileType = null
) => {

    if (fileType) {
        return normalizeFileType(fileType);
    }

    return getFileExtension(filePath);

};


//Validate File Type

const validateFileType = (fileType) => {

    const normalizedType =
        normalizeFileType(fileType);

    if (
        !SUPPORTED_FILE_TYPES.includes(
            normalizedType
        )
    ) {

        throw new Error(
            `Unsupported document type: ${
                normalizedType || "unknown"
            }`
        );

    }

    return normalizedType;

};


//Validate File Path

const validateFilePath = (filePath) => {

    if (!filePath) {

        throw new Error(
            "File path is required."
        );

    }

    if (
        typeof filePath !== "string"
    ) {

        throw new Error(
            "File path must be a string."
        );

    }

    return true;

};


//Check File Exists

const checkFileExists = (filePath) => {

    validateFilePath(
        filePath
    );

    if (
        !fs.existsSync(filePath)
    ) {

        throw new Error(
            `Document file not found: ${filePath}`
        );

    }

    return true;

};


//Read File Buffer

const readFileBuffer = async (
    filePath
) => {

    checkFileExists(
        filePath
    );

    return await fs.promises.readFile(
        filePath
    );

};


//Extract Plain Text

const extractTextFromTxt = async (
    filePath
) => {

    const buffer =
        await readFileBuffer(
            filePath
        );

    return buffer.toString(
        "utf8"
    );

};


//Extract Markdown

//Markdown can normally be processed as plain text.

const extractTextFromMarkdown = async (
    filePath
) => {

    return await extractTextFromTxt(
        filePath
    );

};


//Extract PDF Text

const extractTextFromPdf = async (
    filePath
) => {

    const buffer =
        await readFileBuffer(
            filePath
        );


    let pdfParse;

    try {

        //pdf-parse

        const pdfModule =
            require("pdf-parse");

        pdfParse =
            pdfModule.default ||
            pdfModule;

    } catch (error) {

        throw new Error(
            "The 'pdf-parse' package is required to extract PDF text. " +
            "Install it with: npm install pdf-parse"
        );

    }


    try {

        const result =
            await pdfParse(
                buffer
            );


        return result.text || "";

    } catch (error) {

        throw new Error(
            `Failed to extract text from PDF: ${error.message}`
        );

    }

};


//Extract DOCX Text

const extractTextFromDocx = async (
    filePath
) => {

    const buffer =
        await readFileBuffer(
            filePath
        );


    let mammoth;

    try {

        mammoth =
            require("mammoth");

    } catch (error) {

        throw new Error(
            "The 'mammoth' package is required to extract DOCX text. " +
            "Install it with: npm install mammoth"
        );

    }


    try {

        const result =
            await mammoth.extractRawText({
                buffer
            });


        return result.value || "";

    } catch (error) {

        throw new Error(
            `Failed to extract text from DOCX: ${error.message}`
        );

    }

};


/*
| Extract DOC Text
|
| Older .doc files are different from .docx.
|
| Mammoth does NOT reliably process old binary .doc files.
|
| Therefore this function attempts to use the optional `word-extractor`
| package.
*/

const extractTextFromDoc = async (
    filePath
) => {

    checkFileExists(
        filePath
    );


    let WordExtractor;

    try {

        WordExtractor =
            require("word-extractor");

    } catch (error) {

        throw new Error(
            "The 'word-extractor' package is required to extract " +
            "legacy DOC files. Install it with: " +
            "npm install word-extractor"
        );

    }


    try {

        const extractor =
            new WordExtractor();


        const document =
            await extractor.extract(
                filePath
            );


        return document.getBody();

    } catch (error) {

        throw new Error(
            `Failed to extract text from DOC: ${error.message}`
        );

    }

};


//Clean Extracted Text

const cleanExtractedText = (
    text
) => {

    if (!text) {
        return "";
    }


    return String(text)

        // Normalize line endings
        .replace(/\r\n/g, "\n")

        .replace(/\r/g, "\n")

        // Replace non-breaking spaces
        .replace(/\u00A0/g, " ")

        // Remove trailing spaces
        .replace(/[ \t]+$/gm, "")

        // Remove excessive spaces
        .replace(/[ \t]{2,}/g, " ")

        // Remove excessive empty lines
        .replace(/\n{3,}/g, "\n\n")

        .trim();

};


//Validate Extracted Text

const validateExtractedText = (
    text
) => {

    if (
        !text ||
        !String(text).trim()
    ) {

        throw new Error(
            "No readable text was extracted from the document."
        );

    }

    return true;

};


//Extract Text

const extractText = async (
    filePath,
    fileType = null
) => {

    validateFilePath(
        filePath
    );


    checkFileExists(
        filePath
    );


    const resolvedType =
        resolveFileType(
            filePath,
            fileType
        );


    const normalizedType =
        validateFileType(
            resolvedType
        );


    let extractedText;


    switch (
        normalizedType
    ) {

        case "pdf":

            extractedText =
                await extractTextFromPdf(
                    filePath
                );

            break;


        case "docx":

            extractedText =
                await extractTextFromDocx(
                    filePath
                );

            break;


        case "doc":

            extractedText =
                await extractTextFromDoc(
                    filePath
                );

            break;


        case "txt":

            extractedText =
                await extractTextFromTxt(
                    filePath
                );

            break;


        case "md":

            extractedText =
                await extractTextFromMarkdown(
                    filePath
                );

            break;


        case "markdown":

            extractedText =
                await extractTextFromMarkdown(
                    filePath
                );

            break;


        default:

            throw new Error(
                `No extractor available for file type: ${normalizedType}`
            );

    }


    const cleanedText =
        cleanExtractedText(
            extractedText
        );


    validateExtractedText(
        cleanedText
    );


    return cleanedText;

};


//Extract Text With Metadata

const extractTextWithMetadata = async ({
    filePath,
    fileType = null
} = {}) => {

    validateFilePath(
        filePath
    );


    const resolvedType =
        resolveFileType(
            filePath,
            fileType
        );


    const normalizedType =
        validateFileType(
            resolvedType
        );


    const text =
        await extractText(
            filePath,
            normalizedType
        );


    return {

        text,

        filePath,

        fileName:
            path.basename(
                filePath
            ),

        fileType:
            normalizedType,

        characterCount:
            text.length

    };

};


//Extract Multiple Documents

const extractMultipleDocuments = async (
    documents = []
) => {

    if (
        !Array.isArray(documents)
    ) {

        throw new Error(
            "Documents must be an array."
        );

    }


    const results = [];


    for (
        const document of documents
    ) {

        const filePath =
            document.filePath ||
            document.path;


        const fileType =
            document.fileType ||
            null;


        const result =
            await extractTextWithMetadata({

                filePath,

                fileType

            });


        results.push({

            ...result,

            documentId:
                document.documentId ||
                document._id ||
                null,

            metadata:
                document.metadata ||
                {}

        });

    }


    return results;

};


//Get Supported File Types

const getSupportedFileTypes = () => {

    return [
        ...SUPPORTED_FILE_TYPES
    ];

};


//Check Whether File Type Is Supported

const isSupportedFileType = (
    fileType
) => {

    const normalizedType =
        normalizeFileType(
            fileType
        );


    return SUPPORTED_FILE_TYPES.includes(
        normalizedType
    );

};


//Export

module.exports = {

    SUPPORTED_FILE_TYPES,

    normalizeFileType,

    getFileExtension,

    resolveFileType,

    validateFileType,

    validateFilePath,

    checkFileExists,

    readFileBuffer,

    extractTextFromTxt,

    extractTextFromMarkdown,

    extractTextFromPdf,

    extractTextFromDocx,

    extractTextFromDoc,

    cleanExtractedText,

    validateExtractedText,

    extractText,

    extractTextWithMetadata,

    extractMultipleDocuments,

    getSupportedFileTypes,

    isSupportedFileType

};