import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    domain: {
        type: String,
        default: "MERN STACK"
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    dp: {
        type: String,
        default: process.env.DEFAULT_AVATAR
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: "student"
    }
}, {
    timestamps: true
})

export const userDB = model("users", userSchema) 