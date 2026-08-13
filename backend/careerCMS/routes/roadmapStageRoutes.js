const express = require("express");

const router = express.Router();

const roadmapStageController = require("../controllers/roadmapStageController");

const {
    protect,
    authorize
} = require("../../shared/middleware/auth");


//Public Roadmap Stage Routes

/*
    GET /api/roadmap-stages
    Get all roadmap stages
*/
router.get(
    "/",
    roadmapStageController.getAllRoadmapStages
);


/*
    GET /api/roadmap-stages/roadmap/:roadmapId
    Get stages belonging to a roadmap
*/
router.get(
    "/roadmap/:roadmapId",
    roadmapStageController.getStagesByRoadmap
);


/*
    GET /api/roadmap-stages/:id
    Get roadmap stage by ID
*/
router.get(
    "/:id",
    roadmapStageController.getRoadmapStageById
);


//Admin Roadmap Stage Routes

/*
    POST /api/roadmap-stages
    Create roadmap stage
*/
router.post(
    "/",
    protect,
    authorize("admin"),
    roadmapStageController.createRoadmapStage
);


/*
    PUT /api/roadmap-stages/:id
    Update roadmap stage
*/
router.put(
    "/:id",
    protect,
    authorize("admin"),
    roadmapStageController.updateRoadmapStage
);


/*
    DELETE /api/roadmap-stages/:id
    Delete roadmap stage
*/
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    roadmapStageController.deleteRoadmapStage
);


//Roadmap Stage Publishing

/*
    PATCH /api/roadmap-stages/:id/publish
    Publish roadmap stage
*/
router.patch(
    "/:id/publish",
    protect,
    authorize("admin"),
    roadmapStageController.publishRoadmapStage
);


/*
    PATCH /api/roadmap-stages/:id/unpublish
    Unpublish roadmap stage
*/
router.patch(
    "/:id/unpublish",
    protect,
    authorize("admin"),
    roadmapStageController.unpublishRoadmapStage
);


//Stage Display Order

/*
    PATCH /api/roadmap-stages/:id/order
    Update stage display order
*/
router.patch(
    "/:id/order",
    protect,
    authorize("admin"),
    roadmapStageController.updateStageOrder
);


//Export Router

module.exports = router;