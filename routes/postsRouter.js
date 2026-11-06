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


        /*
const timer=setTimeout(()=>{
    if(Number(globalOtp)===Number(otp))
    globalOtp=null
    console.log("password Expired")
},(1000*60)*5)
*/
 

export default postsRouter