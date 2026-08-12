const mongoose = require("mongoose");

const RoadmapStage = require("../models/RoadmapStage");
const Roadmap = require("../models/Roadmap");

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


//Check Roadmap Exists

const checkRoadmapExists = async (roadmapId) => {

    const roadmap = await Roadmap.findById(
        roadmapId
    );

    if (!roadmap) {

        throw new ApiError(
            404,
            "Roadmap not found."
        );

    }

    return roadmap;

};


//Create Roadmap Stage

const createRoadmapStage = async (
    stageData,
    userId
) => {

    if (!userId) {

        throw new ApiError(
            401,
            "User authentication is required."
        );

    }


    const {
        roadmap,
        title,
        name,
        displayOrder,
        order
    } = stageData;


    //Validate Roadmap

    validateObjectId(
        roadmap,
        "roadmap ID"
    );


    await checkRoadmapExists(
        roadmap
    );


    //Validate Stage Name

    if (!title && !name) {

        throw new ApiError(
            400,
            "Stage title or name is required."
        );

    }


    //Determine Order

    const requestedOrder =
        displayOrder !== undefined
            ? Number(displayOrder)
            : order !== undefined
                ? Number(order)
                : null;


    //Prevent Duplicate Order

    if (
        requestedOrder !== null &&
        Number.isInteger(requestedOrder)
    ) {

        const existingStage =
            await RoadmapStage.findOne({

                roadmap,

                $or: [
                    {
                        displayOrder:
                            requestedOrder
                    },
                    {
                        order:
                            requestedOrder
                    }
                ]

            });


        if (existingStage) {

            throw new ApiError(
                409,
                "Another stage already uses this order in the roadmap."
            );

        }

    }


    //Create Stage

    const stage =
        await RoadmapStage.create({

            ...stageData,

            createdBy: userId,

            updatedBy: userId

        });


    return stage;

};


//Get All Roadmap Stages

const getAllRoadmapStages = async (
    options = {}
) => {

    const {
        page = 1,
        limit = 20,
        roadmap,
        status,
        search,
        sortBy = "displayOrder",
        sortOrder = "asc"
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


    //Roadmap Filter

    if (roadmap) {

        validateObjectId(
            roadmap,
            "roadmap ID"
        );

        filter.roadmap = roadmap;

    }


    //Status Filter

    if (status) {

        filter.status = status;

    }


    //Search

    if (search && search.trim()) {

        filter.$or = [

            {
                title: {
                    $regex: search.trim(),
                    $options: "i"
                }
            },

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

        "displayOrder",

        "order",

        "title",

        "name",

        "createdAt",

        "updatedAt"

    ];


    const safeSortField =
        allowedSortFields.includes(sortBy)
            ? sortBy
            : "displayOrder";


    const safeSortOrder =
        sortOrder === "desc"
            ? -1
            : 1;


    const skip =
        (currentPage - 1) * perPage;


    const [
        stages,
        total
    ] = await Promise.all([

        RoadmapStage
            .find(filter)
            .populate(
                "roadmap",
                "name title slug status career"
            )
            .sort({
                [safeSortField]:
                    safeSortOrder
            })
            .skip(skip)
            .limit(perPage)
            .lean(),

        RoadmapStage.countDocuments(
            filter
        )

    ]);


    return {

        stages,

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


//Get Stage By ID

const getRoadmapStageById = async (
    stageId
) => {

    validateObjectId(
        stageId,
        "roadmap stage ID"
    );


    const stage =
        await RoadmapStage
            .findById(stageId)
            .populate(
                "roadmap",
                "name title slug description career status"
            )
            .lean();


    if (!stage) {

        throw new ApiError(
            404,
            "Roadmap stage not found."
        );

    }


    return stage;

};


//Get Stages For Roadmap

const getStagesForRoadmap = async (
    roadmapId,
    options = {}
) => {

    validateObjectId(
        roadmapId,
        "roadmap ID"
    );


    await checkRoadmapExists(
        roadmapId
    );


    const filter = {
        roadmap: roadmapId
    };


    if (options.status) {

        filter.status =
            options.status;

    }


    const stages =
        await RoadmapStage
            .find(filter)
            .sort({

                displayOrder: 1,

                order: 1,

                createdAt: 1

            })
            .lean();


    return stages;

};


//Update Roadmap Stage

const updateRoadmapStage = async (
    stageId,
    updateData,
    userId
) => {

    validateObjectId(
        stageId,
        "roadmap stage ID"
    );


    if (!userId) {

        throw new ApiError(
            401,
            "User authentication is required."
        );

    }


    const stage =
        await RoadmapStage.findById(
            stageId
        );


    if (!stage) {

        throw new ApiError(
            404,
            "Roadmap stage not found."
        );

    }


    //Validate New Roadmap

    if (updateData.roadmap) {

        validateObjectId(
            updateData.roadmap,
            "roadmap ID"
        );


        await checkRoadmapExists(
            updateData.roadmap
        );

    }


    //Determine New Roadmap

    const newRoadmapId =
        updateData.roadmap ||
        stage.roadmap;


    //Determine New Order   

    const newDisplayOrder =
        updateData.displayOrder !== undefined
            ? Number(updateData.displayOrder)
            : stage.displayOrder;


    const newOrder =
        updateData.order !== undefined
            ? Number(updateData.order)
            : stage.order;


    //Check Duplicate Order

    if (
        updateData.displayOrder !== undefined ||
        updateData.order !== undefined ||
        updateData.roadmap !== undefined
    ) {

        const duplicateFilter = {

            _id: {
                $ne: stageId
            },

            roadmap: newRoadmapId,

            $or: []

        };


        if (
            updateData.displayOrder !== undefined
        ) {

            duplicateFilter.$or.push({
                displayOrder:
                    newDisplayOrder
            });

        }


        if (
            updateData.order !== undefined
        ) {

            duplicateFilter.$or.push({
                order:
                    newOrder
            });

        }


        const duplicateStage =
            await RoadmapStage.findOne(
                duplicateFilter
            );


        if (duplicateStage) {

            throw new ApiError(
                409,
                "Another stage already uses this order in the roadmap."
            );

        }

    }


//Update Fields

    Object.keys(updateData).forEach(
        (key) => {

            if (
                updateData[key] !== undefined
            ) {

                stage[key] =
                    updateData[key];

            }

        }
    );


    stage.updatedBy =
        userId;


    await stage.save();


    return stage;

};


//Delete Roadmap Stage

const deleteRoadmapStage = async (
    stageId
) => {

    validateObjectId(
        stageId,
        "roadmap stage ID"
    );


    const stage =
        await RoadmapStage.findById(
            stageId
        );


    if (!stage) {

        throw new ApiError(
            404,
            "Roadmap stage not found."
        );

    }


    await RoadmapStage.findByIdAndDelete(
        stageId
    );


    return {

        message:
            "Roadmap stage deleted successfully."

    };

};


//Publish Roadmap Stage

const publishRoadmapStage = async (
    stageId,
    userId
) => {

    validateObjectId(
        stageId,
        "roadmap stage ID"
    );


    const stage =
        await RoadmapStage.findById(
            stageId
        );


    if (!stage) {

        throw new ApiError(
            404,
            "Roadmap stage not found."
        );

    }


    if (!stage.title && !stage.name) {

        throw new ApiError(
            400,
            "Stage must have a title or name before publishing."
        );

    }


    if (!stage.description) {

        throw new ApiError(
            400,
            "Stage must have a description before publishing."
        );

    }


    stage.status =
        "published";

    stage.updatedBy =
        userId;


    await stage.save();


    return stage;

};


//Unpublish Roadmap Stage

const unpublishRoadmapStage = async (
    stageId,
    userId
) => {

    validateObjectId(
        stageId,
        "roadmap stage ID"
    );


    const stage =
        await RoadmapStage.findById(
            stageId
        );


    if (!stage) {

        throw new ApiError(
            404,
            "Roadmap stage not found."
        );

    }


    stage.status =
        "draft";

    stage.updatedBy =
        userId;


    await stage.save();


    return stage;

};


//Archive Roadmap Stage

const archiveRoadmapStage = async (
    stageId,
    userId
) => {

    validateObjectId(
        stageId,
        "roadmap stage ID"
    );


    const stage =
        await RoadmapStage.findById(
            stageId
        );


    if (!stage) {

        throw new ApiError(
            404,
            "Roadmap stage not found."
        );

    }


    stage.status =
        "archived";

    stage.updatedBy =
        userId;


    await stage.save();


    return stage;

};


//Restore Roadmap Stage

const restoreRoadmapStage = async (
    stageId,
    userId
) => {

    validateObjectId(
        stageId,
        "roadmap stage ID"
    );


    const stage =
        await RoadmapStage.findById(
            stageId
        );


    if (!stage) {

        throw new ApiError(
            404,
            "Roadmap stage not found."
        );

    }


    stage.status =
        "draft";

    stage.updatedBy =
        userId;


    await stage.save();


    return stage;

};


//Reorder Roadmap Stages

const reorderRoadmapStages = async (
    roadmapId,
    stageOrders,
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


    await checkRoadmapExists(
        roadmapId
    );


    if (!Array.isArray(stageOrders)) {

        throw new ApiError(
            400,
            "Stage orders must be provided as an array."
        );

    }


    if (stageOrders.length === 0) {

        throw new ApiError(
            400,
            "At least one stage order is required."
        );

    }


    const bulkOperations = [];


    for (
        let index = 0;
        index < stageOrders.length;
        index++
    ) {

        const item =
            stageOrders[index];


        const stageId =
            item.stageId ||
            item._id ||
            item.id;


        const displayOrder =
            item.displayOrder !== undefined
                ? Number(item.displayOrder)
                : index + 1;


        validateObjectId(
            stageId,
            "stage ID"
        );


        if (
            !Number.isInteger(
                displayOrder
            ) ||
            displayOrder < 0
        ) {

            throw new ApiError(
                400,
                "Display order must be a non-negative integer."
            );

        }


        bulkOperations.push({

            updateOne: {

                filter: {

                    _id: stageId,

                    roadmap: roadmapId

                },

                update: {

                    $set: {

                        displayOrder,

                        updatedBy: userId

                    }

                }

            }

        });

    }


    const result =
        await RoadmapStage.bulkWrite(
            bulkOperations
        );


    return {

        matchedCount:
            result.matchedCount,

        modifiedCount:
            result.modifiedCount,

        message:
            "Roadmap stages reordered successfully."

    };

};


//Update Stage Display Order

const updateStageDisplayOrder = async (
    stageId,
    displayOrder,
    userId
) => {

    validateObjectId(
        stageId,
        "roadmap stage ID"
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


    const stage =
        await RoadmapStage.findById(
            stageId
        );


    if (!stage) {

        throw new ApiError(
            404,
            "Roadmap stage not found."
        );

    }


    stage.displayOrder =
        Number(displayOrder);

    stage.updatedBy =
        userId;


    await stage.save();


    return stage;

};


//Get Published Stages For Roadmap

const getPublishedStagesForRoadmap = async (
    roadmapId
) => {

    validateObjectId(
        roadmapId,
        "roadmap ID"
    );


    await checkRoadmapExists(
        roadmapId
    );


    const stages =
        await RoadmapStage
            .find({

                roadmap: roadmapId,

                status: "published"

            })
            .sort({

                displayOrder: 1,

                order: 1

            })
            .lean();


    return stages;

};


//Export Service Functions

module.exports = {

    createRoadmapStage,

    getAllRoadmapStages,

    getRoadmapStageById,

    getStagesForRoadmap,

    updateRoadmapStage,

    deleteRoadmapStage,

    publishRoadmapStage,

    unpublishRoadmapStage,

    archiveRoadmapStage,

    restoreRoadmapStage,

    reorderRoadmapStages,

    updateStageDisplayOrder,

    getPublishedStagesForRoadmap

};