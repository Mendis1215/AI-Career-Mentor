const mongoose = require("mongoose");

const githubProfileSchema = new mongoose.Schema(
    {
        // Student Reference

        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "StudentProfile",
            required: true,
            unique: true,
            index: true
        },

        // GitHub Account Information

        githubUsername: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },

        githubUserId: {
            type: Number,
            default: null
        },

        profileUrl: {
            type: String,
            trim: true,
            maxlength: 500
        },

        avatarUrl: {
            type: String,
            trim: true,
            maxlength: 500
        },

        bio: {
            type: String,
            trim: true,
            maxlength: 1000
        },

        publicRepositories: {
            type: Number,
            min: 0,
            default: 0
        },

        followers: {
            type: Number,
            min: 0,
            default: 0
        },

        following: {
            type: Number,
            min: 0,
            default: 0
        },

        // GitHub Activity

        totalStars: {
            type: Number,
            min: 0,
            default: 0
        },

        totalForks: {
            type: Number,
            min: 0,
            default: 0
        },

        totalCommits: {
            type: Number,
            min: 0,
            default: 0
        },

        // Repository Analysis

        analyzedRepositories: {
            type: Number,
            min: 0,
            default: 0
        },

        analyzedLanguages: [
            {
                type: String,
                trim: true
            }
        ],

        detectedSkills: [
            {
                skillId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Skill"
                },

                confidenceScore: {
                    type: Number,
                    min: 0,
                    max: 100
                }
            }
        ],

        // GitHub Analysis Score

        githubScore: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },

        // Analysis Summary

        analysisSummary: {
            type: String,
            trim: true,
            maxlength: 3000
        },

        strengths: [
            {
                type: String,
                trim: true,
                maxlength: 200
            }
        ],

        weaknesses: [
            {
                type: String,
                trim: true,
                maxlength: 200
            }
        ],

        recommendations: [
            {
                type: String,
                trim: true,
                maxlength: 500
            }
        ],

        // Synchronization

        lastSyncedAt: {
            type: Date,
            default: null
        },

        lastAnalyzedAt: {
            type: Date,
            default: null
        },

        // Connection Status

        connectionStatus: {
            type: String,
            enum: [
                "connected",
                "disconnected",
                "error"
            ],
            default: "connected"
        },

        isActive: {
            type: Boolean,
            default: true
        },

        // Error Information

        lastError: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: null
        }
    },
    {
        timestamps: true
    }
);

// Indexes

githubProfileSchema.index({
    githubUsername: 1
});

// Export Model

module.exports = mongoose.model(
    "GitHubProfile",
    githubProfileSchema
);