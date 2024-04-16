import { Schema, model } from "mongoose";

const mentorSchema = new Schema({
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
        required: true
    },
    cover: {
        type: String  
    },
    available_time: {
        type: Array,
        default: [
            {
                from: "09:30",
                to: "11:00"
            }, {
                from: "11:30",
                to: "13:00"
            }, {
                from: "14:00",
                to: "15:30"
            }, {
                form: "16:00",
                to: "17:30"
            }
        ]
    }
}, {
    timestamps: true
})

export const mentorDB = model("mentors", mentorSchema) 