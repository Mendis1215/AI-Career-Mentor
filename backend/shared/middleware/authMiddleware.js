const jwt = require("jsonwebtoken");

const env = require("../config/env");
const User = require("../models/User");

/*
Authentication Middleware

Verifies the JWT sent by the client and attaches the authenticated
user's information to req.user.
*/

const authenticate = async (req, res, next) => {
    try {
        //Get Authorization Header

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        //Check Bearer Token Format

        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format"
            });
        }

        //Extract Token

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token is missing"
            });
        }

        //Verify JWT

        const decoded = jwt.verify(token, env.jwtSecret);

        //Check User

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User account no longer exists"
            });
        }

        //Check Account Status

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated"
            });
        }

        //Attach User Information

        req.user = {
            userId: user._id.toString(),
            role: user.role
        };

        //Continue Request

        next();
    } catch (error) {
        //JWT Errors

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Authentication token has expired"
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token"
            });
        }

        //Unexpected Errors

        next(error);
    }
};

module.exports = authenticate;