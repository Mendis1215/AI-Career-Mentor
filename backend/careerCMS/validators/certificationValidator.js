const { body, param, query } = require("express-validator");


//Create Certification Validation

const createCertificationValidator = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Certification name is required.")
        .isLength({ min: 2, max: 150 })
        .withMessage(
            "Certification name must be between 2 and 150 characters."
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

    body("provider")
        .trim()
        .notEmpty()
        .withMessage("Certification provider is required.")
        .isLength({ max: 150 })
        .withMessage(
            "Provider name cannot exceed 150 characters."
        ),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage(
            "Certification description cannot exceed 2000 characters."
        ),

    body("url")
        .optional()
        .trim()
        .isURL()
        .withMessage(
            "Certification URL must be a valid URL."
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
            "Invalid certification level."
        ),

    body("duration")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage(
            "Duration cannot exceed 100 characters."
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

    body("isFree")
        .optional()
        .isBoolean()
        .withMessage(
            "isFree must be a boolean."
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


//Update Certification Validation

const updateCertificationValidator = [

    param("id")
        .isMongoId()
        .withMessage(
            "Invalid certification ID."
        ),

    body("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 150 })
        .withMessage(
            "Certification name must be between 2 and 150 characters."
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

    body("provider")
        .optional()
        .trim()
        .isLength({ min: 2, max: 150 })
        .withMessage(
            "Provider name must be between 2 and 150 characters."
        ),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage(
            "Certification description cannot exceed 2000 characters."
        ),

    body("url")
        .optional()
        .trim()
        .isURL()
        .withMessage(
            "Certification URL must be a valid URL."
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
            "Invalid certification level."
        ),

    body("duration")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage(
            "Duration cannot exceed 100 characters."
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

    body("isFree")
        .optional()
        .isBoolean()
        .withMessage(
            "isFree must be a boolean."
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


//Certification ID Validation

const certificationIdValidator = [

    param("id")
        .isMongoId()
        .withMessage(
            "Invalid certification ID."
        )

];


//Certification Slug Validation

const certificationSlugValidator = [

    param("slug")
        .trim()
        .notEmpty()
        .withMessage(
            "Certification slug is required."
        )
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .withMessage(
            "Invalid certification slug."
        )

];


//Certification Query Validation

const certificationQueryValidator = [

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

    query("provider")
        .optional()
        .trim()
        .isLength({ max: 150 })
        .withMessage(
            "Provider cannot exceed 150 characters."
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
            "Invalid certification level."
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
            "Invalid certification status."
        ),

    query("sortBy")
        .optional()
        .trim()
        .isIn([
            "name",
            "provider",
            "level",
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

const certificationDisplayOrderValidator = [

    param("id")
        .isMongoId()
        .withMessage(
            "Invalid certification ID."
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

    createCertificationValidator,

    updateCertificationValidator,

    certificationIdValidator,

    certificationSlugValidator,

    certificationQueryValidator,

    certificationDisplayOrderValidator

};