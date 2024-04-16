import { Router } from "express"
import mentorController from "../Controllers/mentor.controller.mjs"

const app = Router()

app.get("/sessions", mentorController.getSessions)
app.post("/book", mentorController.bookMentor)
app.get("/bookings/:userId", mentorController.getBookings)

export default app