const express = require("express");

const router = express.Router();

const projectController = require("../controllers/projectController");

const authMiddleware = require("../../shared/middleware/authMiddleware");

const validationMiddleware = require("../../shared/middleware/validationMiddleware");

const {
    createProjectSchema,
    updateProjectSchema,
    projectIdParamSchema
} = require("../validators/projectValidator");


//Student Project Routes

/*
GET /api/student/projects
*/


/*
GET /api/student/projects
*/

router.get(
    "/",
    authMiddleware,
    projectController.getProjects
);


/*
GET /api/student/projects/:projectId
*/

router.get(
    "/:projectId",
    authMiddleware,
    validationMiddleware(projectIdParamSchema, "params"),
    projectController.getProject
);


/*
POST /api/student/projects
*/

router.post(
    "/",
    authMiddleware,
    validationMiddleware(createProjectSchema),
    projectController.createProject
);


/*
PUT /api/student/projects/:projectId
*/

router.put(
    "/:projectId",
    authMiddleware,
    validationMiddleware(projectIdParamSchema, "params"),
    validationMiddleware(updateProjectSchema),
    projectController.updateProject
);


/*
DELETE /api/student/projects/:projectId
*/

router.delete(
    "/:projectId",
    authMiddleware,
    validationMiddleware(projectIdParamSchema, "params"),
    projectController.deleteProject
);


module.exports = router;