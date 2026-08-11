const StudentProfile = require("../models/StudentProfile");
const StudentSkill = require("../models/StudentSkill");

const Career = require("../../careerCMS/models/Career");
const CareerSkill = require("../../careerCMS/models/CareerSkill");

const ApiError = require("../../shared/utils/ApiError");


//Proficiency Levels

const PROFICIENCY_LEVELS = {

    beginner: 1,

    intermediate: 2,

    advanced: 3,

    expert: 4

};


//Normalize Text

const normalizeText = (value) => {

    if (!value) {
        return "";
    }

    return value
        .toString()
        .trim()
        .toLowerCase();

};


//Get Proficiency Score

const getProficiencyScore = (
    proficiencyLevel
) => {

    return (
        PROFICIENCY_LEVELS[
            proficiencyLevel
        ] || 0
    );

};


//Get Proficiency Difference

const getProficiencyGap = (
    studentLevel,
    requiredLevel
) => {

    const studentScore =
        getProficiencyScore(
            studentLevel
        );

    const requiredScore =
        getProficiencyScore(
            requiredLevel
        );


    return Math.max(
        requiredScore - studentScore,
        0
    );

};


//Determine Gap Priority

//Priority is based on:
//1. Whether the skill is completely missing
//2. Required proficiency


const determineGapPriority = ({
    studentProficiency,
    requiredProficiency
}) => {

    //Completely Missing Skill

    if (!studentProficiency) {

        if (
            requiredProficiency ===
            "expert"
        ) {
            return "critical";
        }

        if (
            requiredProficiency ===
            "advanced"
        ) {
            return "high";
        }

        if (
            requiredProficiency ===
            "intermediate"
        ) {
            return "medium";
        }

        return "low";
    }


    //Existing Skill But Insufficient Level

    const gap =
        getProficiencyGap(
            studentProficiency,
            requiredProficiency
        );


    if (gap >= 3) {
        return "high";
    }

    if (gap === 2) {
        return "medium";
    }

    if (gap === 1) {
        return "low";
    }


    return "none";

};


//Calculate Skill Gap Percentage

//0%   = no gap
//100% = completely missing


const calculateGapPercentage = ({
    studentProficiency,
    requiredProficiency
}) => {

    const requiredScore =
        getProficiencyScore(
            requiredProficiency
        );


    if (requiredScore === 0) {
        return 0;
    }


    //Completely Missing

    if (!studentProficiency) {

        return 100;

    }


    const studentScore =
        getProficiencyScore(
            studentProficiency
        );


    if (
        studentScore >=
        requiredScore
    ) {

        return 0;

    }


    const gap =
        (
            (
                requiredScore -
                studentScore
            ) /
            requiredScore
        ) * 100;


    return Number(
        gap.toFixed(2)
    );

};


//Analyze Career Skill Gap

//Main function for calculating the student's skill gaps
//against one career.


const analyzeSkillGap = async (
    userId,
    careerId
) => {

    //Check Student Profile

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


    //Check Career

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


    //Get Student Skills

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


    //Get Career Required Skills

    const careerSkills =
        await CareerSkill.find({

            careerId,

            isActive: true

        })
            .populate(
                "skillId",
                "name category description"
            )
            .lean();


    //No Required Skills

    if (!careerSkills.length) {

        return {

            career: {

                id:
                    career._id,

                name:
                    career.name

            },

            summary: {

                totalRequiredSkills: 0,

                skillsMet: 0,

                skillsWithGaps: 0,

                missingSkills: 0,

                overallGapPercentage: 0

            },

            skillGaps: []

        };

    }


    //Create Student Skill Map

    const studentSkillMap =
        new Map();


    studentSkills.forEach(
        (studentSkill) => {

            const skillName =
                studentSkill.skillId?.name;


            if (!skillName) {
                return;
            }


            const normalizedName =
                normalizeText(
                    skillName
                );


            studentSkillMap.set(
                normalizedName,
                studentSkill
            );

        }
    );


    //Analyze Every Required Skill

    const skillGaps = [];


    careerSkills.forEach(
        (careerSkill) => {

            const skill =
                careerSkill.skillId;


            if (!skill) {
                return;
            }


            const skillName =
                skill.name;


            const normalizedName =
                normalizeText(
                    skillName
                );


            const studentSkill =
                studentSkillMap.get(
                    normalizedName
                );


            const studentProficiency =
                studentSkill
                    ?.proficiencyLevel ||
                null;


            const requiredProficiency =
                careerSkill
                    .minimumProficiency ||
                "beginner";


            const gapPercentage =
                calculateGapPercentage({

                    studentProficiency,

                    requiredProficiency

                });


            const priority =
                determineGapPriority({

                    studentProficiency,

                    requiredProficiency

                });


            const proficiencyGap =
                getProficiencyGap(

                    studentProficiency,

                    requiredProficiency

                );


            //Skill Status

            let status;


            if (!studentProficiency) {

                status = "missing";

            }

            else if (
                proficiencyGap > 0
            ) {

                status = "needs_improvement";

            }

            else {

                status = "met";

            }


            //Add Analysis

            skillGaps.push({

                skillId:
                    skill._id,

                skillName,

                category:
                    skill.category,

                requiredProficiency,

                studentProficiency,

                status,

                priority,

                proficiencyGap,

                gapPercentage

            });

        }
    );


    //Sort by Priority

    const priorityOrder = {

        critical: 1,

        high: 2,

        medium: 3,

        low: 4,

        none: 5

    };


    skillGaps.sort(
        (a, b) =>

            priorityOrder[
                a.priority
            ]

            -

            priorityOrder[
                b.priority
            ]
    );


    //Calculate Summary

    const totalRequiredSkills =
        skillGaps.length;


    const skillsMet =
        skillGaps.filter(
            skill =>
                skill.status ===
                "met"
        ).length;


    const skillsWithGaps =
        skillGaps.filter(
            skill =>
                skill.status ===
                "needs_improvement"
        ).length;


    const missingSkills =
        skillGaps.filter(
            skill =>
                skill.status ===
                "missing"
        ).length;


    //Overall Gap Percentage

    const totalGap =
        skillGaps.reduce(
            (
                total,
                skill
            ) =>
                total +
                skill.gapPercentage,
            0
        );


    const overallGapPercentage =
        totalRequiredSkills > 0

            ? Number(
                (
                    totalGap /
                    totalRequiredSkills
                ).toFixed(2)
            )

            : 0;


    //Skill Match Percentage

    const skillMatchPercentage =
        Number(
            (
                100 -
                overallGapPercentage
            ).toFixed(2)
        );


    //Return Result

    return {

        career: {

            id:
                career._id,

            name:
                career.name,

            category:
                career.category

        },

        summary: {

            totalRequiredSkills,

            skillsMet,

            skillsWithGaps,

            missingSkills,

            overallGapPercentage,

            skillMatchPercentage

        },

        skillGaps

    };

};


//Get Missing Skills Only

//Returns only completely missing skills.

const getMissingSkills = async (
    userId,
    careerId
) => {

    const analysis =
        await analyzeSkillGap(
            userId,
            careerId
        );


    return analysis.skillGaps
        .filter(
            skill =>
                skill.status ===
                "missing"
        );

};


//Get High Priority Skill Gaps

const getHighPriorityGaps = async (
    userId,
    careerId
) => {

    const analysis =
        await analyzeSkillGap(
            userId,
            careerId
        );


    return analysis.skillGaps
        .filter(
            skill =>

                skill.priority ===
                "critical"

                ||

                skill.priority ===
                "high"
        );

};


//Get Skill Gap Summary
//Smaller response designed for the Student Dashboard.

const getSkillGapSummary = async (
    userId,
    careerId
) => {

    const analysis =
        await analyzeSkillGap(
            userId,
            careerId
        );


    return {

        career:
            analysis.career,

        summary:
            analysis.summary

    };

};


//Export

module.exports = {

    analyzeSkillGap,

    getMissingSkills,

    getHighPriorityGaps,

    getSkillGapSummary,

    calculateGapPercentage,

    determineGapPriority

};