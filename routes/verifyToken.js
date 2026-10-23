import jsonwebtoken from "jsonwebtoken"
 
 function verifyToken(req,res,next){
const beareHeader=req.headers["authorization"]

if(beareHeader){
const bearer=beareHeader.split(" ")
const bearerToken=bearer[1]
req.token=bearerToken
jsonwebtoken.verify(bearerToken,process.env.SECRET_KEY,(err,authData)=>{
    if(err){
        res.json({
            error:"Invalid Token"
        })
        return
    }
    req.user=authData
    req.token=beareHeader
    next()
    
  
})

}
else{
    console.log('verify fnction failed to get bearer header')
}
 }

export default verifyToken

