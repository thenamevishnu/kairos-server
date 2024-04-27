import { userDB } from "../Models/user.model.mjs"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Cryptr from "cryptr"
import { sendMail } from "../Utils/Mailer.mjs"

const { sign: createToken } = jwt

const cryptr = new Cryptr(process.env.CRYPTR_KEY)

const createNewAccount = async (req, res) => {
    try {
        const { confirm_password, ...userData } = req.body
        const emailMatch = await userDB.findOne({ email: userData.email })
        if (emailMatch && emailMatch.deleted?.status) {
            return res.status(409).send({ message: "Recover you account!" })
        }
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
        return res.status(400).send({ message: "BAD REQUEST" })
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ message: "Internal server error"})
    }
}

const userLogin = async (req, res) => {
    try {
        const userData = req.query
        console.log(userData);
        const emailMatch = await userDB.findOne({ email: userData.email, "deleted.status": false })
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

const profileUpdate = async (req, res) => {
    try {
        const body = req.body
        const { user_id, ...updateData } = body
        if (updateData?.username) {
            const usernameExist = await userDB.findOne({ username: updateData.username })
            if (usernameExist) {
                return res.status(409).send({ message: "Usrname already exist" })
            }
        }
        const response = await userDB.updateOne({ _id: user_id, "deleted.status": false }, { $set: updateData })
        if (response.matchedCount == 1 && response.modifiedCount == 1) {
            return res.status(200).send({message: "updated", status: "OK"})
        }
        return res.status(400).send({ message: "BAD REQUEST" })
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ message: "Internal server error"})
    }
}

const changePassword = async (req, res) => {
    try {
        const { user_id, currentPassword, newPassword } = req.body
        const userInfo = await userDB.findOne({ _id: user_id })
        const checkCurrentPassword = await bcrypt.compare(currentPassword, userInfo.password)
        if (!checkCurrentPassword) {
            return res.status(400).send({ message: "Current password is wrong" })
        }
        const checkPassword = await bcrypt.compare(newPassword, userInfo.password)
        if (checkPassword) {
            return res.status(400).send({ message: "New password is same as your old password" })
        }
        const newHash = await bcrypt.hash(newPassword, 10)
        const response = await userDB.updateOne({ _id: user_id, "deleted.status": false }, { $set: { password: newHash } })
        if (response.matchedCount == 1 && response.modifiedCount == 1) {
            return res.status(200).send({message: "updated", status: "OK"})
        }
        return res.status(400).send({ message: "BAD REQUEST" })
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ message: "Internal server error"})
    }
}

const deleteAccount = async (req, res) => {
    try {
        const { user_id } = req.params
        const { reason } = req.query
        const response = await userDB.updateOne({ _id: user_id }, { $set: { "deleted.status": true, "deleted.reason": reason } })
        if (response.matchedCount == 1 && response.modifiedCount == 1) {
            return res.status(200).send({message: "Deleted", status: "OK"})
        }
        return res.status(400).send({message: "BAD REQUEST"})
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ message: "Internal server error"})
    }
}

const resetPassword = async (req, res) => {
    try {
        const {email} = req.body
        const response = await userDB.findOne({ email: email })
        if (!response) {
            return res.status(404).send({message: "Email is not registered with us"})
        }
        const enMail = cryptr.encrypt(email)
        const resData = await sendMail(email, "Password Reset Verification", `Click on the link to verify: ${process.env.SERVER}/password/reset/verify?hash=${enMail}`)
        if (resData) {
            return res.status(200).send({ message: "reset verification mail sent", status: "OK" })
        }
        return res.status(400).send({ message: "reset verification failed" })
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ message: "Internal server error"})
    }
}

export default {
    createNewAccount,
    userLogin,
    profileUpdate,
    changePassword,
    deleteAccount,
    resetPassword
}