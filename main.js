import express from "express";
import bcrypt from "bcryptjs";
import { Strategy } from "passport-local";
import passport from "passport";
import "dotenv/config";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));



import cors from "./routes/cors.js";
app.use(cors);

import signinRouter from "./routes/signinRoute.js";
import loginRouter from "./routes/loginRouter.js";
import postsRouter from "./routes/postsRouter.js"
import uploadRouter from "./routes/blogPostRuter.js";
import prisma from "./routes/db.js";


app.use("/uploads",express.static("uploads"))
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,  "home.html"));
});

app.use("/signin", signinRouter);
app.use("/login", loginRouter);
app.use("/post",uploadRouter)


const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log("port is running...");
});