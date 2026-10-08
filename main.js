import express from "express";
import bcrypt from "bcryptjs";
import { Strategy } from "passport-local";
import passport from "passport";
import "dotenv/config";



const app = express();

app.use(express.json());

import cors from "./routes/cors.js";
app.use(cors);

import signinRouter from "./routes/signinRoute.js";
import loginRouter from "./routes/loginRouter.js";
import postsRouter from "./routes/postsRouter.js"
import prisma from "./routes/db.js";



app.get("/", (req, res) => {
    res.send("Hello world");
});

app.use("/signin", signinRouter);
app.use("/login", loginRouter);
app.use("/post",postsRouter)

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log("port is running...");
});