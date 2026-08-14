const { body, param, query } = require("express-validator");


//Create Project Validation

const createProjectValidator = [

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Project title is required.")
        .isLength({ min: 2, max: 150 })
        .withMessage(
            "Project title must be between 2 and 150 characters."
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

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Project description is required."),

    body("shortDescription")
        .optional()
        .trim()
        .isLength({ max: 300 })
        .withMessage(
            "Short description cannot exceed 300 characters."
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
            "Invalid project difficulty."
        ),

    body("category")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage(
            "Project category cannot exceed 100 characters."
        ),

    body("estimatedDuration")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage(
            "Estimated duration cannot exceed 100 characters."
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

    body("technologies")
        .optional()
        .isArray()
        .withMessage(
            "Technologies must be an array."
        ),

    body("technologies.*")
        .optional()
        .isString()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage(
            "Each technology must be a valid string."
        ),

    body("githubUrl")
        .optional()
        .trim()
        .isURL()
        .withMessage(
            "GitHub URL must be a valid URL."
        ),

    body("demoUrl")
        .optional()
        .trim()
        .isURL()
        .withMessage(
            "Demo URL must be a valid URL."
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


//Update Project Validation

const updateProjectValidator = [

    param("id")
        .isMongoId()
        .withMessage(
            "Invalid project ID."
        ),

    body("title")
        .optional()
        .trim()
        .isLength({ min: 2, max: 150 })
        .withMessage(
            "Project title must be between 2 and 150 characters."
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

    body("difficulty")
        .optional()
        .trim()
        .isIn([
            "beginner",
            "intermediate",
            "advanced"
        ])
        .withMessage(
            "Invalid project difficulty."
        ),

    body("category")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage(
            "Project category cannot exceed 100 characters."
        ),

    body("estimatedDuration")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage(
            "Estimated duration cannot exceed 100 characters."
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

    body("technologies")
        .optional()
        .isArray()
        .withMessage(
            "Technologies must be an array."
        ),

    body("technologies.*")
        .optional()
        .isString()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage(
            "Each technology must be a valid string."
        ),

    body("githubUrl")
        .optional()
        .trim()
        .isURL()
        .withMessage(
            "GitHub URL must be a valid URL."
        ),

    body("demoUrl")
        .optional()
        .trim()
        .isURL()
        .withMessage(
            "Demo URL must be a valid URL."
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


//Project ID Validation

const projectIdValidator = [

    param("id")
        .isMongoId()
        .withMessage(
            "Invalid project ID."
        )

];


//Project Slug Validation

const projectSlugValidator = [

    param("slug")
        .trim()
        .notEmpty()
        .withMessage(
            "Project slug is required."
        )
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .withMessage(
            "Invalid project slug."
        )

];


//Project Query Validation

const projectQueryValidator = [

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
        .isLength({ max: 100 })
        .withMessage(
            "Category cannot exceed 100 characters."
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
            "Invalid project difficulty."
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
            "Invalid project status."
        ),

    query("sortBy")
        .optional()
        .trim()
        .isIn([
            "title",
            "category",
            "difficulty",
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

const projectDisplayOrderValidator = [

    param("id")
        .isMongoId()
        .withMessage(
            "Invalid project ID."
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

    createProjectValidator,

    updateProjectValidator,

    projectIdValidator,

    projectSlugValidator,

    projectQueryValidator,

    projectDisplayOrderValidator

};