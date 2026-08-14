const { body, param, query } = require("express-validator");


//Create Knowledge Document Validation

const createKnowledgeValidator = [

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Knowledge document title is required.")
        .isLength({ min: 2, max: 200 })
        .withMessage(
            "Title must be between 2 and 200 characters."
        ),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage(
            "Description cannot exceed 2000 characters."
        ),

    body("category")
        .notEmpty()
        .withMessage("Knowledge category is required.")
        .trim()
        .isIn([
            "career",
            "skill",
            "roadmap",
            "project",
            "certification",
            "general"
        ])
        .withMessage(
            "Invalid knowledge category."
        ),

    body("source")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage(
            "Source cannot exceed 500 characters."
        ),

    body("sourceUrl")
        .optional()
        .trim()
        .isURL()
        .withMessage(
            "Source URL must be a valid URL."
        ),

    body("documentType")
        .optional()
        .trim()
        .isIn([
            "pdf",
            "docx",
            "txt",
            "markdown",
            "webpage",
            "other"
        ])
        .withMessage(
            "Invalid document type."
        ),

    body("tags")
        .optional()
        .isArray()
        .withMessage(
            "Tags must be an array."
        ),

    body("tags.*")
        .optional()
        .isString()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage(
            "Each tag must be a string between 1 and 50 characters."
        ),

    body("careers")
        .optional()
        .isArray()
        .withMessage(
            "Careers must be an array."
        ),

    body("careers.*")
        .optional()
        .isMongoId()
        .withMessage(
            "Each career must contain a valid career ID."
        ),

    body("skills")
        .optional()
        .isArray()
        .withMessage(
            "Skills must be an array."
        ),

    body("skills.*")
        .optional()
        .isMongoId()
        .withMessage(
            "Each skill must contain a valid skill ID."
        ),

    body("roadmaps")
        .optional()
        .isArray()
        .withMessage(
            "Roadmaps must be an array."
        ),

    body("roadmaps.*")
        .optional()
        .isMongoId()
        .withMessage(
            "Each roadmap must contain a valid roadmap ID."
        ),

    body("isPublished")
        .optional()
        .isBoolean()
        .withMessage(
            "isPublished must be a boolean."
        )

];


//Update Knowledge Document Validation

const updateKnowledgeValidator = [

    param("id")
        .isMongoId()
        .withMessage(
            "Invalid knowledge document ID."
        ),

    body("title")
        .optional()
        .trim()
        .isLength({ min: 2, max: 200 })
        .withMessage(
            "Title must be between 2 and 200 characters."
        ),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage(
            "Description cannot exceed 2000 characters."
        ),

    body("category")
        .optional()
        .trim()
        .isIn([
            "career",
            "skill",
            "roadmap",
            "project",
            "certification",
            "general"
        ])
        .withMessage(
            "Invalid knowledge category."
        ),

    body("source")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage(
            "Source cannot exceed 500 characters."
        ),

    body("sourceUrl")
        .optional()
        .trim()
        .isURL()
        .withMessage(
            "Source URL must be a valid URL."
        ),

    body("documentType")
        .optional()
        .trim()
        .isIn([
            "pdf",
            "docx",
            "txt",
            "markdown",
            "webpage",
            "other"
        ])
        .withMessage(
            "Invalid document type."
        ),

    body("tags")
        .optional()
        .isArray()
        .withMessage(
            "Tags must be an array."
        ),

    body("tags.*")
        .optional()
        .isString()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage(
            "Each tag must be a string between 1 and 50 characters."
        ),

    body("careers")
        .optional()
        .isArray()
        .withMessage(
            "Careers must be an array."
        ),

    body("careers.*")
        .optional()
        .isMongoId()
        .withMessage(
            "Each career must contain a valid career ID."
        ),

    body("skills")
        .optional()
        .isArray()
        .withMessage(
            "Skills must be an array."
        ),

    body("skills.*")
        .optional()
        .isMongoId()
        .withMessage(
            "Each skill must contain a valid skill ID."
        ),

    body("roadmaps")
        .optional()
        .isArray()
        .withMessage(
            "Roadmaps must be an array."
        ),

    body("roadmaps.*")
        .optional()
        .isMongoId()
        .withMessage(
            "Each roadmap must contain a valid roadmap ID."
        ),

    body("isPublished")
        .optional()
        .isBoolean()
        .withMessage(
            "isPublished must be a boolean."
        )

];


//Knowledge Document ID Validation

const knowledgeIdValidator = [

    param("id")
        .isMongoId()
        .withMessage(
            "Invalid knowledge document ID."
        )

];


//Knowledge Query Validation

const knowledgeQueryValidator = [

    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage(
            "Page must be a positive integer."
        ),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage(
            "Limit must be between 1 and 100."
        ),

    query("search")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage(
            "Search term cannot exceed 100 characters."
        ),

    query("category")
        .optional()
        .trim()
        .isIn([
            "career",
            "skill",
            "roadmap",
            "project",
            "certification",
            "general"
        ])
        .withMessage(
            "Invalid knowledge category."
        ),

    query("documentType")
        .optional()
        .trim()
        .isIn([
            "pdf",
            "docx",
            "txt",
            "markdown",
            "webpage",
            "other"
        ])
        .withMessage(
            "Invalid document type."
        ),

    query("career")
        .optional()
        .isMongoId()
        .withMessage(
            "Invalid career ID."
        ),

    query("skill")
        .optional()
        .isMongoId()
        .withMessage(
            "Invalid skill ID."
        ),

    query("roadmap")
        .optional()
        .isMongoId()
        .withMessage(
            "Invalid roadmap ID."
        ),

    query("status")
        .optional()
        .trim()
        .isIn([
            "draft",
            "published",
            "archived"
        ])
        .withMessage(
            "Invalid knowledge document status."
        ),

    query("sortBy")
        .optional()
        .trim()
        .isIn([
            "title",
            "category",
            "documentType",
            "createdAt",
            "updatedAt"
        ])
        .withMessage(
            "Invalid sort field."
        ),

    query("sortOrder")
        .optional()
        .trim()
        .isIn([
            "asc",
            "desc"
        ])
        .withMessage(
            "Sort order must be asc or desc."
        )

];


//Knowledge Category Validation

const knowledgeCategoryValidator = [

    param("category")
        .trim()
        .notEmpty()
        .withMessage(
            "Knowledge category is required."
        )
        .isIn([
            "career",
            "skill",
            "roadmap",
            "project",
            "certification",
            "general"
        ])
        .withMessage(
            "Invalid knowledge category."
        )

];


//Knowledge Publish Validation

const knowledgePublishValidator = [

    param("id")
        .isMongoId()
        .withMessage(
            "Invalid knowledge document ID."
        ),

    body("isPublished")
        .notEmpty()
        .withMessage(
            "isPublished is required."
        )
        .isBoolean()
        .withMessage(
            "isPublished must be a boolean."
        )

];


//Export Validators

module.exports = {

    createKnowledgeValidator,

    updateKnowledgeValidator,

    knowledgeIdValidator,

    knowledgeQueryValidator,

    knowledgeCategoryValidator,

    knowledgePublishValidator

};