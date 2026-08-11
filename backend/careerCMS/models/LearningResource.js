const mongoose = require("mongoose");


//Learning Resource Schema

const learningResourceSchema = new mongoose.Schema(
    {

        //Basic Resource Information

        title: {
            type: String,
            required: [true, "Resource title is required."],
            trim: true,
            minlength: [
                2,
                "Resource title must contain at least 2 characters."
            ],
            maxlength: [
                200,
                "Resource title cannot exceed 200 characters."
            ]
        },


        slug: {
            type: String,
            required: [true, "Resource slug is required."],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                "Resource slug must contain only lowercase letters, numbers and hyphens."
            ]
        },


        shortDescription: {
            type: String,
            required: [true, "Short description is required."],
            trim: true,
            maxlength: [
                500,
                "Short description cannot exceed 500 characters."
            ]
        },


        description: {
            type: String,
            trim: true,
            default: ""
        },


        //Resource Type

        type: {
            type: String,
            required: [true, "Resource type is required."],
            enum: [
                "Course",
                "Video",
                "Article",
                "Documentation",
                "Book",
                "Tutorial",
                "Practice",
                "Project Guide",
                "Certification Preparation",
                "Other"
            ],
            index: true
        },


        //Provider / Platform

        provider: {
            type: String,
            required: [true, "Resource provider is required."],
            trim: true,
            maxlength: [
                150,
                "Provider name cannot exceed 150 characters."
            ]
        },


        providerUrl: {
            type: String,
            trim: true,
            default: null
        },


        resourceUrl: {
            type: String,
            required: [true, "Resource URL is required."],
            trim: true
        },


        //Related Skills

        skills: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Skill"
            }
        ],


        //Related Careers

        careers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Career"
            }
        ],


        //Difficulty

        difficulty: {
            type: String,
            enum: [
                "Beginner",
                "Intermediate",
                "Advanced",
                "Expert"
            ],
            default: "Beginner",
            index: true
        },


        //Language

        language: {
            type: String,
            trim: true,
            default: "English"
        },


        //Free / Paid

        pricing: {

            type: {
                type: String,
                enum: [
                    "Free",
                    "Paid",
                    "Freemium"
                ],
                default: "Free"
            },

            amount: {
                type: Number,
                min: 0,
                default: 0
            },

            currency: {
                type: String,
                trim: true,
                default: "USD"
            }

        },


        //Estimated Learning Time

        estimatedDuration: {

            value: {
                type: Number,
                min: 0,
                default: null
            },

            unit: {
                type: String,
                enum: [
                    "minutes",
                    "hours",
                    "days",
                    "weeks",
                    "months"
                ],
                default: "hours"
            }

        },


        //Resource Level / Sequence

        learningOrder: {
            type: Number,
            min: 0,
            default: 0
        },


        //Learning Objectives

        learningObjectives: [
            {
                type: String,
                trim: true
            }
        ],


        //Resource Tags

        tags: [
            {
                type: String,
                trim: true,
                lowercase: true
            }
        ],


        //Rating

        rating: {

            value: {
                type: Number,
                min: 0,
                max: 5,
                default: null
            },

            reviewCount: {
                type: Number,
                min: 0,
                default: 0
            }

        },


        //Thumbnail

        thumbnailUrl: {
            type: String,
            trim: true,
            default: null
        },


        //External Resource

        isExternal: {
            type: Boolean,
            default: true
        },


        //Resource Status

        status: {
            type: String,
            enum: [
                "draft",
                "published",
                "archived"
            ],
            default: "draft",
            index: true
        },


        //Featured Resource

        featured: {
            type: Boolean,
            default: false
        },


        //Display Order

        displayOrder: {
            type: Number,
            min: 0,
            default: 0
        },


        //CMS Metadata

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }

    },

    {
        timestamps: true
    }

);


//Indexes

learningResourceSchema.index({
    title: "text",
    shortDescription: "text",
    description: "text",
    provider: "text"
});

learningResourceSchema.index({
    type: 1,
    difficulty: 1,
    status: 1
});

learningResourceSchema.index({
    skills: 1,
    status: 1
});

learningResourceSchema.index({
    careers: 1,
    status: 1
});

learningResourceSchema.index({
    featured: 1,
    displayOrder: 1
});

learningResourceSchema.index({
    tags: 1
});


//Validation

learningResourceSchema.pre(
    "save",
    function (next) {

        //Free Resource Validation

        if (
            this.pricing &&
            this.pricing.type === "Free"
        ) {

            this.pricing.amount = 0;

        }


        //Rating Validation

        if (
            this.rating &&
            this.rating.value !== null &&
            this.rating.reviewCount === 0
        ) {

            this.rating.reviewCount = 1;

        }


        //Published Resource Validation

        if (
            this.status === "published" &&
            (
                !this.title ||
                !this.resourceUrl ||
                !this.provider
            )
        ) {

            return next(
                new Error(
                    "A published resource must have a title, URL and provider."
                )
            );

        }


        next();

    }
);


//Model

const LearningResource = mongoose.model(
    "LearningResource",
    learningResourceSchema
);


module.exports = LearningResource;