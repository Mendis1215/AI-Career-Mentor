const StudentProfile = require("../models/StudentProfile");
const User = require("../../shared/models/User");
const ApiError = require("../../shared/utils/ApiError");


/*
Get Student Profile

Returns the profile belonging to the authenticated student.
*/

const getProfile = async (userId) => {

    const profile = await StudentProfile.findOne({
        userId
    })
        .populate("userId", "email role")
        .lean();

    if (!profile) {
        throw new ApiError(
            404,
            "Student profile not found."
        );
    }

    return profile;
};


/*
Create Student Profile

Creates a profile for the authenticated student.
*/

const createProfile = async (userId, profileData) => {

    /*
    Check User
    */

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(
            404,
            "User not found."
        );
    }


    /*
    Check Existing Profile
    */

    const existingProfile = await StudentProfile.findOne({
        userId
    });

    if (existingProfile) {
        throw new ApiError(
            409,
            "Student profile already exists."
        );
    }


    /*
    Create Profile
    */

    const profile = await StudentProfile.create({
        userId,
        ...profileData
    });


    /*
    Return Created Profile
    */

    return profile;
};


/*
Update Student Profile

Updates only the authenticated student's profile.
*/

const updateProfile = async (userId, profileData) => {

    const profile = await StudentProfile.findOne({
        userId
    });

    if (!profile) {
        throw new ApiError(
            404,
            "Student profile not found."
        );
    }


    /*
    Prevent User ID Modification
    
    The authenticated user's ID must never be changed through
    the profile update request.
    */

    delete profileData.userId;


    //Update Profile
    
    Object.assign(
        profile,
        profileData
    );


    await profile.save();


    return profile;
};


/*
Delete Student Profile

We do not immediately delete the profile document.
Instead, we deactivate it.
*/

const deleteProfile = async (userId) => {

    const profile = await StudentProfile.findOne({
        userId
    });

    if (!profile) {
        throw new ApiError(
            404,
            "Student profile not found."
        );
    }


    //Soft Delete

    profile.isActive = false;

    await profile.save();


    return {
        message: "Student profile deactivated successfully."
    };
};


/*
Restore Student Profile

Allows an inactive profile to become active again.
*/

const restoreProfile = async (userId) => {

    const profile = await StudentProfile.findOne({
        userId
    });

    if (!profile) {
        throw new ApiError(
            404,
            "Student profile not found."
        );
    }


    profile.isActive = true;

    await profile.save();


    return profile;
};


/*
Check Profile Completion

Calculates how complete the student's profile is.
*/

const getProfileCompletion = async (userId) => {

    const profile = await StudentProfile.findOne({
        userId
    }).lean();

    if (!profile) {
        throw new ApiError(
            404,
            "Student profile not found."
        );
    }


    /*
    Profile Fields
    
    These are the basic fields required for profile completion.
    */

    const fields = [
        "firstName",
        "lastName",
        "degreeProgram",
        "university",
        "graduationYear",
        "bio"
    ];


    let completedFields = 0;


    fields.forEach((field) => {

        const value = profile[field];

        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            completedFields++;
        }

    });


    const totalFields = fields.length;

    const completionPercentage =
        Math.round(
            (completedFields / totalFields) * 100
        );


    return {
        completedFields,
        totalFields,
        completionPercentage
    };
};


//Export Service Functions

module.exports = {

    getProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    restoreProfile,
    getProfileCompletion

};