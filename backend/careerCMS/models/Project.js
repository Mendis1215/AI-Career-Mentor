const mongoose = require("mongoose");


//Project Schema

const projectSchema = new mongoose.Schema(
    {

        //Basic Project Information

        title: {
            type: String,
            required: [true, "Project title is required."],
            trim: true,
            minlength: [
                2,
                "Project title must contain at least 2 characters."
            ],
            maxlength: [
                150,
                "Project title cannot exceed 150 characters."
            ]
        },


        slug: {
            type: String,
            required: [true, "Project slug is required."],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                "Project slug must contain only lowercase letters, numbers and hyphens."
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
            required: [true, "Project description is required."],
            trim: true
        },


        //Project Type

        type: {
            type: String,
            required: [true, "Project type is required."],
            enum: [
                "Data Analysis",
                "Machine Learning",
                "Deep Learning",
                "Artificial Intelligence",
                "Web Development",
                "Mobile Development",
                "Software Development",
                "Data Engineering",
                "Cloud",
                "Cyber Security",
                "Other"
            ],
            index: true
        },


        //Difficulty

        difficulty: {
            type: String,
            required: [true, "Project difficulty is required."],
            enum: [
                "Beginner",
                "Intermediate",
                "Advanced",
                "Expert"
            ],
            default: "Beginner",
            index: true
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
                    "hours",
                    "days",
                    "weeks",
                    "months"
                ],
                default: "weeks"
            }

        },


        //Technologies / Tools

        technologies: [
            {
                type: String,
                trim: true
            }
        ],


        //Required Skills

        skills: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Skill"
            }
        ],


        //Project Objectives

        objectives: [
            {
                type: String,
                trim: true
            }
        ],


        //Expected Learning Outcomes

        learningOutcomes: [
            {
                type: String,
                trim: true
            }
        ],


        //Project Requirements

        requirements: [
            {
                type: String,
                trim: true
            }
        ],


        //Project Deliverables

        deliverables: [
            {
                type: String,
                trim: true
            }
        ],


        //Dataset Information

        datasetRequired: {
            type: Boolean,
            default: false
        },


        datasetDescription: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: ""
        },


        datasetUrl: {
            type: String,
            trim: true,
            default: null
        },


        //GitHub / Portfolio Information

        githubRepositoryUrl: {
            type: String,
            trim: true,
            default: null
        },


        demoUrl: {
            type: String,
            trim: true,
            default: null
        },


        //Career References

        careers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Career"
            }
        ],


        //Project Status

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


        //Featured Project

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

projectSchema.index({
    title: "text",
    shortDescription: "text",
    description: "text"
});

projectSchema.index({
    type: 1,
    difficulty: 1,
    status: 1
});

projectSchema.index({
    careers: 1,
    status: 1
});

projectSchema.index({
    featured: 1,
    displayOrder: 1
});


//Validation

projectSchema.pre(
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
                    "Project duration cannot be negative."
                )
            );

        }


        //Dataset Validation

        if (
            this.datasetRequired &&
            (
                !this.datasetDescription ||
                this.datasetDescription.trim().length === 0
            )
        ) {

            return next(
                new Error(
                    "Dataset description is required when datasetRequired is true."
                )
            );

        }


        //Published Project Validation

        if (
            this.status === "published" &&
            (
                !this.title ||
                !this.description ||
                this.skills.length === 0
            )
        ) {

            return next(
                new Error(
                    "A published project must have a title, description and at least one skill."
                )
            );

        }


        next();

    }
);


//Model

const Project = mongoose.model(
    "Project",
    projectSchema
);


module.exports = Project;