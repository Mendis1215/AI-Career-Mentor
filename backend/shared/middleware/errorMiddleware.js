const {
    NODE_ENV
} = process.env;


//Error Middleware

const errorMiddleware = (
    err,
    req,
    res,
    next
) => {

    //Default Error Values

    let statusCode =
        err.statusCode || 500;

    let message =
        err.message ||
        "Internal server error.";

    //Handle Mongoose Validation Errors

    if (
        err.name === "ValidationError"
    ) {

        statusCode = 400;

        const errors = Object.values(
            err.errors
        ).map((error) => ({
            field: error.path,
            message: error.message
        }));

        return res.status(statusCode).json({

            success: false,

            message:
                "Validation failed.",

            errors

        });

    }


    //Handle Mongoose Cast Errors
    //Usually happens when an invalid MongoDB ObjectId
    //is provided.

    if (
        err.name === "CastError"
    ) {

        statusCode = 400;

        message =
            `Invalid ${err.path || "value"}.`;

    }


    //Handle MongoDB Duplicate Key Error

    if (
        err.code === 11000
    ) {

        statusCode = 409;

        const duplicatedFields =
            Object.keys(
                err.keyPattern || {}
            );

        message =
            duplicatedFields.length > 0
                ? `${duplicatedFields.join(", ")} already exists.`
                : "A record with the same value already exists.";

    }


    //Handle JWT Errors

    if (
        err.name === "JsonWebTokenError"
    ) {

        statusCode = 401;

        message =
            "Invalid authentication token.";

    }


    //Handle Expired JWT

    if (
        err.name === "TokenExpiredError"
    ) {

        statusCode = 401;

        message =
            "Authentication token has expired.";

    }


    //Handle Syntax Errors
    //Usually caused by invalid JSON in request body.

    if (
        err instanceof SyntaxError &&
        err.status === 400 &&
        "body" in err
    ) {

        statusCode = 400;

        message =
            "Invalid JSON request body.";

    }


    //Development Error Information

    const response = {

        success: false,

        message

    };


    //Include Validation Details

    if (err.errors) {

        response.errors =
            err.errors;

    }


    //Include Stack Trace in Development

    if (
        NODE_ENV === "development"
    ) {

        response.stack =
            err.stack;

    }


    //Send Response

    return res
        .status(statusCode)
        .json(response);

};


module.exports = errorMiddleware;