const app = require("./app");
const env = require("./shared/config/env");
const connectDatabase = require("./shared/config/database");

/*
Start Server
*/

const startServer = async () => {
    try {
        // Connect to MongoDB first
        await connectDatabase();

        // Start Express server
        app.listen(env.port, () => {
            console.log(" ");
            console.log("   AI Career Mentor Backend Started");
            console.log(" ");
            console.log(`Environment: ${env.nodeEnv}`);
            console.log(`Server: http://localhost:${env.port}`);
            console.log(`Health: http://localhost:${env.port}/api/health`);
            console.log(" ");
        });
    } catch (error) {
        console.error("Failed to start server");
        console.error(error.message);

        process.exit(1);
    }
};

startServer();