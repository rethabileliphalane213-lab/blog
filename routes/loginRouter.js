import { Router } from "express";
import passport from "passport";
import prisma from "./db.js"
import bcryptjs from  "bcryptjs"
import jsonwebtoken from "jsonwebtoken"

import verifyToken from "./verifyToken.js"


const loginRouter = Router();

loginRouter.post("/users", async(req, res, next) => {
const [email,password]=req.body

const user=await prisma.user.findFirst({
    where:{
        email:email
    }
})
 if(!user){
    res.json({
        error:"Incorrect email"
    })
    return
 }
 const match=await bcryptjs.compare(password,user.password)
 if(!match){
       res.json({
        error:"Incorrect Password"
    })
    return
 }
 jsonwebtoken.sing({user:user},"secretKey",(error,token)=>{
res.send({
    token
})
 })

});

export default loginRouter;

