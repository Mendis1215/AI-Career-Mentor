const mongoose = require("mongoose");


//Certification Schema

const certificationSchema = new mongoose.Schema(
    {

        //Basic Certification Information

        name: {
            type: String,
            required: [true, "Certification name is required."],
            trim: true,
            minlength: [
                2,
                "Certification name must contain at least 2 characters."
            ],
            maxlength: [
                200,
                "Certification name cannot exceed 200 characters."
            ]
        },


        slug: {
            type: String,
            required: [true, "Certification slug is required."],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                "Certification slug must contain only lowercase letters, numbers and hyphens."
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
            required: [true, "Certification description is required."],
            trim: true
        },


        //Certification Provider

        provider: {
            type: String,
            required: [true, "Certification provider is required."],
            trim: true,
            maxlength: [
                150,
                "Provider name cannot exceed 150 characters."
            ]
        },


        providerWebsite: {
            type: String,
            trim: true,
            default: null
        },


        //Certification Level

        level: {
            type: String,
            enum: [
                "Beginner",
                "Intermediate",
                "Advanced",
                "Professional",
                "Expert"
            ],
            default: "Beginner"
        },


        //Certification Type

        type: {
            type: String,
            enum: [
                "Professional Certification",
                "Professional Certificate",
                "Academic Certificate",
                "Course Certificate",
                "Specialization",
                "Other"
            ],
            default: "Professional Certificate"
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


        //Certification Requirements

        prerequisites: [
            {
                type: String,
                trim: true
            }
        ],


        requirements: [
            {
                type: String,
                trim: true
            }
        ],


        //Exam Information

        examRequired: {
            type: Boolean,
            default: false
        },


        examDuration: {
            type: Number,
            min: 0,
            default: null
        },


        examDurationUnit: {
            type: String,
            enum: [
                "minutes",
                "hours"
            ],
            default: "hours"
        },


        //Cost Information

        cost: {

            amount: {
                type: Number,
                min: 0,
                default: 0
            },

            currency: {
                type: String,
                trim: true,
                default: "USD"
            },

            isFree: {
                type: Boolean,
                default: false
            }

        },


        //Certification Validity

        validity: {

            type: {
                type: String,
                enum: [
                    "Lifetime",
                    "Fixed Period",
                    "Unknown"
                ],
                default: "Unknown"
            },

            duration: {
                type: Number,
                min: 0,
                default: null
            },

            durationUnit: {
                type: String,
                enum: [
                    "months",
                    "years"
                ],
                default: "years"
            }

        },


        //Learning Information

        estimatedPreparationTime: {

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


        //Certification URL

        certificationUrl: {
            type: String,
            trim: true,
            default: null
        },


        //Image / Logo

        logoUrl: {
            type: String,
            trim: true,
            default: null
        },


        //Recommendation Priority

        priority: {
            type: Number,
            min: 1,
            max: 10,
            default: 5
        },


        //Certification Status

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


        //Featured Certification

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

certificationSchema.index({
    name: "text",
    shortDescription: "text",
    description: "text",
    provider: "text"
});

certificationSchema.index({
    provider: 1,
    status: 1
});

certificationSchema.index({
    level: 1,
    status: 1
});

certificationSchema.index({
    careers: 1,
    status: 1
});

certificationSchema.index({
    skills: 1,
    status: 1
});

certificationSchema.index({
    featured: 1,
    displayOrder: 1
});


//Validation

certificationSchema.pre(
    "save",
    function (next) {

        //Free Certification Validation

        if (
            this.cost &&
            this.cost.isFree === true
        ) {

            this.cost.amount = 0;

        }


        //Exam Duration Validation

        if (
            this.examRequired === false
        ) {

            this.examDuration = null;

        }


        //Fixed Validity Validation

        if (
            this.validity &&
            this.validity.type === "Fixed Period" &&
            (
                !this.validity.duration ||
                this.validity.duration <= 0
            )
        ) {

            return next(
                new Error(
                    "Fixed-period certifications must have a valid duration."
                )
            );

        }


        //Published Certification Validation

        if (
            this.status === "published" &&
            (
                !this.name ||
                !this.provider ||
                !this.description
            )
        ) {

            return next(
                new Error(
                    "A published certification must have a name, provider and description."
                )
            );

        }


        next();

    }
);


//Model

const Certification = mongoose.model(
    "Certification",
    certificationSchema
);


module.exports = Certification;