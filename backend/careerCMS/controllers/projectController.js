const projectService = require("../services/projectService");


//Create Project

const createProject = async (req, res, next) => {

    try {

        const project =
            await projectService.createProject(
                req.body,
                req.user._id
            );

        return res.status(201).json({

            success: true,

            message:
                "Project created successfully.",

            data: project

        });

    } catch (error) {

        next(error);

    }

};


//Get All Projects

const getAllProjects = async (req, res, next) => {

    try {

        const result =
            await projectService.getAllProjects(
                req.query
            );

        return res.status(200).json({

            success: true,

            message:
                "Projects retrieved successfully.",

            data: result

        });

    } catch (error) {

        next(error);

    }

};


//Get Project By ID

const getProjectById = async (req, res, next) => {

    try {

        const project =
            await projectService.getProjectById(
                req.params.id
            );

        return res.status(200).json({

            success: true,

            message:
                "Project retrieved successfully.",

            data: project

        });

    } catch (error) {

        next(error);

    }

};


//Get Project By Slug

const getProjectBySlug = async (req, res, next) => {

    try {

        const project =
            await projectService.getProjectBySlug(
                req.params.slug
            );

        return res.status(200).json({

            success: true,

            message:
                "Project retrieved successfully.",

            data: project

        });

    } catch (error) {

        next(error);

    }

};


//Update Project

const updateProject = async (req, res, next) => {

    try {

        const project =
            await projectService.updateProject(

                req.params.id,

                req.body,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Project updated successfully.",

            data: project

        });

    } catch (error) {

        next(error);

    }

};


//Delete Project

const deleteProject = async (req, res, next) => {

    try {

        const result =
            await projectService.deleteProject(
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


//Publish Project

const publishProject = async (req, res, next) => {

    try {

        const project =
            await projectService.publishProject(

                req.params.id,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Project published successfully.",

            data: project

        });

    } catch (error) {

        next(error);

    }

};


//Unpublish Project

const unpublishProject = async (req, res, next) => {

    try {

        const project =
            await projectService.unpublishProject(

                req.params.id,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Project unpublished successfully.",

            data: project

        });

    } catch (error) {

        next(error);

    }

};


//Archive Project

const archiveProject = async (req, res, next) => {

    try {

        const project =
            await projectService.archiveProject(

                req.params.id,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Project archived successfully.",

            data: project

        });

    } catch (error) {

        next(error);

    }

};


//Restore Project

const restoreProject = async (req, res, next) => {

    try {

        const project =
            await projectService.restoreProject(

                req.params.id,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Project restored successfully.",

            data: project

        });

    } catch (error) {

        next(error);

    }

};


//Get Projects By Career

const getProjectsByCareer = async (req, res, next) => {

    try {

        const projects =
            await projectService.getProjectsByCareer(

                req.params.careerId,

                req.query

            );

        return res.status(200).json({

            success: true,

            message:
                "Career projects retrieved successfully.",

            data: projects

        });

    } catch (error) {

        next(error);

    }

};


//Get Projects By Skill

const getProjectsBySkill = async (req, res, next) => {

    try {

        const projects =
            await projectService.getProjectsBySkill(

                req.params.skillId,

                req.query

            );

        return res.status(200).json({

            success: true,

            message:
                "Skill-related projects retrieved successfully.",

            data: projects

        });

    } catch (error) {

        next(error);

    }

};


//Get Published Projects

const getPublishedProjects = async (req, res, next) => {

    try {

        const projects =
            await projectService.getPublishedProjects(
                req.query
            );

        return res.status(200).json({

            success: true,

            message:
                "Published projects retrieved successfully.",

            data: projects

        });

    } catch (error) {

        next(error);

    }

};


//Update Project Display Order

const updateProjectDisplayOrder = async (
    req,
    res,
    next
) => {

    try {

        const project =
            await projectService.updateProjectDisplayOrder(

                req.params.id,

                req.body.displayOrder,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Project display order updated successfully.",

            data: project

        });

    } catch (error) {

        next(error);

    }

};


//Export Controllers

module.exports = {

    createProject,

    getAllProjects,

    getProjectById,

    getProjectBySlug,

    updateProject,

    deleteProject,

    publishProject,

    unpublishProject,

    archiveProject,

    restoreProject,

    getProjectsByCareer,

    getProjectsBySkill,

    getPublishedProjects,

    updateProjectDisplayOrder

};