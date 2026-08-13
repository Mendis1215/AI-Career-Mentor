const express = require("express");

const router = express.Router();

const careerSkillController = require("../controllers/careerSkillController");

const {
    protect,
    authorize
} = require("../../shared/middleware/auth");


//Public Career-Skill Routes

/*
    GET /api/career-skills
    Get all career-skill relationships
*/
router.get(
    "/",
    careerSkillController.getAllCareerSkills
);


/*
    GET /api/career-skills/career/:careerId
    Get skills belonging to a career
*/
router.get(
    "/career/:careerId",
    careerSkillController.getSkillsForCareer
);


/*
    GET /api/career-skills/skill/:skillId
    Get careers associated with a skill
*/
router.get(
    "/skill/:skillId",
    careerSkillController.getCareersForSkill
);


/*
    GET /api/career-skills/:id
    Get career-skill relationship by ID
*/
router.get(
    "/:id",
    careerSkillController.getCareerSkillById
);


//Admin Career-Skill Routes

/*
    POST /api/career-skills
    Create career-skill relationship
*/
router.post(
    "/",
    protect,
    authorize("admin"),
    careerSkillController.createCareerSkill
);


/*
    PUT /api/career-skills/:id
    Update career-skill relationship
*/
router.put(
    "/:id",
    protect,
    authorize("admin"),
    careerSkillController.updateCareerSkill
);


/*
    DELETE /api/career-skills/:id
    Delete career-skill relationship
*/
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    careerSkillController.deleteCareerSkill
);


//Display Order

/*
    PATCH /api/career-skills/:id/display-order
    Update relationship display order
*/
router.patch(
    "/:id/display-order",
    protect,
    authorize("admin"),
    careerSkillController.updateCareerSkillOrder
);


//Export Router

module.exports = router;