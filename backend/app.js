const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const env = require("./shared/config/env");

const app = express();

/*
Security Middleware
*/

app.use(helmet());

/*
CORS Configuration
*/

app.use(
    cors({
        origin: env.clientUrl,
        credentials: true
    })
);

/*
Body Parsing Middleware
*/

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/*
HTTP Request Logging
*/

if (env.nodeEnv === "development") {
    app.use(morgan("dev"));
}

/*
Health Check
*/

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "AI Career Mentor API is running",
        environment: env.nodeEnv
    });
});

/*
Root Route
*/

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to AI Career Mentor API"
    });
});

/*
404 Handler
*/

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});

/*
Global Error Handler
*/

app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

module.exports = app;