const mongoose = require("mongoose");


//Knowledge Document Schema


const knowledgeDocumentSchema = new mongoose.Schema(
    {

        //Basic Document Information

        title: {
            type: String,
            required: [true, "Document title is required."],
            trim: true,
            minlength: [
                2,
                "Document title must contain at least 2 characters."
            ],
            maxlength: [
                200,
                "Document title cannot exceed 200 characters."
            ]
        },


        slug: {
            type: String,
            required: [true, "Document slug is required."],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                "Document slug must contain only lowercase letters, numbers and hyphens."
            ]
        },


        description: {
            type: String,
            trim: true,
            maxlength: [
                2000,
                "Document description cannot exceed 2000 characters."
            ],
            default: ""
        },


        //Document Type

        documentType: {
            type: String,
            required: [true, "Document type is required."],
            enum: [
                "PDF",
                "DOCX",
                "TXT",
                "Markdown",
                "Web Page",
                "Other"
            ],
            index: true
        },


        //File Information

        fileName: {
            type: String,
            trim: true,
            default: null
        },


        originalFileName: {
            type: String,
            trim: true,
            default: null
        },


        filePath: {
            type: String,
            trim: true,
            default: null
        },


        fileSize: {
            type: Number,
            min: 0,
            default: null
        },


        mimeType: {
            type: String,
            trim: true,
            default: null
        },


        //External Source

        sourceUrl: {
            type: String,
            trim: true,
            default: null
        },


        sourceName: {
            type: String,
            trim: true,
            default: null
        },


        //Knowledge Category

        category: {
            type: String,
            required: [true, "Knowledge category is required."],
            enum: [
                "Career",
                "Skill",
                "Roadmap",
                "Project",
                "Certification",
                "Learning Resource",
                "Interview",
                "Industry",
                "General"
            ],
            index: true
        },


        //Related Career

        careers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Career"
            }
        ],


        //Related Skills

        skills: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Skill"
            }
        ],


        //Related Roadmaps

        roadmaps: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Roadmap"
            }
        ],


        //Tags

        tags: [
            {
                type: String,
                trim: true,
                lowercase: true
            }
        ],


        //Language

        language: {
            type: String,
            trim: true,
            default: "English"
        },


        //Document Processing Status

        processingStatus: {
            type: String,
            enum: [
                "pending",
                "processing",
                "completed",
                "failed"
            ],
            default: "pending",
            index: true
        },


        //Processing Error

        processingError: {
            type: String,
            trim: true,
            default: null
        },


        //Extracted Text Information

        extractedTextLength: {
            type: Number,
            min: 0,
            default: 0
        },


        pageCount: {
            type: Number,
            min: 0,
            default: null
        },


        //Chunk Information

        chunkCount: {
            type: Number,
            min: 0,
            default: 0
        },


        //Embedding Information

        embeddingStatus: {
            type: String,
            enum: [
                "pending",
                "processing",
                "completed",
                "failed"
            ],
            default: "pending",
            index: true
        },


        embeddingModel: {
            type: String,
            trim: true,
            default: null
        },


        vectorCollection: {
            type: String,
            trim: true,
            default: null
        },


        //Document Version

        version: {
            type: Number,
            min: 1,
            default: 1
        },


        //Document Status

        status: {
            type: String,
            enum: [
                "draft",
                "published",
                "archived"
            ],
            default: "draft",
            index: true
        },


        //RAG Availability

        availableForRAG: {
            type: Boolean,
            default: false,
            index: true
        },


        //Featured Document

        featured: {
            type: Boolean,
            default: false
        },


        //CMS Metadata

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }

    },

    {
        timestamps: true
    }

);


//Indexes

knowledgeDocumentSchema.index({
    title: "text",
    description: "text",
    tags: "text"
});


knowledgeDocumentSchema.index({
    category: 1,
    status: 1
});


knowledgeDocumentSchema.index({
    processingStatus: 1,
    embeddingStatus: 1
});


knowledgeDocumentSchema.index({
    availableForRAG: 1,
    status: 1
});


knowledgeDocumentSchema.index({
    careers: 1,
    status: 1
});


knowledgeDocumentSchema.index({
    skills: 1,
    status: 1
});


//Validation

knowledgeDocumentSchema.pre(
    "save",
    function (next) {

        //File Document Validation

        const fileBasedTypes = [
            "PDF",
            "DOCX",
            "TXT",
            "Markdown"
        ];

        if (
            fileBasedTypes.includes(this.documentType) &&
            !this.filePath &&
            !this.sourceUrl
        ) {

            return next(
                new Error(
                    "A file-based knowledge document must have a file path or source URL."
                )
            );

        }


        //Web Page Validation

        if (
            this.documentType === "Web Page" &&
            !this.sourceUrl
        ) {

            return next(
                new Error(
                    "A web page knowledge document must have a source URL."
                )
            );

        }


        //RAG Availability Validation

        if (
            this.availableForRAG === true &&
            (
                this.processingStatus !== "completed" ||
                this.embeddingStatus !== "completed"
            )
        ) {

            return next(
                new Error(
                    "A document can only be available for RAG after processing and embedding are completed."
                )
            );

        }


        //Published Document Validation

        if (
            this.status === "published" &&
            (
                !this.title ||
                !this.category
            )
        ) {

            return next(
                new Error(
                    "A published knowledge document must have a title and category."
                )
            );

        }


        next();

    }
);


//Model

const KnowledgeDocument = mongoose.model(
    "KnowledgeDocument",
    knowledgeDocumentSchema
);


module.exports = KnowledgeDocument;