const fs = require("fs");
const path = require("path");
const crypto = require("crypto");


//Profile Image Storage Directory

const profileImagesDirectory = path.join(
    __dirname,
    "../../uploads/profile-images"
);


//Supported Image Types

const ALLOWED_IMAGE_TYPES = Object.freeze({

    ".jpg": "image/jpeg",

    ".jpeg": "image/jpeg",

    ".png": "image/png",

    ".webp": "image/webp"

});


//Maximum Image Size

const MAX_IMAGE_SIZE =
    5 * 1024 * 1024;


//Initialize Storage Directory

const initializeImageStorage = () => {

    if (
        !fs.existsSync(
            profileImagesDirectory
        )
    ) {

        fs.mkdirSync(
            profileImagesDirectory,
            {
                recursive: true
            }
        );

    }

};


initializeImageStorage();


//Validate Image Extension

const isAllowedImageExtension = (
    filename
) => {

    if (!filename) {
        return false;
    }

    const extension =
        path.extname(
            filename
        ).toLowerCase();

    return Boolean(
        ALLOWED_IMAGE_TYPES[
            extension
        ]
    );

};


//Validate Image MIME Type

const isAllowedImageMimeType = (
    mimeType
) => {

    return Object.values(
        ALLOWED_IMAGE_TYPES
    ).includes(
        mimeType
    );

};


//Validate Image

const validateImage = ({
    filename,
    mimeType,
    size
}) => {

    if (!filename) {

        throw new Error(
            "Image filename is required."
        );

    }


    if (
        !isAllowedImageExtension(
            filename
        )
    ) {

        throw new Error(
            "Only JPG, JPEG, PNG, and WEBP images are allowed."
        );

    }


    if (
        !isAllowedImageMimeType(
            mimeType
        )
    ) {

        throw new Error(
            "Invalid image MIME type."
        );

    }


    if (
        typeof size !== "number"
    ) {

        throw new Error(
            "Image size must be provided."
        );

    }


    if (
        size <= 0
    ) {

        throw new Error(
            "Image cannot be empty."
        );

    }


    if (
        size > MAX_IMAGE_SIZE
    ) {

        throw new Error(
            "Image size cannot exceed 5 MB."
        );

    }


    return true;

};


//Generate Image Filename

const generateImageFilename = (
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

    return `profile-${timestamp}-${randomString}${extension}`;

};


//Save Profile Image

const saveProfileImage = async ({
    buffer,
    originalFilename,
    mimeType
}) => {

    if (!Buffer.isBuffer(buffer)) {

        throw new Error(
            "Image data must be a Buffer."
        );

    }


    validateImage({

        filename:
            originalFilename,

        mimeType,

        size:
            buffer.length

    });


    await fs.promises.mkdir(
        profileImagesDirectory,
        {
            recursive: true
        }
    );


    const filename =
        generateImageFilename(
            originalFilename
        );


    const filePath =
        path.join(
            profileImagesDirectory,
            filename
        );


    await fs.promises.writeFile(
        filePath,
        buffer
    );


    return {

        filename,

        originalFilename,

        path:
            filePath,

        mimeType,

        size:
            buffer.length

    };

};


//Delete Profile Image

const deleteProfileImage = async (
    filename
) => {

    if (!filename) {
        return false;
    }


    //Prevent Path Traversal

    const safeFilename =
        path.basename(
            filename
        );


    const filePath =
        path.join(
            profileImagesDirectory,
            safeFilename
        );


    try {

        await fs.promises.access(
            filePath
        );

        await fs.promises.unlink(
            filePath
        );

        return true;

    } catch (error) {

        if (
            error.code === "ENOENT"
        ) {

            return false;

        }

        throw error;

    }

};


//Get Profile Image Path

const getProfileImagePath = (
    filename
) => {

    if (!filename) {
        return null;
    }


    const safeFilename =
        path.basename(
            filename
        );


    return path.join(
        profileImagesDirectory,
        safeFilename
    );

};


//Check Profile Image Exists

const profileImageExists = async (
    filename
) => {

    const filePath =
        getProfileImagePath(
            filename
        );


    if (!filePath) {
        return false;
    }


    try {

        await fs.promises.access(
            filePath
        );

        return true;

    } catch (error) {

        return false;

    }

};


//Get Image Storage Information

const getImageStorageInfo = () => {

    return {

        directory:
            profileImagesDirectory,

        maxSize:
            MAX_IMAGE_SIZE,

        maxSizeMB:
            MAX_IMAGE_SIZE /
            (1024 * 1024),

        allowedExtensions:
            Object.keys(
                ALLOWED_IMAGE_TYPES
            ),

        allowedMimeTypes:
            Object.values(
                ALLOWED_IMAGE_TYPES
            )

    };

};


//Export

module.exports = {

    ALLOWED_IMAGE_TYPES,

    MAX_IMAGE_SIZE,

    initializeImageStorage,

    isAllowedImageExtension,

    isAllowedImageMimeType,

    validateImage,

    generateImageFilename,

    saveProfileImage,

    deleteProfileImage,

    getProfileImagePath,

    profileImageExists,

    getImageStorageInfo

};