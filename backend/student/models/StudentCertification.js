const mongoose = require("mongoose");

const studentCertificationSchema = new mongoose.Schema(
    {
        //Student Reference

        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "StudentProfile",
            required: true,
            index: true
        },

        //Certification Reference
        //Optional reference to the master certification stored
        //in the Career CMS.

        certificationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Certification",
            default: null,
            index: true
        },

        //Certification Information
        //These fields allow students to add certifications that
        //are not yet available in the Career CMS.

        certificationName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
            default: null
        },

        issuingOrganization: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
            default: null
        },

        //Certification Dates

        issueDate: {
            type: Date,
            default: null
        },

        expirationDate: {
            type: Date,
            default: null
        },

        //Credential Information

        credentialId: {
            type: String,
            trim: true,
            maxlength: 200,
            default: null
        },

        credentialUrl: {
            type: String,
            trim: true,
            maxlength: 500,
            default: null
        },

        certificateFile: {
            type: String,
            trim: true,
            maxlength: 500,
            default: null
        },

        //Verification

        verificationStatus: {
            type: String,
            enum: [
                "pending",
                "verified",
                "rejected"
            ],
            default: "pending"
        },

        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        verifiedAt: {
            type: Date,
            default: null
        },

        //Skills Associated With Certification
        //These are Skill IDs from the Career CMS.

        relatedSkills: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Skill"
            }
        ],

        //Description

        description: {
            type: String,
            trim: true,
            maxlength: 1000
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

//Indexes

studentCertificationSchema.index({
    studentId: 1,
    certificationName: 1
});

//Export Model

module.exports = mongoose.model(
    "StudentCertification",
    studentCertificationSchema
);