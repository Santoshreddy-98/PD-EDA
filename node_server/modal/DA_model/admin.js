const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        validate: {
            validator: (name) => /^[A-Za-z\s]*$/.test(name),
            message: "Name must contain only letters and spaces.",
        },
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: (email) =>
                /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email),
            message: "Invalid email format.",
        },
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: (password) =>
                /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(password),
            message: "Password must contain a number, an uppercase letter, and a special character.",
        },
    },
    isAdmin: { type: String, enum: ["yes", "no"], required: true },
    role: {
        type: String,
        enum: ["PD Dev", "PD Lead", "Manager"],
        required: true,
    },
});

// Middleware to hash the password before saving
adminSchema.pre("save", function (next) {
    const admin = this;

    if (!admin.isModified("password")) return next();

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(admin.password, salt, (err, hash) => {
            if (err) return next(err);

            admin.password = hash;
            next();
        });
    });
});

module.exports = mongoose.model("Admin", adminSchema);

