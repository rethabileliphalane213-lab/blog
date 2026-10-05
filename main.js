import express from "express";
import bcrypt from "bcryptjs";
import { Strategy } from "passport-local";
import passport from "passport";
import "dotenv/config";

import prisma from "./routes/db.js";

const app = express();

app.use(express.json());

import cors from "./routes/cors.js";
app.use(cors);

import signinRouter from "./routes/signinRoute.js";
import loginRouter from "./routes/loginRouter.js";

passport.use(
    new Strategy(
        { usernameField: "email" },
        async (email, password, done) => {
            try {
                const userFound = await prisma.user.findFirst({
                    where: {
                        email: email
                    }
                });

                if (!userFound) {
                    return done(null, false, {
                        error: "Incorrect Email"
                    });
                }

                const match = await bcrypt.compare(
                    password,
                    userFound.password
                );

                if (!match) {
                    return done(null, false, {
                        error: "Incorrect Password"
                    });
                }

                return done(null, userFound);

            } catch (e) {
                return done(e);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    return done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const userFound = await prisma.user.findFirst({
            where: {
                id: id
            }
        });

        return done(null, userFound);

    } catch (e) {
        return done(e);
    }
});

app.use(passport.initialize());

app.get("/", (req, res) => {
    res.send("Hello world");
});

app.use("/signin", signinRouter);
app.use("/login", loginRouter);

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log("port is running...");
});