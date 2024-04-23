import express from "express"
import userRoute from "./Routes/user.controller.mjs"
import sessionRoute from "./Routes/session.route.mjs"
import cors from "cors"
import "./Config/db.mjs"
import "./Utils/cron.mjs"
import { Server } from "socket.io"

const app = express()

app.use(express.json())
app.use(cors())

app.use("/user", userRoute)
app.use("/session", sessionRoute)

const server = app.listen(process.env.PORT || 8080, (err) => {
    if (err) process.exit(1)
    console.log("Server running!")
})

const socketClient = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "*",
        methods: "*"
    }
})

socketClient.on("connection", socket => {
    socket.on("joinCall", ({ roomId, userId, name })=> { 
        socket.join(roomId)
        socketClient.to(roomId).emit("newUser", { userId: userId, name: name })
    })
})