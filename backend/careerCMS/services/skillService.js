const mongoose = require("mongoose");

const Skill = require("../models/Skill");
const CareerSkill = require("../models/CareerSkill");
const StudentSkill = require("../../student/models/StudentSkill");

const ApiError = require("../../shared/utils/ApiError");


//Create Skill

const createSkill = async (skillData, userId) => {

    if (!userId) {
        throw new ApiError(
            401,
            "User authentication is required."
        );
    }

    const existingSkill = await Skill.findOne({
        $or: [
            {
                name: skillData.name
            },
            {
                slug: skillData.slug
            }
        ]
    });

    if (existingSkill) {
        throw new ApiError(
            409,
            "A skill with the same name or slug already exists."
        );
    }

    const skill = await Skill.create({
        ...skillData,
        createdBy: userId,
        updatedBy: userId
    });

    return skill;
};


//Get All Skills

const getAllSkills = async (options = {}) => {

    const {
        page = 1,
        limit = 10,
        status,
        category,
        level,
        search,
        featured,
        sortBy = "createdAt",
        sortOrder = "desc"
    } = options;


    const currentPage = Math.max(
        Number(page) || 1,
        1
    );

    const perPage = Math.min(
        Math.max(Number(limit) || 10, 1),
        100
    );


    const filter = {};


    //Status

    if (status) {
        filter.status = status;
    }


    //Category

    if (category) {
        filter.category = category;
    }


    //Level

    if (level) {
        filter.level = level;
    }


    //Featured

    if (featured !== undefined) {

        filter.featured =
            featured === true ||
            featured === "true";

    }


    //Search

    if (search && search.trim()) {

        filter.$or = [
            {
                name: {
                    $regex: search.trim(),
                    $options: "i"
                }
            },
            {
                description: {
                    $regex: search.trim(),
                    $options: "i"
                }
            }
        ];

    }


    //Sorting

    const allowedSortFields = [
        "name",
        "createdAt",
        "updatedAt",
        "displayOrder"
    ];

    const safeSortField =
        allowedSortFields.includes(sortBy)
            ? sortBy
            : "createdAt";


    const safeSortOrder =
        sortOrder === "asc"
            ? 1
            : -1;


    const skip =
        (currentPage - 1) * perPage;


    const [
        skills,
        total
    ] = await Promise.all([

        Skill
            .find(filter)
            .sort({
                [safeSortField]: safeSortOrder
            })
            .skip(skip)
            .limit(perPage)
            .lean(),

        Skill.countDocuments(filter)

    ]);


    return {

        skills,

        pagination: {

            page: currentPage,

            limit: perPage,

            total,

            totalPages:
                Math.ceil(total / perPage),

            hasNextPage:
                currentPage <
                Math.ceil(total / perPage),

            hasPreviousPage:
                currentPage > 1

        }

    };

};


//Get Skill By ID

const getSkillById = async (skillId) => {

    if (!mongoose.isValidObjectId(skillId)) {

        throw new ApiError(
            400,
            "Invalid skill ID."
        );

    }


    const skill = await Skill
        .findById(skillId)
        .lean();


    if (!skill) {

        throw new ApiError(
            404,
            "Skill not found."
        );

    }


    return skill;

};


//Get Skill By Slug

const getSkillBySlug = async (slug) => {

    if (!slug || !slug.trim()) {

        throw new ApiError(
            400,
            "Skill slug is required."
        );

    }


    const skill = await Skill
        .findOne({
            slug: slug.trim().toLowerCase()
        })
        .lean();


    if (!skill) {

        throw new ApiError(
            404,
            "Skill not found."
        );

    }


    return skill;

};


//Update Skill

const updateSkill = async (
    skillId,
    updateData,
    userId
) => {

    if (!mongoose.isValidObjectId(skillId)) {

        throw new ApiError(
            400,
            "Invalid skill ID."
        );

    }


    if (!userId) {

        throw new ApiError(
            401,
            "User authentication is required."
        );

    }


    const skill = await Skill.findById(
        skillId
    );


    if (!skill) {

        throw new ApiError(
            404,
            "Skill not found."
        );

    }


    //Duplicate Name / Slug Check

    if (
        updateData.name ||
        updateData.slug
    ) {

        const duplicateConditions = [];


        if (updateData.name) {

            duplicateConditions.push({
                name: updateData.name
            });

        }


        if (updateData.slug) {

            duplicateConditions.push({
                slug: updateData.slug
            });

        }


        const duplicateSkill =
            await Skill.findOne({

                _id: {
                    $ne: skillId
                },

                $or: duplicateConditions

            });


        if (duplicateSkill) {

            throw new ApiError(
                409,
                "Another skill with the same name or slug already exists."
            );

        }

    }


    //Update Fields

    Object.keys(updateData).forEach(
        (key) => {

            if (
                updateData[key] !== undefined
            ) {

                skill[key] =
                    updateData[key];

            }

        }
    );


    skill.updatedBy = userId;


    await skill.save();


    return skill;

};


//Publish Skill

const publishSkill = async (
    skillId,
    userId
) => {

    if (!mongoose.isValidObjectId(skillId)) {

        throw new ApiError(
            400,
            "Invalid skill ID."
        );

    }


    const skill = await Skill.findById(
        skillId
    );


    if (!skill) {

        throw new ApiError(
            404,
            "Skill not found."
        );

    }


    if (
        !skill.name ||
        !skill.description
    ) {

        throw new ApiError(
            400,
            "Skill must have a name and description before publishing."
        );

    }


    skill.status = "published";

    skill.updatedBy = userId;


    await skill.save();


    return skill;

};


//Unpublish Skill

const unpublishSkill = async (
    skillId,
    userId
) => {

    if (!mongoose.isValidObjectId(skillId)) {

        throw new ApiError(
            400,
            "Invalid skill ID."
        );

    }


    const skill = await Skill.findById(
        skillId
    );


    if (!skill) {

        throw new ApiError(
            404,
            "Skill not found."
        );

    }


    skill.status = "draft";

    skill.updatedBy = userId;


    await skill.save();


    return skill;

};


//Archive Skill

const archiveSkill = async (
    skillId,
    userId
) => {

    if (!mongoose.isValidObjectId(skillId)) {

        throw new ApiError(
            400,
            "Invalid skill ID."
        );

    }


    const skill = await Skill.findById(
        skillId
    );


    if (!skill) {

        throw new ApiError(
            404,
            "Skill not found."
        );

    }


    skill.status = "archived";

    skill.updatedBy = userId;


    await skill.save();


    return skill;

};


//Restore Skill

const restoreSkill = async (
    skillId,
    userId
) => {

    if (!mongoose.isValidObjectId(skillId)) {

        throw new ApiError(
            400,
            "Invalid skill ID."
        );

    }


    const skill = await Skill.findById(
        skillId
    );


    if (!skill) {

        throw new ApiError(
            404,
            "Skill not found."
        );

    }


    skill.status = "draft";

    skill.updatedBy = userId;


    await skill.save();


    return skill;

};


//Delete Skill

const deleteSkill = async (
    skillId
) => {

    if (!mongoose.isValidObjectId(skillId)) {

        throw new ApiError(
            400,
            "Invalid skill ID."
        );

    }


    const skill = await Skill.findById(
        skillId
    );


    if (!skill) {

        throw new ApiError(
            404,
            "Skill not found."
        );

    }


    //Check Career Relationships

    const careerSkillCount =
        await CareerSkill.countDocuments({
            skill: skillId
        });


    //Check Student Relationships

    const studentSkillCount =
        await StudentSkill.countDocuments({
            skill: skillId
        });


    if (
        careerSkillCount > 0 ||
        studentSkillCount > 0
    ) {

        throw new ApiError(
            409,
            "Skill cannot be permanently deleted because it is already being used. Archive it instead."
        );

    }


    await Skill.findByIdAndDelete(
        skillId
    );


    return {
        message: "Skill deleted successfully."
    };

};


//Get Skill With Career Relationships

const getSkillDetails = async (
    skillId
) => {

    if (!mongoose.isValidObjectId(skillId)) {

        throw new ApiError(
            400,
            "Invalid skill ID."
        );

    }


    const skill = await Skill
        .findById(skillId)
        .lean();


    if (!skill) {

        throw new ApiError(
            404,
            "Skill not found."
        );

    }


    const careerMappings =
        await CareerSkill
            .find({
                skill: skillId
            })
            .populate(
                "career",
                "name slug description status"
            )
            .lean();


    return {

        skill,

        careers: careerMappings

    };

};


//Get Published Skills

const getPublishedSkills = async () => {

    const skills = await Skill
        .find({
            status: "published"
        })
        .sort({
            displayOrder: 1,
            name: 1
        })
        .lean();


    return skills;

};


//Get Skills By Category

const getSkillsByCategory = async (
    category
) => {

    if (!category || !category.trim()) {

        throw new ApiError(
            400,
            "Skill category is required."
        );

    }


    const skills = await Skill
        .find({
            category: category.trim(),
            status: "published"
        })
        .sort({
            displayOrder: 1,
            name: 1
        })
        .lean();


    return skills;

};


//Get Skills By Level

const getSkillsByLevel = async (
    level
) => {

    if (!level || !level.trim()) {

        throw new ApiError(
            400,
            "Skill level is required."
        );

    }


    const allowedLevels = [
        "Beginner",
        "Intermediate",
        "Advanced",
        "Expert"
    ];


    if (!allowedLevels.includes(level)) {

        throw new ApiError(
            400,
            "Invalid skill level."
        );

    }


    const skills = await Skill
        .find({
            level,
            status: "published"
        })
        .sort({
            displayOrder: 1,
            name: 1
        })
        .lean();


    return skills;

};


//Update Skill Display Order

const updateSkillDisplayOrder = async (
    skillId,
    displayOrder,
    userId
) => {

    if (!mongoose.isValidObjectId(skillId)) {

        throw new ApiError(
            400,
            "Invalid skill ID."
        );

    }


    if (
        !Number.isInteger(
            Number(displayOrder)
        ) ||
        Number(displayOrder) < 0
    ) {

        throw new ApiError(
            400,
            "Display order must be a non-negative integer."
        );

    }


    const skill = await Skill.findById(
        skillId
    );


    if (!skill) {

        throw new ApiError(
            404,
            "Skill not found."
        );

    }


    skill.displayOrder =
        Number(displayOrder);

    skill.updatedBy = userId;


    await skill.save();


    return skill;

};


//Export Service Functions

module.exports = {

    createSkill,

    getAllSkills,

    getSkillById,

    getSkillBySlug,

    updateSkill,

    publishSkill,

    unpublishSkill,

    archiveSkill,

    restoreSkill,

    deleteSkill,

    getSkillDetails,

    getPublishedSkills,

    getSkillsByCategory,

    getSkillsByLevel,

    updateSkillDisplayOrder

};