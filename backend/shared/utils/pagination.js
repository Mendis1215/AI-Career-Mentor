//Pagination Utilities


//Default Pagination Settings

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;


//Get Pagination Parameters
//Converts page and limit values into safe integers.

const getPaginationParams = (
    page,
    limit
) => {

    let currentPage =
        parseInt(page, 10);

    let pageLimit =
        parseInt(limit, 10);


    //Validate Page

    if (
        isNaN(currentPage) ||
        currentPage < 1
    ) {

        currentPage =
            DEFAULT_PAGE;

    }


    //Validate Limit

    if (
        isNaN(pageLimit) ||
        pageLimit < 1
    ) {

        pageLimit =
            DEFAULT_LIMIT;

    }


    //Prevent Excessive Requests

    if (
        pageLimit > MAX_LIMIT
    ) {

        pageLimit =
            MAX_LIMIT;

    }


    //Calculate Skip

    const skip =
        (currentPage - 1) *
        pageLimit;


    return {

        page: currentPage,

        limit: pageLimit,

        skip

    };

};


//Calculate Total Pages

const calculateTotalPages = (
    totalItems,
    limit
) => {

    if (
        !totalItems ||
        !limit ||
        limit <= 0
    ) {

        return 0;

    }

    return Math.ceil(
        totalItems / limit
    );

};


//Create Pagination Metadata

const createPaginationMetadata = ({
    page,
    limit,
    totalItems
}) => {

    const totalPages =
        calculateTotalPages(
            totalItems,
            limit
        );


    return {

        currentPage:
            page,

        pageSize:
            limit,

        totalItems,

        totalPages,

        hasNextPage:
            page < totalPages,

        hasPreviousPage:
            page > 1

    };

};


//Create Pagination Result
//Combines query results with pagination metadata.

const createPaginationResult = ({
    data,
    page,
    limit,
    totalItems
}) => {

    return {

        data,

        pagination:
            createPaginationMetadata({
                page,
                limit,
                totalItems
            })

    };

};


//Apply Pagination To Mongoose Query
//Usage:
/*
 const query = Career.find(filter);

 applyPagination(
     query,
     page,
     limit
 );
*/

const applyPagination = (
    query,
    page,
    limit
) => {

    const pagination =
        getPaginationParams(
            page,
            limit
        );


    return query
        .skip(pagination.skip)
        .limit(pagination.limit);

};


//Get Pagination From Request
//Extracts pagination values directly from req.query.

const getPaginationFromRequest = (
    req
) => {

    if (!req || !req.query) {

        return getPaginationParams(
            DEFAULT_PAGE,
            DEFAULT_LIMIT
        );

    }


    return getPaginationParams(
        req.query.page,
        req.query.limit
    );

};


//Build Pagination Links
//Creates next/previous API links when applicable.

const buildPaginationLinks = ({
    page,
    limit,
    totalPages,
    baseUrl
}) => {

    const links = {

        self: null,

        next: null,

        previous: null

    };


    //Current Page

    links.self =
        `${baseUrl}?page=${page}&limit=${limit}`;


    //Next Page

    if (
        page < totalPages
    ) {

        links.next =
            `${baseUrl}?page=${page + 1}&limit=${limit}`;

    }


    //Previous Page

    if (
        page > 1
    ) {

        links.previous =
            `${baseUrl}?page=${page - 1}&limit=${limit}`;

    }


    return links;

};


//Constants

const PAGINATION_CONFIG = {

    DEFAULT_PAGE,

    DEFAULT_LIMIT,

    MAX_LIMIT

};


//Export

module.exports = {

    PAGINATION_CONFIG,

    getPaginationParams,

    calculateTotalPages,

    createPaginationMetadata,

    createPaginationResult,

    applyPagination,

    getPaginationFromRequest,

    buildPaginationLinks

};