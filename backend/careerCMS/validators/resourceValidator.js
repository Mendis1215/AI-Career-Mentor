const { body, param, query } = require("express-validator");


//Create Learning Resource Validation

const createResourceValidator = [

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Resource title is required.")
        .isLength({ min: 2, max: 200 })
        .withMessage(
            "Resource title must be between 2 and 200 characters."
        ),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage(
            "Resource description cannot exceed 2000 characters."
        ),

    body("type")
        .notEmpty()
        .withMessage("Resource type is required.")
        .trim()
        .isIn([
            "course",
            "tutorial",
            "documentation",
            "video",
            "article",
            "book",
            "website",
            "practice"
        ])
        .withMessage(
            "Invalid resource type."
        ),

    body("provider")
        .optional()
        .trim()
        .isLength({ max: 150 })
        .withMessage(
            "Provider name cannot exceed 150 characters."
        ),

    body("url")
        .notEmpty()
        .withMessage("Resource URL is required.")
        .trim()
        .isURL()
        .withMessage(
            "Resource URL must be a valid URL."
        ),

    body("difficulty")
        .optional()
        .trim()
        .isIn([
            "beginner",
            "intermediate",
            "advanced"
        ])
        .withMessage(
            "Invalid resource difficulty."
        ),

    body("duration")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage(
            "Duration cannot exceed 100 characters."
        ),

    body("isFree")
        .optional()
        .isBoolean()
        .withMessage(
            "isFree must be a boolean."
        ),

    body("price")
        .optional()
        .isFloat({ min: 0 })
        .withMessage(
            "Price must be a non-negative number."
        ),

    body("currency")
        .optional()
        .trim()
        .isLength({ min: 3, max: 3 })
        .withMessage(
            "Currency must be a 3-character code."
        )
        .isAlpha()
        .withMessage(
            "Currency must contain only letters."
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
        ),

    body("displayOrder")
        .optional()
        .isInt({ min: 0 })
        .withMessage(
            "Display order must be a non-negative integer."
        )

];


//Update Learning Resource Validation

const updateResourceValidator = [

    param("id")
        .isMongoId()
        .withMessage(
            "Invalid resource ID."
        ),

    body("title")
        .optional()
        .trim()
        .isLength({ min: 2, max: 200 })
        .withMessage(
            "Resource title must be between 2 and 200 characters."
        ),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage(
            "Resource description cannot exceed 2000 characters."
        ),

    body("type")
        .optional()
        .trim()
        .isIn([
            "course",
            "tutorial",
            "documentation",
            "video",
            "article",
            "book",
            "website",
            "practice"
        ])
        .withMessage(
            "Invalid resource type."
        ),

    body("provider")
        .optional()
        .trim()
        .isLength({ max: 150 })
        .withMessage(
            "Provider name cannot exceed 150 characters."
        ),

    body("url")
        .optional()
        .trim()
        .isURL()
        .withMessage(
            "Resource URL must be a valid URL."
        ),

    body("difficulty")
        .optional()
        .trim()
        .isIn([
            "beginner",
            "intermediate",
            "advanced"
        ])
        .withMessage(
            "Invalid resource difficulty."
        ),

    body("duration")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage(
            "Duration cannot exceed 100 characters."
        ),

    body("isFree")
        .optional()
        .isBoolean()
        .withMessage(
            "isFree must be a boolean."
        ),

    body("price")
        .optional()
        .isFloat({ min: 0 })
        .withMessage(
            "Price must be a non-negative number."
        ),

    body("currency")
        .optional()
        .trim()
        .isLength({ min: 3, max: 3 })
        .withMessage(
            "Currency must be a 3-character code."
        )
        .isAlpha()
        .withMessage(
            "Currency must contain only letters."
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
        ),

    body("displayOrder")
        .optional()
        .isInt({ min: 0 })
        .withMessage(
            "Display order must be a non-negative integer."
        )

];


//Resource ID Validation

const resourceIdValidator = [

    param("id")
        .isMongoId()
        .withMessage(
            "Invalid resource ID."
        )

];


//Resource Query Validation

const resourceQueryValidator = [

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

    query("type")
        .optional()
        .trim()
        .isIn([
            "course",
            "tutorial",
            "documentation",
            "video",
            "article",
            "book",
            "website",
            "practice"
        ])
        .withMessage(
            "Invalid resource type."
        ),

    query("provider")
        .optional()
        .trim()
        .isLength({ max: 150 })
        .withMessage(
            "Provider cannot exceed 150 characters."
        ),

    query("difficulty")
        .optional()
        .trim()
        .isIn([
            "beginner",
            "intermediate",
            "advanced"
        ])
        .withMessage(
            "Invalid resource difficulty."
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

    query("isFree")
        .optional()
        .isBoolean()
        .withMessage(
            "isFree must be a boolean."
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
            "Invalid resource status."
        ),

    query("sortBy")
        .optional()
        .trim()
        .isIn([
            "title",
            "type",
            "provider",
            "difficulty",
            "price",
            "createdAt",
            "updatedAt",
            "displayOrder"
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


//Display Order Validation

const resourceDisplayOrderValidator = [

    param("id")
        .isMongoId()
        .withMessage(
            "Invalid resource ID."
        ),

    body("displayOrder")
        .notEmpty()
        .withMessage(
            "Display order is required."
        )
        .isInt({ min: 0 })
        .withMessage(
            "Display order must be a non-negative integer."
        )

];


//Export Validators

module.exports = {

    createResourceValidator,

    updateResourceValidator,

    resourceIdValidator,

    resourceQueryValidator,

    resourceDisplayOrderValidator

};