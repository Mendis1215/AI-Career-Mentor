/*
Role Authorization Middleware

This middleware checks whether the authenticated user has one of
the roles required to access a protected resource.

Authentication must run BEFORE this middleware.
*/

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        //Make sure Authentication Middleware has run
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        //Check User Role

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to access this resource"
            });
        }

        //Role is allowed

        next();
    };
};

module.exports = authorizeRoles;