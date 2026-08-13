const express = require("express");

const router = express.Router();

const skillController = require("../controllers/skillController");

const {
    protect,
    authorize
} = require("../../shared/middleware/auth");


//Public Skill Routes

/*
    GET /api/skills
    Get all skills
*/
router.get(
    "/",
    skillController.getAllSkills
);


/*
    GET /api/skills/category/:category
    Get skills by category
*/
router.get(
    "/category/:category",
    skillController.getSkillsByCategory
);


/*
    GET /api/skills/level/:level
    Get skills by level
*/
router.get(
    "/level/:level",
    skillController.getSkillsByLevel
);


/*
    GET /api/skills/slug/:slug
    Get skill by slug
*/
router.get(
    "/slug/:slug",
    skillController.getSkillBySlug
);


/*
    GET /api/skills/:id
    Get skill by ID
*/
router.get(
    "/:id",
    skillController.getSkillById
);


//Admin Skill Routes

/*
    POST /api/skills
    Create skill
*/
router.post(
    "/",
    protect,
    authorize("admin"),
    skillController.createSkill
);


/*
    PUT /api/skills/:id
    Update skill
*/
router.put(
    "/:id",
    protect,
    authorize("admin"),
    skillController.updateSkill
);


/*
    DELETE /api/skills/:id
    Delete skill
*/
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    skillController.deleteSkill
);


//Skill Publishing

/*
    PATCH /api/skills/:id/publish
    Publish skill
*/
router.patch(
    "/:id/publish",
    protect,
    authorize("admin"),
    skillController.publishSkill
);


/*
    PATCH /api/skills/:id/unpublish
    Unpublish skill
*/
router.patch(
    "/:id/unpublish",
    protect,
    authorize("admin"),
    skillController.unpublishSkill
);


//Skill Archive

/*
    PATCH /api/skills/:id/archive
    Archive skill
*/
router.patch(
    "/:id/archive",
    protect,
    authorize("admin"),
    skillController.archiveSkill
);


/*
    PATCH /api/skills/:id/restore
    Restore skill
*/
router.patch(
    "/:id/restore",
    protect,
    authorize("admin"),
    skillController.restoreSkill
);


//Skill Display Order

/*
    PATCH /api/skills/:id/display-order
    Update skill display order
*/
router.patch(
    "/:id/display-order",
    protect,
    authorize("admin"),
    skillController.updateSkillDisplayOrder
);


//Published Skills

/*
    GET /api/skills/published
    Get published skills
*/
router.get(
    "/published",
    skillController.getPublishedSkills
);


//Export Router

module.exports = router;