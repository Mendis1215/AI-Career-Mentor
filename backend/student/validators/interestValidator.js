const Joi = require("joi");

//MongoDB ObjectId Validation

const objectId = Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
        "string.pattern.base": "Invalid MongoDB ObjectId."
    });


//Interest Type
//Defines the type of interest the student is adding.

const interestType = Joi.string()
    .valid(
        "career",
        "technology",
        "domain",
        "learning"
    )
    .required()
    .messages({
        "any.only":
            "Interest type must be career, technology, domain, or learning.",
        "any.required":
            "Interest type is required."
    });


//Interest Level
//Indicates how strongly the student is interested in something.

const interestLevel = Joi.string()
    .valid(
        "low",
        "medium",
        "high"
    )
    .default("medium")
    .messages({
        "any.only":
            "Interest level must be low, medium, or high."
    });


//Create Student Interest Validation

const createInterestSchema = Joi.object({
    //Interest Reference

    interestId: objectId
        .required()
        .messages({
            "any.required":
                "Interest ID is required."
        }),

    //Interest Type

    interestType,

    //Interest Level

    interestLevel,

    //Priority
    //Used to identify which interests are more important to the student.

    priority: Joi.number()
        .integer()
        .min(1)
        .max(10)
        .default(5)
        .messages({
            "number.min":
                "Priority must be between 1 and 10.",
            "number.max":
                "Priority must be between 1 and 10."
        }),

    //Notes

    notes: Joi.string()
        .trim()
        .max(500)
        .allow("")
        .messages({
            "string.max":
                "Interest notes cannot exceed 500 characters."
        }),

    //Active Status

    isActive: Joi.boolean()
        .default(true)
});


//Update Student Interest Validation

const updateInterestSchema = Joi.object({
    //Interest Type

    interestType: Joi.string()
        .valid(
            "career",
            "technology",
            "domain",
            "learning"
        ),

    //Interest Level

    interestLevel: Joi.string()
        .valid(
            "low",
            "medium",
            "high"
        ),

    //Priority

    priority: Joi.number()
        .integer()
        .min(1)
        .max(10)
        .messages({
            "number.min":
                "Priority must be between 1 and 10.",
            "number.max":
                "Priority must be between 1 and 10."
        }),

    //Notes

    notes: Joi.string()
        .trim()
        .max(500)
        .allow("")
        .messages({
            "string.max":
                "Interest notes cannot exceed 500 characters."
        }),

    //Active Status

    isActive: Joi.boolean()
})
    .min(1)
    .messages({
        "object.min":
            "At least one interest field must be provided for update."
    });


//Interest ID Parameter Validation
//Used for routes such as:
// PUT    /api/student/interests/:interestId
// DELETE /api/student/interests/:interestId

const interestIdParamSchema = Joi.object({
    interestId: objectId.required()
});


//Export Validators

module.exports = {
    createInterestSchema,
    updateInterestSchema,
    interestIdParamSchema
};