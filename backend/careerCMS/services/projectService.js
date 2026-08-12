const mongoose = require("mongoose");

const Project = require("../models/Project");
const Career = require("../models/Career");
const Skill = require("../models/Skill");

const ApiError = require("../../shared/utils/ApiError");


//Validate ObjectId

const validateObjectId = (id, fieldName) => {

    if (!mongoose.isValidObjectId(id)) {

        throw new ApiError(
            400,
            `Invalid ${fieldName}.`
        );

    }

};


//Check Career Exists

const checkCareerExists = async (careerId) => {

    const career = await Career.findById(
        careerId
    );

    if (!career) {

        throw new ApiError(
            404,
            "Career not found."
        );

    }

    return career;

};


//Check Skill Exists

const checkSkillExists = async (skillId) => {

    const skill = await Skill.findById(
        skillId
    );

    if (!skill) {

        throw new ApiError(
            404,
            "Skill not found."
        );

    }

    return skill;

};


//Validate Skill Array

const validateSkillArray = async (
    skills
) => {

    if (!skills) {
        return;
    }


    if (!Array.isArray(skills)) {

        throw new ApiError(
            400,
            "Skills must be provided as an array."
        );

    }


    for (const skillId of skills) {

        validateObjectId(
            skillId,
            "skill ID"
        );

        await checkSkillExists(
            skillId
        );

    }

};


//Create Project

const createProject = async (
    projectData,
    userId
) => {

    if (!userId) {

        throw new ApiError(
            401,
            "User authentication is required."
        );

    }


    const {
        career,
        skills,
        slug,
        name,
        title
    } = projectData;


    //Validate Career

    if (career) {

        validateObjectId(
            career,
            "career ID"
        );

        await checkCareerExists(
            career
        );

    }


    //Validate Skills

    await validateSkillArray(
        skills
    );


    //Duplicate Slug

    if (slug) {

        const existingSlug =
            await Project.findOne({
                slug
            });


        if (existingSlug) {

            throw new ApiError(
                409,
                "A project with the same slug already exists."
            );

        }

    }


    //Duplicate Name

    if (name || title) {

        const duplicateFilter = {};


        if (career) {

            duplicateFilter.career =
                career;

        }


        duplicateFilter.$or = [];


        if (name) {

            duplicateFilter.$or.push({
                name
            });

        }


        if (title) {

            duplicateFilter.$or.push({
                title
            });

        }


        const existingProject =
            await Project.findOne(
                duplicateFilter
            );


        if (existingProject) {

            throw new ApiError(
                409,
                "A project with the same name or title already exists."
            );

        }

    }


    //Create Project

    const project =
        await Project.create({

            ...projectData,

            createdBy: userId,

            updatedBy: userId

        });


    return project;

};


//Get All Projects

const getAllProjects = async (
    options = {}
) => {

    const {
        page = 1,
        limit = 10,
        career,
        status,
        difficulty,
        category,
        search,
        featured,
        sortBy = "createdAt",
        sortOrder = "desc"
    } = options;


    const currentPage = Math.max(
        Number(page) || 1,
        1
    );


    const perPage = Math.min(
        Math.max(Number(limit) || 10, 1),
        100
    );


    const filter = {};


    //Career Filter

    if (career) {

        validateObjectId(
            career,
            "career ID"
        );

        filter.career = career;

    }


    //Status Filter

    if (status) {

        filter.status = status;

    }


    //Difficulty Filter

    if (difficulty) {

        filter.difficulty =
            difficulty;

    }


    //Category Filter

    if (category) {

        filter.category =
            category;

    }


    //Featured Filter

    if (featured !== undefined) {

        filter.featured =
            featured === true ||
            featured === "true";

    }


    //Search

    if (
        search &&
        search.trim()
    ) {

        filter.$or = [

            {
                name: {
                    $regex: search.trim(),
                    $options: "i"
                }
            },

            {
                title: {
                    $regex: search.trim(),
                    $options: "i"
                }
            },

            {
                description: {
                    $regex: search.trim(),
                    $options: "i"
                }
            },

            {
                objective: {
                    $regex: search.trim(),
                    $options: "i"
                }
            }

        ];

    }


    //Sorting

    const allowedSortFields = [

        "name",
        "title",
        "difficulty",
        "category",
        "createdAt",
        "updatedAt",
        "displayOrder"

    ];


    const safeSortField =
        allowedSortFields.includes(
            sortBy
        )
            ? sortBy
            : "createdAt";


    const safeSortOrder =
        sortOrder === "asc"
            ? 1
            : -1;


    const skip =
        (currentPage - 1) * perPage;


    const [
        projects,
        total
    ] = await Promise.all([

        Project
            .find(filter)
            .populate(
                "career",
                "name slug status"
            )
            .populate(
                "skills",
                "name slug category level status"
            )
            .sort({
                [safeSortField]:
                    safeSortOrder
            })
            .skip(skip)
            .limit(perPage)
            .lean(),

        Project.countDocuments(
            filter
        )

    ]);


    return {

        projects,

        pagination: {

            page: currentPage,

            limit: perPage,

            total,

            totalPages:
                Math.ceil(
                    total / perPage
                ),

            hasNextPage:
                currentPage <
                Math.ceil(
                    total / perPage
                ),

            hasPreviousPage:
                currentPage > 1

        }

    };

};


//Get Project By ID

const getProjectById = async (
    projectId
) => {

    validateObjectId(
        projectId,
        "project ID"
    );


    const project =
        await Project
            .findById(projectId)
            .populate(
                "career",
                "name slug description status"
            )
            .populate(
                "skills",
                "name slug description category level status"
            )
            .lean();


    if (!project) {

        throw new ApiError(
            404,
            "Project not found."
        );

    }


    return project;

};


//Get Project By Slug

const getProjectBySlug = async (
    slug
) => {

    if (
        !slug ||
        !slug.trim()
    ) {

        throw new ApiError(
            400,
            "Project slug is required."
        );

    }


    const project =
        await Project
            .findOne({
                slug:
                    slug
                        .trim()
                        .toLowerCase()
            })
            .populate(
                "career",
                "name slug description status"
            )
            .populate(
                "skills",
                "name slug category level status"
            )
            .lean();


    if (!project) {

        throw new ApiError(
            404,
            "Project not found."
        );

    }


    return project;

};


//Update Project

const updateProject = async (
    projectId,
    updateData,
    userId
) => {

    validateObjectId(
        projectId,
        "project ID"
    );


    if (!userId) {

        throw new ApiError(
            401,
            "User authentication is required."
        );

    }


    const project =
        await Project.findById(
            projectId
        );


    if (!project) {

        throw new ApiError(
            404,
            "Project not found."
        );

    }


    //Validate Career

    if (updateData.career) {

        validateObjectId(
            updateData.career,
            "career ID"
        );

        await checkCareerExists(
            updateData.career
        );

    }


    //Validate Skills

    if (updateData.skills) {

        await validateSkillArray(
            updateData.skills
        );

    }


    //Slug Duplicate Check

    if (
        updateData.slug &&
        updateData.slug !== project.slug
    ) {

        const duplicateSlug =
            await Project.findOne({

                _id: {
                    $ne: projectId
                },

                slug: updateData.slug

            });


        if (duplicateSlug) {

            throw new ApiError(
                409,
                "A project with the same slug already exists."
            );

        }

    }


    //Update Fields

    Object.keys(updateData).forEach(
        (key) => {

            if (
                updateData[key] !== undefined
            ) {

                project[key] =
                    updateData[key];

            }

        }
    );


    project.updatedBy =
        userId;


    await project.save();


    return project;

};


//Publish Project

const publishProject = async (
    projectId,
    userId
) => {

    validateObjectId(
        projectId,
        "project ID"
    );


    const project =
        await Project.findById(
            projectId
        );


    if (!project) {

        throw new ApiError(
            404,
            "Project not found."
        );

    }


    //Required Content Validation

    if (
        !project.name &&
        !project.title
    ) {

        throw new ApiError(
            400,
            "Project must have a name or title before publishing."
        );

    }


    if (!project.description) {

        throw new ApiError(
            400,
            "Project must have a description before publishing."
        );

    }


    project.status =
        "published";

    project.updatedBy =
        userId;


    await project.save();


    return project;

};


//Unpublish Project

const unpublishProject = async (
    projectId,
    userId
) => {

    validateObjectId(
        projectId,
        "project ID"
    );


    const project =
        await Project.findById(
            projectId
        );


    if (!project) {

        throw new ApiError(
            404,
            "Project not found."
        );

    }


    project.status =
        "draft";

    project.updatedBy =
        userId;


    await project.save();


    return project;

};


//Archive Project

const archiveProject = async (
    projectId,
    userId
) => {

    validateObjectId(
        projectId,
        "project ID"
    );


    const project =
        await Project.findById(
            projectId
        );


    if (!project) {

        throw new ApiError(
            404,
            "Project not found."
        );

    }


    project.status =
        "archived";

    project.updatedBy =
        userId;


    await project.save();


    return project;

};


//Restore Project

const restoreProject = async (
    projectId,
    userId
) => {

    validateObjectId(
        projectId,
        "project ID"
    );


    const project =
        await Project.findById(
            projectId
        );


    if (!project) {

        throw new ApiError(
            404,
            "Project not found."
        );

    }


    project.status =
        "draft";

    project.updatedBy =
        userId;


    await project.save();


    return project;

};


//Delete Project

const deleteProject = async (
    projectId
) => {

    validateObjectId(
        projectId,
        "project ID"
    );


    const project =
        await Project.findById(
            projectId
        );


    if (!project) {

        throw new ApiError(
            404,
            "Project not found."
        );

    }


    await Project.findByIdAndDelete(
        projectId
    );


    return {

        message:
            "Project deleted successfully."

    };

};


//Get Projects By Career

const getProjectsByCareer = async (
    careerId,
    options = {}
) => {

    validateObjectId(
        careerId,
        "career ID"
    );


    await checkCareerExists(
        careerId
    );


    const filter = {

        career: careerId

    };


    if (options.status) {

        filter.status =
            options.status;

    }


    if (options.difficulty) {

        filter.difficulty =
            options.difficulty;

    }


    const projects =
        await Project
            .find(filter)
            .populate(
                "skills",
                "name slug category level"
            )
            .sort({

                displayOrder: 1,

                createdAt: 1

            })
            .lean();


    return projects;

};


//Get Projects By Skill

const getProjectsBySkill = async (
    skillId,
    options = {}
) => {

    validateObjectId(
        skillId,
        "skill ID"
    );


    await checkSkillExists(
        skillId
    );


    const filter = {

        skills: skillId

    };


    if (options.status) {

        filter.status =
            options.status;

    }


    if (options.difficulty) {

        filter.difficulty =
            options.difficulty;

    }


    const projects =
        await Project
            .find(filter)
            .populate(
                "career",
                "name slug status"
            )
            .populate(
                "skills",
                "name slug category level"
            )
            .sort({

                displayOrder: 1,

                createdAt: 1

            })
            .lean();


    return projects;

};


//Get Published Projects


const getPublishedProjects = async (
    options = {}
) => {

    const filter = {

        status: "published"

    };


    if (options.career) {

        validateObjectId(
            options.career,
            "career ID"
        );

        filter.career =
            options.career;

    }


    if (options.difficulty) {

        filter.difficulty =
            options.difficulty;

    }


    if (options.category) {

        filter.category =
            options.category;

    }


    const projects =
        await Project
            .find(filter)
            .populate(
                "career",
                "name slug"
            )
            .populate(
                "skills",
                "name slug category level"
            )
            .sort({

                displayOrder: 1,

                createdAt: 1

            })
            .lean();


    return projects;

};


//Update Project Display Order

const updateProjectDisplayOrder = async (
    projectId,
    displayOrder,
    userId
) => {

    validateObjectId(
        projectId,
        "project ID"
    );


    if (
        !Number.isInteger(
            Number(displayOrder)
        ) ||
        Number(displayOrder) < 0
    ) {

        throw new ApiError(
            400,
            "Display order must be a non-negative integer."
        );

    }


    const project =
        await Project.findById(
            projectId
        );


    if (!project) {

        throw new ApiError(
            404,
            "Project not found."
        );

    }


    project.displayOrder =
        Number(displayOrder);

    project.updatedBy =
        userId;


    await project.save();


    return project;

};


//Export Service Functions

module.exports = {

    createProject,

    getAllProjects,

    getProjectById,

    getProjectBySlug,

    updateProject,

    publishProject,

    unpublishProject,

    archiveProject,

    restoreProject,

    deleteProject,

    getProjectsByCareer,

    getProjectsBySkill,

    getPublishedProjects,

    updateProjectDisplayOrder

};