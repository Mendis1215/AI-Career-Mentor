const resourceService = require("../services/resourceService");


//Create Resource

const createResource = async (req, res, next) => {

    try {

        const resource =
            await resourceService.createResource(
                req.body,
                req.user._id
            );

        return res.status(201).json({

            success: true,

            message:
                "Learning resource created successfully.",

            data: resource

        });

    } catch (error) {

        next(error);

    }

};


//Get All Resources

const getAllResources = async (req, res, next) => {

    try {

        const result =
            await resourceService.getAllResources(
                req.query
            );

        return res.status(200).json({

            success: true,

            message:
                "Learning resources retrieved successfully.",

            data: result

        });

    } catch (error) {

        next(error);

    }

};


//Get Resource By ID

const getResourceById = async (req, res, next) => {

    try {

        const resource =
            await resourceService.getResourceById(
                req.params.id
            );

        return res.status(200).json({

            success: true,

            message:
                "Learning resource retrieved successfully.",

            data: resource

        });

    } catch (error) {

        next(error);

    }

};


//Get Resource By Slug

const getResourceBySlug = async (req, res, next) => {

    try {

        const resource =
            await resourceService.getResourceBySlug(
                req.params.slug
            );

        return res.status(200).json({

            success: true,

            message:
                "Learning resource retrieved successfully.",

            data: resource

        });

    } catch (error) {

        next(error);

    }

};


//Update Resource

const updateResource = async (req, res, next) => {

    try {

        const resource =
            await resourceService.updateResource(

                req.params.id,

                req.body,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Learning resource updated successfully.",

            data: resource

        });

    } catch (error) {

        next(error);

    }

};


//Delete Resource

const deleteResource = async (req, res, next) => {

    try {

        const result =
            await resourceService.deleteResource(
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


//Publish Resource

const publishResource = async (req, res, next) => {

    try {

        const resource =
            await resourceService.publishResource(

                req.params.id,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Learning resource published successfully.",

            data: resource

        });

    } catch (error) {

        next(error);

    }

};


//Unpublish Resource

const unpublishResource = async (req, res, next) => {

    try {

        const resource =
            await resourceService.unpublishResource(

                req.params.id,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Learning resource unpublished successfully.",

            data: resource

        });

    } catch (error) {

        next(error);

    }

};


//Archive Resource

const archiveResource = async (req, res, next) => {

    try {

        const resource =
            await resourceService.archiveResource(

                req.params.id,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Learning resource archived successfully.",

            data: resource

        });

    } catch (error) {

        next(error);

    }

};


//Archive Resource

const restoreResource = async (req, res, next) => {

    try {

        const resource =
            await resourceService.restoreResource(

                req.params.id,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Learning resource restored successfully.",

            data: resource

        });

    } catch (error) {

        next(error);

    }

};


//Get Resources By Career

const getResourcesByCareer = async (
    req,
    res,
    next
) => {

    try {

        const resources =
            await resourceService.getResourcesByCareer(

                req.params.careerId,

                req.query

            );

        return res.status(200).json({

            success: true,

            message:
                "Career learning resources retrieved successfully.",

            data: resources

        });

    } catch (error) {

        next(error);

    }

};


//Get Resources By Skill

const getResourcesBySkill = async (
    req,
    res,
    next
) => {

    try {

        const resources =
            await resourceService.getResourcesBySkill(

                req.params.skillId,

                req.query

            );

        return res.status(200).json({

            success: true,

            message:
                "Skill-related learning resources retrieved successfully.",

            data: resources

        });

    } catch (error) {

        next(error);

    }

};


//Get Published Resources

const getPublishedResources = async (
    req,
    res,
    next
) => {

    try {

        const resources =
            await resourceService.getPublishedResources(
                req.query
            );

        return res.status(200).json({

            success: true,

            message:
                "Published learning resources retrieved successfully.",

            data: resources

        });

    } catch (error) {

        next(error);

    }

};


//Update Resource Display Order

const updateResourceDisplayOrder = async (
    req,
    res,
    next
) => {

    try {

        const resource =
            await resourceService.updateResourceDisplayOrder(

                req.params.id,

                req.body.displayOrder,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Resource display order updated successfully.",

            data: resource

        });

    } catch (error) {

        next(error);

    }

};


//Export Controllers

module.exports = {

    createResource,

    getAllResources,

    getResourceById,

    getResourceBySlug,

    updateResource,

    deleteResource,

    publishResource,

    unpublishResource,

    archiveResource,

    restoreResource,

    getResourcesByCareer,

    getResourcesBySkill,

    getPublishedResources,

    updateResourceDisplayOrder

};