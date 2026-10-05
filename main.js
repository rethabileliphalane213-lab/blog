import express from "express"
import bcrypt from "bcryptjs"
const app=express()
import {Strategy} from "passport-local"
import prisma from "./db.js"
import passport from "passport"
import "dotenv/config";
app.use(express.json())
import cors from "./routes/cors.js"
app.use(cors)

import signinRouter from "./routes/signinRoute.js"


passport.use(new Strategy({usernameField:"email"},async(email,password,done)=>{

try{
const userFound=await prismsa.user.findFirst({
    where:{
        email:email
    }
})
if(!userFound){
    return done(null,false,{error:"Incorrect Email"})
}
const match= await bcrypt.compare(password,userFound.password)
if(!match){
    return done(null,false,{error:"Incorrect Password"})
}
return document(null,userFound)
}catch(e){
    done(e)
}

}))

passport.serializeUser((user,done)=>{
    return done(null, user.id)
})
passport.deserializeUser(async(id,done)=>{
try{
const userFound=await prismsa.user.findFirst({
    where:{
        id:id
    }
})
done(null,userFound)
}catch(e){
    done(e)
}
})
app.get("/",(req,res)=>{
    res.send("Hello world")
})

app.use("/signin",signinRouter)

const port= process.env.PORT||4000

app.listen(port,()=>{
    console.log("port is running...")
})

