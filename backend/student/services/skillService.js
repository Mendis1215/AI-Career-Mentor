const StudentSkill = require("../models/StudentSkill");
const Skill = require("../../careerCMS/models/Skill");
const ApiError = require("../../shared/utils/ApiError");


//Get Student Skills
//Returns all skills belonging to the authenticated student.

const getSkills = async (userId) => {

    const skills = await StudentSkill.find({
        userId,
        isActive: true
    })
        .populate(
            "skillId",
            "name category description"
        )
        .sort({
            createdAt: -1
        })
        .lean();

    return skills;
};


//Get Single Student Skill

const getSkill = async (userId, skillId) => {

    const studentSkill = await StudentSkill.findOne({
        _id: skillId,
        userId,
        isActive: true
    })
        .populate(
            "skillId",
            "name category description"
        )
        .lean();

    if (!studentSkill) {
        throw new ApiError(
            404,
            "Student skill not found."
        );
    }

    return studentSkill;
};


//Add Student Skill
//Adds a skill to the authenticated student's profile.

const addSkill = async (userId, skillData) => {

    const {
        skillId,
        proficiencyLevel,
        yearsOfExperience,
        isPrimary
    } = skillData;


    //Check Skill
    //The skill must already exist in the Career CMS.

    const skill = await Skill.findById(skillId);

    if (!skill) {
        throw new ApiError(
            404,
            "Skill not found in the career database."
        );
    }


    //Check Duplicate

    const existingSkill = await StudentSkill.findOne({
        userId,
        skillId
    });

    if (existingSkill) {

        //If previously deactivated, reactivate it

        if (!existingSkill.isActive) {

            existingSkill.isActive = true;

            if (proficiencyLevel !== undefined) {
                existingSkill.proficiencyLevel =
                    proficiencyLevel;
            }

            if (yearsOfExperience !== undefined) {
                existingSkill.yearsOfExperience =
                    yearsOfExperience;
            }

            if (isPrimary !== undefined) {
                existingSkill.isPrimary =
                    isPrimary;
            }

            await existingSkill.save();

            return existingSkill;
        }


        throw new ApiError(
            409,
            "This skill is already added to the student's profile."
        );
    }


    //Create Student Skill

    const studentSkill = await StudentSkill.create({

        userId,

        skillId,

        proficiencyLevel,

        yearsOfExperience,

        isPrimary

    });


    //Return Populated Skill

    return await StudentSkill.findById(
        studentSkill._id
    )
        .populate(
            "skillId",
            "name category description"
        );
};


//Update Student Skill

const updateSkill = async (
    userId,
    skillId,
    skillData
) => {

    //Find Skill Belonging to Student

    const studentSkill = await StudentSkill.findOne({
        _id: skillId,
        userId,
        isActive: true
    });

    if (!studentSkill) {
        throw new ApiError(
            404,
            "Student skill not found."
        );
    }


    //Prevent Skill ID Modification

    delete skillData.userId;

    delete skillData.skillId;


    //Update

    Object.assign(
        studentSkill,
        skillData
    );


    await studentSkill.save();


    //Return Updated Skill

    return await StudentSkill.findById(
        studentSkill._id
    )
        .populate(
            "skillId",
            "name category description"
        );
};


//Delete Student Skill
//Soft delete instead of permanently removing the record.

const deleteSkill = async (
    userId,
    skillId
) => {

    const studentSkill = await StudentSkill.findOne({
        _id: skillId,
        userId,
        isActive: true
    });

    if (!studentSkill) {
        throw new ApiError(
            404,
            "Student skill not found."
        );
    }


    //Soft Delete
    

    studentSkill.isActive = false;

    await studentSkill.save();


    return {
        message: "Student skill removed successfully."
    };
};


//Get Skills by Proficiency Level
//Useful for career readiness and skill-gap analysis.

const getSkillsByProficiency = async (
    userId,
    proficiencyLevel
) => {

    const skills = await StudentSkill.find({
        userId,
        proficiencyLevel,
        isActive: true
    })
        .populate(
            "skillId",
            "name category description"
        )
        .lean();

    return skills;
};


//Get Primary Skills
//Returns the skills marked as primary by the student.

const getPrimarySkills = async (userId) => {

    const skills = await StudentSkill.find({
        userId,
        isPrimary: true,
        isActive: true
    })
        .populate(
            "skillId",
            "name category description"
        )
        .lean();

    return skills;
};


//Get Skill Summary
/*
 Provides a summary that can later be used by:

 - Career recommendation
 - Skill gap analysis
 - Internship readiness
 - AI/RAG context

*/

const getSkillSummary = async (userId) => {

    const skills = await StudentSkill.find({
        userId,
        isActive: true
    })
        .populate(
            "skillId",
            "name category"
        )
        .lean();


    //Count Skills

    const totalSkills = skills.length;


    //Count Primary Skills

    const primarySkills = skills.filter(
        skill => skill.isPrimary
    ).length;


    //Group by Proficiency

    const proficiency = {
        beginner: 0,
        intermediate: 0,
        advanced: 0,
        expert: 0
    };


    skills.forEach((skill) => {

        if (
            proficiency[
                skill.proficiencyLevel
            ] !== undefined
        ) {

            proficiency[
                skill.proficiencyLevel
            ]++;

        }

    });


    return {

        totalSkills,

        primarySkills,

        proficiency,

        skills

    };
};


//Export

module.exports = {

    getSkills,

    getSkill,

    addSkill,

    updateSkill,

    deleteSkill,

    getSkillsByProficiency,

    getPrimarySkills,

    getSkillSummary

};