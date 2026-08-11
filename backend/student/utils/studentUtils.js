const mongoose = require("mongoose");

//Check MongoDB ObjectId

const isValidObjectId = (id) => {

    return mongoose.Types.ObjectId.isValid(id);

};


//Convert Value To ObjectId

const toObjectId = (id) => {

    if (!isValidObjectId(id)) {

        throw new Error(
            "Invalid MongoDB ObjectId."
        );

    }

    return new mongoose.Types.ObjectId(id);

};


//Normalize String

const normalizeString = (value) => {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .trim()
        .replace(/\s+/g, " ");

};


//Normalize Lowercase String

const normalizeLowercaseString = (value) => {

    return normalizeString(value)
        .toLowerCase();

};


//Remove Duplicate Values

const removeDuplicates = (values = []) => {

    if (!Array.isArray(values)) {

        return [];

    }


    return [
        ...new Set(
            values
                .map((value) =>
                    normalizeString(value)
                )
                .filter(Boolean)
        )
    ];

};


//Calculate Percentage

const calculatePercentage = (
    completed,
    total
) => {

    const completedValue =
        Number(completed) || 0;

    const totalValue =
        Number(total) || 0;


    if (totalValue <= 0) {

        return 0;

    }


    const percentage =
        (completedValue / totalValue) * 100;


    return Math.min(

        100,

        Math.max(

            0,

            Number(
                percentage.toFixed(2)
            )

        )

    );

};


//Calculate Completion Percentage

const calculateCompletionPercentage = (
    items = []
) => {

    if (!Array.isArray(items) || items.length === 0) {

        return 0;

    }


    const completedItems =
        items.filter(

            (item) =>
                item.completed === true ||
                item.status === "completed"

        );


    return calculatePercentage(

        completedItems.length,

        items.length

    );

};


//Clamp Number

const clampNumber = (
    value,
    min,
    max
) => {

    const number =
        Number(value);


    if (Number.isNaN(number)) {

        return min;

    }


    return Math.min(

        max,

        Math.max(

            min,

            number

        )

    );

};


//Calculate Average

const calculateAverage = (
    values = []
) => {

    if (!Array.isArray(values) || values.length === 0) {

        return 0;

    }


    const numbers =
        values

            .map((value) =>
                Number(value)
            )

            .filter((value) =>
                Number.isFinite(value)
            );


    if (numbers.length === 0) {

        return 0;

    }


    const total =
        numbers.reduce(

            (sum, value) =>
                sum + value,

            0

        );


    return Number(

        (
            total /
            numbers.length
        ).toFixed(2)

    );

};


//Normalize Proficiency Level

const normalizeProficiencyLevel = (
    level
) => {

    const normalized =
        normalizeLowercaseString(level);


    const levels = {

        beginner: "beginner",

        basic: "beginner",

        novice: "beginner",

        intermediate: "intermediate",

        medium: "intermediate",

        advanced: "advanced",

        expert: "expert",

        proficient: "advanced"

    };


    return levels[normalized] || null;

};


//Get Proficiency Score

const getProficiencyScore = (
    level
) => {

    const normalizedLevel =
        normalizeProficiencyLevel(level);


    const scores = {

        beginner: 25,

        intermediate: 50,

        advanced: 75,

        expert: 100

    };


    return scores[normalizedLevel] || 0;

};


//Calculate Skill Proficiency Average

const calculateSkillProficiencyAverage = (
    skills = []
) => {

    if (!Array.isArray(skills) || skills.length === 0) {

        return 0;

    }


    const scores =
        skills.map(

            (skill) =>
                getProficiencyScore(
                    skill.proficiencyLevel
                )

        );


    return calculateAverage(scores);

};


//Get Readiness Level

const getReadinessLevel = (
    score
) => {

    const readinessScore =
        clampNumber(

            score,

            0,

            100

        );


    if (readinessScore < 40) {

        return "Not Ready";

    }


    if (readinessScore < 60) {

        return "Needs Improvement";

    }


    if (readinessScore < 80) {

        return "Nearly Ready";

    }


    return "Ready";

};


//Get Skill Gap Level

const getSkillGapLevel = (
    percentage
) => {

    const gap =
        clampNumber(

            percentage,

            0,

            100

        );


    if (gap === 0) {

        return "No Gap";

    }


    if (gap <= 25) {

        return "Low";

    }


    if (gap <= 50) {

        return "Moderate";

    }


    if (gap <= 75) {

        return "High";

    }


    return "Critical";

};


//Generate Pagination

const createPagination = (
    page = 1,
    limit = 10,
    total = 0
) => {

    const currentPage =
        Math.max(

            1,

            Number(page) || 1

        );


    const pageLimit =
        Math.max(

            1,

            Number(limit) || 10

        );


    const totalItems =
        Math.max(

            0,

            Number(total) || 0

        );


    const totalPages =
        Math.ceil(

            totalItems /
            pageLimit

        );


    return {

        page: currentPage,

        limit: pageLimit,

        totalItems,

        totalPages,

        hasNextPage:
            currentPage < totalPages,

        hasPreviousPage:
            currentPage > 1

    };

};


//Sanitize Search Text

const sanitizeSearchText = (
    value
) => {

    return normalizeString(value)

        .replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

};


//Format Date

const formatDate = (
    date
) => {

    if (!date) {

        return null;

    }


    const parsedDate =
        new Date(date);


    if (Number.isNaN(
        parsedDate.getTime()
    )) {

        return null;

    }


    return parsedDate;

};


//Check Date Expired

const isExpired = (
    expiryDate
) => {

    const date =
        formatDate(expiryDate);


    if (!date) {

        return false;

    }


    return date < new Date();

};


//Get Days Until Date

const getDaysUntil = (
    targetDate
) => {

    const date =
        formatDate(targetDate);


    if (!date) {

        return null;

    }


    const currentDate =
        new Date();


    const difference =
        date.getTime() -
        currentDate.getTime();


    return Math.ceil(

        difference /
        (1000 * 60 * 60 * 24)

    );

};


//Export Utilities

module.exports = {

    isValidObjectId,

    toObjectId,

    normalizeString,

    normalizeLowercaseString,

    removeDuplicates,

    calculatePercentage,

    calculateCompletionPercentage,

    clampNumber,

    calculateAverage,

    normalizeProficiencyLevel,

    getProficiencyScore,

    calculateSkillProficiencyAverage,

    getReadinessLevel,

    getSkillGapLevel,

    createPagination,

    sanitizeSearchText,

    formatDate,

    isExpired,

    getDaysUntil

};