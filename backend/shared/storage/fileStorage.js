const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

//Storage Directories

const uploadsDirectory = path.join(
    __dirname,
    "../../uploads"
);

const knowledgeDocumentsDirectory =
    path.join(
        uploadsDirectory,
        "knowledge-documents"
    );

const profileImagesDirectory =
    path.join(
        uploadsDirectory,
        "profile-images"
    );


//Create Storage Directories

const initializeStorageDirectories = () => {

    const directories = [

        uploadsDirectory,

        knowledgeDocumentsDirectory,

        profileImagesDirectory

    ];

    directories.forEach((directory) => {

        if (!fs.existsSync(directory)) {

            fs.mkdirSync(directory, {
                recursive: true
            });

        }

    });

};


//Initialize Storage

initializeStorageDirectories();


//Generate Unique Filename

const generateUniqueFilename = (
    originalFilename
) => {

    const extension =
        path.extname(
            originalFilename
        ).toLowerCase();

    const randomString =
        crypto
            .randomBytes(16)
            .toString("hex");

    const timestamp =
        Date.now();

    return `${timestamp}-${randomString}${extension}`;

};


//Get File Extension

const getFileExtension = (
    filename
) => {

    if (!filename) {
        return "";
    }

    return path
        .extname(filename)
        .toLowerCase();

};


//Get File Size

const getFileSize = async (
    filePath
) => {

    const stats =
        await fs.promises.stat(
            filePath
        );

    return stats.size;

};


//Check File Exists

const fileExists = async (
    filePath
) => {

    try {

        await fs.promises.access(
            filePath,
            fs.constants.F_OK
        );

        return true;

    } catch (error) {

        return false;

    }

};


//Save File

const saveFile = async ({
    buffer,
    directory,
    originalFilename
}) => {

    if (!Buffer.isBuffer(buffer)) {

        throw new Error(
            "File data must be a Buffer."
        );

    }

    if (!directory) {

        throw new Error(
            "Storage directory is required."
        );

    }

    if (!originalFilename) {

        throw new Error(
            "Original filename is required."
        );

    }


    //Create Directory

    await fs.promises.mkdir(
        directory,
        {
            recursive: true
        }
    );


    //Generate Filename

    const filename =
        generateUniqueFilename(
            originalFilename
        );


    const filePath =
        path.join(
            directory,
            filename
        );


    //Save File

    await fs.promises.writeFile(
        filePath,
        buffer
    );


    //Return File Information

    return {

        filename,

        originalFilename,

        path: filePath,

        size: buffer.length,

        extension:
            getFileExtension(
                originalFilename
            )

    };

};


//Read File

const readFile = async (
    filePath
) => {

    if (
        !(await fileExists(filePath))
    ) {

        throw new Error(
            "File does not exist."
        );

    }

    return fs.promises.readFile(
        filePath
    );

};


//Delete File

const deleteFile = async (
    filePath
) => {

    if (!filePath) {
        return false;
    }


    if (
        !(await fileExists(filePath))
    ) {

        return false;

    }


    await fs.promises.unlink(
        filePath
    );

    return true;

};


//Move File

const moveFile = async (
    sourcePath,
    destinationDirectory,
    newFilename = null
) => {

    if (
        !(await fileExists(sourcePath))
    ) {

        throw new Error(
            "Source file does not exist."
        );

    }


    await fs.promises.mkdir(
        destinationDirectory,
        {
            recursive: true
        }
    );


    const filename =
        newFilename ||
        path.basename(sourcePath);


    const destinationPath =
        path.join(
            destinationDirectory,
            filename
        );


    await fs.promises.rename(
        sourcePath,
        destinationPath
    );


    return destinationPath;

};


//Get File Information

const getFileInformation = async (
    filePath
) => {

    if (
        !(await fileExists(filePath))
    ) {

        throw new Error(
            "File does not exist."
        );

    }


    const stats =
        await fs.promises.stat(
            filePath
        );


    return {

        filename:
            path.basename(filePath),

        path:
            filePath,

        extension:
            path.extname(filePath)
                .toLowerCase(),

        size:
            stats.size,

        createdAt:
            stats.birthtime,

        modifiedAt:
            stats.mtime

    };

};


//Get Storage Paths

const getStoragePaths = () => {

    return {

        uploads:
            uploadsDirectory,

        knowledgeDocuments:
            knowledgeDocumentsDirectory,

        profileImages:
            profileImagesDirectory

    };

};


//Export

module.exports = {

    initializeStorageDirectories,

    generateUniqueFilename,

    getFileExtension,

    getFileSize,

    fileExists,

    saveFile,

    readFile,

    deleteFile,

    moveFile,

    getFileInformation,

    getStoragePaths

};