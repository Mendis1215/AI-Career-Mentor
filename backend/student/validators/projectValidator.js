const Joi = require("joi");

//MongoDB ObjectId Validation

const objectId = Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
        "string.pattern.base": "Invalid MongoDB ObjectId."
    });


//Project URL Validation

const projectUrl = Joi.string()
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
            "Project URL must be a valid HTTP or HTTPS URL."
    });


//GitHub Repository URL Validation

const githubRepositoryUrl = Joi.string()
    .trim()
    .uri({
        scheme: [
            "http",
            "https"
        ]
    })
    .pattern(/^https?:\/\/(www\.)?github\.com\/.+/i)
    .max(500)
    .allow("")
    .allow(null)
    .messages({
        "string.uri":
            "GitHub repository URL must be a valid HTTP or HTTPS URL.",

        "string.pattern.base":
            "URL must be a valid GitHub repository URL."
    });


//Project Status

const projectStatus = Joi.string()
    .valid(
        "planned",
        "in_progress",
        "completed"
    )
    .default("planned")
    .messages({
        "any.only":
            "Project status must be planned, in_progress, or completed."
    });


//Project Type

const projectType = Joi.string()
    .valid(
        "academic",
        "personal",
        "team",
        "professional"
    )
    .required()
    .messages({
        "any.required":
            "Project type is required.",

        "any.only":
            "Project type must be academic, personal, team, or professional."
    });


//Create Student Project Validation

const createProjectSchema = Joi.object({

    //Project Title

    title: Joi.string()
        .trim()
        .min(2)
        .max(200)
        .required()
        .messages({
            "any.required":
                "Project title is required.",

            "string.empty":
                "Project title is required.",

            "string.min":
                "Project title must contain at least 2 characters.",

            "string.max":
                "Project title cannot exceed 200 characters."
        }),

    //Project Description

    description: Joi.string()
        .trim()
        .min(10)
        .max(2000)
        .required()
        .messages({
            "any.required":
                "Project description is required.",

            "string.empty":
                "Project description is required.",

            "string.min":
                "Project description must contain at least 10 characters.",

            "string.max":
                "Project description cannot exceed 2000 characters."
        }),

    //Project Type

    projectType,

    //Project Status

    status: projectStatus,

    //Technologies
    //Example: ["Python", "Pandas", "Scikit-learn"]

    technologies: Joi.array()
        .items(
            Joi.string()
                .trim()
                .min(1)
                .max(100)
        )
        .unique()
        .max(30)
        .default([])
        .messages({
            "array.max":
                "A project cannot contain more than 30 technologies."
        }),

    //Related Skills

    relatedSkills: Joi.array()
        .items(objectId)
        .unique()
        .max(30)
        .default([])
        .messages({
            "array.max":
                "A project cannot contain more than 30 related skills."
        }),

    //GitHub Repository

    githubUrl: githubRepositoryUrl,

    //Live Project URL

    projectUrl,

    //Start Date

    startDate: Joi.date()
        .iso()
        .max("now")
        .allow(null)
        .messages({
            "date.format":
                "Start date must be a valid ISO date.",

            "date.max":
                "Start date cannot be in the future."
        }),

    //End Date

    endDate: Joi.date()
        .iso()
        .max("now")
        .allow(null)
        .messages({
            "date.format":
                "End date must be a valid ISO date.",

            "date.max":
                "End date cannot be in the future."
        }),

    //Team Size

    teamSize: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(1)
        .messages({
            "number.min":
                "Team size must be at least 1.",

            "number.max":
                "Team size cannot exceed 100."
        }),

    //Role
    //Student's role in the project.

    role: Joi.string()
        .trim()
        .max(200)
        .allow("")
        .allow(null),

    //Project Outcome

    outcome: Joi.string()
        .trim()
        .max(1000)
        .allow("")
        .allow(null),

    //Is Featured

    isFeatured: Joi.boolean()
        .default(false),

    //Active Status

    isActive: Joi.boolean()
        .default(true)
})
    .custom((value, helpers) => {

        //Validate project dates

        if (
            value.startDate &&
            value.endDate &&
            value.endDate < value.startDate
        ) {
            return helpers.error(
                "any.custom",
                {
                    message:
                        "End date cannot be before start date."
                }
            );
        }

        //Completed projects should have an end date

        if (
            value.status === "completed" &&
            !value.endDate
        ) {
            return helpers.error(
                "any.custom",
                {
                    message:
                        "Completed projects must have an end date."
                }
            );
        }

        return value;
    });


//Update Student Project Validation

const updateProjectSchema = Joi.object({

    title: Joi.string()
        .trim()
        .min(2)
        .max(200),

    description: Joi.string()
        .trim()
        .min(10)
        .max(2000),

    projectType: Joi.string()
        .valid(
            "academic",
            "personal",
            "team",
            "professional"
        ),

    status: Joi.string()
        .valid(
            "planned",
            "in_progress",
            "completed"
        ),

    technologies: Joi.array()
        .items(
            Joi.string()
                .trim()
                .min(1)
                .max(100)
        )
        .unique()
        .max(30),

    relatedSkills: Joi.array()
        .items(objectId)
        .unique()
        .max(30),

    githubUrl: githubRepositoryUrl,

    projectUrl,

    startDate: Joi.date()
        .iso()
        .max("now")
        .allow(null),

    endDate: Joi.date()
        .iso()
        .max("now")
        .allow(null),

    teamSize: Joi.number()
        .integer()
        .min(1)
        .max(100),

    role: Joi.string()
        .trim()
        .max(200)
        .allow("")
        .allow(null),

    outcome: Joi.string()
        .trim()
        .max(1000)
        .allow("")
        .allow(null),

    isFeatured: Joi.boolean(),

    isActive: Joi.boolean()

})
    .min(1)
    .custom((value, helpers) => {

        //Validate dates when both are supplied

        if (
            value.startDate &&
            value.endDate &&
            value.endDate < value.startDate
        ) {
            return helpers.error(
                "any.custom",
                {
                    message:
                        "End date cannot be before start date."
                }
            );
        }

        //Validate completed status

        if (
            value.status === "completed" &&
            !value.endDate
        ) {
            return helpers.error(
                "any.custom",
                {
                    message:
                        "Completed projects must have an end date."
                }
            );
        }

        return value;
    })
    .messages({
        "object.min":
            "At least one project field must be provided for update."
    });


//Project ID Parameter Validation

//Used for:
// GET    /api/student/projects/:projectId
// PUT    /api/student/projects/:projectId
// DELETE /api/student/projects/:projectId

const projectIdParamSchema = Joi.object({

    projectId: objectId.required()

});


//Export Validators

module.exports = {

    createProjectSchema,

    updateProjectSchema,

    projectIdParamSchema

};