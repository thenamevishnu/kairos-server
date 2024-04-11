import express from "express"
import userRoute from "./Routes/user.controller.mjs"
import cors from "cors"
import "./Config/db.mjs"

const app = express()

app.use(express.json())
app.use(cors())

app.use("/user", userRoute)

app.listen(process.env.PORT || 8080, (err) => {
    if (err) process.exit(1)
    console.log("Server running!")
})