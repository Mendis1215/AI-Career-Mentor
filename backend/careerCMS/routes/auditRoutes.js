const express = require("express");

const router = express.Router();

const auditController = require("../controllers/auditController");

const {
    protect,
    authorize
} = require("../../shared/middleware/auth");


//Audit Log Routes

//Audit logs contain administrative activity, so all audit
//endpoints are protected and restricted to administrators.



//Get Audit Logs

/*
    GET /api/audit-logs

    Get audit logs with optional filters.

    Example:
    /api/audit-logs?page=1&limit=20
*/
router.get(
    "/",
    protect,
    authorize("admin"),
    auditController.getAuditLogs
);


//Audit Statistics

/*
    GET /api/audit-logs/statistics

    Get audit activity statistics.
*/
router.get(
    "/statistics",
    protect,
    authorize("admin"),
    auditController.getAuditStatistics
);


//Entity Audit History

/*
    GET /api/audit-logs/entity/:entityType/:entityId

    Get the complete audit history of a specific entity.

    Example:
    /api/audit-logs/entity/Career/64abc123...
*/
router.get(
    "/entity/:entityType/:entityId",
    protect,
    authorize("admin"),
    auditController.getEntityAuditHistory
);


//User Audit History

/*
    GET /api/audit-logs/user/:userId

    Get actions performed by a specific administrator.
*/
router.get(
    "/user/:userId",
    protect,
    authorize("admin"),
    auditController.getUserAuditHistory
);


//Get Audit Log By ID

/*
    GET /api/audit-logs/:id

    Get one audit log.
*/
router.get(
    "/:id",
    protect,
    authorize("admin"),
    auditController.getAuditLogById
);


//Create Audit Log

/*
    POST /api/audit-logs

    Normally audit logs should be generated internally by
    services rather than manually created by the frontend.

    This endpoint is protected for administrative/system use.
*/
router.post(
    "/",
    protect,
    authorize("admin"),
    auditController.createAuditLog
);


//Export Router

module.exports = router;