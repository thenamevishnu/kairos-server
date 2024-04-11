import { userDB } from "../Models/user.model.mjs"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const { sign: createToken} = jwt

const createNewAccount = async (req, res) => {
    try {
        const { confirm_password, ...userData } = req.body
        const emailMatch = await userDB.findOne({ email: userData.email })
        if (emailMatch) {
            return res.status(409).send({ message: "Email exist!" })
        }
        const usernameMatch = await userDB.findOne({ username: userData.username })
        if (usernameMatch) {
            return res.status(409).send({ message: "Usrname exist!" })
        }
        userData.password = await bcrypt.hash(userData.password, 10) 
        const createdUser = await userDB.create(userData)
        const { password, ...userinfo} = createdUser
        if (createdUser?._id) {
            const token = createToken({ sub: userinfo._doc }, process.env.JWT_KEY, { expiresIn: "7d" })
            return res.status(201).send({message: "success", result: token})
        }
        return res.status(400).send({ message: "Something went wrong!"})
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ message: "Internal server error"})
    }
}

const userLogin = async (req, res) => {
    try {
        const userData = req.query
        const emailMatch = await userDB.findOne({ email: userData.email })
        if (!emailMatch) {
            return res.status(404).send({ message: "User does not exist!" })
        }
        const passwordCheck = await bcrypt.compare(userData.password, emailMatch.password)
        if (passwordCheck) {
            const { password, ...userinfo} = emailMatch
            const token = createToken({ sub: userinfo._doc }, process.env.JWT_KEY, { expiresIn: "7d" })
            return res.status(201).send({message: "success", result: token})
        }
        return res.status(400).send({ message: "Invalid Login!"})
    } catch (err) {
        return res.status(500).send({ message: "Internal server error"})
    }
}

export default {
    createNewAccount,
    userLogin
}