const certificationService = require("../services/certificationService");


//Create Certification

const createCertification = async (req, res, next) => {

    try {

        const certification =
            await certificationService.createCertification(
                req.body,
                req.user._id
            );

        return res.status(201).json({

            success: true,

            message:
                "Certification created successfully.",

            data: certification

        });

    } catch (error) {

        next(error);

    }

};


//Get All Certifications

const getAllCertifications = async (req, res, next) => {

    try {

        const result =
            await certificationService.getAllCertifications(
                req.query
            );

        return res.status(200).json({

            success: true,

            message:
                "Certifications retrieved successfully.",

            data: result

        });

    } catch (error) {

        next(error);

    }

};


//Get Certification By ID

const getCertificationById = async (req, res, next) => {

    try {

        const certification =
            await certificationService.getCertificationById(
                req.params.id
            );

        return res.status(200).json({

            success: true,

            message:
                "Certification retrieved successfully.",

            data: certification

        });

    } catch (error) {

        next(error);

    }

};


//Get Certification By Slug

const getCertificationBySlug = async (req, res, next) => {

    try {

        const certification =
            await certificationService.getCertificationBySlug(
                req.params.slug
            );

        return res.status(200).json({

            success: true,

            message:
                "Certification retrieved successfully.",

            data: certification

        });

    } catch (error) {

        next(error);

    }

};


//Update Certification

const updateCertification = async (req, res, next) => {

    try {

        const certification =
            await certificationService.updateCertification(

                req.params.id,

                req.body,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Certification updated successfully.",

            data: certification

        });

    } catch (error) {

        next(error);

    }

};


//Delete Certification

const deleteCertification = async (req, res, next) => {

    try {

        const result =
            await certificationService.deleteCertification(
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


//Publish Certification

const publishCertification = async (req, res, next) => {

    try {

        const certification =
            await certificationService.publishCertification(

                req.params.id,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Certification published successfully.",

            data: certification

        });

    } catch (error) {

        next(error);

    }

};


//Unpublish Certification

const unpublishCertification = async (req, res, next) => {

    try {

        const certification =
            await certificationService.unpublishCertification(

                req.params.id,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Certification unpublished successfully.",

            data: certification

        });

    } catch (error) {

        next(error);

    }

};


//Archive Certification

const archiveCertification = async (req, res, next) => {

    try {

        const certification =
            await certificationService.archiveCertification(

                req.params.id,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Certification archived successfully.",

            data: certification

        });

    } catch (error) {

        next(error);

    }

};


//Restore Certification

const restoreCertification = async (req, res, next) => {

    try {

        const certification =
            await certificationService.restoreCertification(

                req.params.id,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Certification restored successfully.",

            data: certification

        });

    } catch (error) {

        next(error);

    }

};


//Get Certifications By Career

const getCertificationsByCareer = async (
    req,
    res,
    next
) => {

    try {

        const certifications =
            await certificationService.getCertificationsByCareer(

                req.params.careerId,

                req.query

            );

        return res.status(200).json({

            success: true,

            message:
                "Career certifications retrieved successfully.",

            data: certifications

        });

    } catch (error) {

        next(error);

    }

};


//Get Certifications By Skill

const getCertificationsBySkill = async (
    req,
    res,
    next
) => {

    try {

        const certifications =
            await certificationService.getCertificationsBySkill(

                req.params.skillId,

                req.query

            );

        return res.status(200).json({

            success: true,

            message:
                "Skill-related certifications retrieved successfully.",

            data: certifications

        });

    } catch (error) {

        next(error);

    }

};


//Get Published Certifications

const getPublishedCertifications = async (
    req,
    res,
    next
) => {

    try {

        const certifications =
            await certificationService.getPublishedCertifications(
                req.query
            );

        return res.status(200).json({

            success: true,

            message:
                "Published certifications retrieved successfully.",

            data: certifications

        });

    } catch (error) {

        next(error);

    }

};


//Update Certification Display Order

const updateCertificationDisplayOrder = async (
    req,
    res,
    next
) => {

    try {

        const certification =
            await certificationService.updateCertificationDisplayOrder(

                req.params.id,

                req.body.displayOrder,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Certification display order updated successfully.",

            data: certification

        });

    } catch (error) {

        next(error);

    }

};


//Export Controllers

module.exports = {

    createCertification,

    getAllCertifications,

    getCertificationById,

    getCertificationBySlug,

    updateCertification,

    deleteCertification,

    publishCertification,

    unpublishCertification,

    archiveCertification,

    restoreCertification,

    getCertificationsByCareer,

    getCertificationsBySkill,

    getPublishedCertifications,

    updateCertificationDisplayOrder

};