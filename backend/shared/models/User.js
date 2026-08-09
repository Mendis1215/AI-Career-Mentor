const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        // Basic Account Information
        firstName: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
            minlength: [2, "First name must contain at least 2 characters"],
            maxlength: [50, "First name cannot exceed 50 characters"]
        },

        lastName: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
            minlength: [2, "Last name must contain at least 2 characters"],
            maxlength: [50, "Last name cannot exceed 50 characters"]
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must contain at least 8 characters"],
            select: false
        },

        // User Role
        role: {
            type: String,
            enum: {
                values: ["student", "admin"],
                message: "Role must be either student or admin"
            },
            default: "student",
            required: true
        },

        // Account Status
        isActive: {
            type: Boolean,
            default: true
        },

        isEmailVerified: {
            type: Boolean,
            default: false
        },

        // Last Login
        lastLoginAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

/*
Virtual: Full Name
*/

userSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});

/*
JSON Configuration

Allows virtual fields such as fullName to appear when converting
the document to JSON.
*/

userSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    }
});

/*
Export Model
*/

const User = mongoose.model("User", userSchema);

module.exports = User;