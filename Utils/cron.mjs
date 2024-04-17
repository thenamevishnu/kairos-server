// import cron from "node-cron"
// import { bookingDB } from "../Models/booking.model.mjs"
// import { sendMail } from "./Mailer.mjs"

// cron.schedule("* * * * ", async () => {
//     try {
//         const currentTime = Math.floor(new Date().getTime()/1000)
//         const bookings = await bookingDB.find({
//             $expr: {
//                 $and: [
//                     {
//                         $lte: [
//                             {
//                                 $subtract: ["$date", currentTime]
//                             }, 1800
//                         ]
//                     }
//                 ]
//             }
//         })
//         bookings.forEach(async item => {
//             try {
//                 const resposne = await sendMail(item.studentMail, `Meet Mentor at ${item.time.from}`, `You have a meet scheduled on ${new Date(item.date * 1000).toLocaleDateString("en-IN")} at ${item.time.from} - ${item.time.to}`)
//                 if (resposne) {
//                     console.log("Mail sent to "+item.studentMail);
//                 }
//                 const resposne2 = await sendMail(item.mentorMail, `Meet Student at ${item.time.from}`, `You have a meet scheduled on ${new Date(item.date * 1000).toLocaleDateString("en-IN")} at ${item.time.from} - ${item.time.to}`)
//                 if (resposne2) {
//                     console.log("Mail sent to "+item.mentorMail);
//                 }
//             } catch (err) {
//                 console.log(err.message)
//             }
//         })
//     } catch (err) {
//         console.log(err.message);
//     }
// })
   