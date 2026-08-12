const dashboardService = require("../services/dashboardService");


//Get Dashboard Summary

const getDashboardSummary = async (req, res, next) => {

    try {

        const result =
            await dashboardService.getDashboardSummary();


        return res.status(200).json({

            success: true,

            message:
                "Dashboard summary retrieved successfully.",

            data: result

        });

    } catch (error) {

        next(error);

    }

};


//Get Content Statistics

const getContentStatistics = async (req, res, next) => {

    try {

        const result =
            await dashboardService.getContentStatistics();


        return res.status(200).json({

            success: true,

            message:
                "Content statistics retrieved successfully.",

            data: result

        });

    } catch (error) {

        next(error);

    }

};


//Get Recent Activities

const getRecentActivities = async (req, res, next) => {

    try {

        const {
            limit
        } = req.query;


        const result =
            await dashboardService.getRecentActivities({

                limit

            });


        return res.status(200).json({

            success: true,

            message:
                "Recent activities retrieved successfully.",

            data: result

        });

    } catch (error) {

        next(error);

    }

};


//Get Published Content Statistics

const getPublishedContentStatistics = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await dashboardService
                .getPublishedContentStatistics();


        return res.status(200).json({

            success: true,

            message:
                "Published content statistics retrieved successfully.",

            data: result

        });

    } catch (error) {

        next(error);

    }

};


//Get Draft Content Statistics

const getDraftContentStatistics = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await dashboardService
                .getDraftContentStatistics();


        return res.status(200).json({

            success: true,

            message:
                "Draft content statistics retrieved successfully.",

            data: result

        });

    } catch (error) {

        next(error);

    }

};


//Export Controllers

module.exports = {

    getDashboardSummary,

    getContentStatistics,

    getRecentActivities,

    getPublishedContentStatistics,

    getDraftContentStatistics

};