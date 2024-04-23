import { Schema, Types, model } from "mongoose";

const sessionSchema = new Schema({
    mentor: {
        type: Types.ObjectId,
        required: true
    },
    date: {
        type: Number
    },
    time: {
        from: {
            type: String
        },
        to: {
            type: String
        }
    }
}, {
    timestamps: true
})

export const sessionDB = model("sessions", sessionSchema) 