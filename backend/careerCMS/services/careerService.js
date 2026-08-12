const mongoose = require("mongoose");

const Career = require("../models/Career");
const CareerSkill = require("../models/CareerSkill");
const Roadmap = require("../models/Roadmap");
const Project = require("../models/Project");
const Certification = require("../models/Certification");
const LearningResource = require("../models/LearningResource");

const ApiError = require("../../shared/utils/ApiError");


//Create Career

const createCareer = async (careerData, userId) => {

    if (!userId) {
        throw new ApiError(
            401,
            "User authentication is required."
        );
    }

    const existingCareer = await Career.findOne({
        $or: [
            {
                slug: careerData.slug
            },
            {
                name: careerData.name
            }
        ]
    });

    if (existingCareer) {
        throw new ApiError(
            409,
            "A career with the same name or slug already exists."
        );
    }

    const career = await Career.create({
        ...careerData,
        createdBy: userId,
        updatedBy: userId
    });

    return career;
};


//Get All Careers

const getAllCareers = async (options = {}) => {

    const {
        page = 1,
        limit = 10,
        status,
        search,
        featured,
        sortBy = "createdAt",
        sortOrder = "desc"
    } = options;

    const currentPage = Math.max(
        Number(page) || 1,
        1
    );

    const perPage = Math.min(
        Math.max(Number(limit) || 10, 1),
        100
    );

    const filter = {};

    //Status Filter

    if (status) {
        filter.status = status;
    }

    //Featured Filter

    if (featured !== undefined) {

        filter.featured =
            featured === true ||
            featured === "true";

    }

    //Search

    if (search && search.trim()) {

        filter.$or = [
            {
                name: {
                    $regex: search.trim(),
                    $options: "i"
                }
            },
            {
                title: {
                    $regex: search.trim(),
                    $options: "i"
                }
            },
            {
                description: {
                    $regex: search.trim(),
                    $options: "i"
                }
            }
        ];

    }

    //Sorting

    const allowedSortFields = [
        "createdAt",
        "updatedAt",
        "name",
        "title",
        "displayOrder"
    ];

    const safeSortField =
        allowedSortFields.includes(sortBy)
            ? sortBy
            : "createdAt";

    const safeSortOrder =
        sortOrder === "asc"
            ? 1
            : -1;

    const skip =
        (currentPage - 1) * perPage;


    const [
        careers,
        total
    ] = await Promise.all([

        Career
            .find(filter)
            .sort({
                [safeSortField]: safeSortOrder
            })
            .skip(skip)
            .limit(perPage)
            .lean(),

        Career.countDocuments(filter)

    ]);


    return {

        careers,

        pagination: {

            page: currentPage,

            limit: perPage,

            total,

            totalPages:
                Math.ceil(total / perPage),

            hasNextPage:
                currentPage <
                Math.ceil(total / perPage),

            hasPreviousPage:
                currentPage > 1

        }

    };

};


//Get Career By ID

const getCareerById = async (careerId) => {

    if (!mongoose.isValidObjectId(careerId)) {

        throw new ApiError(
            400,
            "Invalid career ID."
        );

    }

    const career = await Career
        .findById(careerId)
        .lean();

    if (!career) {

        throw new ApiError(
            404,
            "Career not found."
        );

    }

    return career;
};


//Get Career By Slug

const getCareerBySlug = async (slug) => {

    if (!slug || !slug.trim()) {

        throw new ApiError(
            400,
            "Career slug is required."
        );

    }

    const career = await Career
        .findOne({
            slug: slug.trim().toLowerCase()
        })
        .lean();

    if (!career) {

        throw new ApiError(
            404,
            "Career not found."
        );

    }

    return career;
};


//Update Career

const updateCareer = async (
    careerId,
    updateData,
    userId
) => {

    if (!mongoose.isValidObjectId(careerId)) {

        throw new ApiError(
            400,
            "Invalid career ID."
        );

    }

    if (!userId) {

        throw new ApiError(
            401,
            "User authentication is required."
        );

    }

    const career = await Career.findById(
        careerId
    );

    if (!career) {

        throw new ApiError(
            404,
            "Career not found."
        );

    }

    //Check Duplicate Name / Slug

    if (
        updateData.name ||
        updateData.slug
    ) {

        const duplicateFilter = {
            _id: {
                $ne: careerId
            },
            $or: []
        };

        if (updateData.name) {

            duplicateFilter.$or.push({
                name: updateData.name
            });

        }

        if (updateData.slug) {

            duplicateFilter.$or.push({
                slug: updateData.slug
            });

        }

        const duplicateCareer =
            await Career.findOne(
                duplicateFilter
            );

        if (duplicateCareer) {

            throw new ApiError(
                409,
                "Another career with the same name or slug already exists."
            );

        }

    }


    //Update Fields

    Object.keys(updateData).forEach(
        (key) => {

            if (
                updateData[key] !== undefined
            ) {

                career[key] =
                    updateData[key];

            }

        }
    );


    career.updatedBy = userId;

    await career.save();

    return career;
};


//Publish Career

const publishCareer = async (
    careerId,
    userId
) => {

    if (!mongoose.isValidObjectId(careerId)) {

        throw new ApiError(
            400,
            "Invalid career ID."
        );

    }

    const career = await Career.findById(
        careerId
    );

    if (!career) {

        throw new ApiError(
            404,
            "Career not found."
        );

    }

    //Validate Required Information

    if (
        !career.name ||
        !career.description
    ) {

        throw new ApiError(
            400,
            "Career must have a name and description before publishing."
        );

    }


    career.status = "published";

    career.updatedBy = userId;

    await career.save();

    return career;
};


//Unpublish Career

const unpublishCareer = async (
    careerId,
    userId
) => {

    if (!mongoose.isValidObjectId(careerId)) {

        throw new ApiError(
            400,
            "Invalid career ID."
        );

    }

    const career = await Career.findById(
        careerId
    );

    if (!career) {

        throw new ApiError(
            404,
            "Career not found."
        );

    }

    career.status = "draft";

    career.updatedBy = userId;

    await career.save();

    return career;
};


//Archive Career

const archiveCareer = async (
    careerId,
    userId
) => {

    if (!mongoose.isValidObjectId(careerId)) {

        throw new ApiError(
            400,
            "Invalid career ID."
        );

    }

    const career = await Career.findById(
        careerId
    );

    if (!career) {

        throw new ApiError(
            404,
            "Career not found."
        );

    }

    career.status = "archived";

    career.updatedBy = userId;

    await career.save();

    return career;
};


//Restore Career

const restoreCareer = async (
    careerId,
    userId
) => {

    if (!mongoose.isValidObjectId(careerId)) {

        throw new ApiError(
            400,
            "Invalid career ID."
        );

    }

    const career = await Career.findById(
        careerId
    );

    if (!career) {

        throw new ApiError(
            404,
            "Career not found."
        );

    }

    career.status = "draft";

    career.updatedBy = userId;

    await career.save();

    return career;
};


//Delete Career

const deleteCareer = async (
    careerId
) => {

    if (!mongoose.isValidObjectId(careerId)) {

        throw new ApiError(
            400,
            "Invalid career ID."
        );

    }

    const career = await Career.findById(
        careerId
    );

    if (!career) {

        throw new ApiError(
            404,
            "Career not found."
        );

    }


    //Check Related Data

    const [
        careerSkillsCount,
        roadmapsCount,
        projectsCount,
        certificationsCount,
        resourcesCount
    ] = await Promise.all([

        CareerSkill.countDocuments({
            career: careerId
        }),

        Roadmap.countDocuments({
            career: careerId
        }),

        Project.countDocuments({
            careers: careerId
        }),

        Certification.countDocuments({
            careers: careerId
        }),

        LearningResource.countDocuments({
            careers: careerId
        })

    ]);


    const hasDependencies =
        careerSkillsCount > 0 ||
        roadmapsCount > 0 ||
        projectsCount > 0 ||
        certificationsCount > 0 ||
        resourcesCount > 0;


    //Prevent Unsafe Deletion

    if (hasDependencies) {

        throw new ApiError(
            409,
            "Career cannot be permanently deleted because related CMS data exists. Archive the career instead."
        );

    }


    await Career.findByIdAndDelete(
        careerId
    );

    return {
        message: "Career deleted successfully."
    };

};


//Get Career With Related Data

const getCareerDetails = async (
    careerId
) => {

    if (!mongoose.isValidObjectId(careerId)) {

        throw new ApiError(
            400,
            "Invalid career ID."
        );

    }

    const career = await Career
        .findById(careerId)
        .lean();

    if (!career) {

        throw new ApiError(
            404,
            "Career not found."
        );

    }


    const [
        careerSkills,
        roadmaps,
        projects,
        certifications,
        resources
    ] = await Promise.all([

        CareerSkill
            .find({
                career: careerId
            })
            .populate(
                "skill",
                "name slug description category level"
            )
            .lean(),

        Roadmap
            .find({
                career: careerId
            })
            .sort({
                displayOrder: 1
            })
            .lean(),

        Project
            .find({
                careers: careerId
            })
            .lean(),

        Certification
            .find({
                careers: careerId
            })
            .lean(),

        LearningResource
            .find({
                careers: careerId
            })
            .lean()

    ]);


    return {

        career,

        skills: careerSkills,

        roadmaps,

        projects,

        certifications,

        learningResources: resources

    };

};


//Get Published Careers

const getPublishedCareers = async () => {

    const careers = await Career
        .find({
            status: "published"
        })
        .sort({
            displayOrder: 1,
            name: 1
        })
        .lean();

    return careers;

};


//Update Career Display Order

const updateCareerDisplayOrder = async (
    careerId,
    displayOrder,
    userId
) => {

    if (!mongoose.isValidObjectId(careerId)) {

        throw new ApiError(
            400,
            "Invalid career ID."
        );

    }

    if (
        !Number.isInteger(
            Number(displayOrder)
        ) ||
        Number(displayOrder) < 0
    ) {

        throw new ApiError(
            400,
            "Display order must be a non-negative integer."
        );

    }

    const career = await Career.findById(
        careerId
    );

    if (!career) {

        throw new ApiError(
            404,
            "Career not found."
        );

    }

    career.displayOrder =
        Number(displayOrder);

    career.updatedBy = userId;

    await career.save();

    return career;
};


//Export Service Functions

module.exports = {

    createCareer,

    getAllCareers,

    getCareerById,

    getCareerBySlug,

    updateCareer,

    publishCareer,

    unpublishCareer,

    archiveCareer,

    restoreCareer,

    deleteCareer,

    getCareerDetails,

    getPublishedCareers,

    updateCareerDisplayOrder

};