import {Router} from "express"
import verifyToken from "./verifyToken.js"
import jwt from "jsonwebtoken" 

const postsRouter=Router()

postsRouter.get("/",verifyToken,(req,res)=>{

    res.json({
        post1:"Monday",
        psot2:"Tuestday",
        post3:"wednesday",
        authData
    })
})

 

export default postsRouter