const mongoose = require("mongoose");
const { applyTimestamps } = require("./url");

const userSchema = new mongoose.Schema({  // Corrected 'Schema' to be capitalized
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        required: true,
        default: "NORMAL",
    },
    password: {
        type: String,  // Removed 'Number' as it's not valid to have multiple types like this without using an array
        required: true,
    },
}, { timestamps: true });

const User = mongoose.model("user", userSchema);

module.exports = User;
