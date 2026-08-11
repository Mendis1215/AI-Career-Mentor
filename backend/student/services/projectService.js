const StudentProfile = require("../models/StudentProfile");

const Career = require("../../careerCMS/models/Career");
const Project = require("../../careerCMS/models/Project");

const ApiError = require("../../shared/utils/ApiError");


//Utility: Normalize Text

const normalizeText = (value) => {

    if (!value) {
        return "";
    }

    return value
        .toString()
        .trim()
        .toLowerCase();

};


//Utility: Clamp Score

const clampScore = (value) => {

    return Math.min(
        Math.max(value, 0),
        100
    );

};


//Utility: Round Score

const roundScore = (value) => {

    return Number(
        value.toFixed(2)
    );

};


//Get Student Projects

const getStudentProjects = async (
    userId
) => {

    const profile =
        await StudentProfile.findOne({

            userId,

            isActive: true

        }).lean();


    if (!profile) {

        throw new ApiError(
            404,
            "Student profile not found."
        );

    }


    const projects =
        profile.projects || [];


    return projects;

};


//Get Project By ID

const getStudentProjectById = async (
    userId,
    projectId
) => {

    const projects =
        await getStudentProjects(
            userId
        );


    const project =
        projects.find(

            item =>
                String(
                    item._id
                ) ===
                String(
                    projectId
                )

        );


    if (!project) {

        throw new ApiError(
            404,
            "Student project not found."
        );

    }


    return project;

};


//Add Student Project

const addStudentProject = async (
    userId,
    projectData
) => {

    const profile =
        await StudentProfile.findOne({

            userId,

            isActive: true

        });


    if (!profile) {

        throw new ApiError(
            404,
            "Student profile not found."
        );

    }


    //Initialize Projects Array

    if (!Array.isArray(profile.projects)) {

        profile.projects = [];

    }


    //Validate Project Name

    if (
        !projectData.name ||
        !projectData.name.trim()
    ) {

        throw new ApiError(
            400,
            "Project name is required."
        );

    }


    //Create Project

    const project = {

        name:
            projectData.name.trim(),

        description:
            projectData.description
                ?.trim() || "",

        technologies:
            Array.isArray(
                projectData.technologies
            )
                ? projectData.technologies
                : [],

        skills:
            Array.isArray(
                projectData.skills
            )
                ? projectData.skills
                : [],

        githubUrl:
            projectData.githubUrl
                ?.trim() || "",

        liveUrl:
            projectData.liveUrl
                ?.trim() || "",

        startDate:
            projectData.startDate || null,

        endDate:
            projectData.endDate || null,

        status:
            projectData.status ||
            "completed",

        isFeatured:
            Boolean(
                projectData.isFeatured
            ),

        createdAt:
            new Date(),

        updatedAt:
            new Date()

    };


    //Add Project

    profile.projects.push(
        project
    );


    await profile.save();


    return project;

};


//Update Student Project

const updateStudentProject = async (
    userId,
    projectId,
    updateData
) => {

    const profile =
        await StudentProfile.findOne({

            userId,

            isActive: true

        });


    if (!profile) {

        throw new ApiError(
            404,
            "Student profile not found."
        );

    }


    if (!Array.isArray(profile.projects)) {

        throw new ApiError(
            404,
            "Student project not found."
        );

    }


    const project =
        profile.projects.id(
            projectId
        );


    if (!project) {

        throw new ApiError(
            404,
            "Student project not found."
        );

    }


    //Allowed Fields

    const allowedFields = [

        "name",

        "description",

        "technologies",

        "skills",

        "githubUrl",

        "liveUrl",

        "startDate",

        "endDate",

        "status",

        "isFeatured"

    ];


    allowedFields.forEach(
        (field) => {

            if (
                updateData[field] !==
                undefined
            ) {

                project[field] =
                    updateData[field];

            }

        }
    );


    project.updatedAt =
        new Date();


    await profile.save();


    return project;

};


//Delete Student Project

const deleteStudentProject = async (
    userId,
    projectId
) => {

    const profile =
        await StudentProfile.findOne({

            userId,

            isActive: true

        });


    if (!profile) {

        throw new ApiError(
            404,
            "Student profile not found."
        );

    }


    const project =
        profile.projects?.id(
            projectId
        );


    if (!project) {

        throw new ApiError(
            404,
            "Student project not found."
        );

    }


    project.deleteOne();


    await profile.save();


    return {

        message:
            "Project deleted successfully."

    };

};


//Get Completed Projects

const getCompletedProjects = async (
    userId
) => {

    const projects =
        await getStudentProjects(
            userId
        );


    return projects.filter(

        project =>
            project.status ===
            "completed"

    );

};


//Get Featured Projects

const getFeaturedProjects = async (
    userId
) => {

    const projects =
        await getStudentProjects(
            userId
        );


    return projects.filter(

        project =>
            project.isFeatured ===
            true

    );

};


/*
 Calculate Project Portfolio Score

 Portfolio score is based on:

 Project count
 Technology diversity
 GitHub availability
 Live demo availability
 Completed projects

*/

const calculateProjectPortfolioScore = (
    projects
) => {

    if (!projects.length) {

        return {

            score: 0,

            breakdown: {

                projectCount: 0,

                technologyDiversity: 0,

                githubPresence: 0,

                liveDemoPresence: 0,

                completion: 0

            }

        };

    }


    //Project Count

    //3 or more projects = full score

    const projectCountScore =
        clampScore(

            (
                projects.length /
                3
            ) * 100

        );


    //Technology Diversity

    const technologySet =
        new Set();


    projects.forEach(
        (project) => {

            if (
                Array.isArray(
                    project.technologies
                )
            ) {

                project.technologies.forEach(
                    technology => {

                        technologySet.add(

                            normalizeText(
                                technology
                            )

                        );

                    }
                );

            }

        }
    );


    const technologyDiversityScore =
        clampScore(

            (
                technologySet.size /
                6
            ) * 100

        );


    //GitHub Presence

    const githubProjects =
        projects.filter(

            project =>
                project.githubUrl

        ).length;


    const githubScore =
        (
            githubProjects /
            projects.length
        ) * 100;


    //Live Demo Presence

    const liveProjects =
        projects.filter(

            project =>
                project.liveUrl

        ).length;


    const liveDemoScore =
        (
            liveProjects /
            projects.length
        ) * 100;


    //Completion

    const completedProjects =
        projects.filter(

            project =>
                project.status ===
                "completed"

        ).length;


    const completionScore =
        (
            completedProjects /
            projects.length
        ) * 100;


    //Overall Portfolio Score

    const score =

        (
            projectCountScore *
            0.30
        )

        +

        (
            technologyDiversityScore *
            0.20
        )

        +

        (
            githubScore *
            0.20
        )

        +

        (
            liveDemoScore *
            0.10
        )

        +

        (
            completionScore *
            0.20
        );


    return {

        score:
            roundScore(
                clampScore(
                    score
                )
            ),

        breakdown: {

            projectCount:
                roundScore(
                    projectCountScore
                ),

            technologyDiversity:
                roundScore(
                    technologyDiversityScore
                ),

            githubPresence:
                roundScore(
                    githubScore
                ),

            liveDemoPresence:
                roundScore(
                    liveDemoScore
                ),

            completion:
                roundScore(
                    completionScore
                )

        }

    };

};


//Get Portfolio Summary

const getPortfolioSummary = async (
    userId
) => {

    const projects =
        await getStudentProjects(
            userId
        );


    const completedProjects =
        projects.filter(

            project =>
                project.status ===
                "completed"

        );


    const inProgressProjects =
        projects.filter(

            project =>
                project.status ===
                "in_progress"

        );


    const featuredProjects =
        projects.filter(

            project =>
                project.isFeatured ===
                true

        );


    const portfolioScore =
        calculateProjectPortfolioScore(
            projects
        );


    return {

        totalProjects:
            projects.length,

        completedProjects:
            completedProjects.length,

        inProgressProjects:
            inProgressProjects.length,

        featuredProjects:
            featuredProjects.length,

        portfolioScore:
            portfolioScore.score,

        scoreBreakdown:
            portfolioScore.breakdown

    };

};


//Get Career Project Recommendations

//Gets projects from Career CMS that are relevant to a career.

const getRecommendedProjects = async (
    userId,
    careerId
) => {

    //Verify Student

    const profile =
        await StudentProfile.findOne({

            userId,

            isActive: true

        }).lean();


    if (!profile) {

        throw new ApiError(
            404,
            "Student profile not found."
        );

    }


    //Verify Career

    const career =
        await Career.findOne({

            _id: careerId,

            isActive: true,

            isPublished: true

        }).lean();


    if (!career) {

        throw new ApiError(
            404,
            "Career not found."
        );

    }


    //Get Career Projects

    const projects =
        await Project.find({

            careerId,

            isActive: true,

            isPublished: true

        }).lean();


    if (!projects.length) {

        return [];

    }


    //Student Skills

    const studentSkills =
        await getStudentSkillsForProjectMatching(
            userId
        );


    //Score Each Project

    const recommendations =
        projects.map(
            (project) => {

                const matchingResult =
                    calculateProjectSkillMatch(

                        studentSkills,

                        project.skills || []

                    );


                return {

                    projectId:
                        project._id,

                    name:
                        project.name,

                    description:
                        project.description,

                    difficulty:
                        project.difficulty,

                    technologies:
                        project.technologies || [],

                    skills:
                        project.skills || [],

                    matchScore:
                        matchingResult.score,

                    matchedSkills:
                        matchingResult.matchedSkills,

                    missingSkills:
                        matchingResult.missingSkills

                };

            }
        );


    //Sort Highest Match First

    recommendations.sort(

        (a, b) =>
            b.matchScore -
            a.matchScore

    );


    return recommendations;

};


//Get Student Skills For Project Matching

const getStudentSkillsForProjectMatching = async (
    userId
) => {

    const StudentSkill =
        require("../models/StudentSkill");


    const skills =
        await StudentSkill.find({

            userId,

            isActive: true

        })
            .populate(
                "skillId",
                "name"
            )
            .lean();


    return skills;

};


//Calculate Project Skill Match

const calculateProjectSkillMatch = (
    studentSkills,
    projectSkills
) => {

    if (!projectSkills.length) {

        return {

            score: 0,

            matchedSkills: [],

            missingSkills: []

        };

    }


    const studentSkillSet =
        new Set();


    studentSkills.forEach(
        (studentSkill) => {

            const skillName =
                studentSkill.skillId?.name;


            if (!skillName) {
                return;
            }


            studentSkillSet.add(

                normalizeText(
                    skillName
                )

            );

        }
    );


    let matchedCount = 0;

    const matchedSkills = [];

    const missingSkills = [];


    projectSkills.forEach(
        (projectSkill) => {

            const skillName =
                projectSkill.name ||
                projectSkill.skillId?.name;


            if (!skillName) {
                return;
            }


            const normalizedName =
                normalizeText(
                    skillName
                );


            if (
                studentSkillSet.has(
                    normalizedName
                )
            ) {

                matchedCount++;

                matchedSkills.push(
                    skillName
                );

            }

            else {

                missingSkills.push(
                    skillName
                );

            }

        }
    );


    const score =

        (
            matchedCount /
            projectSkills.length
        ) * 100;


    return {

        score:
            roundScore(
                clampScore(
                    score
                )
            ),

        matchedSkills,

        missingSkills

    };

};


//Get Project Recommendations For Skill Gaps

//Returns projects that help the student practice missing skills.

const getProjectsForSkillGaps = async (
    userId,
    careerId,
    missingSkills = []
) => {

    //Verify Career

    const career =
        await Career.findOne({

            _id: careerId,

            isActive: true,

            isPublished: true

        }).lean();


    if (!career) {

        throw new ApiError(
            404,
            "Career not found."
        );

    }


    //Get Career Projects

    const projects =
        await Project.find({

            careerId,

            isActive: true,

            isPublished: true

        }).lean();


    //Normalize Missing Skills

    const normalizedMissingSkills =
        missingSkills.map(

            skill =>

                normalizeText(
                    typeof skill ===
                    "string"

                        ? skill

                        : skill.name
                )

        );


    //Find Projects Covering Missing Skills

    const recommendations =
        projects.map(
            (project) => {

                const projectSkills =
                    (
                        project.skills ||
                        []
                    ).map(

                        skill =>

                            normalizeText(

                                typeof skill ===
                                "string"

                                    ? skill

                                    : skill.name

                            )

                    );


                const coveredSkills =
                    normalizedMissingSkills.filter(

                        missingSkill =>

                            projectSkills.includes(
                                missingSkill
                            )

                    );


                return {

                    projectId:
                        project._id,

                    name:
                        project.name,

                    description:
                        project.description,

                    difficulty:
                        project.difficulty,

                    technologies:
                        project.technologies || [],

                    coveredSkills,

                    coverageScore:

                        normalizedMissingSkills.length > 0

                            ? roundScore(

                                (
                                    coveredSkills.length /
                                    normalizedMissingSkills.length

                                ) * 100

                            )

                            : 0

                };

            }
        );


    //Keep Relevant Projects

    return recommendations

        .filter(
            project =>
                project.coveredSkills.length > 0
        )

        .sort(

            (a, b) =>
                b.coverageScore -
                a.coverageScore

        );

};


//Export

module.exports = {

    getStudentProjects,
    getStudentProjectById,
    addStudentProject,
    updateStudentProject,
    deleteStudentProject,
    getCompletedProjects,
    getFeaturedProjects,
    calculateProjectPortfolioScore,
    getPortfolioSummary,
    getRecommendedProjects,
    calculateProjectSkillMatch,
    getProjectsForSkillGaps

};