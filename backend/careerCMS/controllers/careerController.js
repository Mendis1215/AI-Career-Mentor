const careerService = require("../services/careerService");


//Create Career

const createCareer = async (req, res, next) => {

    try {

        const career =
            await careerService.createCareer(
                req.body,
                req.user._id
            );

        return res.status(201).json({

            success: true,

            message:
                "Career created successfully.",

            data: career

        });

    } catch (error) {

        next(error);

    }

};


//Get All Careers

const getAllCareers = async (req, res, next) => {

    try {

        const result =
            await careerService.getAllCareers(
                req.query
            );

        return res.status(200).json({

            success: true,

            message:
                "Careers retrieved successfully.",

            data: result

        });

    } catch (error) {

        next(error);

    }

};


//Get Career By ID

const getCareerById = async (req, res, next) => {

    try {

        const career =
            await careerService.getCareerById(
                req.params.id
            );

        return res.status(200).json({

            success: true,

            message:
                "Career retrieved successfully.",

            data: career

        });

    } catch (error) {

        next(error);

    }

};


//Get Career By Slug

const getCareerBySlug = async (req, res, next) => {

    try {

        const career =
            await careerService.getCareerBySlug(
                req.params.slug
            );

        return res.status(200).json({

            success: true,

            message:
                "Career retrieved successfully.",

            data: career

        });

    } catch (error) {

        next(error);

    }

};


//Update Career

const updateCareer = async (req, res, next) => {

    try {

        const career =
            await careerService.updateCareer(
                req.params.id,
                req.body,
                req.user._id
            );

        return res.status(200).json({

            success: true,

            message:
                "Career updated successfully.",

            data: career

        });

    } catch (error) {

        next(error);

    }

};


//Delete Career

const deleteCareer = async (req, res, next) => {

    try {

        const result =
            await careerService.deleteCareer(
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


//Publish Career

const publishCareer = async (req, res, next) => {

    try {

        const career =
            await careerService.publishCareer(
                req.params.id,
                req.user._id
            );

        return res.status(200).json({

            success: true,

            message:
                "Career published successfully.",

            data: career

        });

    } catch (error) {

        next(error);

    }

};


//Unpublish Career

const unpublishCareer = async (req, res, next) => {

    try {

        const career =
            await careerService.unpublishCareer(
                req.params.id,
                req.user._id
            );

        return res.status(200).json({

            success: true,

            message:
                "Career unpublished successfully.",

            data: career

        });

    } catch (error) {

        next(error);

    }

};


//Archive Career

const archiveCareer = async (req, res, next) => {

    try {

        const career =
            await careerService.archiveCareer(
                req.params.id,
                req.user._id
            );

        return res.status(200).json({

            success: true,

            message:
                "Career archived successfully.",

            data: career

        });

    } catch (error) {

        next(error);

    }

};


//Restore Career

const restoreCareer = async (req, res, next) => {

    try {

        const career =
            await careerService.restoreCareer(
                req.params.id,
                req.user._id
            );

        return res.status(200).json({

            success: true,

            message:
                "Career restored successfully.",

            data: career

        });

    } catch (error) {

        next(error);

    }

};


//Get Published Careers

const getPublishedCareers = async (req, res, next) => {

    try {

        const careers =
            await careerService.getPublishedCareers(
                req.query
            );

        return res.status(200).json({

            success: true,

            message:
                "Published careers retrieved successfully.",

            data: careers

        });

    } catch (error) {

        next(error);

    }

};


//Update Career Display Order

const updateCareerDisplayOrder = async (
    req,
    res,
    next
) => {

    try {

        const career =
            await careerService.updateCareerDisplayOrder(

                req.params.id,

                req.body.displayOrder,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Career display order updated successfully.",

            data: career

        });

    } catch (error) {

        next(error);

    }

};


//Export Controllers

module.exports = {

    createCareer,

    getAllCareers,

    getCareerById,

    getCareerBySlug,

    updateCareer,

    deleteCareer,

    publishCareer,

    unpublishCareer,

    archiveCareer,

    restoreCareer,

    getPublishedCareers,

    updateCareerDisplayOrder

};