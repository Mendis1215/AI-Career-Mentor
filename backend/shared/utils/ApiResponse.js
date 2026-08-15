//Standard API Response
//Provides a consistent response format for successful API requests.

class ApiResponse {

    constructor(
        statusCode = 200,
        data = null,
        message = "Request successful."
    ) {

        //HTTP Status Code

        this.statusCode = statusCode;


        //Success
        

        this.success =
            statusCode >= 200 &&
            statusCode < 300;


        //Message

        this.message = message;


        //Response Data

        this.data = data;

    }

}


/*
 Send Success Response

 Usage:

 return ApiResponse.send(
     res,
     200,
     career,
     "Career retrieved successfully."
 );
*/

ApiResponse.send = (
    res,
    statusCode = 200,
    data = null,
    message = "Request successful."
) => {

    const response =
        new ApiResponse(
            statusCode,
            data,
            message
        );

    return res
        .status(statusCode)
        .json({
            success: response.success,
            message: response.message,
            data: response.data
        });

};


//Success Response

ApiResponse.success = (
    res,
    data = null,
    message = "Request successful.",
    statusCode = 200
) => {

    return ApiResponse.send(
        res,
        statusCode,
        data,
        message
    );

};


//Created Response
//Used after successfully creating a resource.

ApiResponse.created = (
    res,
    data = null,
    message = "Resource created successfully."
) => {

    return ApiResponse.send(
        res,
        201,
        data,
        message
    );

};


//No Content Response
//Used when the operation succeeds but there is no response data.

ApiResponse.noContent = (
    res
) => {

    return res
        .status(204)
        .send();

};


//Export

module.exports = ApiResponse;