import { Router } from "express"
import sessionController from "../Controllers/session.controller.mjs"

const app = Router()

app.post("/create", sessionController.createSession)
app.get("/sessions", sessionController.getSessions)
app.post("/book", sessionController.bookMentor)
app.get("/bookings/:userId", sessionController.getBookings)
app.get("/mybookings/:mentor", sessionController.getMentorBookings)

export default app