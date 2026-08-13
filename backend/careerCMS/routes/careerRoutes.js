const express = require("express");

const router = express.Router();

const careerController = require("../controllers/careerController");

const {
    protect,
    authorize
} = require("../../shared/middleware/auth");


//Public Career Routes

/*
    GET /api/careers
    Get published careers
*/
router.get(
    "/",
    careerController.getAllCareers
);


/*
    GET /api/careers/slug/:slug
    Get career by slug
*/
router.get(
    "/slug/:slug",
    careerController.getCareerBySlug
);


/*
    GET /api/careers/:id
    Get career by ID
*/
router.get(
    "/:id",
    careerController.getCareerById
);


//Admin Career Routes

/*
    POST /api/careers
    Create a new career
*/
router.post(
    "/",
    protect,
    authorize("admin"),
    careerController.createCareer
);


/*
    PUT /api/careers/:id
    Update career
*/
router.put(
    "/:id",
    protect,
    authorize("admin"),
    careerController.updateCareer
);


/*
    DELETE /api/careers/:id
    Delete career
*/
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    careerController.deleteCareer
);


//Career Publishing

/*
    PATCH /api/careers/:id/publish
    Publish career
*/
router.patch(
    "/:id/publish",
    protect,
    authorize("admin"),
    careerController.publishCareer
);


/*
    PATCH /api/careers/:id/unpublish
    Unpublish career
*/
router.patch(
    "/:id/unpublish",
    protect,
    authorize("admin"),
    careerController.unpublishCareer
);


//Career Archive

/*
    PATCH /api/careers/:id/archive
    Archive career
*/
router.patch(
    "/:id/archive",
    protect,
    authorize("admin"),
    careerController.archiveCareer
);


/*
    PATCH /api/careers/:id/restore
    Restore career
*/
router.patch(
    "/:id/restore",
    protect,
    authorize("admin"),
    careerController.restoreCareer
);


//Career Display Order

/*
    PATCH /api/careers/:id/display-order
    Update career display order
*/
router.patch(
    "/:id/display-order",
    protect,
    authorize("admin"),
    careerController.updateCareerDisplayOrder
);


//Export Router

module.exports = router;