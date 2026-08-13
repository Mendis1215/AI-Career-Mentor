const express = require("express");

const router = express.Router();

const projectController = require("../controllers/projectController");

const {
    protect,
    authorize
} = require("../../shared/middleware/auth");


//Public Project Routes

/*
    GET /api/projects
    Get all projects
*/
router.get(
    "/",
    projectController.getAllProjects
);


/*
    GET /api/projects/published
    Get published projects
*/
router.get(
    "/published",
    projectController.getPublishedProjects
);


/*
    GET /api/projects/career/:careerId
    Get projects associated with a career
*/
router.get(
    "/career/:careerId",
    projectController.getProjectsByCareer
);


/*
    GET /api/projects/skill/:skillId
    Get projects associated with a skill
*/
router.get(
    "/skill/:skillId",
    projectController.getProjectsBySkill
);


/*
    GET /api/projects/slug/:slug
    Get project by slug
*/
router.get(
    "/slug/:slug",
    projectController.getProjectBySlug
);


/*
    GET /api/projects/:id
    Get project by ID
*/
router.get(
    "/:id",
    projectController.getProjectById
);


//Admin Project Routes

/*
    POST /api/projects
    Create project
*/
router.post(
    "/",
    protect,
    authorize("admin"),
    projectController.createProject
);


/*
    PUT /api/projects/:id
    Update project
*/
router.put(
    "/:id",
    protect,
    authorize("admin"),
    projectController.updateProject
);


/*
    DELETE /api/projects/:id
    Delete project
*/
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    projectController.deleteProject
);


//Project Publishing

/*
    PATCH /api/projects/:id/publish
    Publish project
*/
router.patch(
    "/:id/publish",
    protect,
    authorize("admin"),
    projectController.publishProject
);


/*
    PATCH /api/projects/:id/unpublish
    Unpublish project
*/
router.patch(
    "/:id/unpublish",
    protect,
    authorize("admin"),
    projectController.unpublishProject
);


//Project Archive

/*
    PATCH /api/projects/:id/archive
    Archive project
*/
router.patch(
    "/:id/archive",
    protect,
    authorize("admin"),
    projectController.archiveProject
);


/*
    PATCH /api/projects/:id/restore
    Restore project
*/
router.patch(
    "/:id/restore",
    protect,
    authorize("admin"),
    projectController.restoreProject
);


//Project Display Order

/*
    PATCH /api/projects/:id/display-order
    Update project display order
*/
router.patch(
    "/:id/display-order",
    protect,
    authorize("admin"),
    projectController.updateProjectDisplayOrder
);


//Export Router

module.exports = router;