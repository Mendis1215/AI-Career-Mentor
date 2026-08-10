const express = require("express");

const router = express.Router();

const careerController = require("../controllers/careerController");

const authMiddleware = require("../../shared/middleware/authMiddleware");


//Student Career Routes

/*
GET /api/student/careers
Get available careers
*/

router.get(
    "/",
    authMiddleware,
    careerController.getCareers
);


/*
GET /api/student/careers/:careerId
Get career details
*/

router.get(
    "/:careerId",
    authMiddleware,
    careerController.getCareer
);


/*
GET /api/student/careers/recommendations
Get recommended careers for logged-in student
*/

router.get(
    "/recommendations",
    authMiddleware,
    careerController.getRecommendations
);


/*
GET /api/student/careers/skill-gap
Get student's skill gap
*/

router.get(
    "/skill-gap",
    authMiddleware,
    careerController.getSkillGap
);


module.exports = router;