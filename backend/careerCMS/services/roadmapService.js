const mongoose = require("mongoose");

const Roadmap = require("../models/Roadmap");
const RoadmapStage = require("../models/RoadmapStage");
const Career = require("../models/Career");

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

    const career = await Career.findById(careerId);

    if (!career) {
        throw new ApiError(
            404,
            "Career not found."
        );
    }

    return career;

};


//Create Roadmap

const createRoadmap = async (
    roadmapData,
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
        slug,
        name,
        title
    } = roadmapData;


    //Validate Career

    if (career) {
        validateObjectId(
            career,
            "career ID"
        );

        await checkCareerExists(career);
    }


    //Duplicate Slug

    if (slug) {

        const existingSlug =
            await Roadmap.findOne({
                slug
            });

        if (existingSlug) {
            throw new ApiError(
                409,
                "A roadmap with the same slug already exists."
            );
        }

    }


    //Duplicate Name / Title For Career

    if (name || title) {

        const duplicateFilter = {};

        if (career) {
            duplicateFilter.career = career;
        }

        duplicateFilter.$or = [];

        if (name) {
            duplicateFilter.$or.push({
                name
            });
        }

        if (title) {
            duplicateFilter.$or.push({
                title
            });
        }


        const existingRoadmap =
            await Roadmap.findOne(
                duplicateFilter
            );


        if (existingRoadmap) {
            throw new ApiError(
                409,
                "A roadmap with the same name or title already exists for this career."
            );
        }

    }


    //Create Roadmap

    const roadmap = await Roadmap.create({

        ...roadmapData,

        createdBy: userId,

        updatedBy: userId

    });


    return roadmap;

};


//Get All Roadmaps

const getAllRoadmaps = async (
    options = {}
) => {

    const {
        page = 1,
        limit = 10,
        career,
        status,
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


    //Career Filter

    if (career) {

        validateObjectId(
            career,
            "career ID"
        );

        filter.career = career;

    }


    //Status Filter

    if (status) {
        filter.status = status;
    }


    //Featured Filter

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
                title: {
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
        "title",
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
        roadmaps,
        total
    ] = await Promise.all([

        Roadmap
            .find(filter)
            .populate(
                "career",
                "name slug status"
            )
            .sort({
                [safeSortField]: safeSortOrder
            })
            .skip(skip)
            .limit(perPage)
            .lean(),

        Roadmap.countDocuments(filter)

    ]);


    return {

        roadmaps,

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


//Get Roadmap By ID

const getRoadmapById = async (
    roadmapId
) => {

    validateObjectId(
        roadmapId,
        "roadmap ID"
    );


    const roadmap =
        await Roadmap
            .findById(roadmapId)
            .populate(
                "career",
                "name slug description status"
            )
            .lean();


    if (!roadmap) {

        throw new ApiError(
            404,
            "Roadmap not found."
        );

    }


    return roadmap;

};


//Get Roadmap By Slug

const getRoadmapBySlug = async (
    slug
) => {

    if (!slug || !slug.trim()) {

        throw new ApiError(
            400,
            "Roadmap slug is required."
        );

    }


    const roadmap =
        await Roadmap
            .findOne({
                slug: slug
                    .trim()
                    .toLowerCase()
            })
            .populate(
                "career",
                "name slug description status"
            )
            .lean();


    if (!roadmap) {

        throw new ApiError(
            404,
            "Roadmap not found."
        );

    }


    return roadmap;

};


//Update Roadmap

const updateRoadmap = async (
    roadmapId,
    updateData,
    userId
) => {

    validateObjectId(
        roadmapId,
        "roadmap ID"
    );


    if (!userId) {

        throw new ApiError(
            401,
            "User authentication is required."
        );

    }


    const roadmap =
        await Roadmap.findById(
            roadmapId
        );


    if (!roadmap) {

        throw new ApiError(
            404,
            "Roadmap not found."
        );

    }


    //Career Change

    if (updateData.career) {

        validateObjectId(
            updateData.career,
            "career ID"
        );

        await checkCareerExists(
            updateData.career
        );

    }


    //Slug Duplicate Check

    if (
        updateData.slug &&
        updateData.slug !== roadmap.slug
    ) {

        const duplicateSlug =
            await Roadmap.findOne({

                _id: {
                    $ne: roadmapId
                },

                slug: updateData.slug

            });


        if (duplicateSlug) {

            throw new ApiError(
                409,
                "A roadmap with the same slug already exists."
            );

        }

    }


    //Update Fields

    Object.keys(updateData).forEach(
        (key) => {

            if (
                updateData[key] !== undefined
            ) {

                roadmap[key] =
                    updateData[key];

            }

        }
    );


    roadmap.updatedBy = userId;


    await roadmap.save();


    return roadmap;

};


//Publish Roadmap

const publishRoadmap = async (
    roadmapId,
    userId
) => {

    validateObjectId(
        roadmapId,
        "roadmap ID"
    );


    const roadmap =
        await Roadmap.findById(
            roadmapId
        );


    if (!roadmap) {

        throw new ApiError(
            404,
            "Roadmap not found."
        );

    }


    //Basic Validation

    if (
        !roadmap.name &&
        !roadmap.title
    ) {

        throw new ApiError(
            400,
            "Roadmap must have a name or title before publishing."
        );

    }


    if (!roadmap.description) {

        throw new ApiError(
            400,
            "Roadmap must have a description before publishing."
        );

    }


    //Check Career

    if (roadmap.career) {

        await checkCareerExists(
            roadmap.career
        );

    }


    roadmap.status = "published";

    roadmap.updatedBy = userId;


    await roadmap.save();


    return roadmap;

};


//Unpublish Roadmap

const unpublishRoadmap = async (
    roadmapId,
    userId
) => {

    validateObjectId(
        roadmapId,
        "roadmap ID"
    );


    const roadmap =
        await Roadmap.findById(
            roadmapId
        );


    if (!roadmap) {

        throw new ApiError(
            404,
            "Roadmap not found."
        );

    }


    roadmap.status = "draft";

    roadmap.updatedBy = userId;


    await roadmap.save();


    return roadmap;

};


//Archive Roadmap

const archiveRoadmap = async (
    roadmapId,
    userId
) => {

    validateObjectId(
        roadmapId,
        "roadmap ID"
    );


    const roadmap =
        await Roadmap.findById(
            roadmapId
        );


    if (!roadmap) {

        throw new ApiError(
            404,
            "Roadmap not found."
        );

    }


    roadmap.status = "archived";

    roadmap.updatedBy = userId;


    await roadmap.save();


    return roadmap;

};


//Restore Roadmap

const restoreRoadmap = async (
    roadmapId,
    userId
) => {

    validateObjectId(
        roadmapId,
        "roadmap ID"
    );


    const roadmap =
        await Roadmap.findById(
            roadmapId
        );


    if (!roadmap) {

        throw new ApiError(
            404,
            "Roadmap not found."
        );

    }


    roadmap.status = "draft";

    roadmap.updatedBy = userId;


    await roadmap.save();


    return roadmap;

};


//Delete Roadmap

const deleteRoadmap = async (
    roadmapId
) => {

    validateObjectId(
        roadmapId,
        "roadmap ID"
    );


    const roadmap =
        await Roadmap.findById(
            roadmapId
        );


    if (!roadmap) {

        throw new ApiError(
            404,
            "Roadmap not found."
        );

    }


    //Check Roadmap Stages

    const stageCount =
        await RoadmapStage.countDocuments({
            roadmap: roadmapId
        });


    if (stageCount > 0) {

        throw new ApiError(
            409,
            "Roadmap cannot be permanently deleted because it contains stages. Delete its stages first or archive the roadmap."
        );

    }


    await Roadmap.findByIdAndDelete(
        roadmapId
    );


    return {

        message:
            "Roadmap deleted successfully."

    };

};


//Get Roadmap With Stages

const getRoadmapDetails = async (
    roadmapId
) => {

    validateObjectId(
        roadmapId,
        "roadmap ID"
    );


    const roadmap =
        await Roadmap
            .findById(roadmapId)
            .populate(
                "career",
                "name slug description status"
            )
            .lean();


    if (!roadmap) {

        throw new ApiError(
            404,
            "Roadmap not found."
        );

    }


    const stages =
        await RoadmapStage
            .find({
                roadmap: roadmapId
            })
            .sort({
                displayOrder: 1,
                order: 1,
                createdAt: 1
            })
            .lean();


    return {

        roadmap,

        stages

    };

};


//Get Roadmaps By Career

const getRoadmapsByCareer = async (
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


    const roadmaps =
        await Roadmap
            .find(filter)
            .sort({
                displayOrder: 1,
                createdAt: 1
            })
            .lean();


    return roadmaps;

};


//Get Published Roadmaps

const getPublishedRoadmaps = async () => {

    const roadmaps =
        await Roadmap
            .find({
                status: "published"
            })
            .populate(
                "career",
                "name slug"
            )
            .sort({
                displayOrder: 1,
                createdAt: 1
            })
            .lean();


    return roadmaps;

};


//Update Roadmap Display Order

const updateRoadmapDisplayOrder = async (
    roadmapId,
    displayOrder,
    userId
) => {

    validateObjectId(
        roadmapId,
        "roadmap ID"
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


    const roadmap =
        await Roadmap.findById(
            roadmapId
        );


    if (!roadmap) {

        throw new ApiError(
            404,
            "Roadmap not found."
        );

    }


    roadmap.displayOrder =
        Number(displayOrder);

    roadmap.updatedBy =
        userId;


    await roadmap.save();


    return roadmap;

};


//Export Service Functions

module.exports = {

    createRoadmap,

    getAllRoadmaps,

    getRoadmapById,

    getRoadmapBySlug,

    updateRoadmap,

    publishRoadmap,

    unpublishRoadmap,

    archiveRoadmap,

    restoreRoadmap,

    deleteRoadmap,

    getRoadmapDetails,

    getRoadmapsByCareer,

    getPublishedRoadmaps,

    updateRoadmapDisplayOrder

};