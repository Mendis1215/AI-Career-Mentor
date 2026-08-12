const mongoose = require("mongoose");

const CareerSkill = require("../models/CareerSkill");
const Career = require("../models/Career");
const Skill = require("../models/Skill");

const ApiError = require("../../shared/utils/ApiError");


//Validate ObjectId

const validateObjectId = (id, fieldName) => {

    if (!mongoose.isValidObjectId(id)) {

        throw new ApiError(
            400,
            `Invalid ${fieldName}.`
        );

    }

};


//Check Career Exists

const checkCareerExists = async (careerId) => {

    const career = await Career.findById(
        careerId
    );

    if (!career) {

        throw new ApiError(
            404,
            "Career not found."
        );

    }

    return career;

};


//Check Skill Exists

const checkSkillExists = async (skillId) => {

    const skill = await Skill.findById(
        skillId
    );

    if (!skill) {

        throw new ApiError(
            404,
            "Skill not found."
        );

    }

    return skill;

};


//Create Career-Skill Relationship

const createCareerSkill = async (
    careerSkillData,
    userId
) => {

    if (!userId) {

        throw new ApiError(
            401,
            "User authentication is required."
        );

    }


    const {
        career,
        skill
    } = careerSkillData;


    validateObjectId(
        career,
        "career ID"
    );

    validateObjectId(
        skill,
        "skill ID"
    );


    //Check Career

    await checkCareerExists(
        career
    );


    //Check Skill

    await checkSkillExists(
        skill
    );


    //Prevent Duplicate Relationship

    const existingRelationship =
        await CareerSkill.findOne({
            career,
            skill
        });


    if (existingRelationship) {

        throw new ApiError(
            409,
            "This skill is already associated with the career."
        );

    }


    //Create Relationship

    const careerSkill =
        await CareerSkill.create({

            ...careerSkillData,

            createdBy: userId,

            updatedBy: userId

        });


    return careerSkill;

};


//Get All Career-Skill Relationships

const getAllCareerSkills = async (
    options = {}
) => {

    const {
        page = 1,
        limit = 20,
        career,
        skill,
        importance,
        requiredLevel,
        status
    } = options;


    const currentPage = Math.max(
        Number(page) || 1,
        1
    );


    const perPage = Math.min(
        Math.max(Number(limit) || 20, 1),
        100
    );


    const filter = {};


    //Career Filter

    if (career) {

        validateObjectId(
            career,
            "career ID"
        );

        filter.career = career;

    }


    //Skill Filter

    if (skill) {

        validateObjectId(
            skill,
            "skill ID"
        );

        filter.skill = skill;

    }


    //Importance Filter

    if (importance) {

        filter.importance = importance;

    }


    //Required Level Filter

    if (requiredLevel) {

        filter.requiredLevel = requiredLevel;

    }


    //Status Filter

    if (status) {

        filter.status = status;

    }


    const skip =
        (currentPage - 1) * perPage;


    const [
        relationships,
        total
    ] = await Promise.all([

        CareerSkill
            .find(filter)
            .populate(
                "career",
                "name slug status"
            )
            .populate(
                "skill",
                "name slug category level status"
            )
            .sort({
                priority: 1,
                createdAt: -1
            })
            .skip(skip)
            .limit(perPage)
            .lean(),

        CareerSkill.countDocuments(
            filter
        )

    ]);


    return {

        relationships,

        pagination: {

            page: currentPage,

            limit: perPage,

            total,

            totalPages:
                Math.ceil(
                    total / perPage
                ),

            hasNextPage:
                currentPage <
                Math.ceil(
                    total / perPage
                ),

            hasPreviousPage:
                currentPage > 1

        }

    };

};


//Get Career-Skill Relationship By ID

const getCareerSkillById = async (
    careerSkillId
) => {

    validateObjectId(
        careerSkillId,
        "career-skill relationship ID"
    );


    const relationship =
        await CareerSkill
            .findById(careerSkillId)
            .populate(
                "career",
                "name slug description status"
            )
            .populate(
                "skill",
                "name slug description category level status"
            )
            .lean();


    if (!relationship) {

        throw new ApiError(
            404,
            "Career-skill relationship not found."
        );

    }


    return relationship;

};


//Get Skills For Career

const getSkillsForCareer = async (
    careerId,
    options = {}
) => {

    validateObjectId(
        careerId,
        "career ID"
    );


    await checkCareerExists(
        careerId
    );


    const {
        status
    } = options;


    const filter = {
        career: careerId
    };


    if (status) {

        filter.status = status;

    }


    const relationships =
        await CareerSkill
            .find(filter)
            .populate(
                "skill",
                "name slug description category level status"
            )
            .sort({
                priority: 1,
                createdAt: 1
            })
            .lean();


    return relationships;

};


//Get Careers For Skill

const getCareersForSkill = async (
    skillId,
    options = {}
) => {

    validateObjectId(
        skillId,
        "skill ID"
    );


    await checkSkillExists(
        skillId
    );


    const {
        status
    } = options;


    const filter = {
        skill: skillId
    };


    if (status) {

        filter.status = status;

    }


    const relationships =
        await CareerSkill
            .find(filter)
            .populate(
                "career",
                "name slug description status"
            )
            .sort({
                priority: 1,
                createdAt: 1
            })
            .lean();


    return relationships;

};


//Update Career-Skill Relationship

const updateCareerSkill = async (
    careerSkillId,
    updateData,
    userId
) => {

    validateObjectId(
        careerSkillId,
        "career-skill relationship ID"
    );


    if (!userId) {

        throw new ApiError(
            401,
            "User authentication is required."
        );

    }


    const relationship =
        await CareerSkill.findById(
            careerSkillId
        );


    if (!relationship) {

        throw new ApiError(
            404,
            "Career-skill relationship not found."
        );

    }


    //Career Change

    const newCareerId =
        updateData.career ||
        relationship.career;


    //Skill Change

    const newSkillId =
        updateData.skill ||
        relationship.skill;


    validateObjectId(
        newCareerId,
        "career ID"
    );

    validateObjectId(
        newSkillId,
        "skill ID"
    );


    await checkCareerExists(
        newCareerId
    );

    await checkSkillExists(
        newSkillId
    );


    //Prevent Duplicate Relationship

    const duplicate =
        await CareerSkill.findOne({

            _id: {
                $ne: careerSkillId
            },

            career: newCareerId,

            skill: newSkillId

        });


    if (duplicate) {

        throw new ApiError(
            409,
            "This skill is already associated with the career."
        );

    }


    //Update Fields

    Object.keys(updateData).forEach(
        (key) => {

            if (
                updateData[key] !== undefined
            ) {

                relationship[key] =
                    updateData[key];

            }

        }
    );


    relationship.updatedBy =
        userId;


    await relationship.save();


    return relationship;

};


//Delete Career-Skill Relationship

const deleteCareerSkill = async (
    careerSkillId
) => {

    validateObjectId(
        careerSkillId,
        "career-skill relationship ID"
    );


    const relationship =
        await CareerSkill.findById(
            careerSkillId
        );


    if (!relationship) {

        throw new ApiError(
            404,
            "Career-skill relationship not found."
        );

    }


    await CareerSkill.findByIdAndDelete(
        careerSkillId
    );


    return {

        message:
            "Career-skill relationship deleted successfully."

    };

};


//Bulk Add Skills To Career

const bulkAddSkillsToCareer = async (
    careerId,
    skills,
    userId
) => {

    validateObjectId(
        careerId,
        "career ID"
    );


    if (!userId) {

        throw new ApiError(
            401,
            "User authentication is required."
        );

    }


    if (!Array.isArray(skills)) {

        throw new ApiError(
            400,
            "Skills must be provided as an array."
        );

    }


    if (skills.length === 0) {

        throw new ApiError(
            400,
            "At least one skill is required."
        );

    }


    await checkCareerExists(
        careerId
    );


    const createdRelationships = [];

    const skippedRelationships = [];


    for (const skillData of skills) {

        const skillId =
            typeof skillData === "string"
                ? skillData
                : skillData.skill;


        validateObjectId(
            skillId,
            "skill ID"
        );


        await checkSkillExists(
            skillId
        );


        const existing =
            await CareerSkill.findOne({

                career: careerId,

                skill: skillId

            });


        if (existing) {

            skippedRelationships.push(
                skillId
            );

            continue;

        }


        const relationship =
            await CareerSkill.create({

                career: careerId,

                skill: skillId,

                ...(typeof skillData === "object"
                    ? skillData
                    : {}),

                createdBy: userId,

                updatedBy: userId

            });


        createdRelationships.push(
            relationship
        );

    }


    return {

        created:
            createdRelationships,

        skipped:
            skippedRelationships,

        createdCount:
            createdRelationships.length,

        skippedCount:
            skippedRelationships.length

    };

};


//Remove Skill From Career

const removeSkillFromCareer = async (
    careerId,
    skillId
) => {

    validateObjectId(
        careerId,
        "career ID"
    );

    validateObjectId(
        skillId,
        "skill ID"
    );


    const relationship =
        await CareerSkill.findOne({

            career: careerId,

            skill: skillId

        });


    if (!relationship) {

        throw new ApiError(
            404,
            "This skill is not associated with the career."
        );

    }


    await CareerSkill.findByIdAndDelete(
        relationship._id
    );


    return {

        message:
            "Skill removed from career successfully."

    };

};


//Update Skill Priority

const updateSkillPriority = async (
    careerSkillId,
    priority,
    userId
) => {

    validateObjectId(
        careerSkillId,
        "career-skill relationship ID"
    );


    if (
        !Number.isInteger(
            Number(priority)
        ) ||
        Number(priority) < 0
    ) {

        throw new ApiError(
            400,
            "Priority must be a non-negative integer."
        );

    }


    const relationship =
        await CareerSkill.findById(
            careerSkillId
        );


    if (!relationship) {

        throw new ApiError(
            404,
            "Career-skill relationship not found."
        );

    }


    relationship.priority =
        Number(priority);

    relationship.updatedBy =
        userId;


    await relationship.save();


    return relationship;

};


//Export Service Functions

module.exports = {

    createCareerSkill,

    getAllCareerSkills,

    getCareerSkillById,

    getSkillsForCareer,

    getCareersForSkill,

    updateCareerSkill,

    deleteCareerSkill,

    bulkAddSkillsToCareer,

    removeSkillFromCareer,

    updateSkillPriority

};