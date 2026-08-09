const mongoose = require("mongoose");

const studentProgressSchema = new mongoose.Schema(
    {
        // Student Reference

        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "StudentProfile",
            required: true,
            index: true
        },

        // Career Reference
        // The career the student is currently following.

        careerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Career",
            required: true,
            index: true
        },

        // Roadmap Reference

        roadmapId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Roadmap",
            required: true,
            index: true
        },

        // Current Roadmap Stage

        currentStageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RoadmapStage",
            default: null
        },

        // Overall Progress

        overallProgress: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },

        // Completed Stages

        completedStages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "RoadmapStage"
            }
        ],

        // Completed Projects

        completedProjects: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Project"
            }
        ],

        // Completed Certifications

        completedCertifications: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Certification"
            }
        ],

        // Learning Hours

        totalLearningHours: {
            type: Number,
            min: 0,
            default: 0
        },

        // Started Date

        startedAt: {
            type: Date,
            default: Date.now
        },

        // Last Activity

        lastActivityAt: {
            type: Date,
            default: Date.now
        },

        // Completion Date

        completedAt: {
            type: Date,
            default: null
        },

        // Progress Status

        status: {
            type: String,
            enum: [
                "not_started",
                "in_progress",
                "completed",
                "paused"
            ],
            default: "not_started"
        },

        // Notes

        notes: {
            type: String,
            trim: true,
            maxlength: 1000
        }
    },
    {
        timestamps: true
    }
);

// Prevent Duplicate Active Progress
// A student should not have multiple progress records for the
// same career and roadmap.

studentProgressSchema.index(
    {
        studentId: 1,
        careerId: 1,
        roadmapId: 1
    },
    {
        unique: true
    }
);

// Export Model

module.exports = mongoose.model(
    "StudentProgress",
    studentProgressSchema
);