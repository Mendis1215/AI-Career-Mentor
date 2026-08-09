const express = require("express");

const authController = require("../controllers/authController");
const {
    registerValidator,
    loginValidator
} = require("../validators/authValidator");

const validateRequest = require("../middleware/validationMiddleware");

const router = express.Router();

//Authentication Routes


/*
 * @route   POST /api/auth/register
 * @desc    Register a new student account
 * @access  Public
 */
router.post(
    "/register",
    validateRequest(registerValidator),
    authController.register
);

/*
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
    "/login",
    validateRequest(loginValidator),
    authController.login
);

/*
 * @route   GET /api/auth/me
 * @desc    Get currently authenticated user
 * @access  Private
 *
 * Authentication middleware will be added in 2.6.
 */
router.get(
    "/me",
    authenticate,
    authController.getCurrentUser
);

/*
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 *
 * Authentication middleware will be added in 2.6.
 */
router.post(
    "/logout",
    authenticate,
    authController.logout
);

module.exports = router;