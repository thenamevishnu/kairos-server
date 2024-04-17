import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
})

const mailOptions = {
    from: process.env.EMAIL,
    to: null,
    subject: null,
    html: null
}
  
export const sendMail = async (to, subject, text) => {
    return new Promise((resolve, reject) => {
        mailOptions.to = to
        mailOptions.subject = subject
        mailOptions.html = `<b>${text}</b>` 
        transporter.sendMail(mailOptions, function (err, res) {
            
            if(err) reject(false)  
            resolve(true)
        })
    })
}