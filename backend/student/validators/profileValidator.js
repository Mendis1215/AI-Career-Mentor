const Joi = require("joi");

//Update Student Profile Validation
//Used when a student creates or updates their profile.

const updateProfileSchema = Joi.object({
    firstName: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .messages({
            "string.empty": "First name is required.",
            "string.min": "First name must contain at least 2 characters.",
            "string.max": "First name cannot exceed 50 characters."
        }),

    lastName: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .messages({
            "string.empty": "Last name is required.",
            "string.min": "Last name must contain at least 2 characters.",
            "string.max": "Last name cannot exceed 50 characters."
        }),

    phone: Joi.string()
        .trim()
        .pattern(/^[0-9+\-\s()]{7,20}$/)
        .messages({
            "string.pattern.base": "Please provide a valid phone number."
        }),

    dateOfBirth: Joi.date()
        .iso()
        .max("now")
        .messages({
            "date.format": "Date of birth must be a valid ISO date.",
            "date.max": "Date of birth cannot be in the future."
        }),

    university: Joi.string()
        .trim()
        .max(200),

    degreeProgram: Joi.string()
        .trim()
        .max(200),

    academicYear: Joi.string()
        .trim()
        .max(50),

    graduationYear: Joi.number()
        .integer()
        .min(2000)
        .max(2100),

    bio: Joi.string()
        .trim()
        .max(1000),

    profileImage: Joi.string()
        .trim()
        .max(500),

    location: Joi.string()
        .trim()
        .max(200),

    careerGoal: Joi.string()
        .trim()
        .max(500),

    isProfilePublic: Joi.boolean()
}).min(1);


//Create Student Profile Validation
//Used when creating a new student profile.

const createProfileSchema = Joi.object({
    firstName: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
            "any.required": "First name is required.",
            "string.empty": "First name is required.",
            "string.min": "First name must contain at least 2 characters.",
            "string.max": "First name cannot exceed 50 characters."
        }),

    lastName: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
            "any.required": "Last name is required.",
            "string.empty": "Last name is required.",
            "string.min": "Last name must contain at least 2 characters.",
            "string.max": "Last name cannot exceed 50 characters."
        }),

    phone: Joi.string()
        .trim()
        .pattern(/^[0-9+\-\s()]{7,20}$/)
        .messages({
            "string.pattern.base": "Please provide a valid phone number."
        }),

    dateOfBirth: Joi.date()
        .iso()
        .max("now")
        .messages({
            "date.format": "Date of birth must be a valid ISO date.",
            "date.max": "Date of birth cannot be in the future."
        }),

    university: Joi.string()
        .trim()
        .max(200)
        .required()
        .messages({
            "any.required": "University is required.",
            "string.empty": "University is required."
        }),

    degreeProgram: Joi.string()
        .trim()
        .max(200)
        .required()
        .messages({
            "any.required": "Degree program is required.",
            "string.empty": "Degree program is required."
        }),

    academicYear: Joi.string()
        .trim()
        .max(50),

    graduationYear: Joi.number()
        .integer()
        .min(2000)
        .max(2100),

    bio: Joi.string()
        .trim()
        .max(1000),

    profileImage: Joi.string()
        .trim()
        .max(500),

    location: Joi.string()
        .trim()
        .max(200),

    careerGoal: Joi.string()
        .trim()
        .max(500),

    isProfilePublic: Joi.boolean()
});


//Export Validators

module.exports = {
    createProfileSchema,
    updateProfileSchema
};