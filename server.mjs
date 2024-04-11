import express from "express"
import userRoute from "./Routes/user.controller.mjs"

const app = express()

app.use(express.json())

app.use("/user", userRoute)

app.listen(process.env.PORT || 8080, (err) => {
    if (err) process.exit(1)
    console.log("Server running!")
})