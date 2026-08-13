const express = require("express");

const router = express.Router();

const dashboardController = require("../controllers/dashboardController");

const {
    protect,
    authorize
} = require("../../shared/middleware/auth");


//Dashboard Routes

//All dashboard endpoints are restricted to administrators.



//Dashboard Overview


/*
    GET /api/career-cms/dashboard

    Get complete Career CMS dashboard overview.
*/
router.get(
    "/",
    protect,
    authorize("admin"),
    dashboardController.getDashboardOverview
);


//Dashboard Statistics

/*
    GET /api/career-cms/dashboard/statistics

    Get overall CMS statistics.
*/
router.get(
    "/statistics",
    protect,
    authorize("admin"),
    dashboardController.getDashboardStatistics
);


//Career Statistics

/*
    GET /api/career-cms/dashboard/careers

    Get career-related statistics.
*/
router.get(
    "/careers",
    protect,
    authorize("admin"),
    dashboardController.getCareerStatistics
);


//Skill Statistics

/*
    GET /api/career-cms/dashboard/skills

    Get skill-related statistics.
*/
router.get(
    "/skills",
    protect,
    authorize("admin"),
    dashboardController.getSkillStatistics
);


//Roadmap Statistics

/*
    GET /api/career-cms/dashboard/roadmaps

    Get roadmap-related statistics.
*/
router.get(
    "/roadmaps",
    protect,
    authorize("admin"),
    dashboardController.getRoadmapStatistics
);


//Project Statistics

/*
    GET /api/career-cms/dashboard/projects

    Get project-related statistics.
*/
router.get(
    "/projects",
    protect,
    authorize("admin"),
    dashboardController.getProjectStatistics
);


//Certification Statistics

/*
    GET /api/career-cms/dashboard/certifications

    Get certification-related statistics.
*/
router.get(
    "/certifications",
    protect,
    authorize("admin"),
    dashboardController.getCertificationStatistics
);


//Learning Resource Statistics

/*
    GET /api/career-cms/dashboard/resources

    Get learning-resource statistics.
*/
router.get(
    "/resources",
    protect,
    authorize("admin"),
    dashboardController.getResourceStatistics
);


//Knowledge Base Statistics

/*
    GET /api/career-cms/dashboard/knowledge

    Get knowledge-base and RAG document statistics.
*/
router.get(
    "/knowledge",
    protect,
    authorize("admin"),
    dashboardController.getKnowledgeStatistics
);


//Recent Activity

/*
    GET /api/career-cms/dashboard/recent-activity

    Get recent CMS activity.
*/
router.get(
    "/recent-activity",
    protect,
    authorize("admin"),
    dashboardController.getRecentActivity
);


//Export Router

module.exports = router;