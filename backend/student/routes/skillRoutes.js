const express = require("express");

const router = express.Router();

const skillController = require("../controllers/skillController");

const authMiddleware = require("../../shared/middleware/authMiddleware");
const validationMiddleware = require("../../shared/middleware/validationMiddleware");

const {
    createSkillSchema,
    updateSkillSchema,
    skillIdParamSchema
} = require("../validators/skillValidator");


//Student Skill Routes

/*
GET /api/student/skills
*/


/*
GET /api/student/skills
*/

router.get(
    "/",
    authMiddleware,
    skillController.getSkills
);


/*
GET /api/student/skills/:skillId
*/

router.get(
    "/:skillId",
    authMiddleware,
    validationMiddleware(skillIdParamSchema, "params"),
    skillController.getSkill
);


/*
POST /api/student/skills
*/

router.post(
    "/",
    authMiddleware,
    validationMiddleware(createSkillSchema),
    skillController.addSkill
);


/*
PUT /api/student/skills/:skillId
*/

router.put(
    "/:skillId",
    authMiddleware,
    validationMiddleware(skillIdParamSchema, "params"),
    validationMiddleware(updateSkillSchema),
    skillController.updateSkill
);


/*
DELETE /api/student/skills/:skillId
*/

router.delete(
    "/:skillId",
    authMiddleware,
    validationMiddleware(skillIdParamSchema, "params"),
    skillController.deleteSkill
);


module.exports = router;