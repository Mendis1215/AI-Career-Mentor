const { body, param, query } = require("express-validator");


//Create Career Validation

const createCareerValidator = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Career name is required.")
        .isLength({ min: 2, max: 100 })
        .withMessage(
            "Career name must be between 2 and 100 characters."
        ),

    body("slug")
        .optional()
        .trim()
        .isLength({ min: 2, max: 120 })
        .withMessage(
            "Slug must be between 2 and 120 characters."
        )
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .withMessage(
            "Slug can only contain lowercase letters, numbers, and hyphens."
        ),

    body("shortDescription")
        .trim()
        .notEmpty()
        .withMessage("Short description is required.")
        .isLength({ max: 300 })
        .withMessage(
            "Short description cannot exceed 300 characters."
        ),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Career description is required."),

    body("category")
        .trim()
        .notEmpty()
        .withMessage("Career category is required.")
        .isLength({ max: 100 })
        .withMessage(
            "Career category cannot exceed 100 characters."
        ),

    body("level")
        .optional()
        .trim()
        .isIn([
            "beginner",
            "intermediate",
            "advanced",
            "expert"
        ])
        .withMessage(
            "Invalid career level."
        ),

    body("salaryRange.min")
        .optional()
        .isNumeric()
        .withMessage(
            "Minimum salary must be a number."
        )
        .custom((value) => value >= 0)
        .withMessage(
            "Minimum salary cannot be negative."
        ),

    body("salaryRange.max")
        .optional()
        .isNumeric()
        .withMessage(
            "Maximum salary must be a number."
        )
        .custom((value) => value >= 0)
        .withMessage(
            "Maximum salary cannot be negative."
        ),

    body("demandLevel")
        .optional()
        .trim()
        .isIn([
            "low",
            "medium",
            "high",
            "very_high"
        ])
        .withMessage(
            "Invalid demand level."
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


/*
|--------------------------------------------------------------------------
| Update Career Validation
|--------------------------------------------------------------------------
*/

const updateCareerValidator = [

    param("id")
        .isMongoId()
        .withMessage(
            "Invalid career ID."
        ),

    body("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage(
            "Career name must be between 2 and 100 characters."
        ),

    body("slug")
        .optional()
        .trim()
        .isLength({ min: 2, max: 120 })
        .withMessage(
            "Slug must be between 2 and 120 characters."
        )
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .withMessage(
            "Slug can only contain lowercase letters, numbers, and hyphens."
        ),

    body("shortDescription")
        .optional()
        .trim()
        .isLength({ max: 300 })
        .withMessage(
            "Short description cannot exceed 300 characters."
        ),

    body("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage(
            "Description cannot be empty."
        ),

    body("category")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage(
            "Career category cannot exceed 100 characters."
        ),

    body("level")
        .optional()
        .trim()
        .isIn([
            "beginner",
            "intermediate",
            "advanced",
            "expert"
        ])
        .withMessage(
            "Invalid career level."
        ),

    body("salaryRange.min")
        .optional()
        .isNumeric()
        .withMessage(
            "Minimum salary must be a number."
        )
        .custom((value) => value >= 0)
        .withMessage(
            "Minimum salary cannot be negative."
        ),

    body("salaryRange.max")
        .optional()
        .isNumeric()
        .withMessage(
            "Maximum salary must be a number."
        )
        .custom((value) => value >= 0)
        .withMessage(
            "Maximum salary cannot be negative."
        ),

    body("demandLevel")
        .optional()
        .trim()
        .isIn([
            "low",
            "medium",
            "high",
            "very_high"
        ])
        .withMessage(
            "Invalid demand level."
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


//Career ID Validation

const careerIdValidator = [

    param("id")
        .isMongoId()
        .withMessage(
            "Invalid career ID."
        )

];


//Career Slug Validation

const careerSlugValidator = [

    param("slug")
        .trim()
        .notEmpty()
        .withMessage(
            "Career slug is required."
        )
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .withMessage(
            "Invalid career slug."
        )

];


//Career List Query Validation

const careerQueryValidator = [

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

    query("level")
        .optional()
        .trim()
        .isIn([
            "beginner",
            "intermediate",
            "advanced",
            "expert"
        ])
        .withMessage(
            "Invalid career level."
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
            "Invalid career status."
        ),

    query("sortBy")
        .optional()
        .trim()
        .isIn([
            "name",
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

const careerDisplayOrderValidator = [

    param("id")
        .isMongoId()
        .withMessage(
            "Invalid career ID."
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

    createCareerValidator,

    updateCareerValidator,

    careerIdValidator,

    careerSlugValidator,

    careerQueryValidator,

    careerDisplayOrderValidator

};