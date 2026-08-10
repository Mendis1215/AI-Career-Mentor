const express = require("express");

const router = express.Router();

const profileController = require("../controllers/profileController");

const authMiddleware = require("../../shared/middleware/authMiddleware");
const validationMiddleware = require("../../shared/middleware/validationMiddleware");

const {
    createProfileSchema,
    updateProfileSchema
} = require("../validators/profileValidator");


//Student Profile Routes


/*
GET /api/student/profile
Get logged-in student's profile
*/

router.get(
    "/",
    authMiddleware,
    profileController.getProfile
);


/*
POST /api/student/profile
Create student profile
*/

router.post(
    "/",
    authMiddleware,
    validationMiddleware(createProfileSchema),
    profileController.createProfile
);


/*
PUT /api/student/profile
Update student profile
*/

router.put(
    "/",
    authMiddleware,
    validationMiddleware(updateProfileSchema),
    profileController.updateProfile
);


/*
DELETE /api/student/profile
Delete/deactivate student profile
*/

router.delete(
    "/",
    authMiddleware,
    profileController.deleteProfile
);


module.exports = router;