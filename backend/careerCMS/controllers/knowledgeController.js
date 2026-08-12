const knowledgeService = require("../services/knowledgeService");


//Create Knowledge Document

const createKnowledgeDocument = async (req, res, next) => {

    try {

        const document =
            await knowledgeService.createKnowledgeDocument(
                req.body,
                req.user._id
            );

        return res.status(201).json({

            success: true,

            message:
                "Knowledge document created successfully.",

            data: document

        });

    } catch (error) {

        next(error);

    }

};


//Get All Knowledge Documents

const getAllKnowledgeDocuments = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await knowledgeService.getAllKnowledgeDocuments(
                req.query
            );

        return res.status(200).json({

            success: true,

            message:
                "Knowledge documents retrieved successfully.",

            data: result

        });

    } catch (error) {

        next(error);

    }

};


//Get Knowledge Document By ID

const getKnowledgeDocumentById = async (
    req,
    res,
    next
) => {

    try {

        const document =
            await knowledgeService.getKnowledgeDocumentById(
                req.params.id
            );

        return res.status(200).json({

            success: true,

            message:
                "Knowledge document retrieved successfully.",

            data: document

        });

    } catch (error) {

        next(error);

    }

};


//Get Knowledge Document By Slug

const getKnowledgeDocumentBySlug = async (
    req,
    res,
    next
) => {

    try {

        const document =
            await knowledgeService.getKnowledgeDocumentBySlug(
                req.params.slug
            );

        return res.status(200).json({

            success: true,

            message:
                "Knowledge document retrieved successfully.",

            data: document

        });

    } catch (error) {

        next(error);

    }

};


//Update Knowledge Document

const updateKnowledgeDocument = async (
    req,
    res,
    next
) => {

    try {

        const document =
            await knowledgeService.updateKnowledgeDocument(

                req.params.id,

                req.body,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Knowledge document updated successfully.",

            data: document

        });

    } catch (error) {

        next(error);

    }

};


//Delete Knowledge Document

const deleteKnowledgeDocument = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await knowledgeService.deleteKnowledgeDocument(
                req.params.id
            );

        return res.status(200).json({

            success: true,

            message:
                result.message

        });

    } catch (error) {

        next(error);

    }

};


//Publish Knowledge Document

const publishKnowledgeDocument = async (
    req,
    res,
    next
) => {

    try {

        const document =
            await knowledgeService.publishKnowledgeDocument(

                req.params.id,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Knowledge document published successfully.",

            data: document

        });

    } catch (error) {

        next(error);

    }

};


//Unpublish Knowledge Document

const unpublishKnowledgeDocument = async (
    req,
    res,
    next
) => {

    try {

        const document =
            await knowledgeService.unpublishKnowledgeDocument(

                req.params.id,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Knowledge document unpublished successfully.",

            data: document

        });

    } catch (error) {

        next(error);

    }

};


//Archive Knowledge Document

const archiveKnowledgeDocument = async (
    req,
    res,
    next
) => {

    try {

        const document =
            await knowledgeService.archiveKnowledgeDocument(

                req.params.id,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Knowledge document archived successfully.",

            data: document

        });

    } catch (error) {

        next(error);

    }

};


//Restore Knowledge Document

const restoreKnowledgeDocument = async (
    req,
    res,
    next
) => {

    try {

        const document =
            await knowledgeService.restoreKnowledgeDocument(

                req.params.id,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Knowledge document restored successfully.",

            data: document

        });

    } catch (error) {

        next(error);

    }

};


//Get Knowledge Documents By Career

const getKnowledgeDocumentsByCareer = async (
    req,
    res,
    next
) => {

    try {

        const documents =
            await knowledgeService.getKnowledgeDocumentsByCareer(

                req.params.careerId,

                req.query

            );

        return res.status(200).json({

            success: true,

            message:
                "Career knowledge documents retrieved successfully.",

            data: documents

        });

    } catch (error) {

        next(error);

    }

};


//Get Knowledge Documents By Skill

const getKnowledgeDocumentsBySkill = async (
    req,
    res,
    next
) => {

    try {

        const documents =
            await knowledgeService.getKnowledgeDocumentsBySkill(

                req.params.skillId,

                req.query

            );

        return res.status(200).json({

            success: true,

            message:
                "Skill-related knowledge documents retrieved successfully.",

            data: documents

        });

    } catch (error) {

        next(error);

    }

};


//Get Published Knowledge Documents

const getPublishedKnowledgeDocuments = async (
    req,
    res,
    next
) => {

    try {

        const documents =
            await knowledgeService.getPublishedKnowledgeDocuments(
                req.query
            );

        return res.status(200).json({

            success: true,

            message:
                "Published knowledge documents retrieved successfully.",

            data: documents

        });

    } catch (error) {

        next(error);

    }

};


//Mark Document As Indexed

const markAsIndexed = async (
    req,
    res,
    next
) => {

    try {

        const document =
            await knowledgeService.markAsIndexed(

                req.params.id,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Knowledge document marked as indexed.",

            data: document

        });

    } catch (error) {

        next(error);

    }

};


//Mark Document As Not Indexed

const markAsNotIndexed = async (
    req,
    res,
    next
) => {

    try {

        const document =
            await knowledgeService.markAsNotIndexed(

                req.params.id,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Knowledge document marked as not indexed.",

            data: document

        });

    } catch (error) {

        next(error);

    }

};


//Update Document Display Order

const updateDocumentDisplayOrder = async (
    req,
    res,
    next
) => {

    try {

        const document =
            await knowledgeService.updateDocumentDisplayOrder(

                req.params.id,

                req.body.displayOrder,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Knowledge document display order updated successfully.",

            data: document

        });

    } catch (error) {

        next(error);

    }

};


//Get Documents Ready For Indexing              

const getDocumentsReadyForIndexing = async (
    req,
    res,
    next
) => {

    try {

        const documents =
            await knowledgeService.getDocumentsReadyForIndexing(
                req.query
            );

        return res.status(200).json({

            success: true,

            message:
                "Knowledge documents ready for indexing retrieved successfully.",

            data: documents

        });

    } catch (error) {

        next(error);

    }

};


//Export Controllers

module.exports = {

    createKnowledgeDocument,

    getAllKnowledgeDocuments,

    getKnowledgeDocumentById,

    getKnowledgeDocumentBySlug,

    updateKnowledgeDocument,

    deleteKnowledgeDocument,

    publishKnowledgeDocument,

    unpublishKnowledgeDocument,

    archiveKnowledgeDocument,

    restoreKnowledgeDocument,

    getKnowledgeDocumentsByCareer,

    getKnowledgeDocumentsBySkill,

    getPublishedKnowledgeDocuments,

    markAsIndexed,

    markAsNotIndexed,

    updateDocumentDisplayOrder,

    getDocumentsReadyForIndexing

};