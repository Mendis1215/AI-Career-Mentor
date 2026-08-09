const mongoose = require("mongoose");

const studentInterestSchema = new mongoose.Schema(
    {
        //Student Reference

        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "StudentProfile",
            required: true,
            index: true
        },

        //Interest Name
        //Examples:
        //- Machine Learning
        //- Data Analytics
        //- Web Development
        //- Artificial Intelligence
        //- Cyber Security

        interestName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },

        //Interest Category

        category: {
            type: String,
            enum: [
                "technology",
                "career",
                "industry",
                "domain",
                "role"
            ],
            default: "technology"
        },

        //Interest Level

        interestLevel: {
            type: String,
            enum: [
                "low",
                "medium",
                "high"
            ],
            default: "medium"
        },

        //Priority
        //Used to determine which interests are more important
        //to the student.

        priority: {
            type: Number,
            min: 1,
            max: 5,
            default: 3
        },

        //Years Interested

        yearsInterested: {
            type: Number,
            min: 0,
            max: 50,
            default: 0
        },

        //Student Explanation
        //Optional explanation about why the student is interested
        //in this area.

        reason: {
            type: String,
            trim: true,
            maxlength: 500
        },

        //Active Status

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

//Prevent Duplicate Interests
//A student should not have the same interest multiple times.

studentInterestSchema.index(
    {
        studentId: 1,
        interestName: 1
    },
    {
        unique: true
    }
);

//Export Model

module.exports = mongoose.model(
    "StudentInterest",
    studentInterestSchema
);