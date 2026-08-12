const mongoose = require("mongoose");

const KnowledgeDocument = require("../models/KnowledgeDocument");
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


//Validate Skill Array

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


//Validate Document Content

const validateDocumentContent = (
    data
) => {

    const hasContent =
        data.content &&
        data.content.trim();


    const hasFile =
        data.fileUrl &&
        data.fileUrl.trim();


    if (!hasContent && !hasFile) {

        throw new ApiError(
            400,
            "Knowledge document must contain text content or a file."
        );

    }

};


//Create Knowledge Document

const createKnowledgeDocument = async (
    documentData,
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
        title
    } = documentData;


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


    //Validate Content

    validateDocumentContent(
        documentData
    );


    //Validate Title

    if (
        !title ||
        !title.trim()
    ) {

        throw new ApiError(
            400,
            "Knowledge document title is required."
        );

    }


    //Duplicate Slug

    if (slug) {

        const existingSlug =
            await KnowledgeDocument.findOne({
                slug
            });


        if (existingSlug) {

            throw new ApiError(
                409,
                "A knowledge document with the same slug already exists."
            );

        }

    }


    //Create Document

    const document =
        await KnowledgeDocument.create({

            ...documentData,

            createdBy: userId,

            updatedBy: userId

        });


    return document;

};


//Get All Knowledge Documents

const getAllKnowledgeDocuments = async (
    options = {}
) => {

    const {
        page = 1,
        limit = 10,
        career,
        skill,
        status,
        type,
        category,
        source,
        search,
        indexed,
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


    //Document Type

    if (type) {

        filter.type = type;

    }


    //Category

    if (category) {

        filter.category =
            category;

    }


    //Source

    if (source) {

        filter.source = {

            $regex:
                source.trim(),

            $options: "i"

        };

    }


    //Indexed Filter

    if (indexed !== undefined) {

        filter.isIndexed =
            indexed === true ||
            indexed === "true";

    }


    //Search

    if (
        search &&
        search.trim()
    ) {

        filter.$or = [

            {
                title: {

                    $regex:
                        search.trim(),

                    $options: "i"

                }

            },

            {
                description: {

                    $regex:
                        search.trim(),

                    $options: "i"

                }

            },

            {
                content: {

                    $regex:
                        search.trim(),

                    $options: "i"

                }

            },

            {
                source: {

                    $regex:
                        search.trim(),

                    $options: "i"

                }

            }

        ];

    }


    //Sorting

    const allowedSortFields = [

        "title",
        "type",
        "category",
        "source",
        "status",
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
        documents,
        total
    ] = await Promise.all([

        KnowledgeDocument
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

        KnowledgeDocument.countDocuments(
            filter
        )

    ]);


    return {

        documents,

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


//Get Knowledge Document By ID

const getKnowledgeDocumentById = async (
    documentId
) => {

    validateObjectId(
        documentId,
        "document ID"
    );


    const document =
        await KnowledgeDocument
            .findById(documentId)
            .populate(
                "career",
                "name slug description status"
            )
            .populate(
                "skills",
                "name slug description category level status"
            )
            .lean();


    if (!document) {

        throw new ApiError(
            404,
            "Knowledge document not found."
        );

    }


    return document;

};


//Get Knowledge Document By Slug

const getKnowledgeDocumentBySlug = async (
    slug
) => {

    if (
        !slug ||
        !slug.trim()
    ) {

        throw new ApiError(
            400,
            "Knowledge document slug is required."
        );

    }


    const document =
        await KnowledgeDocument
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
                "name slug description category level status"
            )
            .lean();


    if (!document) {

        throw new ApiError(
            404,
            "Knowledge document not found."
        );

    }


    return document;

};


//Update Knowledge Document

const updateKnowledgeDocument = async (
    documentId,
    updateData,
    userId
) => {

    validateObjectId(
        documentId,
        "document ID"
    );


    if (!userId) {

        throw new ApiError(
            401,
            "User authentication is required."
        );

    }


    const document =
        await KnowledgeDocument.findById(
            documentId
        );


    if (!document) {

        throw new ApiError(
            404,
            "Knowledge document not found."
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


    //Validate Title

    if (
        updateData.title !== undefined &&
        !updateData.title.trim()
    ) {

        throw new ApiError(
            400,
            "Knowledge document title cannot be empty."
        );

    }


    //Validate Content

    if (
        updateData.content !== undefined ||
        updateData.fileUrl !== undefined
    ) {

        const newContent =
            updateData.content !== undefined
                ? updateData.content
                : document.content;


        const newFileUrl =
            updateData.fileUrl !== undefined
                ? updateData.fileUrl
                : document.fileUrl;


        validateDocumentContent({

            content:
                newContent,

            fileUrl:
                newFileUrl

        });

    }


    //Slug Duplicate Check

    if (
        updateData.slug &&
        updateData.slug !== document.slug
    ) {

        const duplicateSlug =
            await KnowledgeDocument.findOne({

                _id: {
                    $ne: documentId
                },

                slug: updateData.slug

            });


        if (duplicateSlug) {

            throw new ApiError(
                409,
                "A knowledge document with the same slug already exists."
            );

        }

    }


    //Update Fields

    Object.keys(updateData).forEach(
        (key) => {

            if (
                updateData[key] !== undefined
            ) {

                document[key] =
                    updateData[key];

            }

        }
    );


    //Content Changed

    if (
        updateData.content !== undefined ||
        updateData.fileUrl !== undefined
    ) {

        document.isIndexed = false;

        document.indexedAt = null;

    }


    document.updatedBy =
        userId;


    await document.save();


    return document;

};


//Publish Knowledge Document

const publishKnowledgeDocument = async (
    documentId,
    userId
) => {

    validateObjectId(
        documentId,
        "document ID"
    );


    const document =
        await KnowledgeDocument.findById(
            documentId
        );


    if (!document) {

        throw new ApiError(
            404,
            "Knowledge document not found."
        );

    }


    //Required Content

    if (
        !document.title ||
        !document.title.trim()
    ) {

        throw new ApiError(
            400,
            "Knowledge document title is required before publishing."
        );

    }


    if (
        !document.content &&
        !document.fileUrl
    ) {

        throw new ApiError(
            400,
            "Knowledge document must contain content or a file before publishing."
        );

    }


    document.status =
        "published";

    document.updatedBy =
        userId;


    await document.save();


    return document;

};


//Unpublish Knowledge Document

const unpublishKnowledgeDocument = async (
    documentId,
    userId
) => {

    validateObjectId(
        documentId,
        "document ID"
    );


    const document =
        await KnowledgeDocument.findById(
            documentId
        );


    if (!document) {

        throw new ApiError(
            404,
            "Knowledge document not found."
        );

    }


    document.status =
        "draft";

    document.updatedBy =
        userId;


    await document.save();


    return document;

};


//Archive Knowledge Document

const archiveKnowledgeDocument = async (
    documentId,
    userId
) => {

    validateObjectId(
        documentId,
        "document ID"
    );


    const document =
        await KnowledgeDocument.findById(
            documentId
        );


    if (!document) {

        throw new ApiError(
            404,
            "Knowledge document not found."
        );

    }


    document.status =
        "archived";

    document.updatedBy =
        userId;


    await document.save();


    return document;

};


//Restore Knowledge Document

const restoreKnowledgeDocument = async (
    documentId,
    userId
) => {

    validateObjectId(
        documentId,
        "document ID"
    );


    const document =
        await KnowledgeDocument.findById(
            documentId
        );


    if (!document) {

        throw new ApiError(
            404,
            "Knowledge document not found."
        );

    }


    document.status =
        "draft";

    document.updatedBy =
        userId;


    await document.save();


    return document;

};


//Delete Knowledge Document

const deleteKnowledgeDocument = async (
    documentId
) => {

    validateObjectId(
        documentId,
        "document ID"
    );


    const document =
        await KnowledgeDocument.findById(
            documentId
        );


    if (!document) {

        throw new ApiError(
            404,
            "Knowledge document not found."
        );

    }


    await KnowledgeDocument.findByIdAndDelete(
        documentId
    );


    return {

        message:
            "Knowledge document deleted successfully."

    };

};


//Get Documents By Career

const getKnowledgeDocumentsByCareer = async (
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


    if (options.type) {

        filter.type =
            options.type;

    }


    if (options.category) {

        filter.category =
            options.category;

    }


    if (options.indexed !== undefined) {

        filter.isIndexed =
            options.indexed === true ||
            options.indexed === "true";

    }


    const documents =
        await KnowledgeDocument
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


    return documents;

};


//Get Documents By Skill

const getKnowledgeDocumentsBySkill = async (
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


    if (options.type) {

        filter.type =
            options.type;

    }


    if (options.category) {

        filter.category =
            options.category;

    }


    if (options.indexed !== undefined) {

        filter.isIndexed =
            options.indexed === true ||
            options.indexed === "true";

    }


    const documents =
        await KnowledgeDocument
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


    return documents;

};


//Get Published Knowledge Documents

const getPublishedKnowledgeDocuments = async (
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


    if (options.type) {

        filter.type =
            options.type;

    }


    if (options.category) {

        filter.category =
            options.category;

    }


    if (options.indexed !== undefined) {

        filter.isIndexed =
            options.indexed === true ||
            options.indexed === "true";

    }


    const documents =
        await KnowledgeDocument
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


    return documents;

};


//Mark Document As Indexed

const markAsIndexed = async (
    documentId,
    userId
) => {

    validateObjectId(
        documentId,
        "document ID"
    );


    const document =
        await KnowledgeDocument.findById(
            documentId
        );


    if (!document) {

        throw new ApiError(
            404,
            "Knowledge document not found."
        );

    }


    document.isIndexed = true;

    document.indexedAt =
        new Date();

    document.updatedBy =
        userId;


    await document.save();


    return document;

};


//Mark Document As Not Indexed

const markAsNotIndexed = async (
    documentId,
    userId
) => {

    validateObjectId(
        documentId,
        "document ID"
    );


    const document =
        await KnowledgeDocument.findById(
            documentId
        );


    if (!document) {

        throw new ApiError(
            404,
            "Knowledge document not found."
        );

    }


    document.isIndexed = false;

    document.indexedAt = null;

    document.updatedBy =
        userId;


    await document.save();


    return document;

};


//Update Document Display Order

const updateDocumentDisplayOrder = async (
    documentId,
    displayOrder,
    userId
) => {

    validateObjectId(
        documentId,
        "document ID"
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


    const document =
        await KnowledgeDocument.findById(
            documentId
        );


    if (!document) {

        throw new ApiError(
            404,
            "Knowledge document not found."
        );

    }


    document.displayOrder =
        Number(displayOrder);

    document.updatedBy =
        userId;


    await document.save();


    return document;

};


//Get Documents Ready For RAG Indexing

const getDocumentsReadyForIndexing = async (
    options = {}
) => {

    const filter = {

        status: "published",

        isIndexed: false

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


    const documents =
        await KnowledgeDocument
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

                createdAt: 1

            })
            .lean();


    return documents;

};


//Export Service Functions

module.exports = {

    createKnowledgeDocument,

    getAllKnowledgeDocuments,

    getKnowledgeDocumentById,

    getKnowledgeDocumentBySlug,

    updateKnowledgeDocument,

    publishKnowledgeDocument,

    unpublishKnowledgeDocument,

    archiveKnowledgeDocument,

    restoreKnowledgeDocument,

    deleteKnowledgeDocument,

    getKnowledgeDocumentsByCareer,

    getKnowledgeDocumentsBySkill,

    getPublishedKnowledgeDocuments,

    markAsIndexed,

    markAsNotIndexed,

    updateDocumentDisplayOrder,

    getDocumentsReadyForIndexing

};