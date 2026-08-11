const mongoose = require("mongoose");


//Career Schema

const careerSchema = new mongoose.Schema(
    {

        //Basic Career Information

        name: {
            type: String,
            required: [true, "Career name is required."],
            trim: true,
            minlength: [2, "Career name must contain at least 2 characters."],
            maxlength: [100, "Career name cannot exceed 100 characters."]
        },


        slug: {
            type: String,
            required: [true, "Career slug is required."],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                "Career slug must contain only lowercase letters, numbers and hyphens."
            ]
        },


        shortDescription: {
            type: String,
            required: [true, "Short description is required."],
            trim: true,
            maxlength: [300, "Short description cannot exceed 300 characters."]
        },


        description: {
            type: String,
            required: [true, "Career description is required."],
            trim: true
        },


        //Career Category

        category: {
            type: String,
            required: [true, "Career category is required."],
            enum: [
                "Data",
                "Software",
                "AI & Machine Learning",
                "Cyber Security",
                "Cloud & DevOps",
                "Business & IT"
            ],
            trim: true
        },


        //Career Level

        level: {
            type: String,
            required: [true, "Career level is required."],
            enum: [
                "Entry Level",
                "Mid Level",
                "Senior Level"
            ]
        },


        //Career Image

        imageUrl: {
            type: String,
            trim: true,
            default: null
        },


        //Career Responsibilities

        responsibilities: [
            {
                type: String,
                trim: true
            }
        ],


        //Career Requirements

        requirements: [
            {
                type: String,
                trim: true
            }
        ],


        //Career Benefits

        benefits: [
            {
                type: String,
                trim: true
            }
        ],


        //Salary Information

        salary: {

            min: {
                type: Number,
                min: 0,
                default: null
            },

            max: {
                type: Number,
                min: 0,
                default: null
            },

            currency: {
                type: String,
                trim: true,
                default: "USD"
            }

        },


        //Required Education

        education: [
            {
                type: String,
                trim: true
            }
        ],


        //Typical Experience

        experience: {
            type: String,
            trim: true,
            maxlength: 200
        },


        //Job Market Information

        jobDemand: {
            type: String,
            enum: [
                "Low",
                "Moderate",
                "High",
                "Very High"
            ],
            default: "Moderate"
        },


        //Remote Availability

        remoteFriendly: {
            type: Boolean,
            default: true
        },


        //Career Status

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


        //Featured Career

        featured: {
            type: Boolean,
            default: false,
            index: true
        },


        //Display Order

        displayOrder: {
            type: Number,
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

careerSchema.index({
    name: "text",
    shortDescription: "text",
    description: "text"
});

careerSchema.index({
    category: 1,
    status: 1
});

careerSchema.index({
    featured: 1,
    displayOrder: 1
});


//Validation

careerSchema.pre(
    "save",
    function (next) {

        if (
            this.salary &&
            this.salary.min !== null &&
            this.salary.max !== null &&
            this.salary.min > this.salary.max
        ) {

            return next(
                new Error(
                    "Minimum salary cannot be greater than maximum salary."
                )
            );

        }


        next();

    }
);


//Model

const Career = mongoose.model(
    "Career",
    careerSchema
);


module.exports = Career;