const { body, param, query } = require("express-validator");


//Create Roadmap Validation

const createRoadmapValidator = [

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Roadmap title is required.")
        .isLength({ min: 2, max: 150 })
        .withMessage(
            "Roadmap title must be between 2 and 150 characters."
        ),

    body("slug")
        .optional()
        .trim()
        .isLength({ min: 2, max: 150 })
        .withMessage(
            "Slug must be between 2 and 150 characters."
        )
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .withMessage(
            "Slug can only contain lowercase letters, numbers, and hyphens."
        ),

    body("career")
        .notEmpty()
        .withMessage("Career ID is required.")
        .isMongoId()
        .withMessage("Invalid career ID."),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Roadmap description is required."),

    body("shortDescription")
        .optional()
        .trim()
        .isLength({ max: 300 })
        .withMessage(
            "Short description cannot exceed 300 characters."
        ),

    body("estimatedDuration")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage(
            "Estimated duration cannot exceed 100 characters."
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
            "Invalid roadmap difficulty."
        ),

    body("totalStages")
        .optional()
        .isInt({ min: 0 })
        .withMessage(
            "Total stages must be a non-negative integer."
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


//Update Roadmap Validation

const updateRoadmapValidator = [

    param("id")
        .isMongoId()
        .withMessage(
            "Invalid roadmap ID."
        ),

    body("title")
        .optional()
        .trim()
        .isLength({ min: 2, max: 150 })
        .withMessage(
            "Roadmap title must be between 2 and 150 characters."
        ),

    body("slug")
        .optional()
        .trim()
        .isLength({ min: 2, max: 150 })
        .withMessage(
            "Slug must be between 2 and 150 characters."
        )
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .withMessage(
            "Slug can only contain lowercase letters, numbers, and hyphens."
        ),

    body("career")
        .optional()
        .isMongoId()
        .withMessage(
            "Invalid career ID."
        ),

    body("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage(
            "Description cannot be empty."
        ),

    body("shortDescription")
        .optional()
        .trim()
        .isLength({ max: 300 })
        .withMessage(
            "Short description cannot exceed 300 characters."
        ),

    body("estimatedDuration")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage(
            "Estimated duration cannot exceed 100 characters."
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
            "Invalid roadmap difficulty."
        ),

    body("totalStages")
        .optional()
        .isInt({ min: 0 })
        .withMessage(
            "Total stages must be a non-negative integer."
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


//Roadmap ID Validation

const roadmapIdValidator = [

    param("id")
        .isMongoId()
        .withMessage(
            "Invalid roadmap ID."
        )

];


//Career ID Validation

const roadmapCareerIdValidator = [

    param("careerId")
        .isMongoId()
        .withMessage(
            "Invalid career ID."
        )

];


//Roadmap Slug Validation

const roadmapSlugValidator = [

    param("slug")
        .trim()
        .notEmpty()
        .withMessage(
            "Roadmap slug is required."
        )
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .withMessage(
            "Invalid roadmap slug."
        )

];


//Roadmap Query Validation

const roadmapQueryValidator = [

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

    query("career")
        .optional()
        .isMongoId()
        .withMessage(
            "Invalid career ID."
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
            "Invalid roadmap difficulty."
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
            "Invalid roadmap status."
        ),

    query("sortBy")
        .optional()
        .trim()
        .isIn([
            "title",
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

const roadmapDisplayOrderValidator = [

    param("id")
        .isMongoId()
        .withMessage(
            "Invalid roadmap ID."
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

    createRoadmapValidator,

    updateRoadmapValidator,

    roadmapIdValidator,

    roadmapCareerIdValidator,

    roadmapSlugValidator,

    roadmapQueryValidator,

    roadmapDisplayOrderValidator

};