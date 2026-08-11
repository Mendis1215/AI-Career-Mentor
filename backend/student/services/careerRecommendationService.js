const StudentProfile = require("../models/StudentProfile");
const StudentSkill = require("../models/StudentSkill");
const StudentInterest = require("../models/StudentInterest");

const Career = require("../../careerCMS/models/Career");
const CareerSkill = require("../../careerCMS/models/CareerSkill");

const ApiError = require("../../shared/utils/ApiError");

/*
Configuration

These weights determine how the career matching score is calculated.

Skills    -> 60%
Interests -> 25%
Profile   -> 15%
*/

const SCORE_WEIGHTS = {
    skills: 0.60,
    interests: 0.25,
    profile: 0.15
};

//Proficiency Scores

const PROFICIENCY_SCORES = {
    beginner: 0.25,
    intermediate: 0.50,
    advanced: 0.75,
    expert: 1.00
};

//Normalize Text

//Used when comparing skill and interest names.

const normalizeText = (value) => {

    if (!value) {
        return "";
    }

    return value
        .toString()
        .trim()
        .toLowerCase();

};

//Calculate Skill Match

//Compares the student's skills with the skills required by a career.

const calculateSkillMatch = (
    studentSkills,
    careerSkills
) => {

    if (!careerSkills.length) {

        return {
            score: 0,
            matchedSkills: [],
            missingSkills: []
        };

    }

    const studentSkillMap = new Map();

    //Create student skill lookup map

    studentSkills.forEach((studentSkill) => {

        const skillName =
            studentSkill.skillId?.name;

        if (!skillName) {
            return;
        }

        const normalizedName =
            normalizeText(skillName);


        const proficiency =
            PROFICIENCY_SCORES[
                studentSkill.proficiencyLevel
            ] || 0;

        studentSkillMap.set(
            normalizedName,
            {
                ...studentSkill,
                proficiencyScore: proficiency
            }
        );

    });

    let totalSkillScore = 0;

    const matchedSkills = [];

    const missingSkills = [];

    //Compare Career Skills

    careerSkills.forEach((careerSkill) => {

        const skillName =
            careerSkill.skillId?.name;

        if (!skillName) {
            return;
        }

        const normalizedName =
            normalizeText(skillName);

        const studentSkill =
            studentSkillMap.get(
                normalizedName
            );

        //Student has the required skill

        if (studentSkill) {

            const requiredLevel =
                PROFICIENCY_SCORES[
                    careerSkill.minimumProficiency
                ] || 0;

            const studentLevel =
                studentSkill.proficiencyScore;


            //Full match

            if (
                studentLevel >= requiredLevel
            ) {

                totalSkillScore += 1;

            }

            //Partial match

            else if (
                requiredLevel > 0
            ) {

                totalSkillScore +=
                    studentLevel /
                    requiredLevel;

            }


            matchedSkills.push({

                skillId:
                    careerSkill.skillId?._id,

                name:
                    skillName,

                studentProficiency:
                    studentSkill.proficiencyLevel,

                requiredProficiency:
                    careerSkill.minimumProficiency,

                match:
                    studentLevel >= requiredLevel
                        ? "full"
                        : "partial"

            });

        }

        //Student does not have the skill

        else {

            missingSkills.push({

                skillId:
                    careerSkill.skillId?._id,

                name:
                    skillName,

                requiredProficiency:
                    careerSkill.minimumProficiency

            });

        }

    });

    const score =
        careerSkills.length > 0
            ? (
                totalSkillScore /
                careerSkills.length
            ) * 100
            : 0;

    return {

        score: Number(
            score.toFixed(2)
        ),

        matchedSkills,

        missingSkills

    };

};

//Calculate Interest Match

//Compares the student's interests with career keywords/categories.

const calculateInterestMatch = (
    studentInterests,
    career
) => {

    if (!studentInterests.length) {

        return {
            score: 0,
            matchedInterests: []
        };

    }

    //Create searchable career text

    const careerText = [

        career.name,

        career.description,

        career.category,

        ...(career.keywords || [])

    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    const matchedInterests = [];

    let totalScore = 0;

    //Compare Interests

    studentInterests.forEach((item) => {

        const interest =
            normalizeText(
                item.interest
            );

        if (!interest) {
            return;
        }

        //Direct keyword match

        if (
            careerText.includes(
                interest
            )
        ) {

            let interestScore = 1;

            //Increase score for stronger interest

            if (
                item.interestLevel ===
                "very_high"
            ) {

                interestScore = 1;

            }
            else if (
                item.interestLevel ===
                "high"
            ) {

                interestScore = 0.90;

            }
            else if (
                item.interestLevel ===
                "medium"
            ) {

                interestScore = 0.70;

            }
            else {

                interestScore = 0.50;

            }

            totalScore += interestScore;

            matchedInterests.push({

                interest:
                    item.interest,

                interestLevel:
                    item.interestLevel,

                score:
                    interestScore

            });
        }
    });

    const score =
        studentInterests.length > 0
            ? (
                totalScore /
                studentInterests.length
            ) * 100
            : 0;

    return {

        score: Number(
            Math.min(
                score,
                100
            ).toFixed(2)
        ),

        matchedInterests

    };

};

//Calculate Profile Match

//Checks whether the student's academic background is relevant
//to the career.

const calculateProfileMatch = (
    profile,
    career
) => {

    if (!profile) {
        return 0;
    }

    let score = 0;

    let possibleScore = 0;

    //Degree Program Match

    if (
        profile.degreeProgram &&
        career.degreePrograms &&
        career.degreePrograms.length > 0
    ) {

        possibleScore += 1;


        const studentDegree =
            normalizeText(
                profile.degreeProgram
            );


        const degreeMatch =
            career.degreePrograms.some(
                (degree) =>
                    normalizeText(
                        degree
                    ) === studentDegree
            );


        if (degreeMatch) {
            score += 1;
        }

    }

    //Education Level Match

    if (
        profile.educationLevel &&
        career.educationLevels &&
        career.educationLevels.length > 0
    ) {

        possibleScore += 1;


        const studentEducation =
            normalizeText(
                profile.educationLevel
            );


        const educationMatch =
            career.educationLevels.some(
                (level) =>
                    normalizeText(
                        level
                    ) === studentEducation
            );


        if (educationMatch) {
            score += 1;
        }

    }

    //No career profile requirements

    if (possibleScore === 0) {
        return 50;
    }

    return Number(
        (
            score /
            possibleScore *
            100
        ).toFixed(2)
    );

};

//Calculate Overall Career Score

const calculateOverallScore = ({
    skillScore,
    interestScore,
    profileScore
}) => {

    const overallScore =

        (
            skillScore *
            SCORE_WEIGHTS.skills
        )

        +

        (
            interestScore *
            SCORE_WEIGHTS.interests
        )

        +

        (
            profileScore *
            SCORE_WEIGHTS.profile
        );


    return Number(
        overallScore.toFixed(2)
    );

};

//Get Student Career Recommendations

//Main career recommendation function.

const getCareerRecommendations = async (
    userId,
    options = {}
) => {

    const limit =
        Math.min(
            Number(options.limit) || 5,
            20
        );

    //Get Student Profile

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

    //Get Student Interests

    const studentInterests =
        await StudentInterest.find({
            userId,
            isActive: true
        }).lean();

    //Get Active Careers

    const careers =
        await Career.find({
            isActive: true,
            isPublished: true
        }).lean();


    //No Careers Available

    if (!careers.length) {

        return [];

    }

    //Generate Career Scores

    const recommendations = [];

    for (
        const career of careers
    ) {

        //Get Career Skills

        const careerSkills =
            await CareerSkill.find({
                careerId:
                    career._id,
                isActive: true
            })
                .populate(
                    "skillId",
                    "name category"
                )
                .lean();

        //Skill Match

        const skillMatch =
            calculateSkillMatch(
                studentSkills,
                careerSkills
            );

        //Interest Match

        const interestMatch =
            calculateInterestMatch(
                studentInterests,
                career
            );

        //Profile Match

        const profileScore =
            calculateProfileMatch(
                profile,
                career
            );

        //Overall Score

        const overallScore =
            calculateOverallScore({

                skillScore:
                    skillMatch.score,

                interestScore:
                    interestMatch.score,

                profileScore

            });

        //Recommendation

        recommendations.push({

            careerId:
                career._id,

            careerName:
                career.name,

            category:
                career.category,

            description:
                career.description,

            score:
                overallScore,

            breakdown: {

                skills:
                    skillMatch.score,

                interests:
                    interestMatch.score,

                profile:
                    profileScore

            },

            matchedSkills:
                skillMatch.matchedSkills,

            missingSkills:
                skillMatch.missingSkills,

            matchedInterests:
                interestMatch.matchedInterests

        });

    }

    //Sort Highest Score First

    recommendations.sort(
        (a, b) =>
            b.score - a.score
    );

    //Add Rank

    const rankedRecommendations =
        recommendations
            .slice(0, limit)
            .map(
                (recommendation, index) => ({

                    rank:
                        index + 1,

                    ...recommendation

                })
            );

    return rankedRecommendations;

};

//Get Single Career Recommendation

//Calculates the match between a student and one specific career.

const getCareerRecommendation = async (
    userId,
    careerId
) => {

    //Get Student Profile

    const profile =
        await StudentProfile.findOne({
            userId,
            isActive: true
        }).lean();

    //Student Profile Not Found
    if (!profile) {

        throw new ApiError(
            404,
            "Student profile not found."
        );

    }

    //Get Career

    const career =
        await Career.findOne({
            _id: careerId,
            isActive: true,
            isPublished: true
        }).lean();

    //Career Not Found
    if (!career) {

        throw new ApiError(
            404,
            "Career not found."
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

    //Student Interests

    const studentInterests =
        await StudentInterest.find({
            userId,
            isActive: true
        }).lean();

    //Career Skills

    const careerSkills =
        await CareerSkill.find({
            careerId,
            isActive: true
        })
            .populate(
                "skillId",
                "name category"
            )
            .lean();

    //Calculate Matches

    const skillMatch =
        calculateSkillMatch(
            studentSkills,
            careerSkills
        );

    const interestMatch =
        calculateInterestMatch(
            studentInterests,
            career
        );

    const profileScore =
        calculateProfileMatch(
            profile,
            career
        );

    const overallScore =
        calculateOverallScore({

            skillScore:
                skillMatch.score,

            interestScore:
                interestMatch.score,

            profileScore

        });


    return {

        careerId:
            career._id,

        careerName:
            career.name,

        category:
            career.category,

        description:
            career.description,

        score:
            overallScore,

        breakdown: {

            skills:
                skillMatch.score,

            interests:
                interestMatch.score,

            profile:
                profileScore

        },

        matchedSkills:
            skillMatch.matchedSkills,

        missingSkills:
            skillMatch.missingSkills,

        matchedInterests:
            interestMatch.matchedInterests

    };

};

//Export

module.exports = {

    getCareerRecommendations,
    getCareerRecommendation,
    calculateSkillMatch,
    calculateInterestMatch,
    calculateProfileMatch,
    calculateOverallScore
};