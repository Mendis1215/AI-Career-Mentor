const Joi = require("joi");

//ObjectId Validation
//MongoDB ObjectIds contain 24 hexadecimal characters.

const objectId = Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
        "string.pattern.base": "Invalid MongoDB ObjectId."
    });


//Create Student Skill Validation

const createSkillSchema = Joi.object({
    //Skill Reference

    skillId: objectId
        .required()
        .messages({
            "any.required": "Skill ID is required."
        }),

    //Proficiency Level

    proficiencyLevel: Joi.string()
        .valid(
            "beginner",
            "intermediate",
            "advanced",
            "expert"
        )
        .required()
        .messages({
            "any.only":
                "Proficiency level must be beginner, intermediate, advanced, or expert.",
            "any.required":
                "Proficiency level is required."
        }),

    //Proficiency Score

    proficiencyScore: Joi.number()
        .integer()
        .min(0)
        .max(100)
        .default(0)
        .messages({
            "number.min":
                "Proficiency score cannot be less than 0.",
            "number.max":
                "Proficiency score cannot be greater than 100."
        }),

    //Learning Status

    learningStatus: Joi.string()
        .valid(
            "not_started",
            "learning",
            "completed"
        )
        .default("not_started")
        .messages({
            "any.only":
                "Learning status must be not_started, learning, or completed."
        }),

    //Evidence

    evidence: Joi.string()
        .trim()
        .max(500)
        .allow("")
        .messages({
            "string.max":
                "Evidence cannot exceed 500 characters."
        }),

    //Years of Experience

    yearsOfExperience: Joi.number()
        .min(0)
        .max(50)
        .default(0)
        .messages({
            "number.min":
                "Years of experience cannot be negative.",
            "number.max":
                "Years of experience cannot exceed 50."
        }),

    //Last Used Date

    lastUsedAt: Joi.date()
        .iso()
        .max("now")
        .allow(null)
        .messages({
            "date.format":
                "Last used date must be a valid ISO date.",
            "date.max":
                "Last used date cannot be in the future."
        }),

    //Verification
    //Students normally create skills as self-reported.
    //The service layer should control verification.

    isVerified: Joi.boolean()
        .default(false),

    verificationSource: Joi.string()
        .valid(
            "self",
            "project",
            "certification",
            "github",
            "admin"
        )
        .default("self")
});


//Update Student Skill Validation

const updateSkillSchema = Joi.object({
    //Proficiency Level

    proficiencyLevel: Joi.string()
        .valid(
            "beginner",
            "intermediate",
            "advanced",
            "expert"
        ),

    //Proficiency Score

    proficiencyScore: Joi.number()
        .integer()
        .min(0)
        .max(100),

    //Learning Status

    learningStatus: Joi.string()
        .valid(
            "not_started",
            "learning",
            "completed"
        ),

    //Evidence

    evidence: Joi.string()
        .trim()
        .max(500)
        .allow(""),

    //Years of Experience

    yearsOfExperience: Joi.number()
        .min(0)
        .max(50),

    //Last Used Date

    lastUsedAt: Joi.date()
        .iso()
        .max("now")
        .allow(null),

    //Active Status

    isVerified: Joi.boolean(),

    verificationSource: Joi.string()
        .valid(
            "self",
            "project",
            "certification",
            "github",
            "admin"
        )
})
    .min(1)
    .messages({
        "object.min":
            "At least one skill field must be provided for update."
    });


//Skill ID Parameter Validation
//Used for routes such as:
//
//PUT /api/student/skills/:skillId
//DELETE /api/student/skills/:skillId

const skillIdParamSchema = Joi.object({
    skillId: objectId.required()
});


//Export Validators

module.exports = {
    createSkillSchema,
    updateSkillSchema,
    skillIdParamSchema
};