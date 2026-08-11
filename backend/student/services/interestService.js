const StudentInterest = require("../models/StudentInterest");
const ApiError = require("../../shared/utils/ApiError");


//Get Student Interests

//Returns all active interests belonging to the authenticated student.

const getInterests = async (userId) => {

    const interests = await StudentInterest.find({
        userId,
        isActive: true
    })
        .sort({
            createdAt: -1
        })
        .lean();

    return interests;
};


//Get Single Student Interest

const getInterest = async (
    userId,
    interestId
) => {

    const interest = await StudentInterest.findOne({
        _id: interestId,
        userId,
        isActive: true
    }).lean();

    if (!interest) {
        throw new ApiError(
            404,
            "Student interest not found."
        );
    }

    return interest;
};


//Add Student Interest

//Adds a new career interest to the student's profile.

const addInterest = async (
    userId,
    interestData
) => {

    const {
        interest,
        interestLevel,
        priority,
        description
    } = interestData;


    //Normalize Interest Name

    /*Prevents values such as:
    
     "Machine Learning"
     "machine learning"
     " MACHINE LEARNING "
    
    from being treated unnecessarily differently.
    */

    const normalizedInterest =
        interest
            .trim()
            .toLowerCase();


    //Check Duplicate Interest

    const existingInterest =
        await StudentInterest.findOne({
            userId,
            interest: normalizedInterest
        });


    if (existingInterest) {

        //Reactivate Previously Removed Interest

        if (!existingInterest.isActive) {

            existingInterest.isActive = true;

            if (interestLevel !== undefined) {
                existingInterest.interestLevel =
                    interestLevel;
            }

            if (priority !== undefined) {
                existingInterest.priority =
                    priority;
            }

            if (description !== undefined) {
                existingInterest.description =
                    description;
            }

            await existingInterest.save();

            return existingInterest;
        }


        throw new ApiError(
            409,
            "This interest is already added."
        );
    }


    //Create Interest

    const studentInterest =
        await StudentInterest.create({

            userId,

            interest: normalizedInterest,

            interestLevel,

            priority,

            description,

            isActive: true

        });


    return studentInterest;
};


//Update Student Interest

const updateInterest = async (
    userId,
    interestId,
    interestData
) => {

    const studentInterest =
        await StudentInterest.findOne({
            _id: interestId,
            userId,
            isActive: true
        });


    if (!studentInterest) {

        throw new ApiError(
            404,
            "Student interest not found."
        );

    }


    //Prevent User ID Modification

    delete interestData.userId;


    //Normalize Interest

    if (interestData.interest) {

        interestData.interest =
            interestData.interest
                .trim()
                .toLowerCase();

    }


    //Check Duplicate Interest During Update

    if (interestData.interest) {

        const duplicate =
            await StudentInterest.findOne({

                userId,

                interest:
                    interestData.interest,

                _id: {
                    $ne: interestId
                },

                isActive: true

            });


        if (duplicate) {

            throw new ApiError(
                409,
                "This interest is already added."
            );

        }

    }


    //Update

    Object.assign(
        studentInterest,
        interestData
    );


    await studentInterest.save();


    return studentInterest;
};


//Delete Student Interest

//Soft delete the interest.

const deleteInterest = async (
    userId,
    interestId
) => {

    const studentInterest =
        await StudentInterest.findOne({
            _id: interestId,
            userId,
            isActive: true
        });


    if (!studentInterest) {

        throw new ApiError(
            404,
            "Student interest not found."
        );

    }


    //Soft Delete

    studentInterest.isActive = false;

    await studentInterest.save();


    return {
        message:
            "Student interest removed successfully."
    };
};


//Get High-Priority Interests

//Returns interests marked as high priority.

const getHighPriorityInterests = async (
    userId
) => {

    const interests =
        await StudentInterest.find({

            userId,

            priority: "high",

            isActive: true

        })
            .sort({
                createdAt: -1
            })
            .lean();


    return interests;
};


//Get Strong Interests

//Returns interests where the student has a strong
//level of interest.

const getStrongInterests = async (
    userId
) => {

    const interests =
        await StudentInterest.find({

            userId,

            interestLevel: {
                $in: [
                    "high",
                    "very_high"
                ]
            },

            isActive: true

        })
            .sort({
                createdAt: -1
            })
            .lean();


    return interests;
};


//Get Interest Summary

/*Creates a summary for:
 - Career recommendation
 - Student dashboard
 - AI context
 - RAG context
*/

const getInterestSummary = async (
    userId
) => {

    const interests =
        await StudentInterest.find({

            userId,

            isActive: true

        })
            .lean();


    //Total Interests

    const totalInterests =
        interests.length;


    //Count Priority Levels

    const priority = {

        low: 0,

        medium: 0,

        high: 0

    };


    interests.forEach((item) => {

        if (
            priority[item.priority]
            !== undefined
        ) {

            priority[item.priority]++;

        }

    });


    //Count Interest Levels

    const interestLevels = {

        low: 0,

        medium: 0,

        high: 0,

        very_high: 0

    };


    interests.forEach((item) => {

        if (
            interestLevels[
                item.interestLevel
            ] !== undefined
        ) {

            interestLevels[
                item.interestLevel
            ]++;

        }

    });


    //Return Summary

    return {

        totalInterests,

        priority,

        interestLevels,

        interests

    };
};


//Export

module.exports = {

    getInterests,
    getInterest,
    addInterest,
    updateInterest,
    deleteInterest,
    getHighPriorityInterests,
    getStrongInterests,
    getInterestSummary
};