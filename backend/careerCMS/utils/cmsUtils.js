//Career CMS Utility Functions


/*
| Generate URL Slug

|
| Converts a title into a URL-friendly slug.
|
| Example:
| "Data Science Roadmap"
|      ↓
| "data-science-roadmap"
|
*/

const generateSlug = (text) => {

    if (!text || typeof text !== "string") {
        return "";
    }

    return text
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
};


/*
| Generate Unique Slug

|
| Adds a numeric suffix when a slug already exists.
|
| Example:
| data-science
| data-science-1
| data-science-2
|
*/

const generateUniqueSlug = async (
    Model,
    text,
    excludeId = null
) => {

    const baseSlug = generateSlug(text);

    if (!baseSlug) {
        return "";
    }

    let slug = baseSlug;
    let counter = 1;

    while (true) {

        const query = {
            slug
        };

        if (excludeId) {
            query._id = {
                $ne: excludeId
            };
        }

        const existingDocument = await Model.findOne(query);

        if (!existingDocument) {
            return slug;
        }

        slug = `${baseSlug}-${counter}`;
        counter++;
    }
};


//Normalize Text

//Removes unnecessary spaces from text.

const normalizeText = (text) => {

    if (!text || typeof text !== "string") {
        return "";
    }

    return text
        .trim()
        .replace(/\s+/g, " ");
};


//Normalize Array

//Removes empty values and duplicate values.

const normalizeArray = (array) => {

    if (!Array.isArray(array)) {
        return [];
    }

    return [
        ...new Set(
            array
                .filter(
                    (item) =>
                        item !== null &&
                        item !== undefined &&
                        item !== ""
                )
                .map((item) =>
                    typeof item === "string"
                        ? item.trim()
                        : item
                )
        )
    ];
};


//Convert To Boolean

//Safely converts common values to boolean.

const toBoolean = (value, defaultValue = false) => {

    if (value === undefined || value === null) {
        return defaultValue;
    }

    if (typeof value === "boolean") {
        return value;
    }

    if (typeof value === "string") {

        const normalizedValue = value
            .trim()
            .toLowerCase();

        if (normalizedValue === "true") {
            return true;
        }

        if (normalizedValue === "false") {
            return false;
        }
    }

    return defaultValue;
};


//Convert To Positive Integer

const toPositiveInteger = (
    value,
    defaultValue = 0
) => {

    const number = Number(value);

    if (!Number.isInteger(number) || number < 0) {
        return defaultValue;
    }

    return number;
};


//Calculate Pagination

//Calculates skip and limit values for MongoDB queries.

const calculatePagination = (
    page = 1,
    limit = 10
) => {

    const currentPage =
        toPositiveInteger(page, 1) || 1;

    const pageLimit =
        toPositiveInteger(limit, 10) || 10;

    return {
        page: currentPage,
        limit: pageLimit,
        skip: (currentPage - 1) * pageLimit
    };
};


//Build Pagination Response

//Calculates skip and limit values for MongoDB queries.

const buildPaginationResponse = (
    page,
    limit,
    total
) => {

    const totalPages =
        Math.ceil(total / limit);

    return {
        currentPage: page,
        pageSize: limit,
        totalItems: total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
    };
};


//Build Search Query

//Creates a MongoDB case-insensitive search query.


const buildSearchQuery = (
    search,
    fields = []
) => {

    if (
        !search ||
        !Array.isArray(fields) ||
        fields.length === 0
    ) {
        return {};
    }

    const normalizedSearch =
        normalizeText(search);

    if (!normalizedSearch) {
        return {};
    }

    return {
        $or: fields.map((field) => ({
            [field]: {
                $regex: normalizedSearch,
                $options: "i"
            }
        }))
    };
};


//Build Sort Query

const buildSortQuery = (
    sortBy = "createdAt",
    sortOrder = "desc",
    allowedFields = []
) => {

    if (
        !Array.isArray(allowedFields) ||
        allowedFields.length === 0
    ) {
        return {
            createdAt: -1
        };
    }

    const field = allowedFields.includes(sortBy)
        ? sortBy
        : "createdAt";

    const order =
        sortOrder === "asc" ? 1 : -1;

    return {
        [field]: order
    };
};


//Remove Undefined Values

//Removes undefined properties from an object.

const removeUndefinedValues = (object) => {

    if (!object || typeof object !== "object") {
        return {};
    }

    return Object.fromEntries(
        Object.entries(object).filter(
            ([, value]) => value !== undefined
        )
    );
};


//Check MongoDB Object ID

const isValidObjectId = (id) => {

    if (!id) {
        return false;
    }

    return /^[0-9a-fA-F]{24}$/.test(id);
};


//Create Update Object

//Removes undefined values before updating a document.

const createUpdateObject = (data) => {

    if (!data || typeof data !== "object") {
        return {};
    }

    return removeUndefinedValues({
        ...data
    });
};


//Export Utilities

module.exports = {

    generateSlug,
    generateUniqueSlug,

    normalizeText,
    normalizeArray,

    toBoolean,
    toPositiveInteger,

    calculatePagination,
    buildPaginationResponse,

    buildSearchQuery,
    buildSortQuery,

    removeUndefinedValues,
    isValidObjectId,

    createUpdateObject

};