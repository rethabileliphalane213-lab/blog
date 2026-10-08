import { Router } from "express";
import passport from "passport";
import prisma from "./db.js"
import bcryptjs from  "bcryptjs"
import jsonwebtoken from "jsonwebtoken"

import verifyToken from "./verifyToken.js"


const loginRouter = Router();

loginRouter.post("/users", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        console.log("Login email:", email);

        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        });

        console.log("User found:", user);

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
            "secretKey",
            (error, token) => {
                if (error) {
                    return next(error);
                }

                res.json({
                    token: token
                });
            }
        );

    } catch (error) {
        console.error("LOGIN ERROR:", error);
        next(error);
    }
});

export default loginRouter;

