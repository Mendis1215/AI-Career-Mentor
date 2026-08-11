const StudentProfile = require("../models/StudentProfile");
const StudentSkill = require("../models/StudentSkill");
const StudentCertification = require("../models/StudentCertification");
const StudentProgress = require("../models/StudentProgress");
const GitHubProfile = require("../models/GitHubProfile");

const Career = require("../../careerCMS/models/Career");
const CareerSkill = require("../../careerCMS/models/CareerSkill");

const ApiError = require("../../shared/utils/ApiError");


//Readiness Score Weights

//Total = 100%
/*
| Skills          -> 40%
| Projects        -> 20%
| Certifications  -> 10%
| GitHub          -> 10%
| Progress        -> 10%
| Profile         -> 10%
*/

const READINESS_WEIGHTS = {
    skills: 0.40,
    projects: 0.20,
    certifications: 0.10,
    github: 0.10,
    progress: 0.10,
    profile: 0.10
};


//Utility: Clamp Score

//Keeps a score between 0 and 100.

const clampScore = (score) => {

    return Math.min(
        Math.max(score, 0),
        100
    );

};


//Utility: Round Score

const roundScore = (score) => {

    return Number(
        score.toFixed(2)
    );

};


//Calculate Skill Readiness

//Compares student's skills against the selected career's
//required skills.

const calculateSkillReadiness = (
    studentSkills,
    careerSkills
) => {

    if (!careerSkills.length) {

        return 0;

    }


    const proficiencyScores = {

        beginner: 25,

        intermediate: 50,

        advanced: 75,

        expert: 100

    };


    const studentSkillMap =
        new Map();


    //Build Student Skill Map

    studentSkills.forEach(
        (studentSkill) => {

            const skillName =
                studentSkill.skillId?.name;


            if (!skillName) {
                return;
            }


            studentSkillMap.set(

                skillName
                    .trim()
                    .toLowerCase(),

                studentSkill

            );

        }
    );


    let totalScore = 0;


    //Compare Skills

    careerSkills.forEach(
        (careerSkill) => {

            const skillName =
                careerSkill.skillId?.name;


            if (!skillName) {
                return;
            }


            const studentSkill =
                studentSkillMap.get(

                    skillName
                        .trim()
                        .toLowerCase()

                );


            //Missing Skill

            if (!studentSkill) {

                return;

            }


            const studentScore =
                proficiencyScores[
                    studentSkill.proficiencyLevel
                ] || 0;


            const requiredScore =
                proficiencyScores[
                    careerSkill.minimumProficiency
                ] || 25;


            //Calculate Individual Skill Score

            const skillScore =
                Math.min(

                    (
                        studentScore /
                        requiredScore
                    ) * 100,

                    100

                );


            totalScore += skillScore;

        }
    );


    //Average Skill Score

    const score =
        totalScore /
        careerSkills.length;


    return roundScore(
        clampScore(score)
    );

};


//Calculate Project Readiness

//Uses StudentProgress project information.

const calculateProjectReadiness = (
    progress
) => {

    if (!progress) {

        return 0;

    }


    //If project count exists

    if (
        typeof progress.projectsCompleted ===
        "number"
    ) {

        /*
        | 3+ projects = 100%
        */

        return roundScore(
            clampScore(
                (
                    progress.projectsCompleted /
                    3
                ) * 100
            )
        );

    }


    //If project score exists

    if (
        typeof progress.projectScore ===
        "number"
    ) {

        return roundScore(
            clampScore(
                progress.projectScore
            )
        );

    }


    return 0;

};


//Calculate Certification Readiness

const calculateCertificationReadiness = (
    certifications
) => {

    if (!certifications.length) {

        return 0;

    }


    //3 relevant certifications = 100%

    const score =
        (
            certifications.length /
            3
        ) * 100;


    return roundScore(
        clampScore(score)
    );

};


//Calculate GitHub Readiness

//Uses GitHub profile information.

const calculateGithubReadiness = (
    githubProfile
) => {

    if (!githubProfile) {

        return 0;

    }


    let score = 0;


    //Profile Exists

    score += 20;


    //Public Repositories

    if (
        typeof githubProfile.publicRepositories ===
        "number"
    ) {

        score += Math.min(

            (
                githubProfile.publicRepositories /
                5
            ) * 30,

            30

        );

    }


    //Followers

    if (
        typeof githubProfile.followers ===
        "number"
    ) {

        score += Math.min(

            (
                githubProfile.followers /
                10
            ) * 10,

            10

        );

    }


    //Profile Completeness

    if (
        githubProfile.profileUrl
    ) {

        score += 10;

    }


    if (
        githubProfile.username
    ) {

        score += 10;

    }


    //Activity

    if (
        typeof githubProfile.totalContributions ===
        "number"
    ) {

        score += Math.min(

            (
                githubProfile.totalContributions /
                100
            ) * 20,

            20

        );

    }


    return roundScore(
        clampScore(score)
    );

};


//Calculate Progress Readiness

const calculateProgressReadiness = (
    progress
) => {

    if (!progress) {

        return 0;

    }


    //If explicit progress score exists

    if (
        typeof progress.overallProgress ===
        "number"
    ) {

        return roundScore(
            clampScore(
                progress.overallProgress
            )
        );

    }


    if (
        typeof progress.progressPercentage ===
        "number"
    ) {

        return roundScore(
            clampScore(
                progress.progressPercentage
            )
        );

    }


    //Calculate from completed items

    const completed =
        progress.completedItems;


    const total =
        progress.totalItems;


    if (
        typeof completed === "number" &&
        typeof total === "number" &&
        total > 0
    ) {

        return roundScore(

            clampScore(

                (
                    completed /
                    total
                ) * 100

            )

        );

    }


    return 0;

};


//Calculate Profile Readiness

const calculateProfileReadiness = (
    profile
) => {

    if (!profile) {

        return 0;

    }


    const fields = [

        "firstName",

        "lastName",

        "degreeProgram",

        "educationLevel",

        "university",

        "bio",

        "profileImage"

    ];


    let completedFields = 0;


    fields.forEach(
        (field) => {

            if (
                profile[field] !==
                undefined &&

                profile[field] !==
                null &&

                String(
                    profile[field]
                ).trim() !== ""
            ) {

                completedFields++;

            }

        }
    );


    return roundScore(

        (
            completedFields /
            fields.length
        ) * 100

    );

};


//Calculate Overall Readiness

const calculateOverallReadiness = ({
    skills,
    projects,
    certifications,
    github,
    progress,
    profile
}) => {

    const score =

        (
            skills *
            READINESS_WEIGHTS.skills
        )

        +

        (
            projects *
            READINESS_WEIGHTS.projects
        )

        +

        (
            certifications *
            READINESS_WEIGHTS.certifications
        )

        +

        (
            github *
            READINESS_WEIGHTS.github
        )

        +

        (
            progress *
            READINESS_WEIGHTS.progress
        )

        +

        (
            profile *
            READINESS_WEIGHTS.profile
        );


    return roundScore(
        clampScore(score)
    );

};


//Get Readiness Level

const getReadinessLevel = (
    score
) => {

    if (score >= 80) {

        return "internship_ready";

    }


    if (score >= 60) {

        return "nearly_ready";

    }


    if (score >= 40) {

        return "developing";

    }


    return "beginner";

};


//Generate Recommendations

//Converts weak readiness areas into actionable recommendations.

const generateReadinessRecommendations = ({
    skills,
    projects,
    certifications,
    github,
    progress,
    profile
}) => {

    const recommendations = [];


    if (skills < 60) {

        recommendations.push(
            "Improve the technical skills required for your target career."
        );

    }


    if (projects < 60) {

        recommendations.push(
            "Complete more practical projects and add them to your portfolio."
        );

    }


    if (certifications < 50) {

        recommendations.push(
            "Consider completing relevant industry certifications."
        );

    }


    if (github < 50) {

        recommendations.push(
            "Improve your GitHub profile and maintain active public repositories."
        );

    }


    if (progress < 60) {

        recommendations.push(
            "Increase your progress on your learning roadmap."
        );

    }


    if (profile < 80) {

        recommendations.push(
            "Complete your student profile information."
        );

    }


    if (!recommendations.length) {

        recommendations.push(
            "Your profile is progressing well. Continue building projects and improving your career-specific skills."
        );

    }


    return recommendations;

};

//Get Internship Readiness

//Main function.

const getInternshipReadiness = async (
    userId,
    careerId = null
) => {

    //Student Profile

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


    //Student Skills

    const studentSkills =
        await StudentSkill.find({

            userId,

            isActive: true

        })
            .populate(
                "skillId",
                "name category"
            )
            .lean();


    //Certifications

    const certifications =
        await StudentCertification.find({

            userId,

            isActive: true

        }).lean();


    //Student Progress

    const progress =
        await StudentProgress.findOne({

            userId,

            isActive: true

        }).lean();


    //GitHub Profile

    const githubProfile =
        await GitHubProfile.findOne({

            userId,

            isActive: true

        }).lean();


    //Find Career

    let career = null;

    let careerSkills = [];


    if (careerId) {

        career =
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


        careerSkills =
            await CareerSkill.find({

                careerId,

                isActive: true

            })
                .populate(
                    "skillId",
                    "name category"
                )
                .lean();

    }


    //Calculate Component Scores

    const skillScore =

        careerId

            ? calculateSkillReadiness(
                studentSkills,
                careerSkills
            )

            : calculateGeneralSkillReadiness(
                studentSkills
            );


    const projectScore =
        calculateProjectReadiness(
            progress
        );


    const certificationScore =
        calculateCertificationReadiness(
            certifications
        );


    const githubScore =
        calculateGithubReadiness(
            githubProfile
        );


    const progressScore =
        calculateProgressReadiness(
            progress
        );


    const profileScore =
        calculateProfileReadiness(
            profile
        );


    //Overall Score

    const overallScore =
        calculateOverallReadiness({

            skills:
                skillScore,

            projects:
                projectScore,

            certifications:
                certificationScore,

            github:
                githubScore,

            progress:
                progressScore,

            profile:
                profileScore

        });


    //Readiness Level

    const readinessLevel =
        getReadinessLevel(
            overallScore
        );


    //Recommendations

    const recommendations =
        generateReadinessRecommendations({

            skills:
                skillScore,

            projects:
                projectScore,

            certifications:
                certificationScore,

            github:
                githubScore,

            progress:
                progressScore,

            profile:
                profileScore

        });


    //Return Result

    return {

        score:
            overallScore,

        level:
            readinessLevel,

        career: career
            ? {
                id:
                    career._id,

                name:
                    career.name
            }
            : null,

        breakdown: {

            skills:
                skillScore,

            projects:
                projectScore,

            certifications:
                certificationScore,

            github:
                githubScore,

            progress:
                progressScore,

            profile:
                profileScore

        },

        recommendations

    };

};


//General Skill Readiness

//Used when no specific career has been selected.

const calculateGeneralSkillReadiness = (
    studentSkills
) => {

    if (!studentSkills.length) {

        return 0;

    }


    const proficiencyScores = {

        beginner: 25,

        intermediate: 50,

        advanced: 75,

        expert: 100

    };


    let totalScore = 0;


    studentSkills.forEach(
        (studentSkill) => {

            totalScore +=

                proficiencyScores[
                    studentSkill.proficiencyLevel
                ] || 0;

        }
    );


    return roundScore(

        clampScore(

            totalScore /
            studentSkills.length

        )

    );

};


//Get Readiness Summary

//Smaller response for dashboard.

const getReadinessSummary = async (
    userId,
    careerId = null
) => {

    const readiness =
        await getInternshipReadiness(
            userId,
            careerId
        );


    return {

        score:
            readiness.score,

        level:
            readiness.level,

        breakdown:
            readiness.breakdown

    };

};


//Export

module.exports = {

    getInternshipReadiness,

    getReadinessSummary,

    calculateSkillReadiness,

    calculateGeneralSkillReadiness,

    calculateProjectReadiness,

    calculateCertificationReadiness,

    calculateGithubReadiness,

    calculateProgressReadiness,

    calculateProfileReadiness,

    calculateOverallReadiness,

    getReadinessLevel,

    generateReadinessRecommendations

};