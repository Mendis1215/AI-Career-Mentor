const mongoose = require("mongoose");


//Conversation Schema

const conversationSchema = new mongoose.Schema(
    {

        //Student

        //The user who owns this conversation.

        user: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true,

            index: true

        },


        //Conversation Title

        title: {

            type: String,

            trim: true,

            maxlength: 200,

            default: "New Conversation"

        },


        //Conversation Type

        //Determines the main purpose of the conversation.

        type: {

            type: String,

            enum: [

                "chat",

                "career_guidance",

                "roadmap_guidance",

                "skill_gap",

                "project_guidance",

                "github_analysis"

            ],

            default: "chat",

            index: true

        },


        //Conversation Status

        status: {

            type: String,

            enum: [

                "active",

                "archived"

            ],

            default: "active",

            index: true

        },


        //Last Message

        //Used to display a conversation preview without
        //loading the complete message collection.

        lastMessage: {

            type: String,

            trim: true,

            maxlength: 1000,

            default: null

        },


        //Last Message At

        lastMessageAt: {

            type: Date,

            default: null,

            index: true

        },


        //Message Count

        messageCount: {

            type: Number,

            default: 0,

            min: 0

        },


        /*
        | AI Context
        |
        | Stores optional context related to the conversation.
        |
        | Example:
        |
        | {
        |     careerId: "...",
        |     roadmapId: "...",
        |     skillIds: [...]
        | }
        |
        */

        context: {

            careerId: {

                type:
                    mongoose.Schema.Types.ObjectId,

                ref: "Career",

                default: null

            },

            roadmapId: {

                type:
                    mongoose.Schema.Types.ObjectId,

                ref: "Roadmap",

                default: null

            },

            skillIds: [

                {

                    type:
                        mongoose.Schema.Types.ObjectId,

                    ref: "Skill"

                }

            ],

            projectId: {

                type:
                    mongoose.Schema.Types.ObjectId,

                ref: "Project",

                default: null

            }

        },


        //AI Model Information

        //Records which model generated the conversation responses.

        model: {

            type: String,

            default: null,

            trim: true

        },


        //Conversation Metadata

        //Flexible metadata for future requirements.

        metadata: {

            type: mongoose.Schema.Types.Mixed,

            default: {}

        }

    },
    {

        //Timestamps

        timestamps: true

    }
);


//Indexes

//These indexes improve common conversation queries.

conversationSchema.index({

    user: 1,

    status: 1,

    updatedAt: -1

});


conversationSchema.index({

    user: 1,

    type: 1,

    updatedAt: -1

});


conversationSchema.index({

    user: 1,

    lastMessageAt: -1

});


//Update Last Message

//Helper method used after a new message is created.

conversationSchema.methods.updateLastMessage = async function (
    message,
    session = null
) {

    this.lastMessage =
        message
            ? message.substring(0, 1000)
            : null;

    this.lastMessageAt =
        new Date();

    this.messageCount =
        (this.messageCount || 0) + 1;


    if (session) {

        await this.save({
            session
        });

    } else {

        await this.save();

    }


    return this;

};


//Archive Conversation

conversationSchema.methods.archive =
    async function () {

        this.status =
            "archived";

        await this.save();

        return this;

    };


//Restore Conversation

conversationSchema.methods.restore =
    async function () {

        this.status =
            "active";

        await this.save();

        return this;

    };


//Check Active Status

conversationSchema.methods.isActive =
    function () {

        return this.status === "active";

    };


//JSON Transformation

//Remove internal MongoDB fields when returning
//conversation data through the API.

conversationSchema.methods.toJSON =
    function () {

        const conversation =
            this.toObject();

        delete conversation.__v;

        return conversation;

    };


//Model

const Conversation =
    mongoose.model(
        "Conversation",
        conversationSchema
    );

//Export

module.exports = Conversation;