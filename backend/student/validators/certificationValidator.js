const Joi = require("joi");

//MongoDB ObjectId Validation

const objectId = Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
        "string.pattern.base": "Invalid MongoDB ObjectId."
    });


// Create Student Certification Validation

const createCertificationSchema = Joi.object({
    // Certification Name

    certificationName: Joi.string()
        .trim()
        .min(2)
        .max(200)
        .required()
        .messages({
            "any.required": "Certification name is required.",
            "string.empty": "Certification name is required.",
            "string.min":
                "Certification name must contain at least 2 characters.",
            "string.max":
                "Certification name cannot exceed 200 characters."
        }),

    // Issuing Organization

    issuingOrganization: Joi.string()
        .trim()
        .min(2)
        .max(200)
        .required()
        .messages({
            "any.required":
                "Issuing organization is required.",
            "string.empty":
                "Issuing organization is required.",
            "string.min":
                "Issuing organization must contain at least 2 characters.",
            "string.max":
                "Issuing organization cannot exceed 200 characters."
        }),

    // Credential ID

    credentialId: Joi.string()
        .trim()
        .max(200)
        .allow("")
        .allow(null),

    // Credential URL

    credentialUrl: Joi.string()
        .trim()
        .uri({
            scheme: [
                "http",
                "https"
            ]
        })
        .max(500)
        .allow("")
        .allow(null)
        .messages({
            "string.uri":
                "Credential URL must be a valid HTTP or HTTPS URL."
        }),

    // Issue Date

    issueDate: Joi.date()
        .iso()
        .max("now")
        .required()
        .messages({
            "any.required":
                "Issue date is required.",
            "date.format":
                "Issue date must be a valid ISO date.",
            "date.max":
                "Issue date cannot be in the future."
        }),

    // Expiration Date

    expirationDate: Joi.date()
        .iso()
        .min(Joi.ref("issueDate"))
        .allow(null)
        .messages({
            "date.format":
                "Expiration date must be a valid ISO date.",
            "date.min":
                "Expiration date cannot be before the issue date."
        }),

    // Does Not Expire

    doesNotExpire: Joi.boolean()
        .default(false),

    // Certification Provider

    provider: Joi.string()
        .trim()
        .max(200)
        .allow("")
        .allow(null),

    // Related Skills

    relatedSkills: Joi.array()
        .items(
            objectId
        )
        .unique()
        .max(20)
        .default([])
        .messages({
            "array.max":
                "A certification cannot contain more than 20 related skills."
        }),

    // Description

    description: Joi.string()
        .trim()
        .max(1000)
        .allow("")
        .allow(null),

    // Verification Status
    // This should normally be controlled by the backend.

    verificationStatus: Joi.string()
        .valid(
            "pending",
            "verified",
            "rejected"
        )
        .default("pending"),

    // Active Status
    // This should normally be controlled by the backend.

    isActive: Joi.boolean()
        .default(true)
});


// Create Certification Cross-Field Validation
// If doesNotExpire = true, expirationDate should not be supplied.

const createCertificationValidation =
    createCertificationSchema.custom((value, helpers) => {

        if (
            value.doesNotExpire === true &&
            value.expirationDate
        ) {
            return helpers.error(
                "any.custom",
                {
                    message:
                        "Expiration date should not be provided when the certification does not expire."
                }
            );
        }

        return value;
    });


// Update Student Certification Validation

const updateCertificationSchema = Joi.object({
    certificationName: Joi.string()
        .trim()
        .min(2)
        .max(200),

    issuingOrganization: Joi.string()
        .trim()
        .min(2)
        .max(200),

    credentialId: Joi.string()
        .trim()
        .max(200)
        .allow("")
        .allow(null),

    credentialUrl: Joi.string()
        .trim()
        .uri({
            scheme: [
                "http",
                "https"
            ]
        })
        .max(500)
        .allow("")
        .allow(null)
        .messages({
            "string.uri":
                "Credential URL must be a valid HTTP or HTTPS URL."
        }),

    issueDate: Joi.date()
        .iso()
        .max("now"),

    expirationDate: Joi.date()
        .iso()
        .allow(null),

    doesNotExpire: Joi.boolean(),

    provider: Joi.string()
        .trim()
        .max(200)
        .allow("")
        .allow(null),

    relatedSkills: Joi.array()
        .items(
            objectId
        )
        .unique()
        .max(20),

    description: Joi.string()
        .trim()
        .max(1000)
        .allow("")
        .allow(null),

    isActive: Joi.boolean()
})
    .min(1)
    .custom((value, helpers) => {

        // Validate expiration date against issue date

        if (
            value.issueDate &&
            value.expirationDate &&
            value.expirationDate < value.issueDate
        ) {
            return helpers.error(
                "any.custom",
                {
                    message:
                        "Expiration date cannot be before the issue date."
                }
            );
        }

        // Validate non-expiring certification

        if (
            value.doesNotExpire === true &&
            value.expirationDate
        ) {
            return helpers.error(
                "any.custom",
                {
                    message:
                        "Expiration date should not be provided when the certification does not expire."
                }
            );
        }

        return value;
    })
    .messages({
        "object.min":
            "At least one certification field must be provided for update."
    });


// Certification ID Parameter Validation
// Used for:
// PUT    /api/student/certifications/:certificationId
// DELETE /api/student/certifications/:certificationId

const certificationIdParamSchema = Joi.object({
    certificationId: objectId.required()
});


// Export Validators

module.exports = {
    createCertificationSchema:
        createCertificationValidation,

    updateCertificationSchema,

    certificationIdParamSchema
};