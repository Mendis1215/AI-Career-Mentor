const skillService = require("../services/skillService");


//Create Skill

const createSkill = async (req, res, next) => {

    try {

        const skill =
            await skillService.createSkill(
                req.body,
                req.user._id
            );

        return res.status(201).json({

            success: true,

            message:
                "Skill created successfully.",

            data: skill

        });

    } catch (error) {

        next(error);

    }

};


//Get All Skills

const getAllSkills = async (req, res, next) => {

    try {

        const result =
            await skillService.getAllSkills(
                req.query
            );

        return res.status(200).json({

            success: true,

            message:
                "Skills retrieved successfully.",

            data: result

        });

    } catch (error) {

        next(error);

    }

};


//Get Skill By ID

const getSkillById = async (req, res, next) => {

    try {

        const skill =
            await skillService.getSkillById(
                req.params.id
            );

        return res.status(200).json({

            success: true,

            message:
                "Skill retrieved successfully.",

            data: skill

        });

    } catch (error) {

        next(error);

    }

};


//Get Skill By Slug

const getSkillBySlug = async (req, res, next) => {

    try {

        const skill =
            await skillService.getSkillBySlug(
                req.params.slug
            );

        return res.status(200).json({

            success: true,

            message:
                "Skill retrieved successfully.",

            data: skill

        });

    } catch (error) {

        next(error);

    }

};


//Update Skill

const updateSkill = async (req, res, next) => {

    try {

        const skill =
            await skillService.updateSkill(

                req.params.id,

                req.body,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Skill updated successfully.",

            data: skill

        });

    } catch (error) {

        next(error);

    }

};


//Delete Skill

const deleteSkill = async (req, res, next) => {

    try {

        const result =
            await skillService.deleteSkill(
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


//Publish Skill

const publishSkill = async (req, res, next) => {

    try {

        const skill =
            await skillService.publishSkill(

                req.params.id,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Skill published successfully.",

            data: skill

        });

    } catch (error) {

        next(error);

    }

};


//Unpublish Skill

const unpublishSkill = async (req, res, next) => {

    try {

        const skill =
            await skillService.unpublishSkill(

                req.params.id,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Skill unpublished successfully.",

            data: skill

        });

    } catch (error) {

        next(error);

    }

};


//Archive Skill

const archiveSkill = async (req, res, next) => {

    try {

        const skill =
            await skillService.archiveSkill(

                req.params.id,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Skill archived successfully.",

            data: skill

        });

    } catch (error) {

        next(error);

    }

};


//Restore Skill

const restoreSkill = async (req, res, next) => {

    try {

        const skill =
            await skillService.restoreSkill(

                req.params.id,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Skill restored successfully.",

            data: skill

        });

    } catch (error) {

        next(error);

    }

};


//Get Skills By Category

const getSkillsByCategory = async (
    req,
    res,
    next
) => {

    try {

        const skills =
            await skillService.getSkillsByCategory(

                req.params.category,

                req.query

            );

        return res.status(200).json({

            success: true,

            message:
                "Skills retrieved successfully.",

            data: skills

        });

    } catch (error) {

        next(error);

    }

};


//Get Skills By Level

const getSkillsByLevel = async (
    req,
    res,
    next
) => {

    try {

        const skills =
            await skillService.getSkillsByLevel(

                req.params.level,

                req.query

            );

        return res.status(200).json({

            success: true,

            message:
                "Skills retrieved successfully.",

            data: skills

        });

    } catch (error) {

        next(error);

    }

};


//Get Published Skills

const getPublishedSkills = async (
    req,
    res,
    next
) => {

    try {

        const skills =
            await skillService.getPublishedSkills(
                req.query
            );

        return res.status(200).json({

            success: true,

            message:
                "Published skills retrieved successfully.",

            data: skills

        });

    } catch (error) {

        next(error);

    }

};


//Update Skill Display Order

const updateSkillDisplayOrder = async (
    req,
    res,
    next
) => {

    try {

        const skill =
            await skillService.updateSkillDisplayOrder(

                req.params.id,

                req.body.displayOrder,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Skill display order updated successfully.",

            data: skill

        });

    } catch (error) {

        next(error);

    }

};


//Export Controllers

module.exports = {

    createSkill,

    getAllSkills,

    getSkillById,

    getSkillBySlug,

    updateSkill,

    deleteSkill,

    publishSkill,

    unpublishSkill,

    archiveSkill,

    restoreSkill,

    getSkillsByCategory,

    getSkillsByLevel,

    getPublishedSkills,

    updateSkillDisplayOrder

};