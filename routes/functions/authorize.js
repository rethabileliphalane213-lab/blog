function authoriseReq(role){
    return (req,res,next) => {

        if(!req.user){
            return res.status(401).json({
                error:"Access Denied"
            });
        }

        if(req.user.role === role){
            next();
        }
        else{
            return res.status(403).json({
                error:"SORRY! Only Admin can perform such Task"
            });
        }
    }
}

export default authoriseReq;