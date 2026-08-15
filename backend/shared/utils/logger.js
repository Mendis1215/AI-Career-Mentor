const winston = require("winston");
const path = require("path");
const fs = require("fs");


//Environment

const NODE_ENV =
    process.env.NODE_ENV || "development";


//Log Directory

const logDirectory = path.join(
    __dirname,
    "../../logs"
);


//Create Log Directory

if (!fs.existsSync(logDirectory)) {

    fs.mkdirSync(logDirectory, {
        recursive: true
    });

}


//Log Format

const logFormat =
    winston.format.combine(

        winston.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss"
        }),

        winston.format.errors({
            stack: true
        }),

        winston.format.json()

    );


//Development Console Format

const consoleFormat =
    winston.format.combine(

        winston.format.colorize(),

        winston.format.timestamp({
            format: "HH:mm:ss"
        }),

        winston.format.printf(
            ({
                timestamp,
                level,
                message,
                stack
            }) => {

                return (
                    `${timestamp} ` +
                    `${level}: ` +
                    `${stack || message}`
                );

            }
        )

    );


//Logger

const logger = winston.createLogger({

    level:
        NODE_ENV === "production"
            ? "info"
            : "debug",

    format:
        logFormat,

    transports: [

        //Error Log

        new winston.transports.File({

            filename:
                path.join(
                    logDirectory,
                    "error.log"
                ),

            level: "error"

        }),

        //Combined Log

        new winston.transports.File({

            filename:
                path.join(
                    logDirectory,
                    "combined.log"
                )

        })

    ]

});


//Console Logging
//Console logs are especially useful during development.

if (
    NODE_ENV !== "production"
) {

    logger.add(
        new winston.transports.Console({

            format:
                consoleFormat

        })
    );

}


//Log Information

const info = (
    message,
    metadata = {}
) => {

    logger.info(
        message,
        metadata
    );

};


//Log Warning

const warn = (
    message,
    metadata = {}
) => {

    logger.warn(
        message,
        metadata
    );

};


//Log Error

const error = (
    message,
    metadata = {}
) => {

    logger.error(
        message,
        metadata
    );

};


//Log Debug Information

const debug = (
    message,
    metadata = {}
) => {

    logger.debug(
        message,
        metadata
    );

};


//Log HTTP Request

const http = (
    message,
    metadata = {}
) => {

    logger.http(
        message,
        metadata
    );

};


//Create Child Logger
//Useful when you want to identify which module generated a log.

const createChildLogger = (
    moduleName
) => {

    return logger.child({
        module: moduleName
    });

};


//Export

module.exports = {

    logger,

    info,
    warn,
    error,
    debug,
    http,

    createChildLogger

};