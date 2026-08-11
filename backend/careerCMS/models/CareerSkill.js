const mongoose = require("mongoose");


//Career Skill Schema   

const careerSkillSchema = new mongoose.Schema(
    {

        //Career Reference

        career: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Career",
            required: [true, "Career is required."],
            index: true
        },


        //Skill Reference

        skill: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Skill",
            required: [true, "Skill is required."],
            index: true
        },


        //Required Proficiency Level

        requiredLevel: {
            type: String,
            required: [
                true,
                "Required skill level is required."
            ],
            enum: [
                "Beginner",
                "Intermediate",
                "Advanced",
                "Expert"
            ]
        },


        //Skill Importance

        importance: {
            type: String,
            required: [
                true,
                "Skill importance is required."
            ],
            enum: [
                "Low",
                "Medium",
                "High",
                "Critical"
            ],
            default: "Medium"
        },


        //Required Skill Weight
        //Used when calculating career readiness.
        //Higher value = more important skill.

        weight: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
            default: 10
        },


        //Mandatory Skill

        isMandatory: {
            type: Boolean,
            default: false,
            index: true
        },


        //Minimum Expected Experience

        minimumExperience: {
            type: Number,
            min: 0,
            default: 0
        },


        //Skill Description For This Career

        description: {
            type: String,
            trim: true,
            maxlength: [
                1000,
                "Career skill description cannot exceed 1000 characters."
            ],
            default: ""
        },


        //Recommended Learning Priority

        learningPriority: {
            type: Number,
            min: 1,
            max: 10,
            default: 5
        },


        //Status

        status: {
            type: String,
            enum: [
                "active",
                "inactive"
            ],
            default: "active",
            index: true
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


//Prevent Duplicate Career-Skill Relationships

careerSkillSchema.index(
    {
        career: 1,
        skill: 1
    },
    {
        unique: true
    }
);


//Query Indexes

careerSkillSchema.index({
    career: 1,
    status: 1,
    isMandatory: 1
});

careerSkillSchema.index({
    career: 1,
    learningPriority: 1
});

careerSkillSchema.index({
    skill: 1,
    status: 1
});


//Validation

careerSkillSchema.pre(
    "save",
    function (next) {

        //Mandatory skills should have meaningful importance

        if (
            this.isMandatory &&
            (
                this.importance === "Low" ||
                this.importance === "Medium"
            )
        ) {

            return next(
                new Error(
                    "Mandatory skills must have High or Critical importance."
                )
            );

        }


        //Critical skills should have higher weight

        if (
            this.importance === "Critical" &&
            this.weight < 20
        ) {

            return next(
                new Error(
                    "Critical skills should have a weight of at least 20."
                )
            );

        }


        next();

    }
);


//Model

const CareerSkill = mongoose.model(
    "CareerSkill",
    careerSkillSchema
);


module.exports = CareerSkill;