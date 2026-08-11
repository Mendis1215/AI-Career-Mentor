const axios = require("axios");

const GitHubProfile = require("../models/GitHubProfile");
const StudentProfile = require("../models/StudentProfile");

const ApiError = require("../../shared/utils/ApiError");

//GitHub API Configuration


const GITHUB_API_URL =
    "https://api.github.com";

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

//GitHub API Headers

const getGitHubHeaders = () => {

    const headers = {

        Accept:
            "application/vnd.github+json",

        "X-GitHub-Api-Version":
            "2022-11-28"
    };

    /*
    Optional GitHub Token
    
    A token increases API rate limits.
    */

    if (
        process.env.GITHUB_TOKEN
    ) {

        headers.Authorization =
            `Bearer ${process.env.GITHUB_TOKEN}`;

    }

    return headers;
};

//Get GitHub User

const fetchGitHubUser = async (
    username
) => {

    try {

        const response =
            await axios.get(

                `${GITHUB_API_URL}/users/${username}`,

                {
                    headers:
                        getGitHubHeaders(),

                    timeout:
                        10000

                }

            );


        return response.data;

    }

    catch (error) {

        if (
            error.response?.status ===
            404
        ) {

            throw new ApiError(
                404,
                "GitHub user not found."
            );
        }

        throw new ApiError(
            502,
            "Unable to connect to GitHub."
        );
    }
};

//Get GitHub Repositories

const fetchGitHubRepositories = async (
    username
) => {

    try {

        const response =
            await axios.get(

                `${GITHUB_API_URL}/users/${username}/repos`,

                {

                    params: {

                        per_page: 100,

                        sort:
                            "updated",

                        direction:
                            "desc"

                    },

                    headers:
                        getGitHubHeaders(),

                    timeout:
                        10000

                }

            );

        return response.data;

    }

    catch (error) {

        throw new ApiError(
            502,
            "Unable to retrieve GitHub repositories."
        );
    }
};

//Get Repository Languages

const fetchRepositoryLanguages = async (
    owner,
    repository
) => {

    try {

        const response =
            await axios.get(

                `${GITHUB_API_URL}/repos/${owner}/${repository}/languages`,

                {

                    headers:
                        getGitHubHeaders(),

                    timeout:
                        10000

                }

            );


        return response.data;

    }

    catch (error) {

        return {};

    }
};


//Get GitHub Events

const fetchGitHubEvents = async (
    username
) => {

    try {

        const response =
            await axios.get(

                `${GITHUB_API_URL}/users/${username}/events/public`,

                {

                    params: {

                        per_page: 100

                    },

                    headers:
                        getGitHubHeaders(),

                    timeout:
                        10000

                }

            );


        return response.data;

    }

    catch (error) {

        return [];

    }
};

//Build Repository Summary

const buildRepositorySummary = (
    repositories
) => {

    return repositories.map(
        (repository) => {

            return {

                name:
                    repository.name,

                fullName:
                    repository.full_name,

                description:
                    repository.description,

                url:
                    repository.html_url,

                language:
                    repository.language,

                stars:
                    repository.stargazers_count,

                forks:
                    repository.forks_count,

                size:
                    repository.size,

                isFork:
                    repository.fork,

                createdAt:
                    repository.created_at,

                updatedAt:
                    repository.updated_at,

                topics:
                    repository.topics || []

            };
        }
    );
};

//Calculate GitHub Activity

const calculateGitHubActivity = (
    repositories,
    events
) => {

    const repositoryCount =
        repositories.length;


    const originalRepositories =
        repositories.filter(

            repository =>
                !repository.fork

        ).length;

    const totalStars =
        repositories.reduce(

            (total, repository) =>

                total +
                (
                    repository.stargazers_count ||
                    0
                ),
            0
        );

    const totalForks =
        repositories.reduce(

            (total, repository) =>

                total +
                (
                    repository.forks_count ||
                    0
                ),
            0
        );

    const recentEvents =
        events.length;

    return {

        repositoryCount,

        originalRepositories,

        totalStars,

        totalForks,

        recentEvents

    };

};

//Calculate Language Distribution

const calculateLanguageDistribution = (
    repositories
) => {

    const languageCounts = {};

    repositories.forEach(
        (repository) => {

            const language =
                repository.language;

            if (!language) {

                return;

            }

            languageCounts[language] =
                (
                    languageCounts[language] ||
                    0
                ) + 1;

        }
    );


    return languageCounts;
};

/*
| Calculate GitHub Readiness Score

| Score components:
|
| Profile completeness  -> 20%
| Repository quality    -> 30%
| Activity              -> 20%
| Technology diversity  -> 20%
| Open-source signals   -> 10%

*/

const calculateGitHubReadinessScore = ({
    githubUser,
    repositories,
    events
}) => {

    /*
    | Profile Score
    */

    let profileScore = 0;


    if (
        githubUser.name
    ) {

        profileScore += 5;

    }


    if (
        githubUser.bio
    ) {

        profileScore += 5;

    }


    if (
        githubUser.company
    ) {

        profileScore += 2;

    }


    if (
        githubUser.location
    ) {

        profileScore += 3;

    }


    if (
        githubUser.blog
    ) {

        profileScore += 2;

    }


    if (
        githubUser.email
    ) {

        profileScore += 3;

    }

    profileScore =
        clampScore(
            (
                profileScore /
                20
            ) * 100
        );

    //Repository Quality
    
    const originalRepositories =
        repositories.filter(

            repository =>
                !repository.fork

        );

    const repositoryCountScore =
        clampScore(

            (
                originalRepositories.length /
                5
            ) * 100

        );

    const documentedRepositories =
        originalRepositories.filter(

            repository =>
                repository.description

        ).length;

    const documentationScore =

        originalRepositories.length > 0

            ? (
                documentedRepositories /
                originalRepositories.length
            ) * 100

            : 0;

    const repositoryQualityScore =

        (
            repositoryCountScore *
            0.60
        )

        +

        (
            documentationScore *
            0.40
        );

    //Activity Score

    const activityRepositoryScore =
        clampScore(

            (
                repositories.length /
                5
            ) * 100

        );

    const eventScore =
        clampScore(

            (
                events.length /
                20
            ) * 100

        );

    const activityScore =

        (
            activityRepositoryScore *
            0.50
        )

        +

        (
            eventScore *
            0.50
        );

    //Technology Diversity

    const languages =
        new Set();

    repositories.forEach(
        (repository) => {

            if (
                repository.language
            ) {

                languages.add(
                    repository.language
                );

            }

        }
    );

    const technologyScore =
        clampScore(

            (
                languages.size /
                5
            ) * 100

        );

    //Open Source Score

    const starredRepositories =
        originalRepositories.filter(

            repository =>
                (
                    repository.stargazers_count ||
                    0
                ) > 0

        ).length;

    const openSourceScore =

        originalRepositories.length > 0

            ? clampScore(

                (
                    starredRepositories /
                    originalRepositories.length
                ) * 100

            )
            : 0;

    //Final Score

    const score =

        (
            profileScore *
            0.20
        )

        +

        (
            repositoryQualityScore *
            0.30
        )

        +

        (
            activityScore *
            0.20
        )

        +

        (
            technologyScore *
            0.20
        )

        +

        (
            openSourceScore *
            0.10
        );

    return {

        score:
            roundScore(
                clampScore(
                    score
                )
            ),

        breakdown: {

            profile:
                roundScore(
                    profileScore
                ),

            repositoryQuality:
                roundScore(
                    repositoryQualityScore
                ),

            activity:
                roundScore(
                    activityScore
                ),

            technologyDiversity:
                roundScore(
                    technologyScore
                ),

            openSource:
                roundScore(
                    openSourceScore
                )

        }

    };

};

//Analyze GitHub Profile

const analyzeGitHubProfile = async (
    userId,
    username
) => {

    //Verify Student

    const studentProfile =
        await StudentProfile.findOne({

            userId,

            isActive: true

        }).lean();

    if (!studentProfile) {

        throw new ApiError(
            404,
            "Student profile not found."
        );
    }

    //Validate Username

    if (
        !username ||
        !username.trim()
    ) {

        throw new ApiError(
            400,
            "GitHub username is required."
        );
    }

    username =
        username.trim();

    //Fetch GitHub Data

    const githubUser =
        await fetchGitHubUser(
            username
        );


    const repositories =
        await fetchGitHubRepositories(
            username
        );


    const events =
        await fetchGitHubEvents(
            username
        );

    //Repository Summary

    const repositorySummary =
        buildRepositorySummary(
            repositories
        );

    //Activity

    const activity =
        calculateGitHubActivity(

            repositories,

            events

        );

    //Languages

    const languages =
        calculateLanguageDistribution(
            repositories
        );

    //Readiness Score

    const readiness =
        calculateGitHubReadinessScore({

            githubUser,

            repositories,

            events

        });

    //Prepare Data

    const analysisData = {

        username:
            githubUser.login,

        profileUrl:
            githubUser.html_url,

        name:
            githubUser.name,

        bio:
            githubUser.bio,

        avatarUrl:
            githubUser.avatar_url,

        publicRepositories:
            githubUser.public_repos,

        followers:
            githubUser.followers,

        following:
            githubUser.following,

        publicGists:
            githubUser.public_gists,

        accountCreatedAt:
            githubUser.created_at,

        accountUpdatedAt:
            githubUser.updated_at,

        repositories:
            repositorySummary,

        activity,

        languages,

        readinessScore:
            readiness.score,

        readinessBreakdown:
            readiness.breakdown,

        analyzedAt:
            new Date()

    };

    //Save / Update GitHub Profile

    const githubProfile =
        await GitHubProfile.findOneAndUpdate(

            {
                userId

            },

            {

                userId,

                ...analysisData,

                isActive:
                    true

            },

            {

                new:
                    true,

                upsert:
                    true,

                runValidators:
                    true,

                setDefaultsOnInsert:
                    true

            }

        );


    return githubProfile;
};

//Get Stored GitHub Profile

const getGitHubProfile = async (
    userId
) => {

    const profile =
        await GitHubProfile.findOne({

            userId,

            isActive: true

        }).lean();

    if (!profile) {

        throw new ApiError(
            404,
            "GitHub profile has not been connected yet."
        );

    }

    return profile;
};

//Refresh GitHub Analysis

const refreshGitHubAnalysis = async (
    userId
) => {

    const existingProfile =
        await GitHubProfile.findOne({

            userId,

            isActive: true

        }).lean();


    if (!existingProfile) {

        throw new ApiError(
            404,
            "GitHub profile has not been connected yet."
        );

    }

    return analyzeGitHubProfile(

        userId,

        existingProfile.username

    );
};

//Disconnect GitHub

const disconnectGitHub = async (
    userId
) => {

    const githubProfile =
        await GitHubProfile.findOne({

            userId,

            isActive: true

        });

    if (!githubProfile) {

        throw new ApiError(
            404,
            "GitHub profile is not connected."
        );

    }

    githubProfile.isActive =
        false;


    await githubProfile.save();

    return {

        message:
            "GitHub profile disconnected successfully."

    };
};

//Get GitHub Summary

const getGitHubSummary = async (
    userId
) => {

    const profile =
        await getGitHubProfile(
            userId
        );

    return {

        username:
            profile.username,

        profileUrl:
            profile.profileUrl,

        publicRepositories:
            profile.publicRepositories,

        followers:
            profile.followers,

        totalStars:
            profile.activity
                ?.totalStars || 0,

        totalForks:
            profile.activity
                ?.totalForks || 0,

        languages:
            profile.languages || {},

        readinessScore:
            profile.readinessScore || 0,

        readinessBreakdown:
            profile.readinessBreakdown || {},

        analyzedAt:
            profile.analyzedAt

    };
};

//Get GitHub Repository Details

const getRepositoryDetails = async (
    userId,
    repositoryName
) => {

    const profile =
        await getGitHubProfile(
            userId
        );

    const repository =
        profile.repositories?.find(

            item =>
                item.name ===
                repositoryName

        );

    if (!repository) {

        throw new ApiError(
            404,
            "GitHub repository not found in the stored analysis."
        );

    }

    return repository;
};

//Get Technology Summary

const getTechnologySummary = async (
    userId
) => {

    const profile =
        await getGitHubProfile(
            userId
        );

    const languages =
        profile.languages || {};

    const total =
        Object.values(
            languages
        ).reduce(

            (
                sum,
                value
            ) =>

                sum + value,

            0
        );

    const result =
        Object.entries(
            languages
        ).map(

            (
                [
                    language,
                    count
                ]
            ) => {

                return {

                    language,

                    repositoryCount:
                        count,

                    percentage:

                        total > 0

                            ? roundScore(

                                (
                                    count /
                                    total
                                ) * 100
                            )
                            : 0
                };
            }
        );

    result.sort(

        (a, b) =>
            b.repositoryCount -
            a.repositoryCount

    );

    return result;
};

//Generate GitHub Improvement Suggestions

const generateGitHubRecommendations = (
    githubProfile
) => {

    const recommendations = [];

    const score =
        githubProfile.readinessScore || 0;

    const breakdown =
        githubProfile.readinessBreakdown ||
        {};

    //Profile

    if (
        breakdown.profile <
        60
    ) {

        recommendations.push(

            "Complete your GitHub profile with a professional name, bio, location, and portfolio information."

        );
    }

    //Repository Quality

    if (
        breakdown.repositoryQuality <
        60
    ) {

        recommendations.push(

            "Create more high-quality repositories and add clear project descriptions."

        );
    }

    //Activity

    if (
        breakdown.activity <
        60
    ) {

        recommendations.push(

            "Increase your GitHub activity by regularly committing code and maintaining your projects."

        );
    }

    //Technology Diversity

    if (
        breakdown.technologyDiversity <
        60
    ) {

        recommendations.push(

            "Build projects using a broader range of technologies relevant to your target career."

        );
    }

    //Open Source

    if (
        breakdown.openSource <
        50
    ) {

        recommendations.push(

            "Consider contributing to open-source projects to strengthen your GitHub portfolio."

        );
    }

    //Good Score

    if (
        !recommendations.length
    ) {

        recommendations.push(

            "Your GitHub profile is in good shape. Continue maintaining quality projects and consistent activity."

        );
    }

    return {

        score,

        recommendations

    };
};

//Export

module.exports = {

    fetchGitHubUser,
    fetchGitHubRepositories,
    fetchRepositoryLanguages,
    fetchGitHubEvents,
    buildRepositorySummary,
    calculateGitHubActivity,
    calculateLanguageDistribution,
    calculateGitHubReadinessScore,
    analyzeGitHubProfile,
    getGitHubProfile,
    refreshGitHubAnalysis,
    disconnectGitHub,
    getGitHubSummary,
    getRepositoryDetails,
    getTechnologySummary,
    generateGitHubRecommendations

};