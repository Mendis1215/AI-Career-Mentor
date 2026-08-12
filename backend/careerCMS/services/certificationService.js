const mongoose = require("mongoose");

const Certification = require("../models/Certification");
const Career = require("../models/Career");
const Skill = require("../models/Skill");

const ApiError = require("../../shared/utils/ApiError");


//Validate ObjectId

const validateObjectId = (id, fieldName) => {

    if (!mongoose.isValidObjectId(id)) {

        throw new ApiError(
            400,
            `Invalid ${fieldName}.`
        );

    }

};


//Check Career Exists

const checkCareerExists = async (careerId) => {

    const career = await Career.findById(
        careerId
    );

    if (!career) {

        throw new ApiError(
            404,
            "Career not found."
        );

    }

    return career;

};


//Check Skill Exists

const checkSkillExists = async (skillId) => {

    const skill = await Skill.findById(
        skillId
    );

    if (!skill) {

        throw new ApiError(
            404,
            "Skill not found."
        );

    }

    return skill;

};


//Validate Skills

const validateSkillArray = async (
    skills
) => {

    if (skills === undefined) {
        return;
    }


    if (!Array.isArray(skills)) {

        throw new ApiError(
            400,
            "Skills must be provided as an array."
        );

    }


    for (const skillId of skills) {

        validateObjectId(
            skillId,
            "skill ID"
        );

        await checkSkillExists(
            skillId
        );

    }

};


//Create Certification

const createCertification = async (
    certificationData,
    userId
) => {

    if (!userId) {

        throw new ApiError(
            401,
            "User authentication is required."
        );

    }


    const {
        career,
        skills,
        slug,
        name,
        title
    } = certificationData;


    //Validate Career

    if (career) {

        validateObjectId(
            career,
            "career ID"
        );

        await checkCareerExists(
            career
        );

    }


    //Validate Skills

    await validateSkillArray(
        skills
    );


    //Duplicate Slug

    if (slug) {

        const existingSlug =
            await Certification.findOne({
                slug
            });


        if (existingSlug) {

            throw new ApiError(
                409,
                "A certification with the same slug already exists."
            );

        }

    }


    //Duplicate Name / Title

    if (name || title) {

        const duplicateFilter = {};


        if (career) {

            duplicateFilter.career =
                career;

        }


        duplicateFilter.$or = [];


        if (name) {

            duplicateFilter.$or.push({
                name
            });

        }


        if (title) {

            duplicateFilter.$or.push({
                title
            });

        }


        const existingCertification =
            await Certification.findOne(
                duplicateFilter
            );


        if (existingCertification) {

            throw new ApiError(
                409,
                "A certification with the same name or title already exists."
            );

        }

    }


    //Create Certification

    const certification =
        await Certification.create({

            ...certificationData,

            createdBy: userId,

            updatedBy: userId

        });


    return certification;

};


//Get All Certifications

const getAllCertifications = async (
    options = {}
) => {

    const {
        page = 1,
        limit = 10,
        career,
        skill,
        status,
        provider,
        category,
        level,
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


    //Career Filter                                 

    if (career) {

        validateObjectId(
            career,
            "career ID"
        );

        filter.career = career;

    }


    //Skill Filter

    if (skill) {

        validateObjectId(
            skill,
            "skill ID"
        );

        filter.skills = skill;

    }


    //Status Filter

    if (status) {

        filter.status = status;

    }


    //Provider Filter

    if (provider) {

        filter.provider = {

            $regex: provider.trim(),

            $options: "i"

        };

    }


    //Category Filter

    if (category) {

        filter.category =
            category;

    }


    //Level Filter

    if (level) {

        filter.level =
            level;

    }


    //Featured Filter

    if (featured !== undefined) {

        filter.featured =
            featured === true ||
            featured === "true";

    }


    //Search

    if (
        search &&
        search.trim()
    ) {

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
            },

            {
                provider: {
                    $regex: search.trim(),
                    $options: "i"
                }
            }

        ];

    }


    //Sorting

    const allowedSortFields = [

        "name",

        "title",

        "provider",

        "category",

        "level",

        "createdAt",

        "updatedAt",

        "displayOrder"

    ];


    const safeSortField =
        allowedSortFields.includes(
            sortBy
        )
            ? sortBy
            : "createdAt";


    const safeSortOrder =
        sortOrder === "asc"
            ? 1
            : -1;


    const skip =
        (currentPage - 1) * perPage;


    const [
        certifications,
        total
    ] = await Promise.all([

        Certification
            .find(filter)
            .populate(
                "career",
                "name slug status"
            )
            .populate(
                "skills",
                "name slug category level status"
            )
            .sort({
                [safeSortField]:
                    safeSortOrder
            })
            .skip(skip)
            .limit(perPage)
            .lean(),

        Certification.countDocuments(
            filter
        )

    ]);


    return {

        certifications,

        pagination: {

            page: currentPage,

            limit: perPage,

            total,

            totalPages:
                Math.ceil(
                    total / perPage
                ),

            hasNextPage:
                currentPage <
                Math.ceil(
                    total / perPage
                ),

            hasPreviousPage:
                currentPage > 1

        }

    };

};


//Get Certification By ID

const getCertificationById = async (
    certificationId
) => {

    validateObjectId(
        certificationId,
        "certification ID"
    );


    const certification =
        await Certification
            .findById(certificationId)
            .populate(
                "career",
                "name slug description status"
            )
            .populate(
                "skills",
                "name slug description category level status"
            )
            .lean();


    if (!certification) {

        throw new ApiError(
            404,
            "Certification not found."
        );

    }


    return certification;

};


//Get Certification By Slug

const getCertificationBySlug = async (
    slug
) => {

    if (
        !slug ||
        !slug.trim()
    ) {

        throw new ApiError(
            400,
            "Certification slug is required."
        );

    }


    const certification =
        await Certification
            .findOne({
                slug:
                    slug
                        .trim()
                        .toLowerCase()
            })
            .populate(
                "career",
                "name slug description status"
            )
            .populate(
                "skills",
                "name slug category level status"
            )
            .lean();


    if (!certification) {

        throw new ApiError(
            404,
            "Certification not found."
        );

    }


    return certification;

};


//Update Certification

const updateCertification = async (
    certificationId,
    updateData,
    userId
) => {

    validateObjectId(
        certificationId,
        "certification ID"
    );


    if (!userId) {

        throw new ApiError(
            401,
            "User authentication is required."
        );

    }


    const certification =
        await Certification.findById(
            certificationId
        );


    if (!certification) {

        throw new ApiError(
            404,
            "Certification not found."
        );

    }


    //Validate Career

    if (updateData.career) {

        validateObjectId(
            updateData.career,
            "career ID"
        );

        await checkCareerExists(
            updateData.career
        );

    }


    //Validate Skills

    if (
        updateData.skills !== undefined
    ) {

        await validateSkillArray(
            updateData.skills
        );

    }


    //Slug Duplicate Check

    if (
        updateData.slug &&
        updateData.slug !== certification.slug
    ) {

        const duplicateSlug =
            await Certification.findOne({

                _id: {
                    $ne: certificationId
                },

                slug: updateData.slug

            });


        if (duplicateSlug) {

            throw new ApiError(
                409,
                "A certification with the same slug already exists."
            );

        }

    }


    //Update Fields

    Object.keys(updateData).forEach(
        (key) => {

            if (
                updateData[key] !== undefined
            ) {

                certification[key] =
                    updateData[key];

            }

        }
    );


    certification.updatedBy =
        userId;


    await certification.save();


    return certification;

};


//Publish Certification

const publishCertification = async (
    certificationId,
    userId
) => {

    validateObjectId(
        certificationId,
        "certification ID"
    );


    const certification =
        await Certification.findById(
            certificationId
        );


    if (!certification) {

        throw new ApiError(
            404,
            "Certification not found."
        );

    }


    //Required Content Validation

    if (
        !certification.name &&
        !certification.title
    ) {

        throw new ApiError(
            400,
            "Certification must have a name or title before publishing."
        );

    }


    if (
        !certification.description
    ) {

        throw new ApiError(
            400,
            "Certification must have a description before publishing."
        );

    }


    if (
        !certification.provider
    ) {

        throw new ApiError(
            400,
            "Certification provider is required before publishing."
        );

    }


    certification.status =
        "published";

    certification.updatedBy =
        userId;


    await certification.save();


    return certification;

};


//Unpublish Certification

const unpublishCertification = async (
    certificationId,
    userId
) => {

    validateObjectId(
        certificationId,
        "certification ID"
    );


    const certification =
        await Certification.findById(
            certificationId
        );


    if (!certification) {

        throw new ApiError(
            404,
            "Certification not found."
        );

    }


    certification.status =
        "draft";

    certification.updatedBy =
        userId;


    await certification.save();


    return certification;

};


//Archive Certification

const archiveCertification = async (
    certificationId,
    userId
) => {

    validateObjectId(
        certificationId,
        "certification ID"
    );


    const certification =
        await Certification.findById(
            certificationId
        );


    if (!certification) {

        throw new ApiError(
            404,
            "Certification not found."
        );

    }


    certification.status =
        "archived";

    certification.updatedBy =
        userId;


    await certification.save();


    return certification;

};


//Restore Certification

const restoreCertification = async (
    certificationId,
    userId
) => {

    validateObjectId(
        certificationId,
        "certification ID"
    );


    const certification =
        await Certification.findById(
            certificationId
        );


    if (!certification) {

        throw new ApiError(
            404,
            "Certification not found."
        );

    }


    certification.status =
        "draft";

    certification.updatedBy =
        userId;


    await certification.save();


    return certification;

};


//Delete Certification

const deleteCertification = async (
    certificationId
) => {

    validateObjectId(
        certificationId,
        "certification ID"
    );


    const certification =
        await Certification.findById(
            certificationId
        );


    if (!certification) {

        throw new ApiError(
            404,
            "Certification not found."
        );

    }


    await Certification.findByIdAndDelete(
        certificationId
    );


    return {

        message:
            "Certification deleted successfully."

    };

};


//Get Certifications By Career

const getCertificationsByCareer = async (
    careerId,
    options = {}
) => {

    validateObjectId(
        careerId,
        "career ID"
    );


    await checkCareerExists(
        careerId
    );


    const filter = {

        career: careerId

    };


    if (options.status) {

        filter.status =
            options.status;

    }


    if (options.level) {

        filter.level =
            options.level;

    }


    if (options.provider) {

        filter.provider = {

            $regex:
                options.provider.trim(),

            $options: "i"

        };

    }


    const certifications =
        await Certification
            .find(filter)
            .populate(
                "skills",
                "name slug category level"
            )
            .sort({

                displayOrder: 1,

                createdAt: 1

            })
            .lean();


    return certifications;

};


//Get Certifications By Skill

const getCertificationsBySkill = async (
    skillId,
    options = {}
) => {

    validateObjectId(
        skillId,
        "skill ID"
    );


    await checkSkillExists(
        skillId
    );


    const filter = {

        skills: skillId

    };


    if (options.status) {

        filter.status =
            options.status;

    }


    if (options.level) {

        filter.level =
            options.level;

    }


    const certifications =
        await Certification
            .find(filter)
            .populate(
                "career",
                "name slug status"
            )
            .populate(
                "skills",
                "name slug category level"
            )
            .sort({

                displayOrder: 1,

                createdAt: 1

            })
            .lean();


    return certifications;

};


//Get Published Certifications

const getPublishedCertifications = async (
    options = {}
) => {

    const filter = {

        status: "published"

    };


    if (options.career) {

        validateObjectId(
            options.career,
            "career ID"
        );

        filter.career =
            options.career;

    }


    if (options.skill) {

        validateObjectId(
            options.skill,
            "skill ID"
        );

        filter.skills =
            options.skill;

    }


    if (options.provider) {

        filter.provider = {

            $regex:
                options.provider.trim(),

            $options: "i"

        };

    }


    if (options.level) {

        filter.level =
            options.level;

    }


    const certifications =
        await Certification
            .find(filter)
            .populate(
                "career",
                "name slug"
            )
            .populate(
                "skills",
                "name slug category level"
            )
            .sort({

                displayOrder: 1,

                createdAt: 1

            })
            .lean();


    return certifications;

};


//Update Certification Display Order

const updateCertificationDisplayOrder = async (
    certificationId,
    displayOrder,
    userId
) => {

    validateObjectId(
        certificationId,
        "certification ID"
    );


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


    const certification =
        await Certification.findById(
            certificationId
        );


    if (!certification) {

        throw new ApiError(
            404,
            "Certification not found."
        );

    }


    certification.displayOrder =
        Number(displayOrder);

    certification.updatedBy =
        userId;


    await certification.save();


    return certification;

};


//Export Service Functions

module.exports = {

    createCertification,

    getAllCertifications,

    getCertificationById,

    getCertificationBySlug,

    updateCertification,

    publishCertification,

    unpublishCertification,

    archiveCertification,

    restoreCertification,

    deleteCertification,

    getCertificationsByCareer,

    getCertificationsBySkill,

    getPublishedCertifications,

    updateCertificationDisplayOrder

};