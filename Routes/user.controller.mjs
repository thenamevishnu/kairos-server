import { Router } from "express"
import userController from "../Controllers/user.controller.mjs"

const Route = Router()

Route.post("/create", userController.createNewAccount)
Route.get("/login", userController.userLogin)

Route.patch("/profile/update", userController.profileUpdate)
Route.patch("/profile/password/update", userController.changePassword)
Route.delete("/profile/delete/:user_id", userController.deleteAccount)

Route.patch("/password/reset", userController.resetPassword)
Route.patch("/password/reset/verify", userController.resetPasswordVerify)

export default Route