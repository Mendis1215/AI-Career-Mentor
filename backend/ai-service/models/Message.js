const mongoose = require("mongoose");


//Message Schema

const messageSchema = new mongoose.Schema(
    {

        //Conversation
        
        //The conversation to which this message belongs.

        conversation: {

            type:
                mongoose.Schema.Types.ObjectId,

            ref: "Conversation",

            required: true,

            index: true

        },

        //User
        
        //Owner of the conversation/message.
        
        //Keeping the user reference makes it easier to
        //retrieve messages securely and efficiently.

        user: {

            type:
                mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true,

            index: true

        },


        //Role
        
        //Identifies who generated the message.

        role: {

            type: String,

            enum: [

                "user",

                "assistant",

                "system"

            ],

            required: true

        },


        //Message Content

        content: {

            type: String,

            required: true,

            trim: true

        },


        //Message Type
        
        //Used to identify the purpose of the message.
    
        type: {

            type: String,

            enum: [

                "text",

                "career_guidance",

                "roadmap_guidance",

                "skill_gap",

                "project_guidance",

                "github_analysis",

                "system"

            ],

            default: "text"

        },


        //AI Model
        
        //Only relevant for assistant messages.

        model: {

            type: String,

            trim: true,

            default: null

        },


        //Token Usage
        
        //Stores Gemini/API token usage when available.

        tokenUsage: {

            promptTokens: {

                type: Number,

                default: 0,

                min: 0

            },

            completionTokens: {

                type: Number,

                default: 0,

                min: 0

            },

            totalTokens: {

                type: Number,

                default: 0,

                min: 0

            }

        },


        //RAG Sources
        
        //Stores references to documents/chunks used by the
        //AI when generating the response.

        sources: [

            {

                documentId: {

                    type:
                        mongoose.Schema.Types.ObjectId,

                    ref: "KnowledgeDocument",

                    default: null

                },

                chunkId: {

                    type: String,

                    default: null,

                    trim: true

                },

                title: {

                    type: String,

                    default: null,

                    trim: true

                },

                score: {

                    type: Number,

                    default: null

                }

            }

        ],


        //AI Context
        
        //Stores additional context used to generate the response.

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

            projectId: {

                type:
                    mongoose.Schema.Types.ObjectId,

                ref: "Project",

                default: null

            },

            skillIds: [

                {

                    type:
                        mongoose.Schema.Types.ObjectId,

                    ref: "Skill"

                }

            ]

        },


        //Processing Status
        
        //Mainly useful for assistant messages.

        status: {

            type: String,

            enum: [

                "pending",

                "processing",

                "completed",

                "failed"

            ],

            default: "completed"

        },


        //Error Information
        
        //Stores error information when something goes wrong.

        error: {

            message: {

                type: String,

                default: null

            },

            code: {

                type: String,

                default: null

            }

        },


        //Metadata
        
        //Flexible field for future AI functionality.
        
        metadata: {

            type:
                mongoose.Schema.Types.Mixed,

            default: {}

        }

    },
    {

        //Timestamps
        
        //Automatically manages createdAt and updatedAt fields.

        timestamps: true

    }
);


//Indexes

//Most common query:

//Find messages belonging to a conversation
//ordered by creation time.

messageSchema.index({

    conversation: 1,

    createdAt: 1

});


messageSchema.index({

    user: 1,

    createdAt: -1

});


messageSchema.index({

    conversation: 1,

    role: 1,

    createdAt: 1

});


//JSON Transformation

messageSchema.methods.toJSON =
    function () {

        const message =
            this.toObject();

        delete message.__v;

        return message;

    };


//Check User Message

messageSchema.methods.isUserMessage =
    function () {

        return this.role === "user";

    };


//Check Assistant Message

messageSchema.methods.isAssistantMessage =
    function () {

        return this.role === "assistant";

    };


//Check System Message

messageSchema.methods.isSystemMessage =
    function () {

        return this.role === "system";

    };


//Model

const Message =
    mongoose.model(
        "Message",
        messageSchema
    );


//Export

module.exports = Message;