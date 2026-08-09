const authService = require("../services/authService");

//Register

const register = async (req, res, next) => {
    try {
        const user = await authService.registerUser(req.body);

        res.status(201).json({
            success: true,
            message: "Account created successfully",
            data: {
                user
            }
        });
    } catch (error) {
        next(error);
    }
};

//Login

const login = async (req, res, next) => {
    try {
        const result = await authService.loginUser(req.body);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token: result.token,
                user: result.user
            }
        });
    } catch (error) {
        next(error);
    }
};

//Get Current User

const getCurrentUser = async (req, res, next) => {
    try {
        const user = await authService.getCurrentUser(req.user.userId);

        res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            data: {
                user
            }
        });
    } catch (error) {
        next(error);
    }
};

//Logout

const logout = async (req, res, next) => {
    try {
        //JWT authentication is currently stateless.
        //The frontend should remove the stored token after
        //receiving this response.
        //Later, if we implement refresh-token/session
        //management, logout can invalidate the refresh token.

        res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getCurrentUser,
    logout
};