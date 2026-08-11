const mongoose = require("mongoose");


//Roadmap Schema

const roadmapSchema = new mongoose.Schema(
    {

        //Career Reference

        career: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Career",
            required: [true, "Career is required."],
            index: true
        },


        //Roadmap Basic Information

        title: {
            type: String,
            required: [true, "Roadmap title is required."],
            trim: true,
            minlength: [
                2,
                "Roadmap title must contain at least 2 characters."
            ],
            maxlength: [
                150,
                "Roadmap title cannot exceed 150 characters."
            ]
        },


        slug: {
            type: String,
            required: [true, "Roadmap slug is required."],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                "Roadmap slug must contain only lowercase letters, numbers and hyphens."
            ]
        },


        description: {
            type: String,
            required: [true, "Roadmap description is required."],
            trim: true,
            maxlength: [
                2000,
                "Roadmap description cannot exceed 2000 characters."
            ]
        },


        //Roadmap Type

        type: {
            type: String,
            enum: [
                "Beginner",
                "Intermediate",
                "Advanced",
                "Complete"
            ],
            default: "Complete"
        },


        //Estimated Duration

        estimatedDuration: {

            value: {
                type: Number,
                min: 0,
                default: null
            },

            unit: {
                type: String,
                enum: [
                    "days",
                    "weeks",
                    "months"
                ],
                default: "months"
            }

        },


        //Difficulty

        difficulty: {
            type: String,
            enum: [
                "Beginner",
                "Intermediate",
                "Advanced"
            ],
            default: "Beginner"
        },


        //Target Audience

        targetAudience: [
            {
                type: String,
                trim: true
            }
        ],


        //Prerequisites

        prerequisites: [
            {
                type: String,
                trim: true
            }
        ],


        //Learning Outcomes

        learningOutcomes: [
            {
                type: String,
                trim: true
            }
        ],


        //Roadmap Status

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


        //Default Roadmap

        isDefault: {
            type: Boolean,
            default: false,
            index: true
        },


        //Featured Roadmap

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


        //Version
        //Useful when the admin updates an existing roadmap.

        version: {
            type: Number,
            min: 1,
            default: 1
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

roadmapSchema.index({
    career: 1,
    status: 1
});

roadmapSchema.index({
    career: 1,
    isDefault: 1
});

roadmapSchema.index({
    featured: 1,
    displayOrder: 1
});

roadmapSchema.index({
    title: "text",
    description: "text"
});


//Prevent Multiple Default Roadmaps For Same Career

roadmapSchema.index(
    {
        career: 1,
        isDefault: 1
    },
    {
        unique: true,
        partialFilterExpression: {
            isDefault: true
        }
    }
);


//Validation

roadmapSchema.pre(
    "save",
    function (next) {

        //Validate Estimated Duration

        if (
            this.estimatedDuration &&
            this.estimatedDuration.value !== null &&
            this.estimatedDuration.value < 0
        ) {

            return next(
                new Error(
                    "Estimated duration cannot be negative."
                )
            );

        }


        //Published Roadmap Requirements

        if (
            this.status === "published" &&
            (
                !this.description ||
                this.description.trim().length === 0
            )
        ) {

            return next(
                new Error(
                    "A published roadmap must have a description."
                )
            );

        }


        next();

    }
);


//Model

const Roadmap = mongoose.model(
    "Roadmap",
    roadmapSchema
);


module.exports = Roadmap;