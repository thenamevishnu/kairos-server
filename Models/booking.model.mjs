import { Schema, Types, model } from "mongoose";

const bookingSchema = new Schema({
    mentor: {
        type: Types.ObjectId,
        required: true
    },
    roomId: {
        type: String,
        required: true
    },
    session: {
        type: Types.ObjectId,
        required: true
    },
    student: {
        type: Types.ObjectId,
        required: true
    },
    notified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

export const bookingDB = model("bookings", bookingSchema) 