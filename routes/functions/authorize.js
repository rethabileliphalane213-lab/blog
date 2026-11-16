function authoriseReq(role){
    return (req,res,next){
        if(!role){
            res.json({
                error:"Acces Denied"
            })
            return
        }
        if(role==="Admin"){
            nex()
        }
        else{
             res.json({
                error:"SORRY! Only Adimin can perfom such Task"
            })
            return

        }
    }
}

export default authoriseReq