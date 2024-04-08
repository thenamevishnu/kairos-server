import express from "express"

const app = express()

app.use(express.json())

app.listen(8080, (err) => {
    if (err) process.exit(1)
    console.log("Server running!")
})