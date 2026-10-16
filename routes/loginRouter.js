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


loginRouter.post("/recovery", async (req, res) => {
    const { email } = req.body;

    if (!email || !email.trim()) {
        return res.status(400).json({
            error: "Please enter your email address"
        });
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email.trim()
            }
        });

     
        if (!user) {
            return res.json({
                succes: "If an account exists, a recovery OTP will be sent."
            });
        }

        const otp = otpPin();

        const info = await transporter.sendMail({
            from: process.env.GOOGLE_APP,
            to: email.trim(),
            subject: "Password Recovery OTP",
            text: `Your password recovery OTP is ${otp}. It expires in 5 minutes. Do not share this code with anyone.`,
            html: `
                <div style="font-family: Arial, sans-serif;">
                    <h2>Password Recovery</h2>
                    <p>Your one-time PIN is:</p>
                    <h1 style="letter-spacing: 5px;">${otp}</h1>
                    <p>This code expires in 5 minutes.</p>
                    <p>Do not share this code with anyone.</p>
                </div>
            `
        });

        console.log("Recovery email sent:", info.messageId);

        return res.json({
            succes: "If an account exists, a recovery OTP will be sent."
        });

    } catch (error) {
        console.error("RECOVERY EMAIL ERROR:", error);

        return res.status(500).json({
            error: "Unable to send the recovery email. Please try again."
        });
    }
});



export default loginRouter;

