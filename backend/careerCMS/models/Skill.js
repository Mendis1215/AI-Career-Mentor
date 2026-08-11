const mongoose = require("mongoose");


//Skill Schema

const skillSchema = new mongoose.Schema(
    {

        //Basic Skill Information

        name: {
            type: String,
            required: [true, "Skill name is required."],
            trim: true,
            minlength: [2, "Skill name must contain at least 2 characters."],
            maxlength: [100, "Skill name cannot exceed 100 characters."]
        },


        slug: {
            type: String,
            required: [true, "Skill slug is required."],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                "Skill slug must contain only lowercase letters, numbers and hyphens."
            ]
        },


        description: {
            type: String,
            trim: true,
            maxlength: [
                1000,
                "Skill description cannot exceed 1000 characters."
            ],
            default: ""
        },


        //Skill Category

        category: {
            type: String,
            required: [true, "Skill category is required."],
            enum: [
                "Programming",
                "Data Science",
                "Machine Learning",
                "Artificial Intelligence",
                "Database",
                "Cloud",
                "DevOps",
                "Web Development",
                "Mobile Development",
                "Cyber Security",
                "Software Engineering",
                "Business",
                "Communication",
                "Other"
            ],
            index: true
        },


        //Skill Type

        type: {
            type: String,
            required: [true, "Skill type is required."],
            enum: [
                "Technical",
                "Soft Skill",
                "Tool",
                "Framework",
                "Programming Language",
                "Platform",
                "Methodology"
            ],
            index: true
        },


        //Skill Level Information

        levels: {

            beginner: {
                type: String,
                trim: true,
                default: ""
            },

            intermediate: {
                type: String,
                trim: true,
                default: ""
            },

            advanced: {
                type: String,
                trim: true,
                default: ""
            },

            expert: {
                type: String,
                trim: true,
                default: ""
            }

        },


        //Related Technologies

        relatedTechnologies: [
            {
                type: String,
                trim: true
            }
        ],


        //Learning Objectives

        learningObjectives: [
            {
                type: String,
                trim: true
            }
        ],


        //Skill Status

        status: {
            type: String,
            enum: [
                "active",
                "inactive",
                "archived"
            ],
            default: "active",
            index: true
        },


        //Featured Skill

        featured: {
            type: Boolean,
            default: false
        },


        //Display Order

        displayOrder: {
            type: Number,
            default: 0,
            min: 0
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

skillSchema.index({
    name: "text",
    description: "text"
});

skillSchema.index({
    category: 1,
    type: 1,
    status: 1
});

skillSchema.index({
    featured: 1,
    displayOrder: 1
});


//Model

const Skill = mongoose.model(
    "Skill",
    skillSchema
);


module.exports = Skill;