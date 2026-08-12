const roadmapStageService = require("../services/roadmapStageService");


//Create Roadmap Stage

const createRoadmapStage = async (req, res, next) => {

    try {

        const roadmapStage =
            await roadmapStageService.createRoadmapStage(
                req.body,
                req.user._id
            );

        return res.status(201).json({

            success: true,

            message:
                "Roadmap stage created successfully.",

            data: roadmapStage

        });

    } catch (error) {

        next(error);

    }

};


//Get All Roadmap Stages

const getAllRoadmapStages = async (req, res, next) => {

    try {

        const result =
            await roadmapStageService.getAllRoadmapStages(
                req.query
            );

        return res.status(200).json({

            success: true,

            message:
                "Roadmap stages retrieved successfully.",

            data: result

        });

    } catch (error) {

        next(error);

    }

};


//Get Roadmap Stage By ID

const getRoadmapStageById = async (req, res, next) => {

    try {

        const roadmapStage =
            await roadmapStageService.getRoadmapStageById(
                req.params.id
            );

        return res.status(200).json({

            success: true,

            message:
                "Roadmap stage retrieved successfully.",

            data: roadmapStage

        });

    } catch (error) {

        next(error);

    }

};


//Update Roadmap Stage

const updateRoadmapStage = async (req, res, next) => {

    try {

        const roadmapStage =
            await roadmapStageService.updateRoadmapStage(

                req.params.id,

                req.body,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Roadmap stage updated successfully.",

            data: roadmapStage

        });

    } catch (error) {

        next(error);

    }

};


//Delete Roadmap Stage

const deleteRoadmapStage = async (req, res, next) => {

    try {

        const result =
            await roadmapStageService.deleteRoadmapStage(
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


//Get Stages By Roadmap

const getStagesByRoadmap = async (req, res, next) => {

    try {

        const stages =
            await roadmapStageService.getStagesByRoadmap(

                req.params.roadmapId,

                req.query

            );

        return res.status(200).json({

            success: true,

            message:
                "Roadmap stages retrieved successfully.",

            data: stages

        });

    } catch (error) {

        next(error);

    }

};


//Publish Roadmap Stage

const publishRoadmapStage = async (req, res, next) => {

    try {

        const roadmapStage =
            await roadmapStageService.publishRoadmapStage(

                req.params.id,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Roadmap stage published successfully.",

            data: roadmapStage

        });

    } catch (error) {

        next(error);

    }

};


//Unpublish Roadmap Stage

const unpublishRoadmapStage = async (req, res, next) => {

    try {

        const roadmapStage =
            await roadmapStageService.unpublishRoadmapStage(

                req.params.id,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Roadmap stage unpublished successfully.",

            data: roadmapStage

        });

    } catch (error) {

        next(error);

    }

};


//Update Stage Order

const updateStageOrder = async (req, res, next) => {

    try {

        const roadmapStage =
            await roadmapStageService.updateStageOrder(

                req.params.id,

                req.body.displayOrder,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Roadmap stage order updated successfully.",

            data: roadmapStage

        });

    } catch (error) {

        next(error);

    }

};


//Export Controllers

module.exports = {

    createRoadmapStage,

    getAllRoadmapStages,

    getRoadmapStageById,

    updateRoadmapStage,

    deleteRoadmapStage,

    getStagesByRoadmap,

    publishRoadmapStage,

    unpublishRoadmapStage,

    updateStageOrder

};