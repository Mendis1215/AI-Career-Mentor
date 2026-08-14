//Career CMS Publishing Utilities


//Publishing Status

const PUBLISHING_STATUS = {
    DRAFT: "draft",
    PUBLISHED: "published",
    ARCHIVED: "archived"
};


//Check Valid Publishing Status

const isValidPublishingStatus = (status) => {

    return Object.values(PUBLISHING_STATUS)
        .includes(status);
};


//Check Draft Status

const isDraft = (document) => {

    return document?.status === PUBLISHING_STATUS.DRAFT;
};


//Check Published Status

const isPublished = (document) => {

    return document?.status === PUBLISHING_STATUS.PUBLISHED;
};


//Check Archived Status

const isArchived = (document) => {

    return document?.status === PUBLISHING_STATUS.ARCHIVED;
};


//Publish Document

//Changes a document from draft/archived to published.

const publishDocument = (document) => {

    if (!document) {
        throw new Error(
            "Document is required for publishing."
        );
    }

    document.status =
        PUBLISHING_STATUS.PUBLISHED;

    document.isPublished = true;

    document.publishedAt = new Date();

    return document;
};


//Unpublish Document

//Changes a published document back to draft.

const unpublishDocument = (document) => {

    if (!document) {
        throw new Error(
            "Document is required for unpublishing."
        );
    }

    document.status =
        PUBLISHING_STATUS.DRAFT;

    document.isPublished = false;

    return document;
};


//Archive Document

const archiveDocument = (document) => {

    if (!document) {
        throw new Error(
            "Document is required for archiving."
        );
    }

    document.status =
        PUBLISHING_STATUS.ARCHIVED;

    document.isPublished = false;

    document.archivedAt = new Date();

    return document;
};


//Restore Archived Document

//Restores an archived document to draft.

const restoreDocument = (document) => {

    if (!document) {
        throw new Error(
            "Document is required for restoration."
        );
    }

    document.status =
        PUBLISHING_STATUS.DRAFT;

    document.isPublished = false;

    document.archivedAt = null;

    return document;
};


//Get Publishing Status

const getPublishingStatus = (document) => {

    if (!document) {
        return PUBLISHING_STATUS.DRAFT;
    }

    if (document.status) {
        return document.status;
    }

    if (document.isPublished === true) {
        return PUBLISHING_STATUS.PUBLISHED;
    }

    return PUBLISHING_STATUS.DRAFT;
};


//Build Published Query

//Used when students should only see published content.

const buildPublishedQuery = () => {

    return {
        $or: [
            {
                status:
                    PUBLISHING_STATUS.PUBLISHED
            },
            {
                isPublished: true
            }
        ]
    };
};


//Build Draft Query

const buildDraftQuery = () => {

    return {
        $and: [
            {
                $or: [
                    {
                        status:
                            PUBLISHING_STATUS.DRAFT
                    },
                    {
                        status: {
                            $exists: false
                        }
                    }
                ]
            },
            {
                $or: [
                    {
                        isPublished: false
                    },
                    {
                        isPublished: {
                            $exists: false
                        }
                    }
                ]
            }
        ]
    };
};


//Build Archived Query

const buildArchivedQuery = () => {

    return {
        status:
            PUBLISHING_STATUS.ARCHIVED
    };
};


//Get Publishing Metadata

const getPublishingMetadata = (document) => {

    if (!document) {
        return {
            status: PUBLISHING_STATUS.DRAFT,
            isPublished: false,
            publishedAt: null,
            archivedAt: null
        };
    }

    return {
        status: getPublishingStatus(document),

        isPublished:
            document.isPublished === true,

        publishedAt:
            document.publishedAt || null,

        archivedAt:
            document.archivedAt || null
    };
};


//Validate Publishing Transition

//Defines which publishing status changes are allowed.


const canChangePublishingStatus = (
    currentStatus,
    newStatus
) => {

    if (
        !isValidPublishingStatus(currentStatus) ||
        !isValidPublishingStatus(newStatus)
    ) {
        return false;
    }

    const allowedTransitions = {

        draft: [
            PUBLISHING_STATUS.PUBLISHED,
            PUBLISHING_STATUS.ARCHIVED
        ],

        published: [
            PUBLISHING_STATUS.DRAFT,
            PUBLISHING_STATUS.ARCHIVED
        ],

        archived: [
            PUBLISHING_STATUS.DRAFT
        ]

    };

    return allowedTransitions[currentStatus]
        .includes(newStatus);
};


//Export Utilities

module.exports = {

    PUBLISHING_STATUS,

    isValidPublishingStatus,

    isDraft,
    isPublished,
    isArchived,

    publishDocument,
    unpublishDocument,

    archiveDocument,
    restoreDocument,

    getPublishingStatus,

    buildPublishedQuery,
    buildDraftQuery,
    buildArchivedQuery,

    getPublishingMetadata,

    canChangePublishingStatus

};