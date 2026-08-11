const mongoose = require("mongoose");


//Audit Log Schema

const auditLogSchema = new mongoose.Schema(
    {

        //User Who Performed The Action

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required."],
            index: true
        },


        //User Role At The Time Of Action

        userRole: {
            type: String,
            required: [true, "User role is required."],
            enum: [
                "admin",
                "student",
                "system"
            ],
            index: true
        },


        //Action

        action: {
            type: String,
            required: [true, "Audit action is required."],
            enum: [
                "CREATE",
                "UPDATE",
                "DELETE",
                "PUBLISH",
                "UNPUBLISH",
                "ARCHIVE",
                "RESTORE",
                "LOGIN",
                "LOGOUT",
                "UPLOAD",
                "DOWNLOAD",
                "PROCESS",
                "EMBED",
                "VIEW"
            ],
            index: true
        },


        //Entity / Resource Type

        entityType: {
            type: String,
            required: [true, "Entity type is required."],
            enum: [
                "User",
                "Career",
                "Skill",
                "CareerSkill",
                "Roadmap",
                "RoadmapStage",
                "Project",
                "Certification",
                "LearningResource",
                "KnowledgeDocument"
            ],
            index: true
        },


        //Entity ID

        entityId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
            index: true
        },


        //Entity Name
        //Stores a readable name for easier audit-log viewing.

        entityName: {
            type: String,
            trim: true,
            maxlength: [
                200,
                "Entity name cannot exceed 200 characters."
            ],
            default: null
        },


        //Description

        description: {
            type: String,
            trim: true,
            maxlength: [
                1000,
                "Audit description cannot exceed 1000 characters."
            ],
            default: ""
        },


        //Previous Data
        //Useful for UPDATE / DELETE operations.

        previousData: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        },


        //New Data
        //Useful for CREATE / UPDATE operations.

        newData: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        },


        //Changed Fields

        changedFields: [
            {
                type: String,
                trim: true
            }
        ],


        //Request Information

        ipAddress: {
            type: String,
            trim: true,
            default: null
        },


        userAgent: {
            type: String,
            trim: true,
            maxlength: [
                1000,
                "User agent cannot exceed 1000 characters."
            ],
            default: null
        },


        //Request ID
        //Helps trace an action through application logs.

        requestId: {
            type: String,
            trim: true,
            index: true,
            default: null
        },


        //Request Method

        method: {
            type: String,
            enum: [
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE"
            ],
            default: null
        },


        //Request Endpoint

        endpoint: {
            type: String,
            trim: true,
            maxlength: [
                500,
                "Endpoint cannot exceed 500 characters."
            ],
            default: null
        },


        //Action Result

        status: {
            type: String,
            enum: [
                "SUCCESS",
                "FAILED"
            ],
            default: "SUCCESS",
            index: true
        },


        //Error Information

        errorMessage: {
            type: String,
            trim: true,
            maxlength: [
                2000,
                "Error message cannot exceed 2000 characters."
            ],
            default: null
        }

    },

    {
        timestamps: true
    }

);


//Indexes

//Find actions performed by a particular user.

auditLogSchema.index({
    user: 1,
    createdAt: -1
});


//Find actions for a particular entity.

auditLogSchema.index({
    entityType: 1,
    entityId: 1,
    createdAt: -1
});


//Find recent actions.

auditLogSchema.index({
    createdAt: -1
});


//Find failed operations.

auditLogSchema.index({
    status: 1,
    createdAt: -1
});


//Find actions by type.

auditLogSchema.index({
    action: 1,
    createdAt: -1
});


//Validation

auditLogSchema.pre(
    "save",
    function (next) {

        //Failed Actions Must Have Error Message

        if (
            this.status === "FAILED" &&
            (
                !this.errorMessage ||
                this.errorMessage.trim().length === 0
            )
        ) {

            return next(
                new Error(
                    "Failed audit logs must contain an error message."
                )
            );

        }


        //Successful Actions Should Not Store Error Message

        if (
            this.status === "SUCCESS"
        ) {

            this.errorMessage = null;

        }


        next();

    }
);


//Model

const AuditLog = mongoose.model(
    "AuditLog",
    auditLogSchema
);


module.exports = AuditLog;