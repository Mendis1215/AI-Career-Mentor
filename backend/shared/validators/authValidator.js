const Joi = require("joi");

//Registration Validation

const registerValidator = Joi.object({
    firstName: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
            "string.empty": "First name is required",
            "string.min": "First name must contain at least 2 characters",
            "string.max": "First name cannot exceed 50 characters",
            "any.required": "First name is required"
        }),

    lastName: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
            "string.empty": "Last name is required",
            "string.min": "Last name must contain at least 2 characters",
            "string.max": "Last name cannot exceed 50 characters",
            "any.required": "Last name is required"
        }),

    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .required()
        .messages({
            "string.empty": "Email is required",
            "string.email": "Please provide a valid email address",
            "any.required": "Email is required"
        }),

    password: Joi.string()
        .min(8)
        .max(128)
        .required()
        .messages({
            "string.empty": "Password is required",
            "string.min": "Password must contain at least 8 characters",
            "string.max": "Password cannot exceed 128 characters",
            "any.required": "Password is required"
        }),

    confirmPassword: Joi.any()
        .valid(Joi.ref("password"))
        .required()
        .messages({
            "any.only": "Passwords do not match",
            "any.required": "Please confirm your password"
        })
}).options({
    abortEarly: false,
    stripUnknown: true
});

//Login Validation

const loginValidator = Joi.object({
    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .required()
        .messages({
            "string.empty": "Email is required",
            "string.email": "Please provide a valid email address",
            "any.required": "Email is required"
        }),

    password: Joi.string()
        .required()
        .messages({
            "string.empty": "Password is required",
            "any.required": "Password is required"
        })
}).options({
    abortEarly: false,
    stripUnknown: true
});

//Validation Helper

const validate = (schema, data) => {
    const { error, value } = schema.validate(data);

    if (error) {
        const errors = error.details.map((detail) => ({
            field: detail.path.join("."),
            message: detail.message
        }));

        return {
            isValid: false,
            errors
        };
    }

    return {
        isValid: true,
        value
    };
};

//Export

module.exports = {
    registerValidator,
    loginValidator,
    validate
};