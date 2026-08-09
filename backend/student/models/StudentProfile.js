const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
    {
        /*
        User Reference

        Every student profile belongs to one User account.
        */

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            index: true
        },

        //Personal Information

        firstName: {
            type: String,
            trim: true,
            maxlength: 20
        },

        lastName: {
            type: String,
            trim: true,
            maxlength: 20
        },

        dateOfBirth: {
            type: Date
        },

        profileImage: {
            type: String,
            trim: true
        },

        //Academic Information

        university: {
            type: String,
            trim: true,
            maxlength: 50
        },

        degreeProgram: {
            type: String,
            trim: true,
            maxlength: 50
        },

        specialization: {
            type: String,
            trim: true,
            maxlength: 50
        },

        academicYear: {
            type: Number,
            min: 1,
            max: 6
        },

        expectedGraduationYear: {
            type: Number,
            min: 2000,
            max: 2100
        },

        currentGPA: {
            type: Number,
            min: 0,
            max: 4
        },

        //Professional Information

        bio: {
            type: String,
            trim: true,
            maxlength: 1000
        },

        careerGoal: {
            type: String,
            trim: true,
            maxlength: 500
        },

        experienceLevel: {
            type: String,
            enum: [
                "beginner",
                "intermediate",
                "advanced"
            ],
            default: "beginner"
        },

        //Contact Information

        phone: {
            type: Number,
            maxlength: 10
        },

        location: {
            type: String,
            trim: true,
            maxlength: 150
        },

        //Social / Professional Links

        linkedinUrl: {
            type: String,
            trim: true,
            maxlength: 50
        },

        githubUrl: {
            type: String,
            trim: true,
            maxlength: 50
        },

        portfolioUrl: {
            type: String,
            trim: true,
            maxlength: 50
        },

        //Profile Completion

        profileCompletionPercentage: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },

        //Onboarding Status

        onboardingCompleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

//Indexes

studentProfileSchema.index({
    degreeProgram: 1
});

studentProfileSchema.index({
    university: 1
});

//Virtual Full Name

studentProfileSchema.virtual("fullName").get(function () {
    return `${this.firstName || ""} ${this.lastName || ""}`.trim();
});

//JSON Configuration

studentProfileSchema.set("toJSON", {
    virtuals: true
});

//Export Model

module.exports = mongoose.model(
    "StudentProfile",
    studentProfileSchema
);