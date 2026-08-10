const express = require("express");

const router = express.Router();

const certificationController = require("../controllers/certificationController");

const authMiddleware = require("../../shared/middleware/authMiddleware");

const validationMiddleware = require("../../shared/middleware/validationMiddleware");

const {
    createCertificationSchema,
    updateCertificationSchema,
    certificationIdParamSchema
} = require("../validators/certificationValidator");


//tudent Certification Routes

/*
GET /api/student/certifications
*/

router.get(
    "/",
    authMiddleware,
    certificationController.getCertifications
);


/*
GET /api/student/certifications/:certificationId
*/

router.get(
    "/:certificationId",
    authMiddleware,
    validationMiddleware(
        certificationIdParamSchema,
        "params"
    ),
    certificationController.getCertification
);


/*
POST /api/student/certifications
*/

router.post(
    "/",
    authMiddleware,
    validationMiddleware(
        createCertificationSchema
    ),
    certificationController.addCertification
);


/*
PUT /api/student/certifications/:certificationId
*/

router.put(
    "/:certificationId",
    authMiddleware,
    validationMiddleware(
        certificationIdParamSchema,
        "params"
    ),
    validationMiddleware(
        updateCertificationSchema
    ),
    certificationController.updateCertification
);


/*
DELETE /api/student/certifications/:certificationId
*/

router.delete(
    "/:certificationId",
    authMiddleware,
    validationMiddleware(
        certificationIdParamSchema,
        "params"
    ),
    certificationController.deleteCertification
);


module.exports = router;