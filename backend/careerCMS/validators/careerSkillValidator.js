const { body, param, query } = require("express-validator");


//Create Career-Skill Validation

const createCareerSkillValidator = [

    body("career")
        .notEmpty()
        .withMessage("Career ID is required.")
        .isMongoId()
        .withMessage("Invalid career ID."),

    body("skill")
        .notEmpty()
        .withMessage("Skill ID is required.")
        .isMongoId()
        .withMessage("Invalid skill ID."),

    body("importance")
        .optional()
        .trim()
        .isIn([
            "low",
            "medium",
            "high",
            "critical"
        ])
        .withMessage(
            "Invalid skill importance."
        ),

    body("requiredLevel")
        .optional()
        .trim()
        .isIn([
            "beginner",
            "intermediate",
            "advanced",
            "expert"
        ])
        .withMessage(
            "Invalid required skill level."
        ),

    body("weight")
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage(
            "Weight must be between 0 and 100."
        ),

    body("isRequired")
        .optional()
        .isBoolean()
        .withMessage(
            "isRequired must be a boolean."
        ),

    body("displayOrder")
        .optional()
        .isInt({ min: 0 })
        .withMessage(
            "Display order must be a non-negative integer."
        )

];


//Update Career-Skill Validation

const updateCareerSkillValidator = [

    param("id")
        .isMongoId()
        .withMessage(
            "Invalid career-skill ID."
        ),

    body("career")
        .optional()
        .isMongoId()
        .withMessage(
            "Invalid career ID."
        ),

    body("skill")
        .optional()
        .isMongoId()
        .withMessage(
            "Invalid skill ID."
        ),

    body("importance")
        .optional()
        .trim()
        .isIn([
            "low",
            "medium",
            "high",
            "critical"
        ])
        .withMessage(
            "Invalid skill importance."
        ),

    body("requiredLevel")
        .optional()
        .trim()
        .isIn([
            "beginner",
            "intermediate",
            "advanced",
            "expert"
        ])
        .withMessage(
            "Invalid required skill level."
        ),

    body("weight")
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage(
            "Weight must be between 0 and 100."
        ),

    body("isRequired")
        .optional()
        .isBoolean()
        .withMessage(
            "isRequired must be a boolean."
        ),

    body("displayOrder")
        .optional()
        .isInt({ min: 0 })
        .withMessage(
            "Display order must be a non-negative integer."
        )

];


//Career-Skill ID Validation

const careerSkillIdValidator = [

    param("id")
        .isMongoId()
        .withMessage(
            "Invalid career-skill ID."
        )

];


//Career ID Validation

const careerIdValidator = [

    param("careerId")
        .isMongoId()
        .withMessage(
            "Invalid career ID."
        )

];


//Skill ID Validation

const skillIdValidator = [

    param("skillId")
        .isMongoId()
        .withMessage(
            "Invalid skill ID."
        )

];


//Career-Skill Query Validation

const careerSkillQueryValidator = [

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

    query("importance")
        .optional()
        .trim()
        .isIn([
            "low",
            "medium",
            "high",
            "critical"
        ])
        .withMessage(
            "Invalid skill importance."
        ),

    query("requiredLevel")
        .optional()
        .trim()
        .isIn([
            "beginner",
            "intermediate",
            "advanced",
            "expert"
        ])
        .withMessage(
            "Invalid required skill level."
        ),

    query("isRequired")
        .optional()
        .isBoolean()
        .withMessage(
            "isRequired must be a boolean."
        ),

    query("sortBy")
        .optional()
        .trim()
        .isIn([
            "importance",
            "weight",
            "displayOrder",
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


//Display Order Validation

const careerSkillDisplayOrderValidator = [

    param("id")
        .isMongoId()
        .withMessage(
            "Invalid career-skill ID."
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

    createCareerSkillValidator,

    updateCareerSkillValidator,

    careerSkillIdValidator,

    careerIdValidator,

    skillIdValidator,

    careerSkillQueryValidator,

    careerSkillDisplayOrderValidator

};