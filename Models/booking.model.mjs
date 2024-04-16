import { Schema, Types, model } from "mongoose";

const bookingSchema = new Schema({
    mentor: {
        type: Types.ObjectId,
        required: true
    },
    student: {
        type: Types.ObjectId  
    },
    mentorMail: {
        type: String
    },
    studentMail: {
        type: String
    },
    date: {
        type: String
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

export const bookingDB = model("bookings", bookingSchema) 