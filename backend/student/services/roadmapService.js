const StudentProfile = require("../models/StudentProfile");
const StudentSkill = require("../models/StudentSkill");
const StudentProgress = require("../models/StudentProgress");

const Career = require("../../careerCMS/models/Career");
const Roadmap = require("../../careerCMS/models/Roadmap");
const RoadmapStage = require("../../careerCMS/models/RoadmapStage");

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


//Utility: Clamp Percentage

const clampPercentage = (value) => {

    return Math.min(
        Math.max(value, 0),
        100
    );

};


//Utility: Round Number

const roundNumber = (value) => {

    return Number(
        value.toFixed(2)
    );

};


//Get Student Skill Map

const getStudentSkillMap = async (
    userId
) => {

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


    const skillMap = new Map();


    studentSkills.forEach(
        (studentSkill) => {

            const skillName =
                studentSkill.skillId?.name;


            if (!skillName) {
                return;
            }


            skillMap.set(

                normalizeText(
                    skillName
                ),

                studentSkill

            );

        }
    );


    return skillMap;

};


//Calculate Stage Skill Readiness

//Determines how ready the student is for a particular roadmap stage.


const calculateStageSkillReadiness = (
    stage,
    studentSkillMap
) => {

    const requiredSkills =
        stage.skills || [];


    //Stage has no required skills

    if (!requiredSkills.length) {

        return {

            score: 100,

            matchedSkills: [],

            missingSkills: []

        };

    }


    let totalScore = 0;

    const matchedSkills = [];

    const missingSkills = [];


    requiredSkills.forEach(
        (requiredSkill) => {

            //Support both object and direct skill reference

            const skillName =
                requiredSkill.skillId?.name ||
                requiredSkill.name;


            if (!skillName) {
                return;
            }


            const studentSkill =
                studentSkillMap.get(

                    normalizeText(
                        skillName
                    )

                );


            //Student has skill

            if (studentSkill) {

                const proficiency =
                    normalizeText(
                        studentSkill.proficiencyLevel
                    );


                let score = 0;


                if (
                    proficiency ===
                    "expert"
                ) {

                    score = 100;

                }

                else if (
                    proficiency ===
                    "advanced"
                ) {

                    score = 90;

                }

                else if (
                    proficiency ===
                    "intermediate"
                ) {

                    score = 70;

                }

                else if (
                    proficiency ===
                    "beginner"
                ) {

                    score = 40;

                }


                totalScore += score;


                matchedSkills.push({

                    name:
                        skillName,

                    proficiency,

                    score

                });

            }

            //Student does not have skill

            else {

                missingSkills.push({

                    name:
                        skillName,

                    score: 0

                });

            }

        }
    );


    const score =

        requiredSkills.length > 0

            ? (
                totalScore /
                requiredSkills.length
            )

            : 0;


    return {

        score:
            roundNumber(
                clampPercentage(
                    score
                )
            ),

        matchedSkills,

        missingSkills

    };

};


//Get Student Roadmap

//Gets the roadmap for a selected career.


const getStudentRoadmap = async (
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


    //Find Roadmap

    const roadmap =
        await Roadmap.findOne({

            careerId,

            isActive: true,

            isPublished: true

        }).lean();


    if (!roadmap) {

        throw new ApiError(
            404,
            "Roadmap not found for this career."
        );

    }


    //Get Roadmap Stages

    const stages =
        await RoadmapStage.find({

            roadmapId:
                roadmap._id,

            isActive: true

        })
            .populate(
                "skills.skillId",
                "name category"
            )
            .sort({
                order: 1
            })
            .lean();


    //Student Skills

    const studentSkillMap =
        await getStudentSkillMap(
            userId
        );


    //Student Progress

    const progress =
        await StudentProgress.findOne({

            userId,

            isActive: true

        }).lean();


    //Build Stage Results

    const roadmapStages =
        stages.map(
            (stage) => {

                const skillReadiness =
                    calculateStageSkillReadiness(

                        stage,

                        studentSkillMap

                    );


                //Determine Stage Status

                let status =
                    "locked";


                if (
                    skillReadiness.score >=
                    80
                ) {

                    status =
                        "available";

                }

                else if (
                    skillReadiness.score >=
                    50
                ) {

                    status =
                        "in_progress";

                }


                //Check Existing Progress

                if (
                    progress?.completedStages
                ) {

                    const completed =
                        progress.completedStages
                            .some(
                                (completedStage) =>

                                    String(
                                        completedStage.stageId
                                    ) ===
                                    String(
                                        stage._id
                                    )
                            );


                    if (completed) {

                        status =
                            "completed";

                    }

                }


                return {

                    stageId:
                        stage._id,

                    title:
                        stage.title,

                    description:
                        stage.description,

                    order:
                        stage.order,

                    estimatedDuration:
                        stage.estimatedDuration,

                    objectives:
                        stage.objectives || [],

                    resources:
                        stage.resources || [],

                    projects:
                        stage.projects || [],

                    skillReadiness:
                        skillReadiness.score,

                    matchedSkills:
                        skillReadiness.matchedSkills,

                    missingSkills:
                        skillReadiness.missingSkills,

                    status

                };

            }
        );


    //Calculate Roadmap Progress

    const totalStages =
        roadmapStages.length;


    const completedStages =
        roadmapStages.filter(

            stage =>
                stage.status ===
                "completed"

        ).length;


    const inProgressStages =
        roadmapStages.filter(

            stage =>
                stage.status ===
                "in_progress"

        ).length;


    const availableStages =
        roadmapStages.filter(

            stage =>
                stage.status ===
                "available"

        ).length;


    const lockedStages =
        roadmapStages.filter(

            stage =>
                stage.status ===
                "locked"

        ).length;


    const progressPercentage =

        totalStages > 0

            ? (
                completedStages /
                totalStages
            ) * 100

            : 0;


    //Return Roadmap

    return {

        roadmap: {

            id:
                roadmap._id,

            title:
                roadmap.title,

            description:
                roadmap.description,

            careerId:
                career._id,

            careerName:
                career.name

        },

        progress: {

            totalStages,

            completedStages,

            inProgressStages,

            availableStages,

            lockedStages,

            percentage:
                roundNumber(
                    progressPercentage
                )

        },

        stages:
            roadmapStages

    };

};


//Get Current Stage

const getCurrentStage = async (
    userId,
    careerId
) => {

    const roadmap =
        await getStudentRoadmap(
            userId,
            careerId
        );


    //First in-progress stage

    const currentStage =
        roadmap.stages.find(

            stage =>
                stage.status ===
                "in_progress"

        );


    if (currentStage) {

        return currentStage;

    }


    //Otherwise first available stage

    const availableStage =
        roadmap.stages.find(

            stage =>
                stage.status ===
                "available"

        );


    if (availableStage) {

        return availableStage;

    }


    //Otherwise first incomplete stage

    const incompleteStage =
        roadmap.stages.find(

            stage =>
                stage.status !==
                "completed"

        );


    return incompleteStage || null;

};


//Get Completed Stages

const getCompletedStages = async (
    userId,
    careerId
) => {

    const roadmap =
        await getStudentRoadmap(
            userId,
            careerId
        );


    return roadmap.stages.filter(

        stage =>
            stage.status ===
            "completed"

    );

};


//Get Available Stages

const getAvailableStages = async (
    userId,
    careerId
) => {

    const roadmap =
        await getStudentRoadmap(
            userId,
            careerId
        );


    return roadmap.stages.filter(

        stage =>

            stage.status ===
            "available"

            ||

            stage.status ===
            "in_progress"

    );

};


//Calculate Roadmap Completion

const calculateRoadmapCompletion = (
    stages
) => {

    if (!stages.length) {

        return 0;

    }


    const completed =
        stages.filter(

            stage =>
                stage.status ===
                "completed"

        ).length;


    return roundNumber(

        (
            completed /
            stages.length
        ) * 100

    );

};


//Export

module.exports = {

    getStudentRoadmap,

    getCurrentStage,

    getCompletedStages,

    getAvailableStages,

    calculateStageSkillReadiness,

    calculateRoadmapCompletion

};