// Context Formatter
// Converts application data into clean, consistent context structures
// that can be consumed by the AI prompt builder and AI services.


// Safe Value

const safeValue = (
    value,
    fallback = null
) => {

    if (
        value === undefined ||
        value === null
    ) {

        return fallback;

    }

    return value;

};


// Safe String

const safeString = (
    value,
    fallback = ""
) => {

    if (
        value === undefined ||
        value === null
    ) {

        return fallback;

    }

    return String(value).trim();

};


// Convert Mongoose Document

const toPlainObject = (
    data
) => {

    if (!data) {

        return null;

    }


    if (
        typeof data.toObject === "function"
    ) {

        return data.toObject();

    }


    if (
        typeof data.toJSON === "function"
    ) {

        return data.toJSON();

    }


    return data;

};


// Format Student Profile

const formatStudentProfile = (
    profile
) => {

    if (!profile) {

        return {

            name: null,

            degree: null,

            university: null,

            year: null,

            bio: null,

            location: null

        };

    }


    const data =
        toPlainObject(profile);


    return {

        id:
            safeValue(
                data._id
            ),

        name:
            safeString(
                data.name
            ),

        degree:
            safeString(
                data.degree
            ),

        university:
            safeString(
                data.university
            ),

        year:
            safeValue(
                data.year
            ),

        bio:
            safeString(
                data.bio
            ),

        location:
            safeString(
                data.location
            ),

        phone:
            safeString(
                data.phone
            ),

        profileCompleted:
            Boolean(
                data.profileCompleted
            )

    };

};


// Format Skills

const formatSkills = (
    skills = []
) => {

    if (!Array.isArray(skills)) {

        return [];

    }


    return skills.map(
        (skill) => {

            const data =
                toPlainObject(
                    skill
                );


            if (
                typeof skill === "string"
            ) {

                return {

                    name:
                        skill,

                    level:
                        null,

                    years:
                        null

                };

            }


            return {

                id:
                    safeValue(
                        data?._id
                    ),

                name:
                    safeString(
                        data?.name ||
                        data?.skill ||
                        data?.skillName
                    ),

                level:
                    safeString(
                        data?.level
                    ),

                years:
                    safeValue(
                        data?.years ||
                        data?.yearsOfExperience
                    ),

                category:
                    safeString(
                        data?.category
                    )

            };

        }
    );

};


// Format Interests

const formatInterests = (
    interests = []
) => {

    if (!Array.isArray(interests)) {

        return [];

    }


    return interests.map(
        (interest) => {

            const data =
                toPlainObject(
                    interest
                );


            if (
                typeof interest === "string"
            ) {

                return {

                    name:
                        interest

                };

            }


            return {

                id:
                    safeValue(
                        data?._id
                    ),

                name:
                    safeString(
                        data?.name ||
                        data?.interest ||
                        data?.interestName
                    ),

                category:
                    safeString(
                        data?.category
                    ),

                priority:
                    safeValue(
                        data?.priority
                    )

            };

        }
    );

};


// Format Certifications

const formatCertifications = (
    certifications = []
) => {

    if (!Array.isArray(certifications)) {

        return [];

    }


    return certifications.map(
        (certification) => {

            const data =
                toPlainObject(
                    certification
                );


            return {

                id:
                    safeValue(
                        data?._id
                    ),

                name:
                    safeString(
                        data?.name ||
                        data?.title
                    ),

                provider:
                    safeString(
                        data?.provider
                    ),

                issueDate:
                    safeValue(
                        data?.issueDate
                    ),

                expiryDate:
                    safeValue(
                        data?.expiryDate
                    ),

                credentialId:
                    safeString(
                        data?.credentialId
                    ),

                url:
                    safeString(
                        data?.url
                    )

            };

        }
    );

};


// Format Student Progress

const formatStudentProgress = (
    progress
) => {

    if (!progress) {

        return {

            completed:
                0,

            inProgress:
                0,

            percentage:
                0

        };

    }


    const data =
        toPlainObject(
            progress
        );


    return {

        completed:
            Number(
                data.completed ||
                data.completedItems ||
                0
            ),

        inProgress:
            Number(
                data.inProgress ||
                data.inProgressItems ||
                0
            ),

        percentage:
            Number(
                data.percentage ||
                data.completionPercentage ||
                0
            ),

        currentStage:
            safeString(
                data.currentStage
            )

    };

};


// Format Complete Student Context

const formatStudentContext = ({
    profile,
    skills,
    interests,
    certifications,
    progress
} = {}) => {

    return {

        profile:
            formatStudentProfile(
                profile
            ),

        skills:
            formatSkills(
                skills
            ),

        interests:
            formatInterests(
                interests
            ),

        certifications:
            formatCertifications(
                certifications
            ),

        progress:
            formatStudentProgress(
                progress
            )

    };

};


// Format Career

const formatCareer = (
    career
) => {

    if (!career) {

        return null;

    }


    const data =
        toPlainObject(
            career
        );


    return {

        id:
            safeValue(
                data?._id
            ),

        name:
            safeString(
                data?.name ||
                data?.title
            ),

        description:
            safeString(
                data?.description
            ),

        industry:
            safeString(
                data?.industry
            ),

        level:
            safeString(
                data?.level
            ),

        skills:
            formatSkills(
                data?.skills ||
                data?.requiredSkills ||
                []
            ),

        responsibilities:
            Array.isArray(
                data?.responsibilities
            )
                ? data.responsibilities
                : [],

        salaryRange:
            safeValue(
                data?.salaryRange
            )

    };

};


// Format Roadmap

const formatRoadmap = (
    roadmap
) => {

    if (!roadmap) {

        return null;

    }


    const data =
        toPlainObject(
            roadmap
        );


    return {

        id:
            safeValue(
                data?._id
            ),

        title:
            safeString(
                data?.title ||
                data?.name
            ),

        description:
            safeString(
                data?.description
            ),

        career:
            formatCareer(
                data?.career
            ),

        stages:
            Array.isArray(
                data?.stages
            )
                ? data.stages.map(
                    (stage) => {

                        const stageData =
                            toPlainObject(
                                stage
                            );

                        return {

                            id:
                                safeValue(
                                    stageData?._id
                                ),

                            title:
                                safeString(
                                    stageData?.title ||
                                    stageData?.name
                                ),

                            description:
                                safeString(
                                    stageData?.description
                                ),

                            order:
                                safeValue(
                                    stageData?.order
                                ),

                            skills:
                                formatSkills(
                                    stageData?.skills ||
                                    []
                                )

                        };

                    }
                )
                : []

    };

};


// Format Skill Gap

const formatSkillGap = (
    skillGap
) => {

    if (!skillGap) {

        return null;

    }


    const data =
        toPlainObject(
            skillGap
        );


    return {

        currentSkills:
            formatSkills(
                data?.currentSkills ||
                []
            ),

        requiredSkills:
            formatSkills(
                data?.requiredSkills ||
                []
            ),

        matchedSkills:
            formatSkills(
                data?.matchedSkills ||
                []
            ),

        missingSkills:
            formatSkills(
                data?.missingSkills ||
                []
            ),

        overallGap:
            safeValue(
                data?.overallGap
            ),

        readinessScore:
            safeValue(
                data?.readinessScore
            )

    };

};


// Format Project

const formatProject = (
    project
) => {

    if (!project) {

        return null;

    }


    const data =
        toPlainObject(
            project
        );


    return {

        id:
            safeValue(
                data?._id
            ),

        title:
            safeString(
                data?.title ||
                data?.name
            ),

        description:
            safeString(
                data?.description
            ),

        difficulty:
            safeString(
                data?.difficulty
            ),

        technologies:
            Array.isArray(
                data?.technologies
            )
                ? data.technologies
                : [],

        skills:
            formatSkills(
                data?.skills ||
                data?.requiredSkills ||
                []
            ),

        objectives:
            Array.isArray(
                data?.objectives
            )
                ? data.objectives
                : []

    };

};


// Format GitHub Profile

const formatGithubProfile = (
    github
) => {

    if (!github) {

        return null;

    }


    const data =
        toPlainObject(
            github
        );


    return {

        username:
            safeString(
                data?.username
            ),

        profileUrl:
            safeString(
                data?.profileUrl
            ),

        publicRepositories:
            Number(
                data?.publicRepositories ||
                data?.publicRepos ||
                0
            ),

        followers:
            Number(
                data?.followers ||
                0
            ),

        following:
            Number(
                data?.following ||
                0
            ),

        languages:
            Array.isArray(
                data?.languages
            )
                ? data.languages
                : [],

        repositories:
            Array.isArray(
                data?.repositories
            )
                ? data.repositories
                : [],

        analysis:
            safeString(
                data?.analysis
            )

    };

};


// Format Conversation Message

const formatMessage = (
    message
) => {

    if (!message) {

        return null;

    }


    const data =
        toPlainObject(
            message
        );


    return {

        id:
            safeValue(
                data?._id
            ),

        role:
            safeString(
                data?.role
            ),

        content:
            safeString(
                data?.content
            ),

        type:
            safeString(
                data?.type,
                "text"
            ),

        createdAt:
            safeValue(
                data?.createdAt
            )

    };

};


// Format Conversation History

const formatConversationHistory = (
    messages = [],
    maxMessages = 20
) => {

    if (!Array.isArray(messages)) {

        return [];

    }


    return messages
        .slice(-maxMessages)
        .map(
            formatMessage
        )
        .filter(Boolean);

};


// Format RAG Document

const formatRAGDocument = (
    document
) => {

    if (!document) {

        return null;

    }


    const data =
        toPlainObject(
            document
        );


    return {

        documentId:
            safeValue(
                data?.documentId ||
                data?._id
            ),

        chunkId:
            safeString(
                data?.chunkId
            ),

        title:
            safeString(
                data?.title ||
                data?.name
            ),

        content:
            safeString(
                data?.content ||
                data?.text ||
                data?.chunk
            ),

        score:
            data?.score !== undefined
                ? Number(data.score)
                : null,

        source:
            safeString(
                data?.source
            )

    };

};


// Format RAG Results

const formatRAGResults = (
    documents = [],
    maxDocuments = 8
) => {

    if (!Array.isArray(documents)) {

        return [];

    }


    return documents
        .slice(0, maxDocuments)
        .map(
            formatRAGDocument
        )
        .filter(
            (document) =>
                document &&
                document.content
        );

};


// Format AI Context

const formatAIContext = ({
    student,
    career,
    roadmap,
    skillGap,
    project,
    github,
    messages,
    retrievedDocuments
} = {}) => {

    return {

        student:
            formatStudentContext(
                student
            ),

        career:
            formatCareer(
                career
            ),

        roadmap:
            formatRoadmap(
                roadmap
            ),

        skillGap:
            formatSkillGap(
                skillGap
            ),

        project:
            formatProject(
                project
            ),

        github:
            formatGithubProfile(
                github
            ),

        conversationHistory:
            formatConversationHistory(
                messages
            ),

        retrievedDocuments:
            formatRAGResults(
                retrievedDocuments
            )

    };

};


// Remove Empty Values

const removeEmptyValues = (
    object
) => {

    if (
        !object ||
        typeof object !== "object"
    ) {

        return object;

    }


    if (Array.isArray(object)) {

        return object
            .map(
                removeEmptyValues
            )
            .filter(
                (value) =>
                    value !== null &&
                    value !== undefined &&
                    value !== ""
            );

    }


    const result = {};


    Object.entries(
        object
    ).forEach(
        ([key, value]) => {

            if (
                value === null ||
                value === undefined ||
                value === ""
            ) {

                return;

            }


            if (
                typeof value === "object"
            ) {

                const cleaned =
                    removeEmptyValues(
                        value
                    );


                if (
                    Array.isArray(cleaned)
                ) {

                    if (
                        cleaned.length > 0
                    ) {

                        result[key] =
                            cleaned;

                    }

                    return;

                }


                if (
                    Object.keys(cleaned)
                        .length > 0
                ) {

                    result[key] =
                        cleaned;

                }

                return;

            }


            result[key] =
                value;

        }
    );


    return result;

};


// Convert Context To JSON

const contextToJSON = (
    context
) => {

    return JSON.stringify(
        context,
        null,
        2
    );

};


// Export

module.exports = {

    safeValue,

    safeString,

    toPlainObject,

    formatStudentProfile,

    formatSkills,

    formatInterests,

    formatCertifications,

    formatStudentProgress,

    formatStudentContext,

    formatCareer,

    formatRoadmap,

    formatSkillGap,

    formatProject,

    formatGithubProfile,

    formatMessage,

    formatConversationHistory,

    formatRAGDocument,

    formatRAGResults,

    formatAIContext,

    removeEmptyValues,

    contextToJSON

};