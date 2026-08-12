const mongoose = require("mongoose");

const LearningResource = require("../models/LearningResource");
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


//Validate Skill Array

const validateSkillArray = async (
    skills
) => {

    if (skills === undefined) {
        return;
    }


    if (!Array.isArray(skills)) {

        throw new ApiError(
            400,
            "Skills must be provided as an array."
        );

    }


    for (const skillId of skills) {

        validateObjectId(
            skillId,
            "skill ID"
        );

        await checkSkillExists(
            skillId
        );

    }

};


//Create Learning Resource

const createResource = async (
    resourceData,
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
        skills,
        slug,
        name,
        title,
        url
    } = resourceData;


    //Validate Career

    if (career) {

        validateObjectId(
            career,
            "career ID"
        );

        await checkCareerExists(
            career
        );

    }


    //Validate Skills

    await validateSkillArray(
        skills
    );


    //Validate URL

    if (!url || !url.trim()) {

        throw new ApiError(
            400,
            "Resource URL is required."
        );

    }


    //Duplicate Slug

    if (slug) {

        const existingSlug =
            await LearningResource.findOne({
                slug
            });


        if (existingSlug) {

            throw new ApiError(
                409,
                "A learning resource with the same slug already exists."
            );

        }

    }


    //Create Resource

    const resource =
        await LearningResource.create({

            ...resourceData,

            createdBy: userId,

            updatedBy: userId

        });


    return resource;

};


//Get All Learning Resources

const getAllResources = async (
    options = {}
) => {

    const {
        page = 1,
        limit = 10,
        career,
        skill,
        status,
        type,
        provider,
        category,
        level,
        search,
        featured,
        free,
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

        filter.skills = skill;

    }


    //Status Filter

    if (status) {

        filter.status = status;

    }


    //Resource Type

    if (type) {

        filter.type = type;

    }


    //Provider

    if (provider) {

        filter.provider = {

            $regex:
                provider.trim(),

            $options: "i"

        };

    }


    //Category

    if (category) {

        filter.category =
            category;

    }


    //Level

    if (level) {

        filter.level =
            level;

    }


    //Featured

    if (featured !== undefined) {

        filter.featured =
            featured === true ||
            featured === "true";

    }


    //Free Resource

    if (free !== undefined) {

        filter.isFree =
            free === true ||
            free === "true";

    }


    //Search

    if (
        search &&
        search.trim()
    ) {

        filter.$or = [

            {
                name: {
                    $regex:
                        search.trim(),
                    $options: "i"
                }
            },

            {
                title: {
                    $regex:
                        search.trim(),
                    $options: "i"
                }
            },

            {
                description: {
                    $regex:
                        search.trim(),
                    $options: "i"
                }
            },

            {
                provider: {
                    $regex:
                        search.trim(),
                    $options: "i"
                }
            }

        ];

    }


    //Sorting

    const allowedSortFields = [

        "name",
        "title",
        "provider",
        "type",
        "category",
        "level",
        "createdAt",
        "updatedAt",
        "displayOrder"

    ];


    const safeSortField =
        allowedSortFields.includes(
            sortBy
        )
            ? sortBy
            : "createdAt";


    const safeSortOrder =
        sortOrder === "asc"
            ? 1
            : -1;


    const skip =
        (currentPage - 1) * perPage;


    const [
        resources,
        total
    ] = await Promise.all([

        LearningResource
            .find(filter)
            .populate(
                "career",
                "name slug status"
            )
            .populate(
                "skills",
                "name slug category level status"
            )
            .sort({
                [safeSortField]:
                    safeSortOrder
            })
            .skip(skip)
            .limit(perPage)
            .lean(),

        LearningResource.countDocuments(
            filter
        )

    ]);


    return {

        resources,

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


//Get Resource By ID

const getResourceById = async (
    resourceId
) => {

    validateObjectId(
        resourceId,
        "resource ID"
    );


    const resource =
        await LearningResource
            .findById(resourceId)
            .populate(
                "career",
                "name slug description status"
            )
            .populate(
                "skills",
                "name slug description category level status"
            )
            .lean();


    if (!resource) {

        throw new ApiError(
            404,
            "Learning resource not found."
        );

    }


    return resource;

};


//Get Resource By Slug

const getResourceBySlug = async (
    slug
) => {

    if (
        !slug ||
        !slug.trim()
    ) {

        throw new ApiError(
            400,
            "Resource slug is required."
        );

    }


    const resource =
        await LearningResource
            .findOne({
                slug:
                    slug
                        .trim()
                        .toLowerCase()
            })
            .populate(
                "career",
                "name slug description status"
            )
            .populate(
                "skills",
                "name slug category level status"
            )
            .lean();


    if (!resource) {

        throw new ApiError(
            404,
            "Learning resource not found."
        );

    }


    return resource;

};


//Update Learning Resource

const updateResource = async (
    resourceId,
    updateData,
    userId
) => {

    validateObjectId(
        resourceId,
        "resource ID"
    );


    if (!userId) {

        throw new ApiError(
            401,
            "User authentication is required."
        );

    }


    const resource =
        await LearningResource.findById(
            resourceId
        );


    if (!resource) {

        throw new ApiError(
            404,
            "Learning resource not found."
        );

    }


    //Validate Career

    if (updateData.career) {

        validateObjectId(
            updateData.career,
            "career ID"
        );

        await checkCareerExists(
            updateData.career
        );

    }


    //Validate Skills

    if (
        updateData.skills !== undefined
    ) {

        await validateSkillArray(
            updateData.skills
        );

    }


    //Validate URL

    if (
        updateData.url !== undefined &&
        !updateData.url.trim()
    ) {

        throw new ApiError(
            400,
            "Resource URL cannot be empty."
        );

    }


    //Slug Duplicate Check

    if (
        updateData.slug &&
        updateData.slug !== resource.slug
    ) {

        const duplicateSlug =
            await LearningResource.findOne({

                _id: {
                    $ne: resourceId
                },

                slug: updateData.slug

            });


        if (duplicateSlug) {

            throw new ApiError(
                409,
                "A learning resource with the same slug already exists."
            );

        }

    }


    //Update Fields

    Object.keys(updateData).forEach(
        (key) => {

            if (
                updateData[key] !== undefined
            ) {

                resource[key] =
                    updateData[key];

            }

        }
    );


    resource.updatedBy =
        userId;


    await resource.save();


    return resource;

};


//Publish Resource

const publishResource = async (
    resourceId,
    userId
) => {

    validateObjectId(
        resourceId,
        "resource ID"
    );


    const resource =
        await LearningResource.findById(
            resourceId
        );


    if (!resource) {

        throw new ApiError(
            404,
            "Learning resource not found."
        );

    }


    //Required Content

    if (
        !resource.name &&
        !resource.title
    ) {

        throw new ApiError(
            400,
            "Resource must have a name or title before publishing."
        );

    }


    if (!resource.description) {

        throw new ApiError(
            400,
            "Resource must have a description before publishing."
        );

    }


    if (!resource.url) {

        throw new ApiError(
            400,
            "Resource URL is required before publishing."
        );

    }


    resource.status =
        "published";

    resource.updatedBy =
        userId;


    await resource.save();


    return resource;

};


//Unpublish Resource

const unpublishResource = async (
    resourceId,
    userId
) => {

    validateObjectId(
        resourceId,
        "resource ID"
    );


    const resource =
        await LearningResource.findById(
            resourceId
        );


    if (!resource) {

        throw new ApiError(
            404,
            "Learning resource not found."
        );

    }


    resource.status =
        "draft";

    resource.updatedBy =
        userId;


    await resource.save();


    return resource;

};


//Archive Resource

const archiveResource = async (
    resourceId,
    userId
) => {

    validateObjectId(
        resourceId,
        "resource ID"
    );


    const resource =
        await LearningResource.findById(
            resourceId
        );


    if (!resource) {

        throw new ApiError(
            404,
            "Learning resource not found."
        );

    }


    resource.status =
        "archived";

    resource.updatedBy =
        userId;


    await resource.save();


    return resource;

};


//Restore Resource


const restoreResource = async (
    resourceId,
    userId
) => {

    validateObjectId(
        resourceId,
        "resource ID"
    );


    const resource =
        await LearningResource.findById(
            resourceId
        );


    if (!resource) {

        throw new ApiError(
            404,
            "Learning resource not found."
        );

    }


    resource.status =
        "draft";

    resource.updatedBy =
        userId;


    await resource.save();


    return resource;

};


//Delete Resource

const deleteResource = async (
    resourceId
) => {

    validateObjectId(
        resourceId,
        "resource ID"
    );


    const resource =
        await LearningResource.findById(
            resourceId
        );


    if (!resource) {

        throw new ApiError(
            404,
            "Learning resource not found."
        );

    }


    await LearningResource.findByIdAndDelete(
        resourceId
    );


    return {

        message:
            "Learning resource deleted successfully."

    };

};


//Get Resources By Career

const getResourcesByCareer = async (
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


    const filter = {

        career: careerId

    };


    if (options.status) {

        filter.status =
            options.status;

    }


    if (options.type) {

        filter.type =
            options.type;

    }


    if (options.level) {

        filter.level =
            options.level;

    }


    if (options.isFree !== undefined) {

        filter.isFree =
            options.isFree === true ||
            options.isFree === "true";

    }


    const resources =
        await LearningResource
            .find(filter)
            .populate(
                "skills",
                "name slug category level"
            )
            .sort({

                displayOrder: 1,

                createdAt: 1

            })
            .lean();


    return resources;

};


//Get Resources By Skill

const getResourcesBySkill = async (
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


    const filter = {

        skills: skillId

    };


    if (options.status) {

        filter.status =
            options.status;

    }


    if (options.type) {

        filter.type =
            options.type;

    }


    if (options.level) {

        filter.level =
            options.level;

    }


    if (options.isFree !== undefined) {

        filter.isFree =
            options.isFree === true ||
            options.isFree === "true";

    }


    const resources =
        await LearningResource
            .find(filter)
            .populate(
                "career",
                "name slug status"
            )
            .populate(
                "skills",
                "name slug category level"
            )
            .sort({

                displayOrder: 1,

                createdAt: 1

            })
            .lean();


    return resources;

};


//Get Published Resources

const getPublishedResources = async (
    options = {}
) => {

    const filter = {

        status: "published"

    };


    if (options.career) {

        validateObjectId(
            options.career,
            "career ID"
        );

        filter.career =
            options.career;

    }


    if (options.skill) {

        validateObjectId(
            options.skill,
            "skill ID"
        );

        filter.skills =
            options.skill;

    }


    if (options.type) {

        filter.type =
            options.type;

    }


    if (options.level) {

        filter.level =
            options.level;

    }


    if (options.category) {

        filter.category =
            options.category;

    }


    if (options.isFree !== undefined) {

        filter.isFree =
            options.isFree === true ||
            options.isFree === "true";

    }


    const resources =
        await LearningResource
            .find(filter)
            .populate(
                "career",
                "name slug"
            )
            .populate(
                "skills",
                "name slug category level"
            )
            .sort({

                displayOrder: 1,

                createdAt: 1

            })
            .lean();


    return resources;

};


//Update Resource Display Order

const updateResourceDisplayOrder = async (
    resourceId,
    displayOrder,
    userId
) => {

    validateObjectId(
        resourceId,
        "resource ID"
    );


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


    const resource =
        await LearningResource.findById(
            resourceId
        );


    if (!resource) {

        throw new ApiError(
            404,
            "Learning resource not found."
        );

    }


    resource.displayOrder =
        Number(displayOrder);

    resource.updatedBy =
        userId;


    await resource.save();


    return resource;

};


//Export Service Functions

module.exports = {

    createResource,

    getAllResources,

    getResourceById,

    getResourceBySlug,

    updateResource,

    publishResource,

    unpublishResource,

    archiveResource,

    restoreResource,

    deleteResource,

    getResourcesByCareer,

    getResourcesBySkill,

    getPublishedResources,

    updateResourceDisplayOrder

};