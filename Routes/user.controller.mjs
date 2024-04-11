import { Router } from "express"
import userController from "../Controllers/user.controller.mjs"

const Route = Router()

Route.post("/create", userController.createNewAccount)
Route.get("/login", userController.userLogin)

export default Route