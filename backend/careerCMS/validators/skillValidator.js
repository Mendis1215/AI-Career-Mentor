const { body, param, query } = require("express-validator");


//Create Skill Validation

const createSkillValidator = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Skill name is required.")
        .isLength({ min: 2, max: 100 })
        .withMessage(
            "Skill name must be between 2 and 100 characters."
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

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Skill description is required."),

    body("category")
        .trim()
        .notEmpty()
        .withMessage("Skill category is required.")
        .isLength({ max: 100 })
        .withMessage(
            "Skill category cannot exceed 100 characters."
        ),

    body("type")
        .optional()
        .trim()
        .isIn([
            "technical",
            "soft",
            "tool",
            "domain"
        ])
        .withMessage(
            "Invalid skill type."
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
            "Invalid skill level."
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


//Update Skill Validation

const updateSkillValidator = [

    param("id")
        .isMongoId()
        .withMessage(
            "Invalid skill ID."
        ),

    body("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage(
            "Skill name must be between 2 and 100 characters."
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
            "Skill category cannot exceed 100 characters."
        ),

    body("type")
        .optional()
        .trim()
        .isIn([
            "technical",
            "soft",
            "tool",
            "domain"
        ])
        .withMessage(
            "Invalid skill type."
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
            "Invalid skill level."
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


//Skill ID Validation

const skillIdValidator = [

    param("id")
        .isMongoId()
        .withMessage(
            "Invalid skill ID."
        )

];


//Skill Slug Validation

const skillSlugValidator = [

    param("slug")
        .trim()
        .notEmpty()
        .withMessage(
            "Skill slug is required."
        )
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .withMessage(
            "Invalid skill slug."
        )

];


//Skill Category Validation

const skillCategoryValidator = [

    param("category")
        .trim()
        .notEmpty()
        .withMessage(
            "Skill category is required."
        )
        .isLength({ max: 100 })
        .withMessage(
            "Skill category cannot exceed 100 characters."
        )

];


//Skill Level Validation

const skillLevelValidator = [

    param("level")
        .trim()
        .notEmpty()
        .withMessage(
            "Skill level is required."
        )
        .isIn([
            "beginner",
            "intermediate",
            "advanced",
            "expert"
        ])
        .withMessage(
            "Invalid skill level."
        )

];


//Skill List Query Validation

const skillQueryValidator = [

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

    query("type")
        .optional()
        .trim()
        .isIn([
            "technical",
            "soft",
            "tool",
            "domain"
        ])
        .withMessage(
            "Invalid skill type."
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
            "Invalid skill level."
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
            "Invalid skill status."
        ),

    query("sortBy")
        .optional()
        .trim()
        .isIn([
            "name",
            "category",
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


//Skill Display Order Validation

const skillDisplayOrderValidator = [

    param("id")
        .isMongoId()
        .withMessage(
            "Invalid skill ID."
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

    createSkillValidator,

    updateSkillValidator,

    skillIdValidator,

    skillSlugValidator,

    skillCategoryValidator,

    skillLevelValidator,

    skillQueryValidator,

    skillDisplayOrderValidator

};