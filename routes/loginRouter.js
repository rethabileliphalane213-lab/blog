import { Router } from "express";
import passport from "passport";
import prisma from "./db.js"
import bcryptjs from  "bcryptjs"
import jsonwebtoken from "jsonwebtoken"
import nodemailer from "nodemailer"
import bcrypt from "bcryptjs"





import otpPin from "./functions/otpPin.js";
import verifyToken from "./verifyToken.js"



const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,

    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,

    auth: {
        user: "rethabileliphalane213@gmail.com",
        pass: process.env.GOOGLE_PASS,
    },
});
console.log("GOOGLE_PASS exists:", !!process.env.GOOGLE_PASS);

transporter.verify()
    .then(() => {
        console.log("SMTP CONNECTION SUCCESSFUL");
    })
    .catch(error => {
        console.error("SMTP CONNECTION FAILED");
        console.error("Code:", error.code);
        console.error("Command:", error.command);
        console.error("Message:", error.message);
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

let globalOtp

loginRouter.post("/recovery", async (req, res) => {
    console.log("1. RECOVERY ROUTE CALLED");

    const { email } = req.body;

    try {
        console.log("2. Checking user:", email);

        const user = await prisma.user.findUnique({
            where: {
                email: email.trim()
            }
        });

        console.log("3. User found:", !!user);

        if (!user) {
            return res.json({
                success: "If an account exists, a recovery OTP will be sent."
            });
        }

        const otp = otpPin();

        console.log("4. OTP generated");

        globalOtp = otp;

        console.log("5. Starting email send...");

        const info = await transporter.sendMail({
            from: "rethabileliphalane213@gmail.com",
            to: email.trim(),
            subject: "Password Recovery OTP",
            text: `Your password recovery OTP is ${otp}.`,
            html: `
                <h2>Password Recovery</h2>
                <p>Your one-time PIN is:</p>
                <h1>${otp}</h1>
                <p>This code expires in 5 minutes.</p>
            `
        });

        console.log("6. EMAIL SENT:", info.messageId);
        console.log("7. SMTP RESPONSE:", info.response);

        return res.json({
            success: "If an account exists, a recovery OTP will be sent."
        });

    } catch (error) {
        console.error("RECOVERY EMAIL ERROR:", error);
        console.error("ERROR CODE:", error.code);
        console.error("ERROR RESPONSE:", error.response);

        return res.status(500).json({
            error: "Unable to send recovery email."
        });
    }
});

loginRouter.post("/pin_confirm",(req,res)=>{
const {pin}=req.body
if(Number(pin) !==Number(globalOtp)){
    res.json({
        error:"Incorrect PIN!"
    })
    return
}
return res.json({
    succes:"Your Password has Been Reset.Enter new Password"
})

})

loginRouter.post("/password_reset",async(req,res)=>{
    const {newPassword,email}=req.body
     
     try{
        const hashPassword = await bcrypt.hash(newPassword, 10);
        
        await prisma.user.update({
        where:{
            email:email
        },
        data:{
            password:hashPassword
        }
     })
     res.json({
        succes:"Password Changed"
     })
     console.log("Password updated successfully for user:", email);
     return

     }catch(e){
        console.log(e)
        res.json({
            error:`Failed to update Password`
        })
     }
})


export default loginRouter;

