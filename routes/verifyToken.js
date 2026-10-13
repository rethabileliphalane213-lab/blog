 function verifyToken(req,res,next){
const beareHeader=req.headers["authorization"]

if(beareHeader){
const bearer=beareHeader.split(" ")
const bearerToken=bearer[1]
req.token=bearerToken
jwt.verify(req.body.token,Process.env.SECRET_KEY,(err,authData)=>{
    if(err){
        res.json({
            error:"Invalid Token"
        })
    }
    req.user=authData
    next()
  
})

}
else{
    console.log('verify fnction failed to get bearer header')
}
 }

export default verifyToken

