const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const env = require("../config/env");

//Password Hashing

const hashPassword = async (password) => {
    const saltRounds = 12;

    return await bcrypt.hash(password, saltRounds);
};

//Password Comparison

const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

//Generate JWT

const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user._id.toString(),
            role: user.role
        },
        env.jwtSecret,
        {
            expiresIn: env.jwtExpiresIn
        }
    );
};

//Safe User Object

//Never return the password hash to the frontend.

const getSafeUser = (user) => {
    return {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt
    };
};

//Register User

const registerUser = async ({
    firstName,
    lastName,
    email,
    password
}) => {
    // Check whether the email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        const error = new Error(
            "An account with this email already exists"
        );

        error.statusCode = 409;

        throw error;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new student account
    const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: "student"
    });

    return getSafeUser(user);
};

//Login User

const loginUser = async ({ email, password }) => {
    // Explicitly select password because User model uses select: false
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        const error = new Error("Invalid email or password");

        error.statusCode = 401;

        throw error;
    }

    // Check account status
    if (!user.isActive) {
        const error = new Error(
            "Your account has been deactivated"
        );

        error.statusCode = 403;

        throw error;
    }

    // Compare entered password with stored hash
    const passwordMatches = await comparePassword(
        password,
        user.password
    );

    if (!passwordMatches) {
        const error = new Error("Invalid email or password");

        error.statusCode = 401;

        throw error;
    }

    // Update last login time
    user.lastLoginAt = new Date();

    await user.save();

    // Generate JWT
    const token = generateToken(user);

    return {
        token,
        user: getSafeUser(user)
    };
};

//Get Current User

const getCurrentUser = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        const error = new Error("User not found");

        error.statusCode = 404;

        throw error;
    }

    if (!user.isActive) {
        const error = new Error(
            "Your account has been deactivated"
        );

        error.statusCode = 403;

        throw error;
    }

    return getSafeUser(user);
};

//Export Services

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    hashPassword,
    comparePassword,
    generateToken
};