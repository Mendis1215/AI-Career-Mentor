//Custom API Error
//Provides a consistent error object for the entire backend.

class ApiError extends Error {

    constructor(
        statusCode,
        message,
        errors = null,
        isOperational = true
    ) {

        super(message);

        //Error Name

        this.name = "ApiError";


        //HTTP Status Code

        this.statusCode =
            statusCode || 500;


        //Error Message

        this.message =
            message || "Internal server error.";


        //Additional Validation Errors

        this.errors =
            errors;


        //Operational Error
        //true  → expected application error
        //false → unexpected/programming error

        this.isOperational =
            isOperational;


        //Capture Stack Trace

        Error.captureStackTrace(
            this,
            this.constructor
        );

    }

}


//Export

module.exports = ApiError;