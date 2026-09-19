const {Router}=require("express")
const signinRouter=Router()

signinRouter.get("/",(req,res)=>{

})

signinRouter.post("/users",async(req,res)=>{
    const{name,surname,password,email}=req.body

})

