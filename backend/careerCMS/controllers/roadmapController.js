const roadmapService = require("../services/roadmapService");


//Create Roadmap

const createRoadmap = async (req, res, next) => {

    try {

        const roadmap =
            await roadmapService.createRoadmap(
                req.body,
                req.user._id
            );

        return res.status(201).json({

            success: true,

            message:
                "Roadmap created successfully.",

            data: roadmap

        });

    } catch (error) {

        next(error);

    }

};


//Get All Roadmaps

const getAllRoadmaps = async (req, res, next) => {

    try {

        const result =
            await roadmapService.getAllRoadmaps(
                req.query
            );

        return res.status(200).json({

            success: true,

            message:
                "Roadmaps retrieved successfully.",

            data: result

        });

    } catch (error) {

        next(error);

    }

};


//Get Roadmap By ID

const getRoadmapById = async (req, res, next) => {

    try {

        const roadmap =
            await roadmapService.getRoadmapById(
                req.params.id
            );

        return res.status(200).json({

            success: true,

            message:
                "Roadmap retrieved successfully.",

            data: roadmap

        });

    } catch (error) {

        next(error);

    }

};


//Get Roadmap By Slug

const getRoadmapBySlug = async (req, res, next) => {

    try {

        const roadmap =
            await roadmapService.getRoadmapBySlug(
                req.params.slug
            );

        return res.status(200).json({

            success: true,

            message:
                "Roadmap retrieved successfully.",

            data: roadmap

        });

    } catch (error) {

        next(error);

    }

};


//Update Roadmap

const updateRoadmap = async (req, res, next) => {

    try {

        const roadmap =
            await roadmapService.updateRoadmap(

                req.params.id,

                req.body,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Roadmap updated successfully.",

            data: roadmap

        });

    } catch (error) {

        next(error);

    }

};


//Delete Roadmap

const deleteRoadmap = async (req, res, next) => {

    try {

        const result =
            await roadmapService.deleteRoadmap(
                req.params.id
            );

        return res.status(200).json({

            success: true,

            message:
                result.message

        });

    } catch (error) {

        next(error);

    }

};


//Publish Roadmap

const publishRoadmap = async (req, res, next) => {

    try {

        const roadmap =
            await roadmapService.publishRoadmap(

                req.params.id,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Roadmap published successfully.",

            data: roadmap

        });

    } catch (error) {

        next(error);

    }

};


//Unpublish Roadmap

const unpublishRoadmap = async (req, res, next) => {

    try {

        const roadmap =
            await roadmapService.unpublishRoadmap(

                req.params.id,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Roadmap unpublished successfully.",

            data: roadmap

        });

    } catch (error) {

        next(error);

    }

};


//Archive Roadmap

const archiveRoadmap = async (req, res, next) => {

    try {

        const roadmap =
            await roadmapService.archiveRoadmap(

                req.params.id,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Roadmap archived successfully.",

            data: roadmap

        });

    } catch (error) {

        next(error);

    }

};


//Restore Roadmap

const restoreRoadmap = async (req, res, next) => {

    try {

        const roadmap =
            await roadmapService.restoreRoadmap(

                req.params.id,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Roadmap restored successfully.",

            data: roadmap

        });

    } catch (error) {

        next(error);

    }

};


//Get Roadmaps By Career

const getRoadmapsByCareer = async (
    req,
    res,
    next
) => {

    try {

        const roadmaps =
            await roadmapService.getRoadmapsByCareer(

                req.params.careerId,

                req.query

            );

        return res.status(200).json({

            success: true,

            message:
                "Career roadmaps retrieved successfully.",

            data: roadmaps

        });

    } catch (error) {

        next(error);

    }

};


//Get Published Roadmaps

const getPublishedRoadmaps = async (
    req,
    res,
    next
) => {

    try {

        const roadmaps =
            await roadmapService.getPublishedRoadmaps(
                req.query
            );

        return res.status(200).json({

            success: true,

            message:
                "Published roadmaps retrieved successfully.",

            data: roadmaps

        });

    } catch (error) {

        next(error);

    }

};


//Update Roadmap Display Order

const updateRoadmapDisplayOrder = async (
    req,
    res,
    next
) => {

    try {

        const roadmap =
            await roadmapService.updateRoadmapDisplayOrder(

                req.params.id,

                req.body.displayOrder,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Roadmap display order updated successfully.",

            data: roadmap

        });

    } catch (error) {

        next(error);

    }

};


//Export Controllers

module.exports = {

    createRoadmap,

    getAllRoadmaps,

    getRoadmapById,

    getRoadmapBySlug,

    updateRoadmap,

    deleteRoadmap,

    publishRoadmap,

    unpublishRoadmap,

    archiveRoadmap,

    restoreRoadmap,

    getRoadmapsByCareer,

    getPublishedRoadmaps,

    updateRoadmapDisplayOrder

};