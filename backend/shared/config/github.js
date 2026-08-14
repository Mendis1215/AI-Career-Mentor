const env = require("./env");


//GitHub Configuration

const GITHUB_CONFIG = {

    apiUrl:
        env.GITHUB_API_URL ||
        "https://api.github.com",

    apiToken:
        env.GITHUB_TOKEN || "",

    apiVersion:
        env.GITHUB_API_VERSION ||
        "2022-11-28",

    timeout:
        Number(env.GITHUB_TIMEOUT) ||
        10000

};


//Validate GitHub Configuration


const validateGitHubConfig = () => {

    if (!GITHUB_CONFIG.apiUrl) {
        throw new Error(
            "GITHUB_API_URL is not configured."
        );
    }

};



//Get GitHub API Headers
//These headers are used for GitHub REST API requests.

const getGitHubHeaders = () => {

    validateGitHubConfig();

    const headers = {

        Accept:
            "application/vnd.github+json",

        "X-GitHub-Api-Version":
            GITHUB_CONFIG.apiVersion,

        "User-Agent":
            "AI-Career-Mentor"

    };

    //Add authentication only when a token exists

    if (GITHUB_CONFIG.apiToken) {

        headers.Authorization =
            `Bearer ${GITHUB_CONFIG.apiToken}`;

    }

    return headers;

};


//Build GitHub API URL

const buildGitHubUrl = (path = "") => {

    validateGitHubConfig();

    const cleanPath =
        path.startsWith("/")
            ? path
            : `/${path}`;

    return `${GITHUB_CONFIG.apiUrl}${cleanPath}`;

};


//Get GitHub Configuration
//Returns safe configuration information.
//The actual token is never returned.

const getGitHubConfig = () => {

    return {

        apiUrl:
            GITHUB_CONFIG.apiUrl,

        apiVersion:
            GITHUB_CONFIG.apiVersion,

        timeout:
            GITHUB_CONFIG.timeout,

        hasToken:
            Boolean(
                GITHUB_CONFIG.apiToken
            )

    };

};


//Export

module.exports = {

    GITHUB_CONFIG,

    validateGitHubConfig,

    getGitHubHeaders,

    buildGitHubUrl,

    getGitHubConfig

};