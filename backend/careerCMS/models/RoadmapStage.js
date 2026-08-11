const mongoose = require("mongoose");


//Roadmap Stage Schema

const roadmapStageSchema = new mongoose.Schema(
    {

        //Roadmap Reference

        roadmap: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Roadmap",
            required: [true, "Roadmap is required."],
            index: true
        },


        //Stage Number

        stageNumber: {
            type: Number,
            required: [true, "Stage number is required."],
            min: 1
        },


        //Stage Title

        title: {
            type: String,
            required: [true, "Stage title is required."],
            trim: true,
            minlength: [
                2,
                "Stage title must contain at least 2 characters."
            ],
            maxlength: [
                150,
                "Stage title cannot exceed 150 characters."
            ]
        },


        //Stage Description

        description: {
            type: String,
            required: [true, "Stage description is required."],
            trim: true,
            maxlength: [
                2000,
                "Stage description cannot exceed 2000 characters."
            ]
        },


        //Learning Objectives

        learningObjectives: [
            {
                type: String,
                trim: true
            }
        ],


        //Skills Covered

        skills: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Skill"
            }
        ],


        //Projects

        projects: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Project"
            }
        ],


        //Certifications

        certifications: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Certification"
            }
        ],


        //Learning Resources

        learningResources: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "LearningResource"
            }
        ],


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
                    "hours",
                    "days",
                    "weeks",
                    "months"
                ],
                default: "weeks"
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


        //Stage Type

        stageType: {
            type: String,
            enum: [
                "Learning",
                "Practice",
                "Project",
                "Certification",
                "Mixed"
            ],
            default: "Learning"
        },


        //Prerequisite Stages

        prerequisiteStages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "RoadmapStage"
            }
        ],


        //Mandatory Stage

        isMandatory: {
            type: Boolean,
            default: true
        },


        //Status

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


        //Display Order

        displayOrder: {
            type: Number,
            min: 1,
            required: [true, "Display order is required."]
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

//A roadmap cannot have two stages with the same stage number.

roadmapStageSchema.index(
    {
        roadmap: 1,
        stageNumber: 1
    },
    {
        unique: true
    }
);


//A roadmap cannot have two stages with the same display order.

roadmapStageSchema.index(
    {
        roadmap: 1,
        displayOrder: 1
    },
    {
        unique: true
    }
);


roadmapStageSchema.index({
    roadmap: 1,
    status: 1
});


roadmapStageSchema.index({
    roadmap: 1,
    isMandatory: 1
});


//Validation

roadmapStageSchema.pre(
    "save",
    function (next) {

        //Validate Duration

        if (
            this.estimatedDuration &&
            this.estimatedDuration.value !== null &&
            this.estimatedDuration.value < 0
        ) {

            return next(
                new Error(
                    "Stage duration cannot be negative."
                )
            );

        }


        //Stage Number and Display Order

        if (
            this.stageNumber !== this.displayOrder
        ) {

            return next(
                new Error(
                    "Stage number and display order must match."
                )
            );

        }


        //Published Stage Requirements

        if (
            this.status === "published" &&
            (
                !this.title ||
                !this.description
            )
        ) {

            return next(
                new Error(
                    "A published stage must have a title and description."
                )
            );

        }


        next();

    }
);


//Model

const RoadmapStage = mongoose.model(
    "RoadmapStage",
    roadmapStageSchema
);


module.exports = RoadmapStage;