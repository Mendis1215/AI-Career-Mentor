const mongoose = require("mongoose");

const studentSkillSchema = new mongoose.Schema(
    {
        //Student Reference

        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "StudentProfile",
            required: true,
            index: true
        },

        //Skill Reference
        //The actual skill information is stored in the Career CMS
        //Skill collection.

        skillId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Skill",
            required: true,
            index: true
        },

        //Skill Proficiency

        proficiencyLevel: {
            type: String,
            enum: [
                "beginner",
                "intermediate",
                "advanced",
                "expert"
            ],
            default: "beginner",
            required: true
        },

        //Numeric Proficiency Score
        //0 - 100

        proficiencyScore: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },

        //Learning Status

        learningStatus: {
            type: String,
            enum: [
                "not_started",
                "learning",
                "completed"
            ],
            default: "not_started"
        },

        //Evidence
        //Evidence can be used to support the student's claimed skill.

        evidence: {
            type: String,
            trim: true,
            maxlength: 500
        },

        //Years of Experience

        yearsOfExperience: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },

        //Last Used

        lastUsedAt: {
            type: Date
        },

        //Verification
        //Later, skills can potentially be verified through projects,
        //certifications, GitHub analysis, or other evidence.

        isVerified: {
            type: Boolean,
            default: false
        },

        verificationSource: {
            type: String,
            enum: [
                "self",
                "project",
                "certification",
                "github",
                "admin"
            ],
            default: "self"
        }
    },
    {
        timestamps: true
    }
);

//Prevent Duplicate Skills
//A student should not have the same skill multiple times.

studentSkillSchema.index(
    {
        studentId: 1,
        skillId: 1
    },
    {
        unique: true
    }
);

//Export Model

module.exports = mongoose.model(
    "StudentSkill",
    studentSkillSchema
);