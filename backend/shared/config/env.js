const dotenv = require("dotenv");

// Load environment variables from .env
dotenv.config();

// Required environment variables
const requiredVariables = [
    "MONGODB_URI",
    "JWT_SECRET"
];

// Check whether required variables exist
for (const variable of requiredVariables) {
    if (!process.env[variable]) {
        throw new Error(
            `Missing required environment variable: ${variable}`
        );
    }
}

const env = {
    nodeEnv: process.env.NODE_ENV || "development",

    port: Number(process.env.PORT) || 5000,

    mongodbUri: process.env.MONGODB_URI,

    jwtSecret: process.env.JWT_SECRET,

    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

    clientUrl: process.env.CLIENT_URL || "http://localhost:5173"
};

module.exports = env;