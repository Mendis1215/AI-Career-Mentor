const { body, param, query } = require("express-validator");


//Create Roadmap Stage Validation

const createRoadmapStageValidator = [

    body("roadmap")
        .notEmpty()
        .withMessage("Roadmap ID is required.")
        .isMongoId()
        .withMessage("Invalid roadmap ID."),

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Stage title is required.")
        .isLength({ min: 2, max: 150 })
        .withMessage(
            "Stage title must be between 2 and 150 characters."
        ),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage(
            "Stage description cannot exceed 2000 characters."
        ),

    body("stageNumber")
        .notEmpty()
        .withMessage("Stage number is required.")
        .isInt({ min: 1 })
        .withMessage(
            "Stage number must be a positive integer."
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
            "Invalid stage difficulty."
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

    body("projects")
        .optional()
        .isArray()
        .withMessage(
            "Projects must be an array."
        ),

    body("projects.*")
        .optional()
        .isMongoId()
        .withMessage(
            "Each project must contain a valid project ID."
        ),

    body("learningResources")
        .optional()
        .isArray()
        .withMessage(
            "Learning resources must be an array."
        ),

    body("learningResources.*")
        .optional()
        .isMongoId()
        .withMessage(
            "Each learning resource must contain a valid resource ID."
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


//Update Roadmap Stage Validation

const updateRoadmapStageValidator = [

    param("id")
        .isMongoId()
        .withMessage(
            "Invalid roadmap stage ID."
        ),

    body("roadmap")
        .optional()
        .isMongoId()
        .withMessage(
            "Invalid roadmap ID."
        ),

    body("title")
        .optional()
        .trim()
        .isLength({ min: 2, max: 150 })
        .withMessage(
            "Stage title must be between 2 and 150 characters."
        ),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage(
            "Stage description cannot exceed 2000 characters."
        ),

    body("stageNumber")
        .optional()
        .isInt({ min: 1 })
        .withMessage(
            "Stage number must be a positive integer."
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
            "Invalid stage difficulty."
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

    body("projects")
        .optional()
        .isArray()
        .withMessage(
            "Projects must be an array."
        ),

    body("projects.*")
        .optional()
        .isMongoId()
        .withMessage(
            "Each project must contain a valid project ID."
        ),

    body("learningResources")
        .optional()
        .isArray()
        .withMessage(
            "Learning resources must be an array."
        ),

    body("learningResources.*")
        .optional()
        .isMongoId()
        .withMessage(
            "Each learning resource must contain a valid resource ID."
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


//Roadmap Stage ID Validation

const roadmapStageIdValidator = [

    param("id")
        .isMongoId()
        .withMessage(
            "Invalid roadmap stage ID."
        )

];


//Roadmap ID Validation

const roadmapIdValidator = [

    param("roadmapId")
        .isMongoId()
        .withMessage(
            "Invalid roadmap ID."
        )

];


//Roadmap Stage Query Validation

const roadmapStageQueryValidator = [

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

    query("roadmap")
        .optional()
        .isMongoId()
        .withMessage(
            "Invalid roadmap ID."
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
            "Invalid stage difficulty."
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
            "Invalid stage status."
        ),

    query("sortBy")
        .optional()
        .trim()
        .isIn([
            "stageNumber",
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

const roadmapStageDisplayOrderValidator = [

    param("id")
        .isMongoId()
        .withMessage(
            "Invalid roadmap stage ID."
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


//Stage Number Validation

const roadmapStageNumberValidator = [

    body("stageNumber")
        .notEmpty()
        .withMessage(
            "Stage number is required."
        )
        .isInt({ min: 1 })
        .withMessage(
            "Stage number must be a positive integer."
        )

];


//Export Validators

module.exports = {

    createRoadmapStageValidator,

    updateRoadmapStageValidator,

    roadmapStageIdValidator,

    roadmapIdValidator,

    roadmapStageQueryValidator,

    roadmapStageDisplayOrderValidator,

    roadmapStageNumberValidator

};