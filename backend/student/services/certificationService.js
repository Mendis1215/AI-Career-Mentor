const StudentProfile = require("../models/StudentProfile");
const StudentCertification = require("../models/StudentCertification");

const Career = require("../../careerCMS/models/Career");
const Certification = require("../../careerCMS/models/Certification");

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

//Get Student Certifications

const getStudentCertifications = async (
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

    const certifications =
        await StudentCertification.find({

            userId,

            isActive: true

        })
            .populate(
                "certificationId",
                "name provider category level description"
            )
            .sort({
                issueDate: -1
            })
            .lean();

    return certifications;

};

//Get Certification By ID

const getStudentCertificationById = async (
    userId,
    certificationId
) => {

    const certification =
        await StudentCertification.findOne({

            _id: certificationId,

            userId,

            isActive: true

        })
            .populate(
                "certificationId",
                "name provider category level description"
            )
            .lean();

    if (!certification) {

        throw new ApiError(
            404,
            "Student certification not found."
        );

    }

    return certification;
};

//Add Student Certification

const addStudentCertification = async (
    userId,
    certificationData
) => {

    //Verify Student

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

    //Validate Name

    if (
        !certificationData.name ||
        !certificationData.name.trim()
    ) {

        throw new ApiError(
            400,
            "Certification name is required."
        );
    }

    //Create Certification

    const certification =
        new StudentCertification({

            userId,

            name:
                certificationData.name.trim(),

            provider:
                certificationData.provider
                    ?.trim() || "",

            credentialId:
                certificationData.credentialId
                    ?.trim() || "",

            credentialUrl:
                certificationData.credentialUrl
                    ?.trim() || "",

            issueDate:
                certificationData.issueDate ||
                null,

            expiryDate:
                certificationData.expiryDate ||
                null,

            category:
                certificationData.category
                    ?.trim() || "",

            level:
                certificationData.level
                    ?.trim() || "",

            description:
                certificationData.description
                    ?.trim() || "",

            isVerified:
                Boolean(
                    certificationData.isVerified
                ),

            isActive:
                true

        });

    await certification.save();

    return certification;

};

//Update Student Certification

const updateStudentCertification = async (
    userId,
    certificationId,
    updateData
) => {

    const certification =
        await StudentCertification.findOne({

            _id: certificationId,

            userId,

            isActive: true

        });

    if (!certification) {

        throw new ApiError(
            404,
            "Student certification not found."
        );

    }

    const allowedFields = [

        "name",

        "provider",

        "credentialId",

        "credentialUrl",

        "issueDate",

        "expiryDate",

        "category",

        "level",

        "description",

        "isVerified"

    ];

    allowedFields.forEach(
        (field) => {

            if (
                updateData[field] !==
                undefined
            ) {

                certification[field] =
                    updateData[field];

            }
        }
    );

    await certification.save();

    return certification;

};

//Delete Student Certification

const deleteStudentCertification = async (
    userId,
    certificationId
) => {

    const certification =
        await StudentCertification.findOne({

            _id: certificationId,

            userId,

            isActive: true

        });

    if (!certification) {

        throw new ApiError(
            404,
            "Student certification not found."
        );
    }

    //Soft Delete

    certification.isActive =
        false;

    await certification.save();

    return {

        message:
            "Certification deleted successfully."

    };
};

//Check Certification Expiry

const getCertificationStatus = (
    certification
) => {

    if (
        !certification.expiryDate
    ) {

        return "valid";

    }

    const today =
        new Date();

    const expiryDate =
        new Date(
            certification.expiryDate
        );

    if (
        expiryDate <
        today
    ) {

        return "expired";

    }

    const daysRemaining =

        (
            expiryDate -
            today
        )

        /

        (
            1000 *
            60 *
            60 *
            24
        );

    if (
        daysRemaining <=
        30
    ) {

        return "expiring_soon";

    }

    return "valid";

};

//Add Status To Certifications

const formatCertificationStatus = (
    certifications
) => {

    return certifications.map(
        (certification) => {

            return {

                ...certification,

                status:
                    getCertificationStatus(
                        certification
                    )
            };
        }
    );
};

//Get Valid Certifications

const getValidCertifications = async (
    userId
) => {

    const certifications =
        await getStudentCertifications(
            userId
        );

    return formatCertificationStatus(
        certifications
    ).filter(

        certification =>
            certification.status !==
            "expired"

    );
};

//Get Expired Certifications

const getExpiredCertifications = async (
    userId
) => {

    const certifications =
        await getStudentCertifications(
            userId
        );

    return formatCertificationStatus(
        certifications
    ).filter(

        certification =>
            certification.status ===
            "expired"

    );
};

/*
Calculate Certification Portfolio Score
3+ valid certifications = 100%.
*/

const calculateCertificationPortfolioScore = (
    certifications
) => {

    if (!certifications.length) {

        return {

            score: 0,

            total:
                0,

            valid:
                0,

            expired:
                0,

            verified:
                0

        };
    }

    const formatted =
        formatCertificationStatus(
            certifications
        );

    const valid =
        formatted.filter(

            certification =>
                certification.status !==
                "expired"

        ).length;

    const expired =
        formatted.filter(

            certification =>
                certification.status ===
                "expired"

        ).length;

    const verified =
        formatted.filter(

            certification =>
                certification.isVerified ===
                true

        ).length;

    //Number of Certifications

    const certificationCountScore =
        clampScore(

            (
                valid /
                3
            ) * 100

        );

    //Verification Score

    const verificationScore =

        valid > 0

            ? (
                verified /
                valid
            ) * 100

            : 0;

    //Validity Score

    const validityScore =

        certifications.length > 0

            ? (
                valid /
                certifications.length
            ) * 100

            : 0;

    //Final Score

    const score =

        (
            certificationCountScore *
            0.50
        )

        +

        (
            verificationScore *
            0.25
        )

        +

        (
            validityScore *
            0.25
        );

    return {

        score:
            roundScore(
                clampScore(
                    score
                )
            ),

        total:
            certifications.length,

        valid,

        expired,

        verified

    };
};

//Get Certification Portfolio Summary

const getCertificationSummary = async (
    userId
) => {

    const certifications =
        await getStudentCertifications(
            userId
        );

    const formatted =
        formatCertificationStatus(
            certifications
        );

    const score =
        calculateCertificationPortfolioScore(
            certifications
        );

    return {

        total:
            formatted.length,

        valid:
            score.valid,

        expired:
            score.expired,

        verified:
            score.verified,

        expiringSoon:
            formatted.filter(

                certification =>
                    certification.status ===
                    "expiring_soon"

            ).length,

        score:
            score.score

    };
};

//Get Career Certification Recommendations

const getRecommendedCertifications = async (
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

    //Get CMS Certifications

    const certifications =
        await Certification.find({

            careerId,

            isActive: true,

            isPublished: true

        }).lean();

    //Get Student Certifications

    const studentCertifications =
        await getStudentCertifications(
            userId
        );

    //Create Student Certification Set

    const studentCertificationNames =
        new Set();

    studentCertifications.forEach(
        (certification) => {

            const name =

                certification
                    .certificationId
                    ?.name

                ||

                certification.name;

            if (!name) {
                return;
            }

            studentCertificationNames.add(

                normalizeText(
                    name
                )
            );
        }
    );

    //Determine Completion

    const recommendations =
        certifications.map(
            (certification) => {

                const certificationName =
                    certification.name;

                const completed =
                    studentCertificationNames.has(

                        normalizeText(
                            certificationName
                        )
                    );

                return {

                    certificationId:
                        certification._id,

                    name:
                        certification.name,

                    provider:
                        certification.provider,

                    category:
                        certification.category,

                    level:
                        certification.level,

                    description:
                        certification.description,

                    url:
                        certification.url,

                    completed,

                    status:
                        completed
                            ? "completed"
                            : "recommended"
                };
            }
        );

    //Recommended First

    recommendations.sort(

        (a, b) => {

            if (
                a.completed ===
                b.completed
            ) {
                return 0;
            }

            return a.completed
                ? 1
                : -1;
        }
    );
    return recommendations;

};

//Get Missing Career Certifications

const getMissingCareerCertifications = async (
    userId,
    careerId
) => {

    const recommendations =
        await getRecommendedCertifications(
            userId,
            careerId
        );

    return recommendations.filter(

        certification =>
            !certification.completed

    );
};

//Export

module.exports = {

    getStudentCertifications,
    getStudentCertificationById,
    addStudentCertification,
    updateStudentCertification,
    deleteStudentCertification,
    getCertificationStatus,
    formatCertificationStatus,
    getValidCertifications,
    getExpiredCertifications,
    calculateCertificationPortfolioScore,
    getCertificationSummary,
    getRecommendedCertifications,
    getMissingCareerCertifications
};