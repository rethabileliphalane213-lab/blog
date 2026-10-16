import { Router } from "express";
import passport from "passport";
import prisma from "./db.js"
import bcryptjs from  "bcryptjs"
import jsonwebtoken from "jsonwebtoken"
import nodemailer from "nodemailer"




import otpPin from "./functions/otpPin.js";
import verifyToken from "./verifyToken.js"



const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.GOOGLE_APP,
    pass: process.env.GOOGLE_PASS,
  },
});







const loginRouter = Router();

loginRouter.post("/users", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.json({
                error: "Incorrect email"
            });
        }
        const match = await bcryptjs.compare(password, user.password);

        if (!match) {
            return res.json({
                error: "Incorrect Password"
            });
        }

        jsonwebtoken.sign(
            { user: user },
            process.env.SECRET_KEY,
            (error, token) => {
                if (error) {
                    return next(error);
                }

                res.json({
                    succes:"You are logeed in",
                    token: token
                });
            }
        );

    } catch (error) {
        console.error("LOGIN ERROR:", error);
        next(error);
    }
});

loginRouter.post("/recovery",async(req,res)=>{
const otp=otpPin
console.log(otp)
cost [email]=req.body


try {
  const info = await transporter.sendMail({
    from:  process.env.GOOGLE_APP, // sender address
    to: email, // list of recipients
    subject: 'Recovery Pin', // subject line
    text: `Your OTP has been Sent Dont share it wih anyone`, // plain text body
    html: <h1>{otp}</h1>
  });
res.json({
    succes:"OTP Sent",
    otp:otp
})
  console.log("Message sent: %s", info.messageId);
  // Preview URL is only available when using an Ethereal test account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
} catch (err) {
  console.error("Error while sending mail:", err);
}
})


export default loginRouter;

