const auditService = require("../services/auditService");


//Create Audit Log

const createAuditLog = async (req, res, next) => {

    try {

        const auditLog =
            await auditService.createAuditLog(
                req.body,
                req.user._id
            );

        return res.status(201).json({

            success: true,

            message:
                "Audit log created successfully.",

            data: auditLog

        });

    } catch (error) {

        next(error);

    }

};


//Get Audit Logs

const getAuditLogs = async (req, res, next) => {

    try {

        const result =
            await auditService.getAuditLogs(
                req.query
            );

        return res.status(200).json({

            success: true,

            message:
                "Audit logs retrieved successfully.",

            data: result

        });

    } catch (error) {

        next(error);

    }

};


//Get Audit Log By ID

const getAuditLogById = async (req, res, next) => {

    try {

        const auditLog =
            await auditService.getAuditLogById(
                req.params.id
            );

        return res.status(200).json({

            success: true,

            message:
                "Audit log retrieved successfully.",

            data: auditLog

        });

    } catch (error) {

        next(error);

    }

};


//Get Entity Audit History

const getEntityAuditHistory = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await auditService.getEntityAuditHistory(

                req.params.entityType,

                req.params.entityId,

                req.query

            );

        return res.status(200).json({

            success: true,

            message:
                "Entity audit history retrieved successfully.",

            data: result

        });

    } catch (error) {

        next(error);

    }

};


//Get User Audit History

const getUserAuditHistory = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await auditService.getUserAuditHistory(

                req.params.userId,

                req.query

            );

        return res.status(200).json({

            success: true,

            message:
                "User audit history retrieved successfully.",

            data: result

        });

    } catch (error) {

        next(error);

    }

};


//Get Audit Statistics

const getAuditStatistics = async (
    req,
    res,
    next
) => {

    try {

        const statistics =
            await auditService.getAuditStatistics(
                req.query
            );

        return res.status(200).json({

            success: true,

            message:
                "Audit statistics retrieved successfully.",

            data: statistics

        });

    } catch (error) {

        next(error);

    }

};


//Export Controllers

module.exports = {

    createAuditLog,

    getAuditLogs,

    getAuditLogById,

    getEntityAuditHistory,

    getUserAuditHistory,

    getAuditStatistics

};