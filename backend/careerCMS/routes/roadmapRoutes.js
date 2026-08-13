const express = require("express");

const router = express.Router();

const roadmapController = require("../controllers/roadmapController");

const {
    protect,
    authorize
} = require("../../shared/middleware/auth");


//Public Roadmap Routes

/*
    GET /api/roadmaps
    Get all roadmaps
*/
router.get(
    "/",
    roadmapController.getAllRoadmaps
);


/*
    GET /api/roadmaps/career/:careerId
    Get roadmaps belonging to a career
*/
router.get(
    "/career/:careerId",
    roadmapController.getRoadmapsByCareer
);


/*
    GET /api/roadmaps/published
    Get published roadmaps
*/
router.get(
    "/published",
    roadmapController.getPublishedRoadmaps
);


/*
    GET /api/roadmaps/slug/:slug
    Get roadmap by slug
*/
router.get(
    "/slug/:slug",
    roadmapController.getRoadmapBySlug
);


/*
    GET /api/roadmaps/:id
    Get roadmap by ID
*/
router.get(
    "/:id",
    roadmapController.getRoadmapById
);


//Admin Roadmap Routes

/*
    POST /api/roadmaps
    Create roadmap
*/
router.post(
    "/",
    protect,
    authorize("admin"),
    roadmapController.createRoadmap
);


/*
    PUT /api/roadmaps/:id
    Update roadmap
*/
router.put(
    "/:id",
    protect,
    authorize("admin"),
    roadmapController.updateRoadmap
);


/*
    DELETE /api/roadmaps/:id
    Delete roadmap
*/
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    roadmapController.deleteRoadmap
);


//Roadmap Publishing

/*
    PATCH /api/roadmaps/:id/publish
    Publish roadmap
*/
router.patch(
    "/:id/publish",
    protect,
    authorize("admin"),
    roadmapController.publishRoadmap
);


/*
    PATCH /api/roadmaps/:id/unpublish
    Unpublish roadmap
*/
router.patch(
    "/:id/unpublish",
    protect,
    authorize("admin"),
    roadmapController.unpublishRoadmap
);


//Roadmap Archive

/*
    PATCH /api/roadmaps/:id/archive
    Archive roadmap
*/
router.patch(
    "/:id/archive",
    protect,
    authorize("admin"),
    roadmapController.archiveRoadmap
);


/*
    PATCH /api/roadmaps/:id/restore
    Restore roadmap
*/
router.patch(
    "/:id/restore",
    protect,
    authorize("admin"),
    roadmapController.restoreRoadmap
);


//Roadmap Display Order

/*
    PATCH /api/roadmaps/:id/display-order
    Update roadmap display order
*/
router.patch(
    "/:id/display-order",
    protect,
    authorize("admin"),
    roadmapController.updateRoadmapDisplayOrder
);


//Export Router

module.exports = router;