const express = require("express");

const router = express.Router();

const resourceController = require("../controllers/resourceController");

const {
    protect,
    authorize
} = require("../../shared/middleware/auth");


//Public Learning Resource Routes

/*
    GET /api/resources
    Get all learning resources
*/
router.get(
    "/",
    resourceController.getAllResources
);


/*
    GET /api/resources/published
    Get published learning resources
*/
router.get(
    "/published",
    resourceController.getPublishedResources
);


/*
    GET /api/resources/career/:careerId
    Get resources associated with a career
*/
router.get(
    "/career/:careerId",
    resourceController.getResourcesByCareer
);


/*
    GET /api/resources/skill/:skillId
    Get resources associated with a skill
*/
router.get(
    "/skill/:skillId",
    resourceController.getResourcesBySkill
);


/*
    GET /api/resources/slug/:slug
    Get resource by slug
*/
router.get(
    "/slug/:slug",
    resourceController.getResourceBySlug
);


/*
    GET /api/resources/:id
    Get resource by ID
*/
router.get(
    "/:id",
    resourceController.getResourceById
);


//Admin Learning Resource Routes

/*
    POST /api/resources
    Create learning resource
*/
router.post(
    "/",
    protect,
    authorize("admin"),
    resourceController.createResource
);


/*
    PUT /api/resources/:id
    Update learning resource
*/
router.put(
    "/:id",
    protect,
    authorize("admin"),
    resourceController.updateResource
);


/*
    DELETE /api/resources/:id
    Delete learning resource
*/
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    resourceController.deleteResource
);


//Resource Publishing

/*
    PATCH /api/resources/:id/publish
    Publish resource
*/
router.patch(
    "/:id/publish",
    protect,
    authorize("admin"),
    resourceController.publishResource
);


/*
    PATCH /api/resources/:id/unpublish
    Unpublish resource
*/
router.patch(
    "/:id/unpublish",
    protect,
    authorize("admin"),
    resourceController.unpublishResource
);


//Resource Archive

/*
    PATCH /api/resources/:id/archive
    Archive resource
*/
router.patch(
    "/:id/archive",
    protect,
    authorize("admin"),
    resourceController.archiveResource
);


/*
    PATCH /api/resources/:id/restore
    Restore resource
*/
router.patch(
    "/:id/restore",
    protect,
    authorize("admin"),
    resourceController.restoreResource
);


//Resource Display Order

/*
    PATCH /api/resources/:id/display-order
    Update resource display order
*/
router.patch(
    "/:id/display-order",
    protect,
    authorize("admin"),
    resourceController.updateResourceDisplayOrder
);


//Export Router

module.exports = router;