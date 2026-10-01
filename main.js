import express from "express"
const app=express()

import "dotenv/config";
app.use(express.json())
import cors from "./routes/cors.js"
app.use(cors)

import signinRouter from "./routes/signinRoute.js"

app.get("/",(req,res)=>{
    res.send("Hello world")
})

app.use("/signin",signinRouter)

const port= process.env.PORT||4000

app.listen(port,()=>{
    console.log("port is running...")
})

