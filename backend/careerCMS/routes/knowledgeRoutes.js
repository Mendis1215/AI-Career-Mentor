const express = require("express");

const router = express.Router();

const knowledgeController = require("../controllers/knowledgeController");

const {
    protect,
    authorize
} = require("../../shared/middleware/auth");


//Public Knowledge Document Routes

/*
    GET /api/knowledge
    Get all knowledge documents
*/
router.get(
    "/",
    knowledgeController.getAllKnowledgeDocuments
);


/*
    GET /api/knowledge/published
    Get published knowledge documents
*/
router.get(
    "/published",
    knowledgeController.getPublishedKnowledgeDocuments
);


/*
    GET /api/knowledge/ready-for-indexing
    Get documents ready for RAG indexing

    This is an admin-only endpoint because it is related
    to the knowledge-base indexing workflow.
*/
router.get(
    "/ready-for-indexing",
    protect,
    authorize("admin"),
    knowledgeController.getDocumentsReadyForIndexing
);


/*
    GET /api/knowledge/career/:careerId
    Get knowledge documents associated with a career
*/
router.get(
    "/career/:careerId",
    knowledgeController.getKnowledgeDocumentsByCareer
);


/*
    GET /api/knowledge/skill/:skillId
    Get knowledge documents associated with a skill
*/
router.get(
    "/skill/:skillId",
    knowledgeController.getKnowledgeDocumentsBySkill
);


/*
    GET /api/knowledge/slug/:slug
    Get knowledge document by slug
*/
router.get(
    "/slug/:slug",
    knowledgeController.getKnowledgeDocumentBySlug
);


/*
    GET /api/knowledge/:id
    Get knowledge document by ID
*/
router.get(
    "/:id",
    knowledgeController.getKnowledgeDocumentById
);


//Admin Knowledge Document Routes

/*
    POST /api/knowledge
    Create knowledge document
*/
router.post(
    "/",
    protect,
    authorize("admin"),
    knowledgeController.createKnowledgeDocument
);


/*
    PUT /api/knowledge/:id
    Update knowledge document
*/
router.put(
    "/:id",
    protect,
    authorize("admin"),
    knowledgeController.updateKnowledgeDocument
);


/*
    DELETE /api/knowledge/:id
    Delete knowledge document
*/
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    knowledgeController.deleteKnowledgeDocument
);


//Publishing

/*
    PATCH /api/knowledge/:id/publish
    Publish knowledge document
*/
router.patch(
    "/:id/publish",
    protect,
    authorize("admin"),
    knowledgeController.publishKnowledgeDocument
);


/*
    PATCH /api/knowledge/:id/unpublish
    Unpublish knowledge document
*/
router.patch(
    "/:id/unpublish",
    protect,
    authorize("admin"),
    knowledgeController.unpublishKnowledgeDocument
);


//Archive

/*
    PATCH /api/knowledge/:id/archive
    Archive knowledge document
*/
router.patch(
    "/:id/archive",
    protect,
    authorize("admin"),
    knowledgeController.archiveKnowledgeDocument
);


/*
    PATCH /api/knowledge/:id/restore
    Restore knowledge document
*/
router.patch(
    "/:id/restore",
    protect,
    authorize("admin"),
    knowledgeController.restoreKnowledgeDocument
);


//RAG Indexing

/*
    PATCH /api/knowledge/:id/index
    Mark document as indexed
*/
router.patch(
    "/:id/index",
    protect,
    authorize("admin"),
    knowledgeController.markAsIndexed
);


/*
    PATCH /api/knowledge/:id/unindex
    Mark document as not indexed
*/
router.patch(
    "/:id/unindex",
    protect,
    authorize("admin"),
    knowledgeController.markAsNotIndexed
);


//Display Order

/*
    PATCH /api/knowledge/:id/display-order
    Update document display order
*/
router.patch(
    "/:id/display-order",
    protect,
    authorize("admin"),
    knowledgeController.updateDocumentDisplayOrder
);


//Export Router

module.exports = router;