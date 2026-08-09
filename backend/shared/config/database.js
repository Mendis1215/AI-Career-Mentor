const mongoose = require("mongoose");
const env = require("./env");

//Connect the application to MongoDB.
const connectDatabase = async () => {
    try {
        await mongoose.connect(env.mongodbUri);

        console.log("MongoDB connected successfully");
        console.log(`Database: ${mongoose.connection.name}`);
    } catch (error) {
        console.error("MongoDB connection failed");
        console.error(error.message);

        process.exit(1);
    }
};

module.exports = connectDatabase;