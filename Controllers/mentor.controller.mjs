import { Types } from "mongoose"
import { bookingDB } from "../Models/booking.model.mjs"
import { mentorDB } from "../Models/mentor.model.mjs"

const getSessions = async (req, res) => {
    try {
        const sessions = await mentorDB.find({})
        return res.status(200).send({message: "success", result: sessions || []})
    } catch (err) {
        return res.status(500).send({message: "Internal server error"})
    }
}

const bookMentor = async (req, res) => {
    try {
        const body = req.body
        const todayList = await bookingDB.findOne({ mentor: body.mentorId, "time.from": body.start, date: body.date })
        if (todayList) {
            return await res.status(409).send({ message: "Slot already booked!"})
        }
        const anotherClass = await bookingDB.findOne({ "time.from": body.start, date: body.date })
        if (anotherClass) {
            return await res.status(409).send({ message: "You have another class in this time period!"})
        }
        const response = await bookingDB.create({
            student: body.user,
            mentor: body.mentorId,
            date: body.date,
            "time.from": body.start,
            "time.to": body.end,
            mentorMail: body.mentorMail,
            studentMail: body.studentMail
        })
        if (response?._id) {
            return await res.status(201).send({ status: "OK", message: `Booked on ${new Date(body.date * 1000).toLocaleDateString("en-IN")} at ${body.start} - ${body.end}`})
        }
        return res.status(500).send({message: "Something went wrong!"})
    } catch (err) {
        return res.status(500).send({message: "Internal server error"})
    }
}

const getBookings = async (req, res) => {
    try {
        const {userId} = req.params
        const bookings = await bookingDB.aggregate([{
            $match: {
                student: new Types.ObjectId(userId)
            }
        }, {
            $lookup: {
                from: "mentors",
                localField: "mentor",
                foreignField: "_id",
                as: "mentorInfo"
            }
        }, {
            $sort: {
                date: 1,
                "time.from": 1
           } 
        }])
        return res.status(200).send({message: "success", result: bookings || []})
    } catch (err) {
        console.log(err);
        return res.status(500).send({message: "Internal server error"})
    }
}

export default { getSessions, bookMentor, getBookings }