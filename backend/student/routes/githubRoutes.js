const express = require("express");

const router = express.Router();

const githubController = require("../controllers/githubController");

const authMiddleware = require("../../shared/middleware/authMiddleware");

const validationMiddleware = require("../../shared/middleware/validationMiddleware");

const {
    connectGithubSchema,
    updateGithubSchema,
    githubAnalysisSchema,
    githubUsernameParamSchema
} = require("../validators/githubValidator");


//Student GitHub Routes

/*
GET /api/student/github
*/


/*
GET /api/student/github
Get connected GitHub profile
*/

router.get(
    "/",
    authMiddleware,
    githubController.getGithubProfile
);


/*
POST /api/student/github/connect
*/

router.post(
    "/connect",
    authMiddleware,
    validationMiddleware(connectGithubSchema),
    githubController.connectGithub
);


/*
PUT /api/student/github
*/

router.put(
    "/",
    authMiddleware,
    validationMiddleware(updateGithubSchema),
    githubController.updateGithub
);


/*
POST /api/student/github/analyze
*/

router.post(
    "/analyze",
    authMiddleware,
    validationMiddleware(githubAnalysisSchema),
    githubController.analyzeGithub
);


/*
GET /api/student/github/:username
*/

router.get(
    "/:username",
    authMiddleware,
    validationMiddleware(
        githubUsernameParamSchema,
        "params"
    ),
    githubController.getGithubByUsername
);


/*
DELETE /api/student/github
*/

router.delete(
    "/",
    authMiddleware,
    githubController.disconnectGithub
);


module.exports = router;