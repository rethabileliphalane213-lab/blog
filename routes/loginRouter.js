import {Router} from "express"
import bcrypt from "bcryptjs"
import {Strategy} from "passport-local"
import passport from "passport"
import prisma from "./db.js"

const loginRouter=Router()

loginRouter.post("/users",async(req,res)=>{
    const {email,password}
})
