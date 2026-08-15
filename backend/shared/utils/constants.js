//Application Constants
//User Roles

const USER_ROLES = Object.freeze({

    STUDENT: "student",

    ADMIN: "admin"

});


//Account Status

const ACCOUNT_STATUS = Object.freeze({

    ACTIVE: "active",

    INACTIVE: "inactive",

    SUSPENDED: "suspended",

    PENDING: "pending"

});


//Publishing Status

const PUBLISHING_STATUS = Object.freeze({

    DRAFT: "draft",

    PUBLISHED: "published",

    ARCHIVED: "archived"

});


//Career Levels

const CAREER_LEVELS = Object.freeze({

    BEGINNER: "beginner",

    INTERMEDIATE: "intermediate",

    ADVANCED: "advanced",

    EXPERT: "expert"

});


//Skill Levels

const SKILL_LEVELS = Object.freeze({

    BEGINNER: "beginner",

    BASIC: "basic",

    INTERMEDIATE: "intermediate",

    ADVANCED: "advanced",

    EXPERT: "expert"

});


//Skill Types

const SKILL_TYPES = Object.freeze({

    TECHNICAL: "technical",

    SOFT: "soft",

    TOOL: "tool",

    DOMAIN: "domain"

});


//Resource Types

const RESOURCE_TYPES = Object.freeze({

    COURSE: "course",

    TUTORIAL: "tutorial",

    DOCUMENTATION: "documentation",

    VIDEO: "video",

    BOOK: "book",

    ARTICLE: "article",

    PROJECT: "project",

    WEBSITE: "website"

});


//Knowledge Document Types

const KNOWLEDGE_DOCUMENT_TYPES = Object.freeze({

    PDF: "pdf",

    DOCX: "docx",

    TXT: "txt",

    MARKDOWN: "markdown",

    CSV: "csv"

});


//Knowledge Document Processing Status

const KNOWLEDGE_PROCESSING_STATUS =
    Object.freeze({

        PENDING: "pending",

        PROCESSING: "processing",

        COMPLETED: "completed",

        FAILED: "failed"

    });


//Conversation Roles

const MESSAGE_ROLES = Object.freeze({

    USER: "user",

    ASSISTANT: "assistant",

    SYSTEM: "system"

});


//AI Request Types

const AI_REQUEST_TYPES = Object.freeze({

    CHAT: "chat",

    CAREER_GUIDANCE: "career_guidance",

    ROADMAP_GUIDANCE: "roadmap_guidance",

    SKILL_GAP: "skill_gap",

    PROJECT_GUIDANCE: "project_guidance",

    GITHUB_ANALYSIS: "github_analysis"

});


//Audit Actions

const AUDIT_ACTIONS = Object.freeze({

    CREATE: "create",

    UPDATE: "update",

    DELETE: "delete",

    PUBLISH: "publish",

    UNPUBLISH: "unpublish",

    ARCHIVE: "archive",

    RESTORE: "restore",

    LOGIN: "login",

    LOGOUT: "logout"

});


//Audit Entity Types

const AUDIT_ENTITY_TYPES = Object.freeze({

    CAREER: "career",

    SKILL: "skill",

    CAREER_SKILL: "career_skill",

    ROADMAP: "roadmap",

    ROADMAP_STAGE: "roadmap_stage",

    PROJECT: "project",

    CERTIFICATION: "certification",

    RESOURCE: "learning_resource",

    KNOWLEDGE: "knowledge_document",

    USER: "user"

});


//HTTP Status Codes

const HTTP_STATUS = Object.freeze({

    OK: 200,

    CREATED: 201,

    NO_CONTENT: 204,

    BAD_REQUEST: 400,

    UNAUTHORIZED: 401,

    FORBIDDEN: 403,

    NOT_FOUND: 404,

    CONFLICT: 409,

    UNPROCESSABLE_ENTITY: 422,

    INTERNAL_SERVER_ERROR: 500

});


//Pagination

const PAGINATION = Object.freeze({

    DEFAULT_PAGE: 1,

    DEFAULT_LIMIT: 10,

    MAX_LIMIT: 100

});


//File Upload Limits

const FILE_UPLOAD_LIMITS = Object.freeze({

    PROFILE_IMAGE_MB: 5,

    KNOWLEDGE_DOCUMENT_MB: 20,

    MAX_KNOWLEDGE_DOCUMENTS: 10

});


//Allowed Image Types

const IMAGE_MIME_TYPES = Object.freeze([

    "image/jpeg",

    "image/jpg",

    "image/png",

    "image/webp"

]);


//Allowed Knowledge Document Types

const KNOWLEDGE_MIME_TYPES =
    Object.freeze([

        "application/pdf",

        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

        "text/plain",

        "text/markdown",

        "text/csv"

    ]);


//RAG Configuration

const RAG_CONFIG = Object.freeze({

    DEFAULT_TOP_K: 5,

    MAX_TOP_K: 20,

    DEFAULT_CHUNK_SIZE: 1000,

    DEFAULT_CHUNK_OVERLAP: 200

});


//API Configuration

const API_CONFIG = Object.freeze({

    DEFAULT_API_VERSION: "v1",

    DEFAULT_PAGE_SIZE: 10

});


//Date Formats

const DATE_FORMATS = Object.freeze({

    ISO: "YYYY-MM-DD",

    ISO_DATE_TIME:
        "YYYY-MM-DDTHH:mm:ss.SSSZ"

});


//Export

module.exports = {

    USER_ROLES,

    ACCOUNT_STATUS,

    PUBLISHING_STATUS,

    CAREER_LEVELS,

    SKILL_LEVELS,

    SKILL_TYPES,

    RESOURCE_TYPES,

    KNOWLEDGE_DOCUMENT_TYPES,

    KNOWLEDGE_PROCESSING_STATUS,

    MESSAGE_ROLES,

    AI_REQUEST_TYPES,

    AUDIT_ACTIONS,

    AUDIT_ENTITY_TYPES,

    HTTP_STATUS,

    PAGINATION,

    FILE_UPLOAD_LIMITS,

    IMAGE_MIME_TYPES,

    KNOWLEDGE_MIME_TYPES,

    RAG_CONFIG,

    API_CONFIG,

    DATE_FORMATS

};