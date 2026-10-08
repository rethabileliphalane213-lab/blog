import {Router} from "express"
import verifyToken from "./verifyToken.js"
import jwt from "jsonwebtoken" 

const postsRouter=Router()

postsRouter.get("/",verifyToken,(req,res)=>{
jwt.verify(req.body.token,Process.env.SECRET_KEY,(err,authData)=>{
    if(err){
        res.json({
            erro:"Internal error"
        })
    }
    res.json({
        post1:"Monday",
        psot2:"Tuestday",
        post3:"wednesday",
        authData
    })
})
})
 

export default postsRouter