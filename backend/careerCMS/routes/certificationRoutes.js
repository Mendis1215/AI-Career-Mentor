const express = require("express");

const router = express.Router();

const certificationController = require("../controllers/certificationController");

const {
    protect,
    authorize
} = require("../../shared/middleware/auth");


//Public Certification Routes

/*
    GET /api/certifications
    Get all certifications
*/
router.get(
    "/",
    certificationController.getAllCertifications
);


/*
    GET /api/certifications/published
    Get published certifications
*/
router.get(
    "/published",
    certificationController.getPublishedCertifications
);


/*
    GET /api/certifications/career/:careerId
    Get certifications associated with a career
*/
router.get(
    "/career/:careerId",
    certificationController.getCertificationsByCareer
);


/*
    GET /api/certifications/skill/:skillId
    Get certifications associated with a skill
*/
router.get(
    "/skill/:skillId",
    certificationController.getCertificationsBySkill
);


/*
    GET /api/certifications/slug/:slug
    Get certification by slug
*/
router.get(
    "/slug/:slug",
    certificationController.getCertificationBySlug
);


/*
    GET /api/certifications/:id
    Get certification by ID
*/
router.get(
    "/:id",
    certificationController.getCertificationById
);


//Admin Certification Routes

/*
    POST /api/certifications
    Create certification
*/
router.post(
    "/",
    protect,
    authorize("admin"),
    certificationController.createCertification
);


/*
    PUT /api/certifications/:id
    Update certification
*/
router.put(
    "/:id",
    protect,
    authorize("admin"),
    certificationController.updateCertification
);


/*
    DELETE /api/certifications/:id
    Delete certification
*/
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    certificationController.deleteCertification
);


//Certification Publishing

/*
    PATCH /api/certifications/:id/publish
    Publish certification
*/
router.patch(
    "/:id/publish",
    protect,
    authorize("admin"),
    certificationController.publishCertification
);


/*
    PATCH /api/certifications/:id/unpublish
    Unpublish certification
*/
router.patch(
    "/:id/unpublish",
    protect,
    authorize("admin"),
    certificationController.unpublishCertification
);


//Certification Archive

/*
    PATCH /api/certifications/:id/archive
    Archive certification
*/
router.patch(
    "/:id/archive",
    protect,
    authorize("admin"),
    certificationController.archiveCertification
);


/*
    PATCH /api/certifications/:id/restore
    Restore certification
*/
router.patch(
    "/:id/restore",
    protect,
    authorize("admin"),
    certificationController.restoreCertification
);


//Certification Display Order

/*
    PATCH /api/certifications/:id/display-order
    Update certification display order
*/
router.patch(
    "/:id/display-order",
    protect,
    authorize("admin"),
    certificationController.updateCertificationDisplayOrder
);


//Export Router

module.exports = router;