const jwt = require("jsonwebtoken");
const env = require("./env");


//JWT Configuration

const JWT_CONFIG = {
    accessTokenSecret: env.JWT_SECRET,
    accessTokenExpiresIn: env.JWT_EXPIRES_IN || "1d",

    refreshTokenSecret:
        env.JWT_REFRESH_SECRET || env.JWT_SECRET,

    refreshTokenExpiresIn:
        env.JWT_REFRESH_EXPIRES_IN || "7d"
};


//Validate JWT Configuration

const validateJWTConfig = () => {

    if (!JWT_CONFIG.accessTokenSecret) {
        throw new Error(
            "JWT_SECRET is not configured."
        );
    }

    if (!JWT_CONFIG.refreshTokenSecret) {
        throw new Error(
            "JWT_REFRESH_SECRET is not configured."
        );
    }
};


//Generate Access Token

const generateAccessToken = (payload) => {

    validateJWTConfig();

    return jwt.sign(
        payload,
        JWT_CONFIG.accessTokenSecret,
        {
            expiresIn:
                JWT_CONFIG.accessTokenExpiresIn
        }
    );
};


//Generate Refresh Token

const generateRefreshToken = (payload) => {

    validateJWTConfig();

    return jwt.sign(
        payload,
        JWT_CONFIG.refreshTokenSecret,
        {
            expiresIn:
                JWT_CONFIG.refreshTokenExpiresIn
        }
    );
};


//Generate Token Pair

const generateTokenPair = (payload) => {

    return {
        accessToken:
            generateAccessToken(payload),

        refreshToken:
            generateRefreshToken(payload)
    };
};


//Verify Access Token

const verifyAccessToken = (token) => {

    validateJWTConfig();

    return jwt.verify(
        token,
        JWT_CONFIG.accessTokenSecret
    );
};


//Verify Refresh Token

const verifyRefreshToken = (token) => {

    validateJWTConfig();

    return jwt.verify(
        token,
        JWT_CONFIG.refreshTokenSecret
    );
};


//Decode Token

//Decodes the token without verifying its signature.
//Use this only when you need to inspect token contents.

const decodeToken = (token) => {

    if (!token) {
        return null;
    }

    return jwt.decode(token);
};


//Get Token From Authorization Header

//Expected:
//Authorization: Bearer <token>

const extractTokenFromHeader = (
    authorizationHeader
) => {

    if (!authorizationHeader) {
        return null;
    }

    const parts =
        authorizationHeader.split(" ");

    if (
        parts.length !== 2 ||
        parts[0].toLowerCase() !== "bearer"
    ) {
        return null;
    }

    return parts[1];
};


//Export

module.exports = {

    JWT_CONFIG,

    generateAccessToken,
    generateRefreshToken,
    generateTokenPair,

    verifyAccessToken,
    verifyRefreshToken,

    decodeToken,

    extractTokenFromHeader

};