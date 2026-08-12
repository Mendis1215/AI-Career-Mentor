const careerSkillService = require("../services/careerSkillService");


//Create Career-Skill Relationship

const createCareerSkill = async (req, res, next) => {

    try {

        const careerSkill =
            await careerSkillService.createCareerSkill(
                req.body,
                req.user._id
            );

        return res.status(201).json({

            success: true,

            message:
                "Career-skill relationship created successfully.",

            data: careerSkill

        });

    } catch (error) {

        next(error);

    }

};


//Get All Career-Skill Relationships

const getAllCareerSkills = async (req, res, next) => {

    try {

        const result =
            await careerSkillService.getAllCareerSkills(
                req.query
            );

        return res.status(200).json({

            success: true,

            message:
                "Career-skill relationships retrieved successfully.",

            data: result

        });

    } catch (error) {

        next(error);

    }

};


//Get Career-Skill Relationship By ID

const getCareerSkillById = async (req, res, next) => {

    try {

        const careerSkill =
            await careerSkillService.getCareerSkillById(
                req.params.id
            );

        return res.status(200).json({

            success: true,

            message:
                "Career-skill relationship retrieved successfully.",

            data: careerSkill

        });

    } catch (error) {

        next(error);

    }

};


//Update Career-Skill Relationship

const updateCareerSkill = async (req, res, next) => {

    try {

        const careerSkill =
            await careerSkillService.updateCareerSkill(

                req.params.id,

                req.body,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Career-skill relationship updated successfully.",

            data: careerSkill

        });

    } catch (error) {

        next(error);

    }

};


//Delete Career-Skill Relationship

const deleteCareerSkill = async (req, res, next) => {

    try {

        const result =
            await careerSkillService.deleteCareerSkill(
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


//Get Skills For Career

const getSkillsForCareer = async (req, res, next) => {

    try {

        const skills =
            await careerSkillService.getSkillsForCareer(

                req.params.careerId,

                req.query

            );

        return res.status(200).json({

            success: true,

            message:
                "Skills for career retrieved successfully.",

            data: skills

        });

    } catch (error) {

        next(error);

    }

};


//Get Careers For Skill

const getCareersForSkill = async (req, res, next) => {

    try {

        const careers =
            await careerSkillService.getCareersForSkill(

                req.params.skillId,

                req.query

            );

        return res.status(200).json({

            success: true,

            message:
                "Careers for skill retrieved successfully.",

            data: careers

        });

    } catch (error) {

        next(error);

    }

};


//Update Career-Skill Display Order

const updateCareerSkillOrder = async (
    req,
    res,
    next
) => {

    try {

        const careerSkill =
            await careerSkillService.updateCareerSkillOrder(

                req.params.id,

                req.body.displayOrder,

                req.user._id

            );

        return res.status(200).json({

            success: true,

            message:
                "Career-skill display order updated successfully.",

            data: careerSkill

        });

    } catch (error) {

        next(error);

    }

};


//Export Controllers

module.exports = {

    createCareerSkill,

    getAllCareerSkills,

    getCareerSkillById,

    updateCareerSkill,

    deleteCareerSkill,

    getSkillsForCareer,

    getCareersForSkill,

    updateCareerSkillOrder

};