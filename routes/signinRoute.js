
import {Router} from "express"

import bcrypt from "bcryptjs"

const signinRouter=Router()
import prisma from "./db.js"



signinRouter.post("/users",async(req,res)=>{
   
    const {name,surname,email,password}=req.body
    const hashPashword=await bcrypt.hash(password,10)
    const user=await prisma.user.create({data:{
        name:name,
        surname:surname,
        email:email,
        password:hashPashword
    }})
console.log(user)
    res.json({
        message:"user recieved",
        user:req.body
    })
})

export default signinRouter