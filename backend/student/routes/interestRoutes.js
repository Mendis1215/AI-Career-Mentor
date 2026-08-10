const express = require("express");

const router = express.Router();

const interestController = require("../controllers/interestController");

const authMiddleware = require("../../shared/middleware/authMiddleware");
const validationMiddleware = require("../../shared/middleware/validationMiddleware");

const {
    createInterestSchema,
    updateInterestSchema,
    interestIdParamSchema
} = require("../validators/interestValidator");


//Student Interest Routes

/*
GET /api/student/interests
*/


/*
GET /api/student/interests
*/

router.get(
    "/",
    authMiddleware,
    interestController.getInterests
);


/*
GET /api/student/interests/:interestId
*/

router.get(
    "/:interestId",
    authMiddleware,
    validationMiddleware(interestIdParamSchema, "params"),
    interestController.getInterest
);


/*
POST /api/student/interests
*/

router.post(
    "/",
    authMiddleware,
    validationMiddleware(createInterestSchema),
    interestController.addInterest
);


/*
PUT /api/student/interests/:interestId
*/

router.put(
    "/:interestId",
    authMiddleware,
    validationMiddleware(interestIdParamSchema, "params"),
    validationMiddleware(updateInterestSchema),
    interestController.updateInterest
);


/*
DELETE /api/student/interests/:interestId
*/

router.delete(
    "/:interestId",
    authMiddleware,
    validationMiddleware(interestIdParamSchema, "params"),
    interestController.deleteInterest
);


module.exports = router;