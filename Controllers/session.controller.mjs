import { Types } from "mongoose"
import { bookingDB } from "../Models/booking.model.mjs"
import { sessionDB } from "../Models/sessions.model.mjs"
import { createRoomID } from "../Utils/Helper.mjs"

const createSession = async (req, res) => {
    try {
        const body = req.body
        const response = await sessionDB.findOne({ mentor: body.mentor, date: body.date, "time.from": body.start })
        if (response) {
            return await res.status(409).send({ message: "Session already exist!"})
        }
        const resData = await sessionDB.create({
            mentor: body.mentor,
            date: body.date,
            time: {
                from: body.start,
                to: body.end
            }
        })
        if (resData?._id) {
            return await res.status(201).send({ status: "OK", message: `Session Created: ${new Date(body.date * 1000).toLocaleDateString("en-IN")} at ${body.start} - ${body.end}`})
        }
        return res.status(500).send({message: "Something went wrong!"})
    } catch (err) {
        return res.status(500).send({message: "Internal server error"})
    }
}

const getSessions = async (req, res) => {
    try {
        const { type, user_id } = req.query
        let sessions = null
        if (type == "student") {
            sessions = await sessionDB.aggregate([{
                $lookup: {
                    from: "users",
                    localField: "mentor",
                    foreignField: "_id",
                    as: "mentorInfo"
                }
            },{
                $sort: {
                    date: 1,
                    "time.from": 1
                }
            }])
        } else {
            sessions = await sessionDB.aggregate([
                {
                    $match: {
                        mentor: new Types.ObjectId(user_id)
                    }
                },{
                    $lookup: {
                        from: "users",
                        localField: "mentor",
                        foreignField: "_id",
                        as: "mentorInfo"
                    }
                }, {
                    $sort: {
                        date: 1,
                        "time.from": 1
                    }
                }
            ])
        }
        return res.status(200).send({message: "success", result: sessions || []})
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({message: "Internal server error"})
    }
}

const bookMentor = async (req, res) => {
    try {
        const body = req.body
        const bookingExist = await bookingDB.findOne({ mentor: body.mentorId, session: body.session, student: body.student })
        if (bookingExist) {
            return await res.status(409).send({ message: "Slot already booked!"})
        }
        const isSlotExist = await bookingDB.findOne({ session: body.session })
        if (isSlotExist) {
            return await res.status(409).send({ message: "There is not slot available!"})
        }
        let roomId = null
        while (true) {
            roomId = createRoomID()
            const checkRoom = await bookingDB.findOne({ roomId: roomId })
            if (!checkRoom) {
                break
            }
        }
        const response = await bookingDB.create({
            student: body.student,
            mentor: body.mentorId,
            session: body.session,
            roomId: roomId
        })
        if (response?._id) {
            return await res.status(201).send({ status: "OK", message: `Slot booked`})
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
                from: "users",
                localField: "mentor",
                foreignField: "_id",
                as: "mentorInfo"
            }
        },{
            $lookup: {
                from: "users",
                localField: "student",
                foreignField: "_id",
                as: "studentInfo"
            }
        },{
            $lookup: {
                from: "sessions",
                localField: "session",
                foreignField: "_id",
                as: "sessionInfo"
            }
        }, {
            $sort: {
                "sessionInfo.date": 1,
                "sessionInfo.time.from": 1
           } 
        }])
        return res.status(200).send({message: "success", result: bookings || []})
    } catch (err) {
        console.log(err);
        return res.status(500).send({message: "Internal server error"})
    }
}

const getMentorBookings = async (req, res) => {
    try {
        const {mentor} = req.params
        const bookings = await bookingDB.aggregate([{
            $match: {
                mentor: new Types.ObjectId(mentor)
            }
        }, {
            $lookup: {
                from: "users",
                localField: "mentor",
                foreignField: "_id",
                as: "mentorInfo"
            }
        },{
            $lookup: {
                from: "users",
                localField: "student",
                foreignField: "_id",
                as: "studentInfo"
            }
        },{
            $lookup: {
                from: "sessions",
                localField: "session",
                foreignField: "_id",
                as: "sessionInfo"
            }
        }, {
            $sort: {
                "sessionInfo.date": 1,
                "sessionInfo.time.from": 1
           } 
        }])
        return res.status(200).send({message: "success", result: bookings || []})
    } catch (err) {
        console.log(err);
        return res.status(500).send({message: "Internal server error"})
    }
}

export default { getSessions, bookMentor, getBookings, getMentorBookings, createSession }