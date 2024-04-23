// import cron from "node-cron"
// import { bookingDB } from "../Models/booking.model.mjs";
// import { Types } from "mongoose";
// import { sendMail } from "./Mailer.mjs";

// cron.schedule("* * * * * *", async () => {
//     try {
//         const bookings = await bookingDB.aggregate([
//             {
//                 $match: {
//                     notified: false
//                 }
//             }, {
//                 $lookup: {
//                     from: "sessions",
//                     localField: "session",
//                     foreignField: "_id",
//                     as: "sessionInfo"
//                 }
//             }, {
//                 $lookup: {
//                     from: "users",
//                     localField: "mentor",
//                     foreignField: "_id",
//                     as: "mentorInfo"
//                 }
//             }, {
//                 $lookup: {
//                     from: "users",
//                     localField: "student",
//                     foreignField: "_id",
//                     as: "studentInfo"
//                 }
//             }, {
//                 $limit: 1
//             }
//         ])
//         if (bookings?.length == 1) {
//             const currentTime = Math.floor(new Date().getTime()/1000)
//             const date = bookings[0]?.sessionInfo?.[0]?.date
//             if (date - currentTime > 0 && date - currentTime < 1800) {
//                 const bookingId = bookings[0]._id
//                 const mentorMail = bookings[0]?.mentorInfo?.[0].email
//                 const studentMail = bookings[0]?.studentInfo?.[0].email
//                 const fromTime = bookings[0]?.sessionInfo?.[0]?.time.from
//                 const toTime = bookings[0]?.sessionInfo?.[0]?.time.to
//                 await bookingDB.updateOne({ _id: new Types.ObjectId(bookingId) }, { $set: { notified: true } })
//                 const resposne = await sendMail(studentMail, `Meet Mentor at ${fromTime}`, `You have a meet scheduled on ${new Date(date * 1000).toLocaleDateString("en-IN")} at ${fromTime} - ${toTime}`)
//                 if (resposne) {
//                     console.log("Mail sent to "+studentMail);
//                 }
//                 const resposne2 = await sendMail(mentorMail, `Meet Student at ${fromTime}`, `You have a meet scheduled on ${new Date(date * 1000).toLocaleDateString("en-IN")} at ${fromTime} - ${toTime}`)
//                 if (resposne2) {
//                     console.log("Mail sent to "+mentorMail);
//                 }
//             }
//         }
//     } catch (err) {
//         console.log(err.message);
//     }
// })
   