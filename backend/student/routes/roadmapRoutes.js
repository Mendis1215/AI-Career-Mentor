const express = require("express");

const router = express.Router();

const roadmapController = require("../controllers/roadmapController");

const authMiddleware = require("../../shared/middleware/authMiddleware");


//Student Roadmap Routes


/*
GET /api/student/roadmap
Get student's current roadmap
*/

router.get(
    "/",
    authMiddleware,
    roadmapController.getRoadmap
);


/*
GET /api/student/roadmap/progress
*/

router.get(
    "/progress",
    authMiddleware,
    roadmapController.getProgress
);


/*
PUT /api/student/roadmap/progress
*/

router.put(
    "/progress",
    authMiddleware,
    roadmapController.updateProgress
);


/*
POST /api/student/roadmap/generate
Generate/update personalized roadmap
*/

router.post(
    "/generate",
    authMiddleware,
    roadmapController.generateRoadmap
);


module.exports = router;