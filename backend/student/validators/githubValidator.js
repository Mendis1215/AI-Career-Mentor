const Joi = require("joi");

// GitHub Username Validation
// GitHub usernames can contain:
// - letters
// - numbers
// - hyphens
// Maximum length is 39 characters.

const githubUsername = Joi.string()
    .trim()
    .min(1)
    .max(39)
    .pattern(/^[a-zA-Z0-9-]+$/)
    .required()
    .messages({
        "any.required":
            "GitHub username is required.",

        "string.empty":
            "GitHub username is required.",

        "string.min":
            "GitHub username cannot be empty.",

        "string.max":
            "GitHub username cannot exceed 39 characters.",

        "string.pattern.base":
            "GitHub username contains invalid characters."
    });


// GitHub URL Validation

const githubUrl = Joi.string()
    .trim()
    .uri({
        scheme: [
            "http",
            "https"
        ]
    })
    .pattern(/^https?:\/\/(www\.)?github\.com\/.+/i)
    .max(500)
    .messages({
        "string.uri":
            "GitHub URL must be a valid HTTP or HTTPS URL.",

        "string.pattern.base":
            "URL must be a valid GitHub profile URL."
    });


// Connect GitHub Account
// Used when a student connects their GitHub account.

const connectGithubSchema = Joi.object({

    githubUsername,

    githubUrl: githubUrl
        .allow(" ")
        .allow(null),

    // Access Token
    // If OAuth is used, the token should normally NOT come directly
    // from a normal frontend request.
    // This field is optional here because the actual OAuth flow
    // will be handled by the integration layer.

    accessToken: Joi.string()
        .trim()
        .max(1000)
        .allow("")
        .allow(null)
});


// Update GitHub Profile Validation

const updateGithubSchema = Joi.object({

    githubUsername: Joi.string()
        .trim()
        .min(1)
        .max(39)
        .pattern(/^[a-zA-Z0-9-]+$/)
        .messages({
            "string.max":
                "GitHub username cannot exceed 39 characters.",

            "string.pattern.base":
                "GitHub username contains invalid characters."
        }),

    githubUrl: githubUrl
        .allow("")
        .allow(null),

    isConnected: Joi.boolean(),

    // Analysis Settings

    enableAnalysis: Joi.boolean()
})
    .min(1)
    .messages({
        "object.min":
            "At least one GitHub field must be provided for update."
    });


// GitHub Analysis Request Validation
// Used when the student asks the system to analyze
// their GitHub profile.

const githubAnalysisSchema = Joi.object({

    githubUsername: Joi.string()
        .trim()
        .min(1)
        .max(39)
        .pattern(/^[a-zA-Z0-9-]+$/)
        .required()
        .messages({
            "any.required":
                "GitHub username is required.",

            "string.empty":
                "GitHub username is required.",

            "string.pattern.base":
                "GitHub username contains invalid characters."
        }),

    // Analysis Options

    includeRepositories: Joi.boolean()
        .default(true),

    includeLanguages: Joi.boolean()
        .default(true),

    includeContributions: Joi.boolean()
        .default(true),

    includeTopics: Joi.boolean()
        .default(true),

    includeReadme: Joi.boolean()
        .default(true)
});


// GitHub Username Parameter Validation
// Used for routes such as:
// GET /api/student/github/:username

const githubUsernameParamSchema = Joi.object({

    username: Joi.string()
        .trim()
        .min(1)
        .max(39)
        .pattern(/^[a-zA-Z0-9-]+$/)
        .required()
        .messages({
            "any.required":
                "GitHub username is required.",

            "string.pattern.base":
                "Invalid GitHub username."
        })
});


// Export Validators

module.exports = {

    connectGithubSchema,

    updateGithubSchema,

    githubAnalysisSchema,

    githubUsernameParamSchema
};