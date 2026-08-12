const Career = require("../models/Career");
const Skill = require("../models/Skill");
const CareerSkill = require("../models/CareerSkill");
const Roadmap = require("../models/Roadmap");
const RoadmapStage = require("../models/RoadmapStage");
const Project = require("../models/Project");
const Certification = require("../models/Certification");
const LearningResource = require("../models/LearningResource");
const KnowledgeDocument = require("../models/KnowledgeDocument");
const AuditLog = require("../models/AuditLog");


//Get Dashboard Statistics

const getDashboardStatistics = async () => {

    const [
        totalCareers,
        publishedCareers,

        totalSkills,
        totalCareerSkills,

        totalRoadmaps,
        publishedRoadmaps,

        totalRoadmapStages,

        totalProjects,
        publishedProjects,

        totalCertifications,
        publishedCertifications,

        totalResources,
        publishedResources,

        totalKnowledgeDocuments,
        publishedKnowledgeDocuments,

        ragReadyDocuments,

        totalAuditLogs
    ] = await Promise.all([

        Career.countDocuments(),
        Career.countDocuments({
            status: "published"
        }),

        Skill.countDocuments(),
        CareerSkill.countDocuments(),

        Roadmap.countDocuments(),
        Roadmap.countDocuments({
            status: "published"
        }),

        RoadmapStage.countDocuments(),

        Project.countDocuments(),
        Project.countDocuments({
            status: "published"
        }),

        Certification.countDocuments(),
        Certification.countDocuments({
            status: "published"
        }),

        LearningResource.countDocuments(),
        LearningResource.countDocuments({
            status: "published"
        }),

        KnowledgeDocument.countDocuments(),
        KnowledgeDocument.countDocuments({
            status: "published"
        }),

        KnowledgeDocument.countDocuments({
            availableForRAG: true
        }),

        AuditLog.countDocuments()

    ]);


    return {

        careers: {
            total: totalCareers,
            published: publishedCareers,
            draft: totalCareers - publishedCareers
        },

        skills: {
            total: totalSkills,
            careerSkillMappings: totalCareerSkills
        },

        roadmaps: {
            total: totalRoadmaps,
            published: publishedRoadmaps,
            draft: totalRoadmaps - publishedRoadmaps
        },

        roadmapStages: {
            total: totalRoadmapStages
        },

        projects: {
            total: totalProjects,
            published: publishedProjects,
            draft: totalProjects - publishedProjects
        },

        certifications: {
            total: totalCertifications,
            published: publishedCertifications,
            draft: totalCertifications - publishedCertifications
        },

        learningResources: {
            total: totalResources,
            published: publishedResources,
            draft: totalResources - publishedResources
        },

        knowledgeDocuments: {
            total: totalKnowledgeDocuments,
            published: publishedKnowledgeDocuments,
            ragReady: ragReadyDocuments
        },

        auditLogs: {
            total: totalAuditLogs
        }

    };

};


//Get Recent Audit Logs

const getRecentAuditLogs = async (limit = 10) => {

    const safeLimit = Math.min(
        Math.max(Number(limit) || 10, 1),
        50
    );


    const logs = await AuditLog
        .find()
        .populate(
            "user",
            "name email role"
        )
        .sort({
            createdAt: -1
        })
        .limit(safeLimit)
        .lean();


    return logs;

};


//Get Recent Knowledge Documents

const getRecentKnowledgeDocuments = async (limit = 5) => {

    const safeLimit = Math.min(
        Math.max(Number(limit) || 5, 1),
        20
    );


    const documents = await KnowledgeDocument
        .find()
        .populate(
            "careers",
            "title"
        )
        .populate(
            "skills",
            "name"
        )
        .sort({
            createdAt: -1
        })
        .limit(safeLimit)
        .lean();


    return documents;

};


//Get Published Content Summary

const getPublishedContentSummary = async () => {

    const [
        careers,
        roadmaps,
        projects,
        certifications,
        resources,
        knowledgeDocuments
    ] = await Promise.all([

        Career.countDocuments({
            status: "published"
        }),

        Roadmap.countDocuments({
            status: "published"
        }),

        Project.countDocuments({
            status: "published"
        }),

        Certification.countDocuments({
            status: "published"
        }),

        LearningResource.countDocuments({
            status: "published"
        }),

        KnowledgeDocument.countDocuments({
            status: "published"
        })

    ]);


    return {

        careers,
        roadmaps,
        projects,
        certifications,
        learningResources: resources,
        knowledgeDocuments

    };

};


//Get Knowledge / RAG Statistics

const getKnowledgeStatistics = async () => {

    const [
        total,
        pendingProcessing,
        processing,
        processed,
        failedProcessing,
        pendingEmbedding,
        embedding,
        embedded,
        failedEmbedding,
        availableForRAG
    ] = await Promise.all([

        KnowledgeDocument.countDocuments(),

        KnowledgeDocument.countDocuments({
            processingStatus: "pending"
        }),

        KnowledgeDocument.countDocuments({
            processingStatus: "processing"
        }),

        KnowledgeDocument.countDocuments({
            processingStatus: "completed"
        }),

        KnowledgeDocument.countDocuments({
            processingStatus: "failed"
        }),

        KnowledgeDocument.countDocuments({
            embeddingStatus: "pending"
        }),

        KnowledgeDocument.countDocuments({
            embeddingStatus: "processing"
        }),

        KnowledgeDocument.countDocuments({
            embeddingStatus: "completed"
        }),

        KnowledgeDocument.countDocuments({
            embeddingStatus: "failed"
        }),

        KnowledgeDocument.countDocuments({
            availableForRAG: true
        })

    ]);


    return {

        total,

        processing: {
            pending: pendingProcessing,
            processing,
            completed: processed,
            failed: failedProcessing
        },

        embeddings: {
            pending: pendingEmbedding,
            processing: embedding,
            completed: embedded,
            failed: failedEmbedding
        },

        availableForRAG

    };

};


//Get Full Dashboard

const getDashboard = async () => {

    const [
        statistics,
        recentAuditLogs,
        recentKnowledgeDocuments,
        publishedContent,
        knowledgeStatistics
    ] = await Promise.all([

        getDashboardStatistics(),

        getRecentAuditLogs(10),

        getRecentKnowledgeDocuments(5),

        getPublishedContentSummary(),

        getKnowledgeStatistics()

    ]);


    return {

        statistics,

        publishedContent,

        knowledgeStatistics,

        recentAuditLogs,

        recentKnowledgeDocuments

    };

};


//Export Services

module.exports = {

    getDashboardStatistics,

    getRecentAuditLogs,

    getRecentKnowledgeDocuments,

    getPublishedContentSummary,

    getKnowledgeStatistics,

    getDashboard

};