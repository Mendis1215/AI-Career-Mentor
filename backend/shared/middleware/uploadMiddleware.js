const multer = require("multer");
const path = require("path");
const fs = require("fs");


//Upload Directories

const profileImagesDirectory = path.join(
    __dirname,
    "../../uploads/profile-images"
);

const knowledgeDocumentsDirectory = path.join(
    __dirname,
    "../../uploads/knowledge-documents"
);


//Create Upload Directories

const createUploadDirectories = () => {

    const directories = [
        profileImagesDirectory,
        knowledgeDocumentsDirectory
    ];

    directories.forEach((directory) => {

        if (!fs.existsSync(directory)) {

            fs.mkdirSync(directory, {
                recursive: true
            });

        }

    });

};


createUploadDirectories();


//File Size Limits

const FILE_SIZE_LIMITS = {

    profileImage:
        5 * 1024 * 1024, // 5 MB

    knowledgeDocument:
        20 * 1024 * 1024 // 20 MB

};


//Profile Image Storage

const profileImageStorage =
    multer.diskStorage({

        destination: (req, file, cb) => {

            cb(
                null,
                profileImagesDirectory
            );

        },

        filename: (req, file, cb) => {

            const extension =
                path.extname(file.originalname)
                    .toLowerCase();

            const uniqueName =
                `profile-${Date.now()}-${Math.round(
                    Math.random() * 1E9
                )}${extension}`;

            cb(
                null,
                uniqueName
            );

        }

    });


//Knowledge Document Storage

const knowledgeDocumentStorage =
    multer.diskStorage({

        destination: (req, file, cb) => {

            cb(
                null,
                knowledgeDocumentsDirectory
            );

        },

        filename: (req, file, cb) => {

            const extension =
                path.extname(file.originalname)
                    .toLowerCase();

            const uniqueName =
                `knowledge-${Date.now()}-${Math.round(
                    Math.random() * 1E9
                )}${extension}`;

            cb(
                null,
                uniqueName
            );

        }

    });


//Profile Image File Filter

const profileImageFileFilter = (
    req,
    file,
    cb
) => {

    const allowedMimeTypes = [

        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"

    ];

    const extension =
        path.extname(
            file.originalname
        ).toLowerCase();

    const allowedExtensions = [

        ".jpg",
        ".jpeg",
        ".png",
        ".webp"

    ];

    if (
        allowedMimeTypes.includes(
            file.mimetype
        ) &&
        allowedExtensions.includes(
            extension
        )
    ) {

        cb(null, true);

    } else {

        cb(
            new Error(
                "Only JPG, JPEG, PNG, and WEBP images are allowed."
            ),
            false
        );

    }

};


//Knowledge Document File Filter

const knowledgeDocumentFileFilter = (
    req,
    file,
    cb
) => {

    const allowedMimeTypes = [

        "application/pdf",

        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

        "text/plain",

        "text/markdown",

        "text/csv"

    ];

    const extension =
        path.extname(
            file.originalname
        ).toLowerCase();

    const allowedExtensions = [

        ".pdf",
        ".docx",
        ".txt",
        ".md",
        ".csv"

    ];

    if (
        allowedMimeTypes.includes(
            file.mimetype
        ) &&
        allowedExtensions.includes(
            extension
        )
    ) {

        cb(null, true);

    } else {

        cb(
            new Error(
                "Only PDF, DOCX, TXT, Markdown, and CSV files are allowed."
            ),
            false
        );

    }

};


//Profile Image Upload

const uploadProfileImage = multer({

    storage:
        profileImageStorage,

    limits: {

        fileSize:
            FILE_SIZE_LIMITS.profileImage,

        files: 1

    },

    fileFilter:
        profileImageFileFilter

});


//Knowledge Document Upload

const uploadKnowledgeDocument = multer({

    storage:
        knowledgeDocumentStorage,

    limits: {

        fileSize:
            FILE_SIZE_LIMITS.knowledgeDocument,

        files: 1

    },

    fileFilter:
        knowledgeDocumentFileFilter

});


//Multiple Knowledge Documents Upload
//Maximum: 10 documents per request.

const uploadKnowledgeDocuments =
    multer({

        storage:
            knowledgeDocumentStorage,

        limits: {

            fileSize:
                FILE_SIZE_LIMITS.knowledgeDocument,

            files: 10

        },

        fileFilter:
            knowledgeDocumentFileFilter

    });


//Get Uploaded File Information

const getUploadedFileInfo = (
    file
) => {

    if (!file) {
        return null;
    }

    return {

        originalName:
            file.originalname,

        filename:
            file.filename,

        path:
            file.path,

        mimetype:
            file.mimetype,

        size:
            file.size

    };

};


//Delete Uploaded File

const deleteUploadedFile = async (
    filePath
) => {

    if (!filePath) {
        return;
    }

    try {

        await fs.promises.access(
            filePath
        );

        await fs.promises.unlink(
            filePath
        );

    } catch (error) {

        //File may already be deleted.

        if (
            error.code !==
            "ENOENT"
        ) {

            throw error;

        }

    }

};


//Export

module.exports = {

    uploadProfileImage,

    uploadKnowledgeDocument,

    uploadKnowledgeDocuments,

    getUploadedFileInfo,

    deleteUploadedFile,

    FILE_SIZE_LIMITS

};